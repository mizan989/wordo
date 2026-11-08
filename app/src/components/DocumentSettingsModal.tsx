import React, { useState } from 'react';
import { X, Settings, Layout, FileText, Check } from 'lucide-react';
import { PageSettings, PaperSize, PaperOrientation } from '../types';
import { HEADER_FOOTER_PRESETS, HeaderFooterPreset } from '../types/presets';

interface DocumentSettingsModalProps {
  isOpen: boolean;
  settings: PageSettings;
  onSaveSettings: (settings: PageSettings) => void;
  onClose: () => void;
}

export const DocumentSettingsModal: React.FC<DocumentSettingsModalProps> = ({
  isOpen,
  settings,
  onSaveSettings,
  onClose,
}) => {
  const [size, setSize] = useState<PaperSize>(settings.size);
  const [orientation, setOrientation] = useState<PaperOrientation>(settings.orientation);
  const [showNumbers, setShowNumbers] = useState(settings.showPageNumbers);
  const [headerLeft, setHeaderLeft] = useState(settings.headerLeft || '{title}');
  const [headerRight, setHeaderRight] = useState(settings.headerRight || '');
  const [footerLeft, setFooterLeft] = useState(settings.footerLeft || '');
  const [footerRight, setFooterRight] = useState(settings.footerRight || 'Page {page} of {totalPages}');
  const [selectedPreset, setSelectedPreset] = useState<string>(settings.presetId || 'corporate-default');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: HeaderFooterPreset) => {
    setSelectedPreset(preset.id);
    setHeaderLeft(preset.headerLeft);
    setHeaderRight(preset.headerRight);
    setFooterLeft(preset.footerLeft);
    setFooterRight(preset.footerRight);
    setShowNumbers(preset.showPageNumbers);
  };

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      size,
      orientation,
      presetId: selectedPreset,
      headerLeft,
      headerRight,
      footerLeft,
      footerRight,
      showPageNumbers: showNumbers,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in-50">
      <div className="bg-white dark:bg-[#252526] text-[#242424] dark:text-[#cccccc] w-full max-w-lg rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden text-xs flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm text-[#185abd] dark:text-white">
            <Settings className="w-4 h-4" />
            <span>Document Page Setup & Header/Footer Presets</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Header & Footer Presets */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Header & Footer Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HEADER_FOOTER_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedPreset === preset.id
                      ? 'border-[#185abd] bg-blue-50 dark:bg-blue-950/40 text-[#185abd] dark:text-blue-200 font-medium shadow-xs'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{preset.name}</span>
                    {selectedPreset === preset.id && <Check className="w-3.5 h-3.5 text-[#185abd]" />}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{preset.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Header Left
              </label>
              <input
                type="text"
                value={headerLeft}
                onChange={(e) => setHeaderLeft(e.target.value)}
                placeholder="{title}"
                className="w-full px-2.5 py-1.5 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded text-xs outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Header Right
              </label>
              <input
                type="text"
                value={headerRight}
                onChange={(e) => setHeaderRight(e.target.value)}
                placeholder="Department"
                className="w-full px-2.5 py-1.5 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded text-xs outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Footer Left
              </label>
              <input
                type="text"
                value={footerLeft}
                onChange={(e) => setFooterLeft(e.target.value)}
                placeholder="Optional footer text"
                className="w-full px-2.5 py-1.5 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded text-xs outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Footer Right
              </label>
              <input
                type="text"
                value={footerRight}
                onChange={(e) => setFooterRight(e.target.value)}
                placeholder="Page {page}"
                className="w-full px-2.5 py-1.5 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded text-xs outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="showPageNumbers"
              checked={showNumbers}
              onChange={(e) => setShowNumbers(e.target.checked)}
              className="rounded text-[#185abd] focus:ring-0"
            />
            <label htmlFor="showPageNumbers" className="text-xs font-medium cursor-pointer">
              Enable dynamic page numbers in footer
            </label>
          </div>

          {/* Paper Size & Orientation */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Paper Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as PaperSize)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded text-xs outline-hidden"
            >
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="letter">Letter (8.5 × 11 in)</option>
              <option value="legal">Legal (8.5 × 14 in)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Page Orientation
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`py-1.5 px-3 rounded border text-center font-medium ${
                  orientation === 'portrait'
                    ? 'border-[#185abd] bg-blue-50 dark:bg-blue-950/40 text-[#185abd] font-bold'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                Portrait
              </button>
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`py-1.5 px-3 rounded border text-center font-medium ${
                  orientation === 'landscape'
                    ? 'border-[#185abd] bg-blue-50 dark:bg-blue-950/40 text-[#185abd] font-bold'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                Landscape
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded font-medium hover:bg-gray-100 dark:hover:bg-[#333]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#185abd] text-white hover:bg-[#1651aa] rounded font-medium shadow-xs"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
