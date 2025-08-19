"use client";

import { useState } from "react";
import { ImageProcessorSidebar, ImageProcessingSettings } from "@/components/ui/image-processor-sidebar";
import { FileUpload } from "@/components/ui/file-upload";
import { ImageProcessor } from "@/lib/image-processor";

export default function Home() {
  const [settings, setSettings] = useState<ImageProcessingSettings>({
    width: 900,
    height: 900,
    cropPosition: "Crop Bottom Middle",
    addSpace: false,
    spaceSize: 200,
    spacePosition: "bottom",
    maxFileSize: null,
    format: "webp",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processor] = useState(() => new ImageProcessor());

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleGenerate = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload some images first!");
      return;
    }

    setIsProcessing(true);

    try {
      // Process each image file directly
      const processedImages = [];
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        try {
          console.log(`Processing image ${i + 1}/${uploadedFiles.length}: ${file.name}`);
          const processedBlob = await processor.processImage(file, settings);
          processedImages.push({
            name: file.name,
            data: processedBlob,
          });
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error);
          // Continue with other images instead of stopping completely
          alert(`Failed to process ${file.name}. Continuing with other images...`);
        }
      }

      if (processedImages.length === 0) {
        alert("No images could be processed successfully!");
        setIsProcessing(false);
        return;
      }

      // Create new ZIP with processed images
      const processedZip = await processor.createZip(processedImages, settings.format);
      
      // Download the result
      processor.downloadBlob(processedZip, 'processed_images.zip');

    } catch (error) {
      console.error('Error processing images:', error);
      alert('An error occurred while processing the images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ImageProcessorSidebar
        settings={settings}
        onSettingsChange={setSettings}
        onGenerate={handleGenerate}
        isProcessing={isProcessing}
      />
      
      {/* Main content area - positioned to account for sidebar */}
      <div className="ml-0 md:ml-80 min-h-screen pt-16 md:pt-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Batch Image Processor
            </h1>
            <p className="text-gray-600">
              Upload images and apply batch processing with custom settings.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

            <div className="max-w-2xl mx-auto">
              <FileUpload onChange={handleFileUpload} />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center text-green-800">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {uploadedFiles.length} image{uploadedFiles.length > 1 ? 's' : ''} uploaded successfully
                </div>
              </div>
            )}

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                How it works:
              </h3>
              <ol className="text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">1.</span>
                  Upload multiple images
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">2.</span>
                  Configure processing settings in the sidebar
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">3.</span>
                  Click &quot;Generate &amp; Download&quot; to process all images
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">4.</span>
                  Download the ZIP file with processed images
                </li>
              </ol>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Batch Processing</h4>
                <p className="text-sm text-gray-600">Process multiple images at once</p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Smart Cropping</h4>
                <p className="text-sm text-gray-600">Intelligent crop positioning</p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Multiple Formats</h4>
                <p className="text-sm text-gray-600">Export as JPG, PNG, or WebP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
