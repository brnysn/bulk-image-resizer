'use client';

import React from 'react';
import { Progress } from './progress';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessingOverlayProps {
  isVisible: boolean;
  progress: number;
  currentStep: string;
  currentImage?: string;
  totalImages?: number;
  currentImageIndex?: number;
}

export function ProcessingOverlay({
  isVisible,
  progress,
  currentStep,
  currentImage,
  totalImages,
  currentImageIndex,
}: ProcessingOverlayProps) {
  const getStatusMessage = (step: string, progress: number) => {
    if (step === 'initializing') return 'Initializing image processing...';
    if (step === 'processing') {
      if (currentImage && totalImages && currentImageIndex !== undefined) {
        return `Processing image ${currentImageIndex + 1} of ${totalImages}: ${currentImage}`;
      }
      return 'Processing images...';
    }
    if (step === 'creating-zip') return 'Creating ZIP file...';
    if (step === 'completed') return 'Processing complete!';
    return 'Processing images...';
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-blue-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 75) return 'bg-orange-500';
    if (progress < 100) return 'bg-green-500';
    return 'bg-green-600';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            style={{ pointerEvents: 'all' }}
          />
          
          {/* Processing Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ pointerEvents: 'none' }}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-auto"
              style={{ pointerEvents: 'all' }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8"
                  >
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Processing Images
                </h2>
                <p className="text-gray-600">
                  Please wait while we process your images...
                </p>
              </div>

              {/* Progress Section */}
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="text-gray-500">{Math.round(progress)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="w-full h-2"
                    indicatorClassName={getProgressColor(progress)}
                  />
                </div>

                {/* Status Message */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 font-medium">
                    {getStatusMessage(currentStep, progress)}
                  </p>
                  
                  {/* Image counter for processing step */}
                  {currentStep === 'processing' && totalImages && currentImageIndex !== undefined && (
                    <div className="mt-2 text-xs text-gray-500">
                      Image {currentImageIndex + 1} of {totalImages}
                    </div>
                  )}
                </div>

                {/* Current image name (truncated if too long) */}
                {currentImage && (
                  <div className="bg-gray-50 rounded-lg p-3 mt-4">
                    <p className="text-xs text-gray-500 mb-1">Current file:</p>
                    <p className="text-sm font-mono text-gray-700 truncate" title={currentImage}>
                      {currentImage}
                    </p>
                  </div>
                )}

                {/* Processing steps visualization */}
                <div className="flex justify-between text-xs text-gray-400 mt-6">
                  <div className={`flex flex-col items-center ${currentStep === 'initializing' ? 'text-blue-600' : currentStep !== 'initializing' ? 'text-green-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mb-1 ${currentStep === 'initializing' ? 'bg-blue-600' : currentStep !== 'initializing' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <span>Initialize</span>
                  </div>
                  <div className={`flex flex-col items-center ${currentStep === 'processing' ? 'text-blue-600' : currentStep === 'creating-zip' || currentStep === 'completed' ? 'text-green-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mb-1 ${currentStep === 'processing' ? 'bg-blue-600' : currentStep === 'creating-zip' || currentStep === 'completed' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <span>Process</span>
                  </div>
                  <div className={`flex flex-col items-center ${currentStep === 'creating-zip' ? 'text-blue-600' : currentStep === 'completed' ? 'text-green-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mb-1 ${currentStep === 'creating-zip' ? 'bg-blue-600' : currentStep === 'completed' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <span>Package</span>
                  </div>
                  <div className={`flex flex-col items-center ${currentStep === 'completed' ? 'text-green-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mb-1 ${currentStep === 'completed' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <span>Complete</span>
                  </div>
                </div>
              </div>

              {/* Warning message */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Please don't close this tab or navigate away during processing
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
