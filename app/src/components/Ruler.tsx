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
      className="h-6 bg-[#f0f0f0] dark:bg-[#252526] border-b border-[#e0e0e0] dark:border-[#383838] flex items-center relative select-none mx-auto shadow-xs text-[10px] text-gray-500 font-mono"
      style={{ width: `${pageWidth}px` }}
    >
      {/* Left Margin Indicator */}
      <div
        className="absolute top-0 bottom-0 bg-gray-300 dark:bg-gray-700 opacity-40 transition-all"
        style={{ left: 0, width: `${marginLeft}px` }}
      />

      {/* Right Margin Indicator */}
      <div
        className="absolute top-0 bottom-0 bg-gray-300 dark:bg-gray-700 opacity-40 transition-all"
        style={{ right: 0, width: `${marginRight}px` }}
      />

      {/* Inch markers */}
      {Array.from({ length: totalInches + 1 }).map((_, i) => {
        const leftPx = i * 96;
        if (leftPx > pageWidth) return null;
        return (
          <div key={i} className="absolute top-0 h-full flex flex-col justify-end" style={{ left: `${leftPx}px` }}>
            {/* Major tick & number */}
            <div className="h-3.5 w-[1px] bg-gray-400 dark:bg-gray-500" />
            <span className="absolute bottom-1.5 left-1 text-[9px] text-gray-600 dark:text-gray-400 font-sans pointer-events-none">
              {i > 0 ? i : ''}
            </span>

            {/* Sub-ticks for quarter and half inches */}
            {i < totalInches && (
              <>
                <div
                  className="absolute bottom-0 h-1.5 w-[1px] bg-gray-300 dark:bg-gray-600"
                  style={{ left: '24px' }}
                />
                <div
                  className="absolute bottom-0 h-2.5 w-[1px] bg-gray-400 dark:bg-gray-500"
                  style={{ left: '48px' }}
                />
                <div
                  className="absolute bottom-0 h-1.5 w-[1px] bg-gray-300 dark:bg-gray-600"
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
        className={`absolute bottom-0 w-3 h-3 bg-[#185abd] transform -translate-x-1/2 rotate-45 cursor-ew-resize z-20 shadow-sm transition-transform hover:scale-125 ${
          isDragging === 'left' ? 'scale-125 bg-blue-700 ring-2 ring-blue-300' : ''
        }`}
        style={{ left: `${marginLeft}px` }}
        title={`Left Margin: ${(marginLeft / 96).toFixed(2)}"`}
      />

      {/* Right Margin Slider Handle */}
      <div
        onMouseDown={(e) => handleMouseDown('right', e)}
        className={`absolute bottom-0 w-3 h-3 bg-[#185abd] transform translate-x-1/2 rotate-45 cursor-ew-resize z-20 shadow-sm transition-transform hover:scale-125 ${
          isDragging === 'right' ? 'scale-125 bg-blue-700 ring-2 ring-blue-300' : ''
        }`}
        style={{ right: `${marginRight}px` }}
        title={`Right Margin: ${(marginRight / 96).toFixed(2)}"`}
      />
    </div>
  );
};
