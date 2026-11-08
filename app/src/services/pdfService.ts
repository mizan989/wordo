// PDF generation and Print Service
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class PdfService {
  /**
   * Triggers the native platform print dialog (which supports 'Save as PDF' natively)
   */
  public static printDocument(): void {
    window.print();
  }

  /**
   * Directly exports a given HTML container element to a downloadable PDF file.
   */
  public static async exportPdf(containerElement: HTMLElement, filename: string = 'Document.pdf'): Promise<boolean> {
    try {
      // Use html2canvas with high scale for crisp typography
      const canvas = await html2canvas(containerElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      return true;
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback to window.print() if canvas fails
      window.print();
      return false;
    }
  }
}
