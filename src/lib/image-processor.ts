import JSZip from 'jszip';
import { ImageProcessingSettings } from '@/components/ui/image-processor-sidebar';

export interface ProcessedImage {
  name: string;
  data: Blob;
}

export class ImageProcessor {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
  }

  private ensureCanvas() {
    if (!this.canvas || !this.ctx) {
      if (typeof window === 'undefined') {
        throw new Error('Canvas is not available in server-side environment');
      }
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        throw new Error('Failed to get canvas context');
      }
    }
  }

  async extractImagesFromZip(zipFile: File): Promise<{ name: string; data: Blob }[]> {
    const zip = new JSZip();
    const contents = await zip.loadAsync(zipFile);
    const images: { name: string; data: Blob }[] = [];

    for (const filename in contents.files) {
      const file = contents.files[filename];
      if (!file.dir && this.isImageFile(filename)) {
        try {
          const blob = await file.async('blob');
          // Validate blob has content
          if (blob.size > 0) {
            images.push({ name: filename, data: blob });
          } else {
            console.warn(`Skipping empty file: ${filename}`);
          }
        } catch (error) {
          console.warn(`Failed to extract ${filename}:`, error);
        }
      }
    }

    return images;
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => 
      filename.toLowerCase().endsWith(ext)
    );
  }

  async processImage(
    imageInput: Blob | File,
    settings: ImageProcessingSettings
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      let objectUrl: string | null = null;
      
      const cleanup = () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Image loading timeout'));
      }, 30000); // 30 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        try {
          const processedBlob = this.resizeAndCropImage(img, settings);
          cleanup();
          resolve(processedBlob);
        } catch (error) {
          cleanup();
          reject(error);
        }
      };
      
      img.onerror = (error) => {
        clearTimeout(timeout);
        cleanup();
        console.error('Failed to load image:', error);
        reject(new Error(`Failed to load image: ${imageInput.type || 'unknown type'}`));
      };

      try {
        objectUrl = URL.createObjectURL(imageInput);
        img.src = objectUrl;
      } catch (error) {
        cleanup();
        reject(new Error(`Failed to create object URL: ${error}`));
      }
    });
  }

  private resizeAndCropImage(
    img: HTMLImageElement,
    settings: ImageProcessingSettings
  ): Blob {
    this.ensureCanvas();
    if (!this.canvas || !this.ctx) {
      throw new Error('Canvas not available');
    }
    
    const { width, height, cropPosition, addSpace, spaceSize, spacePosition } = settings;
    
    // Calculate dimensions
    let targetWidth = width;
    let targetHeight = height;
    
    if (addSpace) {
      switch (spacePosition) {
        case 'left':
        case 'right':
          targetWidth = width - spaceSize;
          break;
        case 'top':
        case 'bottom':
          targetHeight = height - spaceSize;
          break;
      }
    }

    // Calculate crop position
    const sourceAspectRatio = img.width / img.height;
    const targetAspectRatio = targetWidth / targetHeight;
    
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = img.width;
    let sourceHeight = img.height;

    if (sourceAspectRatio > targetAspectRatio) {
      // Image is wider than target - crop horizontally
      sourceWidth = img.height * targetAspectRatio;
      sourceX = this.getCropX(img.width, sourceWidth, cropPosition);
    } else if (sourceAspectRatio < targetAspectRatio) {
      // Image is taller than target - crop vertically
      sourceHeight = img.width / targetAspectRatio;
      sourceY = this.getCropY(img.height, sourceHeight, cropPosition);
    }

    // Set canvas size
    this.canvas.width = width;
    this.canvas.height = height;

    // Clear canvas
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, width, height);

    // Calculate destination position
    let destX = 0;
    let destY = 0;
    const destWidth = targetWidth;
    const destHeight = targetHeight;

    if (addSpace) {
      switch (spacePosition) {
        case 'left':
          destX = spaceSize;
          break;
        case 'right':
          destX = 0;
          break;
        case 'top':
          destY = spaceSize;
          break;
        case 'bottom':
          destY = 0;
          break;
      }
    }

    // Draw image
    this.ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, destWidth, destHeight
    );

    // Convert to blob
    return this.canvasToBlob(settings.format, settings.maxFileSize);
  }

  private getCropX(imageWidth: number, cropWidth: number, cropPosition: string): number {
    const offset = imageWidth - cropWidth;
    
    if (cropPosition.includes('Left')) return 0;
    if (cropPosition.includes('Right')) return offset;
    return offset / 2; // Middle
  }

  private getCropY(imageHeight: number, cropHeight: number, cropPosition: string): number {
    const offset = imageHeight - cropHeight;
    
    if (cropPosition.includes('Top')) return 0;
    if (cropPosition.includes('Bottom')) return offset;
    return offset / 2; // Middle
  }

  private canvasToBlob(format: string, maxFileSize: number | null): Blob {
    if (!this.canvas) {
      throw new Error('Canvas not available');
    }
    
    let quality = 0.9;
    let blob: Blob;

    do {
      const dataURL = this.canvas.toDataURL(`image/${format}`, quality);
      const byteString = atob(dataURL.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      
      blob = new Blob([arrayBuffer], { type: `image/${format}` });
      
      if (!maxFileSize || blob.size <= maxFileSize * 1024) {
        break;
      }
      
      quality -= 0.1;
    } while (quality > 0.1);

    return blob;
  }

  async createZip(processedImages: ProcessedImage[], outputFormat?: string): Promise<Blob> {
    const zip = new JSZip();
    
    processedImages.forEach((image) => {
      const baseName = this.getBaseName(image.name);
      // Use the output format from settings, fallback to original extension
      const extension = outputFormat || this.getFileExtension(image.name);
      const newName = `${baseName}.${extension}`;
      zip.file(newName, image.data);
    });

    return await zip.generateAsync({ type: 'blob' });
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop() || 'jpg';
  }

  private getBaseName(filename: string): string {
    return filename.split('.').slice(0, -1).join('.');
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
