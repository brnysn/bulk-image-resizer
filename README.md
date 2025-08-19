# Batch Image Processor

A powerful Next.js application for batch processing images with advanced features like resizing, cropping, format conversion, and space addition. Upload a ZIP file containing images and apply custom processing settings to all images at once.

![Image Processor](https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop)

## ✨ Features

- **Batch Processing**: Process multiple images simultaneously
- **Smart Resizing**: Resize images to custom dimensions
- **Intelligent Cropping**: 9 crop position options (Top Left, Top Middle, Top Right, etc.)
- **Space Addition**: Add empty space around images with customizable positioning
- **Format Conversion**: Convert between JPG, PNG, and WebP formats
- **File Size Optimization**: Set maximum file size limits with automatic quality adjustment
- **ZIP Handling**: Extract from ZIP, process, and create new ZIP with processed images
- **Modern UI**: Beautiful, responsive interface using Shadcn UI components
- **Real-time Preview**: See your settings and upload status in real-time

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/image-resizer.git
cd image-resizer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Use

### Step 1: Prepare Your Images
- Create a ZIP file containing the images you want to process
- Supported image formats: JPG, JPEG, PNG, GIF, BMP, WebP

### Step 2: Configure Settings
Use the sidebar to configure your processing settings:

#### Resize Dimensions
- **Width**: Target width in pixels
- **Height**: Target height in pixels

#### Crop Position
Choose how images should be cropped when they don't match the target aspect ratio:
- Top Left, Top Middle, Top Right
- Middle Left, Center, Middle Right  
- Bottom Left, Bottom Middle, Bottom Right

#### Empty Space (Optional)
- **Toggle**: Enable/disable adding empty space
- **Space Size**: Size of the space in pixels
- **Position**: Where to add the space (top, bottom, left, right)

#### File Size Optimization (Optional)
- **Max File Size**: Maximum file size in KB
- The system will automatically reduce quality to meet this limit

#### Output Format
- **JPG**: Best for photos, smaller file sizes
- **PNG**: Best for graphics with transparency
- **WebP**: Modern format with excellent compression

### Step 3: Upload and Process
1. Drag and drop your ZIP file or click to upload
2. Click "Generate & Download" 
3. Wait for processing to complete
4. Download your processed images ZIP file

## 🛠 Technical Features

### Components
- **ImageProcessorSidebar**: Advanced settings panel with animations
- **FileUpload**: Drag-and-drop ZIP file upload with visual feedback
- **ImageProcessor**: Core image processing engine with Canvas API

### Image Processing Capabilities
- Canvas-based image manipulation
- Aspect ratio-aware cropping
- Quality-based file size optimization
- Multiple output format support
- Batch processing with progress feedback

### Technology Stack
- **Framework**: Next.js 15
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS  
- **Animations**: Framer Motion
- **File Handling**: JSZip, react-dropzone
- **Icons**: Lucide React, Tabler Icons
- **Image Processing**: HTML5 Canvas API

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main application page
├── components/ui/
│   ├── file-upload.tsx      # File upload component
│   └── image-processor-sidebar.tsx  # Settings sidebar
└── lib/
    ├── image-processor.ts   # Core image processing logic
    └── utils.ts             # Utility functions
```

## 🎨 Customization

### Adding New Crop Positions
Edit the `cropOptions` array in `image-processor-sidebar.tsx`:

```typescript
const cropOptions = [
  "Crop Top Left",
  "Crop Top Middle", 
  // Add your custom positions
];
```

### Adding New Output Formats
1. Update the `formats` array in the sidebar component
2. Modify the `canvasToBlob` method in `image-processor.ts`

### Styling Customization
The application uses Tailwind CSS. Modify the theme in `tailwind.config.js` or update component styles directly.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Docker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Unsplash](https://unsplash.com) for the demo images
- [Next.js](https://nextjs.org) team for the amazing framework
- [Vercel](https://vercel.com) for hosting and deployment
