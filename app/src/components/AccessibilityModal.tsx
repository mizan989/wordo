import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, Eye } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  actionText?: string;
  action?: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose, editor }) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);

  useEffect(() => {
    if (!isOpen || !editor) return;

    const detected: AccessibilityIssue[] = [];

    // 1. Check images for alt text
    const html = editor.getHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const imgs = tempDiv.querySelectorAll('img');
    let missingAltCount = 0;
    imgs.forEach((img) => {
      if (!img.getAttribute('alt') || img.getAttribute('alt')?.trim() === '') {
        missingAltCount++;
      }
    });

    if (missingAltCount > 0) {
      detected.push({
        id: 'img-alt',
        type: 'error',
        title: `Missing alternative text (${missingAltCount} image${missingAltCount > 1 ? 's' : ''})`,
        description: 'Screen reader users need alt text to understand the content and purpose of images in your document.',
        actionText: 'Review images',
      });
    }

    // 2. Check headings structure
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    let skippedHeading = false;
    headings.forEach((h) => {
      const level = parseInt(h.tagName.substring(1), 10);
      if (lastLevel > 0 && level > lastLevel + 1) {
        skippedHeading = true;
      }
      lastLevel = level;
    });

    if (skippedHeading) {
      detected.push({
        id: 'heading-order',
        type: 'warning',
        title: 'Skipped heading level detected',
        description: 'Headings should follow a logical hierarchical sequence (e.g., Heading 1 followed by Heading 2, not Heading 3).',
      });
    }

    if (headings.length === 0 && editor.getText().length > 300) {
      detected.push({
        id: 'no-headings',
        type: 'info',
        title: 'No headings found in long document',
        description: 'Using headings (Title, Heading 1, Heading 2) helps assistive technologies navigate long sections quickly.',
      });
    }

    // 3. Check for empty paragraphs / blank line clutter
    const paragraphs = tempDiv.querySelectorAll('p');
    let emptyCount = 0;
    paragraphs.forEach((p) => {
      if (!p.textContent?.trim() && p.children.length === 0) {
        emptyCount++;
      }
    });

    if (emptyCount >= 3) {
      detected.push({
        id: 'empty-paragraphs',
        type: 'warning',
        title: `Repeated blank blank lines (${emptyCount})`,
        description: 'Extra blank paragraph returns create unnecessary silence for screen readers. Use paragraph spacing before/after instead.',
      });
    }

    // 4. Tables check
    const tables = tempDiv.querySelectorAll('table');
    let tablesMissingHeader = 0;
    tables.forEach((t) => {
      if (!t.querySelector('th')) {
        tablesMissingHeader++;
      }
    });

    if (tablesMissingHeader > 0) {
      detected.push({
        id: 'table-header',
        type: 'warning',
        title: `Table missing header row (${tablesMissingHeader})`,
        description: 'Ensure tables have a header row specified so screen readers can announce column labels with cell values.',
      });
    }

    setIssues(detected);
  }, [isOpen, editor]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      <div className="bg-[var(--surface-primary)] text-[var(--text-primary)] rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] border border-[var(--border-color)] w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-color)] bg-[var(--surface-secondary)]">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-[var(--text-primary)]" />
            <span className="text-sm font-semibold">Accessibility Checker</span>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] p-1 rounded-[var(--radius-sm)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Issues List */}
        <div className="p-5 overflow-y-auto max-h-80 space-y-3">
          {issues.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
              <p className="font-semibold text-[var(--text-primary)] text-sm">No accessibility issues found!</p>
              <p className="text-xs text-[var(--text-muted)]">People using screen readers or assistive technology should have no difficulty reading this document.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[var(--text-secondary)]">
                Inspection results ({issues.length} {issues.length === 1 ? 'item' : 'items'} to review):
              </p>
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-3 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--surface-secondary)] space-y-1 text-xs"
                >
                  <div className="flex items-center space-x-2">
                    {issue.type === 'error' ? (
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    ) : issue.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-500 shrink-0" />
                    )}
                    <span className="font-semibold text-[var(--text-primary)]">{issue.title}</span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-[11px] pl-6">{issue.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--surface-secondary)] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs rounded-[var(--radius-md)] font-medium bg-[var(--accent-color)] text-white hover:opacity-90 transition-opacity shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
