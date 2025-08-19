"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Download } from "lucide-react";

const AnimatedMenuToggle = ({
  toggle,
  isOpen,
}: {
  toggle: () => void;
  isOpen: boolean;
}) => (
  <button
    onClick={toggle}
    aria-label="Toggle menu"
    className="focus:outline-none z-999"
  >
    <motion.div animate={{ y: isOpen ? 13 : 0 }} transition={{ duration: 0.3 }}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        className="text-black"
      >
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 2.5 L 22 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 12 L 22 12", opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 21.5 L 22 21.5" },
            open: { d: "M 3 2.5 L 17 16.5" },
          }}
        />
      </motion.svg>
    </motion.div>
  </button>
);

export interface ImageProcessingSettings {
  width: number;
  height: number;
  cropPosition: string;
  addSpace: boolean;
  spaceSize: number;
  spacePosition: string;
  maxFileSize: number | null;
  format: string;
}

interface ImageProcessorSidebarProps {
  settings: ImageProcessingSettings;
  onSettingsChange: (settings: ImageProcessingSettings | ((prev: ImageProcessingSettings) => ImageProcessingSettings)) => void;
  onGenerate: () => void;
  isProcessing?: boolean;
}

const ImageProcessorSidebar = ({
  settings,
  onSettingsChange,
  onGenerate,
  isProcessing = false,
}: ImageProcessorSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const onSettingsChangeRef = useRef(onSettingsChange);
  onSettingsChangeRef.current = onSettingsChange;

  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const updateSetting = useCallback((key: keyof ImageProcessingSettings, value: string | number | boolean | null) => {
    onSettingsChange((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  }, [onSettingsChange]);

  // Stable input handlers to prevent focus loss
  const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChangeRef.current((prevSettings) => ({
      ...prevSettings,
      width: parseInt(e.target.value) || 0,
    }));
  }, []);

  const handleHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChangeRef.current((prevSettings) => ({
      ...prevSettings,
      height: parseInt(e.target.value) || 0,
    }));
  }, []);

  const handleSpaceSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChangeRef.current((prevSettings) => ({
      ...prevSettings,
      spaceSize: parseInt(e.target.value) || 0,
    }));
  }, []);

  const handleMaxFileSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChangeRef.current((prevSettings) => ({
      ...prevSettings,
      maxFileSize: e.target.value ? parseInt(e.target.value) : null,
    }));
  }, []);

  const cropOptions = useMemo(() => [
    "Crop Top Left",
    "Crop Top Middle",
    "Crop Top Right",
    "Crop Middle Right",
    "Crop Middle Left",
    "Crop Bottom Right",
    "Crop Bottom Middle",
    "Crop Bottom Left",
  ], []);

  const spacePositions = useMemo(() => ["top", "bottom", "left", "right"], []);
  const formats = useMemo(() => ["webp", "jpg", "png"], []);

  const SidebarContent = useMemo(() => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold">Image Processor</p>
            <p className="text-sm text-gray-500">Configure your settings</p>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {/* Resize Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Resize Dimensions</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (px)
              </label>
              <input
                type="text"
                value={settings.width}
                onChange={handleWidthChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="800"
                key="width-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (px)
              </label>
              <input
                type="text"
                value={settings.height}
                onChange={handleHeightChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="600"
                key="height-input"
              />
            </div>
          </div>
        </div>

        {/* Crop Position */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Crop Position</h3>
          <select
            value={settings.cropPosition}
            onChange={(e) => updateSetting("cropPosition", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {cropOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Empty Space Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Add Empty Space</h3>
            <button
              onClick={() => updateSetting("addSpace", !settings.addSpace)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.addSpace ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.addSpace ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {settings.addSpace && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Space Size (px)
                </label>
                <input
                  type="text"
                  value={settings.spaceSize}
                  onChange={handleSpaceSizeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20"
                  key="space-size-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Space Position
                </label>
                <select
                  value={settings.spacePosition}
                  onChange={(e) => updateSetting("spacePosition", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {spacePositions.map((position) => (
                    <option key={position} value={position}>
                      {position.charAt(0).toUpperCase() + position.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Max File Size */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Max File Size (optional)</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={settings.maxFileSize || ""}
              onChange={handleMaxFileSizeChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1024"
              key="max-file-size-input"
            />
            <span className="text-sm text-gray-500">KB</span>
          </div>
        </div>

        {/* File Format */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Output Format</h3>
          <div className="space-y-2">
            {formats.map((format) => (
              <label key={format} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="format"
                  value={format}
                  checked={settings.format === format}
                  onChange={(e) => updateSetting("format", e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {format.toUpperCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onGenerate}
          disabled={isProcessing}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-colors ${
            isProcessing
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Generate & Download</span>
            </>
          )}
        </button>
      </div>
    </div>
  ), [settings, handleWidthChange, handleHeightChange, handleSpaceSizeChange, handleMaxFileSizeChange, updateSetting, onGenerate, isProcessing, cropOptions, spacePositions, formats]);

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileSidebarVariants}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-50 bg-white text-black"
          >
            {SidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed top-0 left-0 h-full w-80 bg-white text-black shadow-lg border-r border-gray-200">
        {SidebarContent}
      </div>

      {/* Mobile top bar for toggle */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 md:hidden flex justify-between items-center fixed top-0 left-0 right-0 z-40">
        <h1 className="text-xl font-bold">Image Processor</h1>
        <AnimatedMenuToggle toggle={toggleSidebar} isOpen={isOpen} />
      </div>
    </>
  );
};

export { ImageProcessorSidebar };
