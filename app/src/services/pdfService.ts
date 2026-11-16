// PDF generation and Print Service
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PlatformService } from './platform';
import { PageSettings } from '../types';

export class PdfService {
  /**
   * Triggers the native platform print dialog (which supports 'Save as PDF' natively)
   */
  public static printDocument(): void {
    window.print();
  }

  /**
   * Directly exports a given HTML container element to a downloadable PDF file,
   * splitting content into correctly sized pages matching document settings
   * and preferring vector/selectable text.
   */
  public static async exportPdf(
    containerElement: HTMLElement,
    filename: string = 'Document.pdf',
    pageSettings?: PageSettings
  ): Promise<boolean> {
    const isLandscape = pageSettings?.orientation === 'landscape';
    const paperSize = pageSettings?.size || 'a4';
    const format = paperSize === 'legal' ? 'legal' : paperSize === 'letter' ? 'letter' : 'a4';
    const orientation = isLandscape ? 'landscape' : 'portrait';
    const safeFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;

    // Clone element to avoid modifying the active DOM editor and strip zoom transforms
    const clone = containerElement.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.zIndex = '-9999';
    clone.style.opacity = '1';
    clone.style.pointerEvents = 'none';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';

    // Strip any interactive inputs/buttons or temporary UI from the export clone
    clone.querySelectorAll('input, textarea').forEach((el) => {
      const input = el as HTMLInputElement;
      const text = input.value || '';
      if (text) {
        const span = document.createElement('span');
        span.textContent = text;
        span.className = input.className;
        span.style.border = 'none';
        span.style.background = 'transparent';
        span.style.outline = 'none';
        input.parentNode?.replaceChild(span, input);
      } else {
        input.remove();
      }
    });
    clone.querySelectorAll('button, .print\\:hidden').forEach((el) => {
      el.remove();
    });

    // Ensure all elements in the clone have outline and box-shadow removed so no focus rings appear in PDF
    clone.querySelectorAll('*').forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style) {
        htmlEl.style.outline = 'none';
        htmlEl.style.outlineWidth = '0';
        htmlEl.style.boxShadow = 'none';
      }
    });

    document.body.appendChild(clone);

    try {
      const pdf = new jsPDF({
        orientation,
        unit: 'pt',
        format,
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Attempt vector/selectable text export using jsPDF html method
      let htmlExportSuccess = false;
      try {
        await new Promise<void>((resolve, reject) => {
          pdf.html(clone, {
            callback: () => {
              htmlExportSuccess = true;
              resolve();
            },
            autoPaging: 'text',
            width: pdfWidth,
            windowWidth: containerElement.offsetWidth || 816,
            html2canvas: {
              scale: 1.5,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff',
            },
          }).catch(reject);
        });
      } catch (e) {
        console.warn('[Wordo PDF] pdf.html vector export failed, falling back to multi-page raster slicing:', e);
        htmlExportSuccess = false;
      }

      if (htmlExportSuccess) {
        const pdfBlob = pdf.output('blob');
        if (PlatformService.isDesktop()) {
          const buffer = await pdfBlob.arrayBuffer();
          await PlatformService.saveFile(safeFilename, new Uint8Array(buffer), 'application/pdf');
        } else {
          pdf.save(safeFilename);
        }
        return true;
      }

      // High-fidelity multi-page sliced fallback
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const fallbackPdf = new jsPDF({
        orientation,
        unit: 'pt',
        format,
        compress: true,
      });

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pageHeightInCanvasPx = Math.floor(canvasWidth * (pdfHeight / pdfWidth));

      let renderedHeight = 0;
      let pageIndex = 0;

      while (renderedHeight < canvasHeight) {
        if (pageIndex > 0) {
          fallbackPdf.addPage(format, orientation);
        }

        const sliceHeight = Math.min(pageHeightInCanvasPx, canvasHeight - renderedHeight);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = pageHeightInCanvasPx;
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasWidth, pageHeightInCanvasPx);
          ctx.drawImage(
            canvas,
            0,
            renderedHeight,
            canvasWidth,
            sliceHeight,
            0,
            0,
            canvasWidth,
            sliceHeight
          );

          const imgData = pageCanvas.toDataURL('image/jpeg', 0.92);
          fallbackPdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        }

        renderedHeight += pageHeightInCanvasPx;
        pageIndex++;
      }

      const pdfBlob = fallbackPdf.output('blob');
      if (PlatformService.isDesktop()) {
        const buffer = await pdfBlob.arrayBuffer();
        await PlatformService.saveFile(safeFilename, new Uint8Array(buffer), 'application/pdf');
      } else {
        fallbackPdf.save(safeFilename);
      }

      return true;
    } catch (err) {
      console.error('Error exporting PDF:', err);
      window.print();
      return false;
    } finally {
      if (document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
    }
  }
}
