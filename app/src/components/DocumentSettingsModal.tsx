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
      <div className="bg-[var(--surface-primary)] text-[var(--text-primary)] w-full max-w-lg rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--border-color)] overflow-hidden text-xs flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[var(--surface-secondary)] border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-sm text-[var(--text-primary)]">
            <Settings className="w-4 h-4" />
            <span>Document Page Setup & Header/Footer Presets</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--hover-bg)] text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Header & Footer Presets */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide">
              Header & Footer Presets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HEADER_FOOTER_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedPreset === preset.id
                      ? 'border-[var(--accent-color)] bg-[var(--selection-bg)] text-[var(--accent-color)] font-medium shadow-xs'
                      : 'border-[var(--border-color)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{preset.name}</span>
                    {selectedPreset === preset.id && <Check className="w-3.5 h-3.5 text-[var(--accent-color)]" />}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-snug">{preset.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-subtle)]">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Header Left
              </label>
              <input
                type="text"
                value={headerLeft}
                onChange={(e) => setHeaderLeft(e.target.value)}
                placeholder="{title}"
                className="w-full px-2.5 py-1.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-md)] text-xs outline-hidden focus:border-[var(--accent-color)]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Header Right
              </label>
              <input
                type="text"
                value={headerRight}
                onChange={(e) => setHeaderRight(e.target.value)}
                placeholder="Department"
                className="w-full px-2.5 py-1.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-md)] text-xs outline-hidden focus:border-[var(--accent-color)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Footer Left
              </label>
              <input
                type="text"
                value={footerLeft}
                onChange={(e) => setFooterLeft(e.target.value)}
                placeholder="Optional footer text"
                className="w-full px-2.5 py-1.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-md)] text-xs outline-hidden focus:border-[var(--accent-color)]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Footer Right
              </label>
              <input
                type="text"
                value={footerRight}
                onChange={(e) => setFooterRight(e.target.value)}
                placeholder="Page {page}"
                className="w-full px-2.5 py-1.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-md)] text-xs outline-hidden focus:border-[var(--accent-color)]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="showPageNumbers"
              checked={showNumbers}
              onChange={(e) => setShowNumbers(e.target.checked)}
              className="rounded text-[var(--accent-color)] focus:ring-0"
            />
            <label htmlFor="showPageNumbers" className="text-xs font-medium cursor-pointer">
              Enable dynamic page numbers in footer
            </label>
          </div>

          {/* Paper Size & Orientation */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
              Paper Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as PaperSize)}
              className="w-full px-2.5 py-1.5 bg-[var(--surface-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-md)] text-xs outline-hidden focus:border-[var(--accent-color)]"
            >
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="letter">Letter (8.5 × 11 in)</option>
              <option value="legal">Legal (8.5 × 14 in)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
              Page Orientation
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`py-1.5 px-3 rounded border text-center font-medium ${
                  orientation === 'portrait'
                    ? 'border-[var(--accent-color)] bg-[var(--selection-bg)] text-[var(--accent-color)] font-semibold rounded-[var(--radius-md)]'
                    : 'border-[var(--border-color)] bg-[var(--surface-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-[var(--radius-md)]'
                }`}
              >
                Portrait
              </button>
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`py-1.5 px-3 rounded border text-center font-medium ${
                  orientation === 'landscape'
                    ? 'border-[var(--accent-color)] bg-[var(--selection-bg)] text-[var(--accent-color)] font-semibold rounded-[var(--radius-md)]'
                    : 'border-[var(--border-color)] bg-[var(--surface-primary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] rounded-[var(--radius-md)]'
                }`}
              >
                Landscape
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f5f5f5] dark:bg-[#1e1e1e] border-t border-[var(--border-subtle)] flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-[var(--border-color)] bg-[var(--surface-primary)] text-[var(--text-primary)] rounded-[var(--radius-md)] font-medium hover:bg-[var(--hover-bg)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[var(--accent-color)] text-white hover:opacity-90 rounded-[var(--radius-md)] font-medium transition-opacity shadow-xs"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
