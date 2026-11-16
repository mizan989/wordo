import React, { useState } from 'react';

interface RulerProps {
  pageWidth: number; // in pixels
  marginLeft?: number;
  marginRight?: number;
  onMarginChange?: (left: number, right: number) => void;
}

export const Ruler: React.FC<RulerProps> = ({
  pageWidth,
  marginLeft = 96,
  marginRight = 96,
  onMarginChange,
}) => {
  // 1 inch = 96 pixels at standard 96 DPI
  const totalInches = Math.floor(pageWidth / 96);
  const [isDragging, setIsDragging] = useState<'left' | 'right' | null>(null);

  const handleMouseDown = (type: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(type);

    const startX = e.clientX;
    const initialMargin = type === 'left' ? marginLeft : marginRight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      if (type === 'left') {
        const newLeft = Math.max(24, Math.min(pageWidth - marginRight - 96, Math.round(initialMargin + delta)));
        onMarginChange?.(newLeft, marginRight);
      } else {
        const newRight = Math.max(24, Math.min(pageWidth - marginLeft - 96, Math.round(initialMargin - delta)));
        onMarginChange?.(marginLeft, newRight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="h-6 bg-[var(--surface-secondary)] border-b border-[var(--border-color)] flex items-center relative select-none mx-auto text-[10px] text-[var(--text-secondary)] font-mono transition-colors"
      style={{ width: `${pageWidth}px` }}
    >
      {/* Left Margin Indicator */}
      <div
        className="absolute top-0 bottom-0 bg-[var(--hover-bg)] opacity-80 transition-all"
        style={{ left: 0, width: `${marginLeft}px` }}
      />

      {/* Right Margin Indicator */}
      <div
        className="absolute top-0 bottom-0 bg-[var(--hover-bg)] opacity-80 transition-all"
        style={{ right: 0, width: `${marginRight}px` }}
      />

      {/* Inch markers */}
      {Array.from({ length: totalInches + 1 }).map((_, i) => {
        const leftPx = i * 96;
        if (leftPx > pageWidth) return null;
        return (
          <div key={i} className="absolute top-0 h-full flex flex-col justify-end" style={{ left: `${leftPx}px` }}>
            {/* Major tick & number */}
            <div className="h-3.5 w-[1px] bg-[var(--border-color)]" />
            <span className="absolute bottom-1.5 left-1 text-[9px] text-[var(--text-muted)] font-sans pointer-events-none">
              {i > 0 ? i : ''}
            </span>

            {/* Sub-ticks for quarter and half inches */}
            {i < totalInches && (
              <>
                <div
                  className="absolute bottom-0 h-1.5 w-[1px] bg-[var(--border-subtle)]"
                  style={{ left: '24px' }}
                />
                <div
                  className="absolute bottom-0 h-2.5 w-[1px] bg-[var(--border-color)]"
                  style={{ left: '48px' }}
                />
                <div
                  className="absolute bottom-0 h-1.5 w-[1px] bg-[var(--border-subtle)]"
                  style={{ left: '72px' }}
                />
              </>
            )}
          </div>
        );
      })}

      {/* Left Margin Slider Handle */}
      <div
        onMouseDown={(e) => handleMouseDown('left', e)}
        className={`absolute bottom-0 w-2.5 h-2.5 bg-[var(--accent-color)] transform -translate-x-1/2 rotate-45 cursor-ew-resize z-20 shadow-xs transition-transform hover:scale-125 ${
          isDragging === 'left' ? 'scale-125 ring-2 ring-[var(--accent-color)]/40' : ''
        }`}
        style={{ left: `${marginLeft}px` }}
        title={`Left Margin: ${(marginLeft / 96).toFixed(2)}"`}
      />

      {/* Right Margin Slider Handle */}
      <div
        onMouseDown={(e) => handleMouseDown('right', e)}
        className={`absolute bottom-0 w-2.5 h-2.5 bg-[var(--accent-color)] transform translate-x-1/2 rotate-45 cursor-ew-resize z-20 shadow-xs transition-transform hover:scale-125 ${
          isDragging === 'right' ? 'scale-125 ring-2 ring-[var(--accent-color)]/40' : ''
        }`}
        style={{ right: `${marginRight}px` }}
        title={`Right Margin: ${(marginRight / 96).toFixed(2)}"`}
      />
    </div>
  );
};
