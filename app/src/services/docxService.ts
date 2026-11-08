// DOCX Import & Export Service using mammoth and docx with full OpenXML parity
import mammoth from 'mammoth';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  ExternalHyperlink,
  PageBreak,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageOrientation,
  Header,
  Footer,
  PageNumber,
} from 'docx';
import { PlatformService } from './platform';

export class DocxService {
  /**
   * Imports a DOCX file from an ArrayBuffer and converts to structured HTML,
   * preserving embedded images, tables, lists, and formatting.
   */
  public static async importDocx(arrayBuffer: ArrayBuffer): Promise<{ html: string; warnings: string[] }> {
    try {
      const options = {
        convertImage: mammoth.images.imgElement((image: any) => {
          return image.read('base64').then((imageBuffer: string) => {
            return {
              src: `data:${image.contentType};base64,${imageBuffer}`,
            };
          });
        }),
      };
      const result = await (mammoth as any).convertToHtml({ arrayBuffer }, options);
      return {
        html: result.value,
        warnings: result.messages.map((m: any) => m.message),
      };
    } catch (err: any) {
      console.error('Error importing DOCX:', err);
      throw new Error(`Failed to parse DOCX file: ${err.message || 'Unknown error'}`);
    }
  }

  /**
   * Exports document content to a real .docx file with full OpenXML parity.
   */
  public static async exportDocx(
    editorJson: any,
    _editorHtml: string,
    filename: string = 'Document.docx',
    pageSettings?: any,
    destinationPath?: string
  ): Promise<string | false> {
    try {
      const docChildren: (Paragraph | Table)[] = [];

      // Parse Tiptap JSON content into docx library elements
      if (editorJson && editorJson.content && Array.isArray(editorJson.content)) {
        for (const node of editorJson.content) {
          const docElement = this.convertNodeToDocx(node);
          if (docElement) {
            if (Array.isArray(docElement)) {
              docChildren.push(...docElement);
            } else {
              docChildren.push(docElement);
            }
          }
        }
      }

      // If document is empty, add at least one empty paragraph
      if (docChildren.length === 0) {
        docChildren.push(new Paragraph({ text: '' }));
      }

      const topMargin = Math.round((pageSettings?.margins?.top ?? 96) * 15);
      const bottomMargin = Math.round((pageSettings?.margins?.bottom ?? 96) * 15);
      const leftMargin = Math.round((pageSettings?.margins?.left ?? 96) * 15);
      const rightMargin = Math.round((pageSettings?.margins?.right ?? 96) * 15);
      const isLandscape = pageSettings?.orientation === 'landscape';

      const dimensions = pageSettings?.size === 'a4'
        ? { width: 11906, height: 16838 }
        : pageSettings?.size === 'legal'
          ? { width: 12240, height: 20160 }
          : { width: 12240, height: 15840 };
      const sectionProps: any = {
        page: {
          margin: { top: topMargin, bottom: bottomMargin, left: leftMargin, right: rightMargin },
          size: {
            width: isLandscape ? dimensions.height : dimensions.width,
            height: isLandscape ? dimensions.width : dimensions.height,
            orientation: isLandscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
          },
        },
      };

      // Build Header
      const headerLeftText = (pageSettings?.headerLeft || pageSettings?.headerText || '').replace('{title}', filename.replace(/\.docx$/i, ''));
      const headerRightText = pageSettings?.headerRight || '';
      const headerParagraphs: Paragraph[] = [];
      if (headerLeftText || headerRightText) {
        headerParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.BOTH,
            children: [
              new TextRun({ text: headerLeftText, size: 18, color: '71717A', font: 'Aptos' }),
              ...(headerRightText ? [new TextRun({ text: `\t${headerRightText}`, size: 18, color: '71717A', font: 'Aptos' })] : []),
            ],
          })
        );
      }

      // Build Footer
      const footerLeftText = pageSettings?.footerLeft || pageSettings?.footerText || '';
      const showPageNumbers = pageSettings?.showPageNumbers !== false;
      const footerParagraphs: Paragraph[] = [];
      if (footerLeftText || showPageNumbers) {
        const footerRuns: (TextRun | any)[] = [];
        if (footerLeftText) {
          footerRuns.push(new TextRun({ text: footerLeftText, size: 18, color: '71717A', font: 'Aptos' }));
        }
        if (showPageNumbers) {
          footerRuns.push(
            new TextRun({
              text: footerLeftText ? '\tPage ' : 'Page ',
              size: 18,
              color: '71717A',
              font: 'Aptos',
            }),
            new TextRun({
              children: [PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES],
              size: 18,
              color: '71717A',
              font: 'Aptos',
            })
          );
        }
        footerParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.BOTH,
            children: footerRuns,
          })
        );
      }

      const doc = new Document({
        title: filename.replace(/\.docx$/i, ''),
        description: 'Created with Wordo',
        sections: [
          {
            properties: sectionProps,
            headers: headerParagraphs.length > 0 ? { default: new Header({ children: headerParagraphs }) } : undefined,
            footers: footerParagraphs.length > 0 ? { default: new Footer({ children: footerParagraphs }) } : undefined,
            children: docChildren,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const safeFilename = filename.endsWith('.docx') ? filename : `${filename}.docx`;
      return await PlatformService.saveFile(
        safeFilename,
        blob,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        destinationPath
      );
    } catch (err: any) {
      console.error('Error exporting DOCX:', err);
      throw new Error(`Failed to export DOCX: ${err.message || 'Unknown error'}`);
    }
  }

  private static convertNodeToDocx(node: any): Paragraph | Table | (Paragraph | Table)[] | null {
    if (!node) return null;

    switch (node.type) {
      case 'paragraph': {
        const runs = this.extractParagraphRuns(node.content);
        const alignment = this.getAlignment(node.attrs?.textAlign);
        const lineSpacing = node.attrs?.lineHeight
          ? Math.round(parseFloat(node.attrs.lineHeight) * 240)
          : 276;
        const indentLeft = node.attrs?.indent
          ? Math.round(node.attrs.indent * 360)
          : undefined;

        const before = node.attrs?.spaceBefore ? 240 : 0;
        const after = node.attrs?.spaceAfter === false ? 0 : 120;

        return new Paragraph({
          children: runs,
          alignment,
          indent: indentLeft ? { left: indentLeft } : undefined,
          spacing: { before, after, line: lineSpacing },
        });
      }

      case 'heading': {
        const level = node.attrs?.level || 1;
        const runs = this.extractParagraphRuns(node.content);
        const headingLevel =
          level === 1
            ? HeadingLevel.HEADING_1
            : level === 2
            ? HeadingLevel.HEADING_2
            : HeadingLevel.HEADING_3;
        const alignment = this.getAlignment(node.attrs?.textAlign);

        return new Paragraph({
          children: runs,
          heading: headingLevel,
          alignment,
          spacing: { before: 240, after: 120 },
        });
      }

      case 'bulletList':
      case 'bullet_list': {
        const items: Paragraph[] = [];
        if (node.content && Array.isArray(node.content)) {
          for (const item of node.content) {
            if (item.content && Array.isArray(item.content)) {
              for (const p of item.content) {
                const runs = this.extractParagraphRuns(p.content);
                items.push(
                  new Paragraph({
                    children: runs,
                    bullet: { level: 0 },
                    spacing: { after: 80 },
                  })
                );
              }
            }
          }
        }
        return items;
      }

      case 'orderedList':
      case 'ordered_list': {
        const items: Paragraph[] = [];
        if (node.content && Array.isArray(node.content)) {
          let num = 1;
          for (const item of node.content) {
            if (item.content && Array.isArray(item.content)) {
              for (const p of item.content) {
                const runs = this.extractParagraphRuns(p.content);
                items.push(
                  new Paragraph({
                    children: [new TextRun({ text: `${num}. `, bold: true, font: 'Aptos' }), ...runs],
                    spacing: { after: 80 },
                  })
                );
              }
            }
            num++;
          }
        }
        return items;
      }

      case 'taskList':
      case 'task_list': {
        const items: Paragraph[] = [];
        if (node.content && Array.isArray(node.content)) {
          for (const item of node.content) {
            const checked = item.attrs?.checked;
            const prefix = checked ? '☑ ' : '☐ ';
            if (item.content && Array.isArray(item.content)) {
              for (const p of item.content) {
                const runs = this.extractParagraphRuns(p.content);
                items.push(
                  new Paragraph({
                    children: [new TextRun({ text: prefix, bold: true, font: 'Aptos' }), ...runs],
                    spacing: { after: 80 },
                  })
                );
              }
            }
          }
        }
        return items;
      }

      case 'blockquote': {
        const runs = this.extractParagraphRuns(node.content);
        return new Paragraph({
          children: runs,
          indent: { left: 720 },
          spacing: { before: 120, after: 120 },
        });
      }

      case 'codeBlock':
      case 'code_block': {
        const text = node.content?.map((c: any) => c.text || '').join('') || '';
        return new Paragraph({
          children: [new TextRun({ text, font: 'Consolas', size: 20 })],
          shading: { fill: 'F1F5F9' },
          spacing: { before: 120, after: 120 },
        });
      }

      case 'horizontalRule': {
        return new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '666666' } },
        });
      }

      case 'pageBreak': {
        return new Paragraph({ children: [new PageBreak()] });
      }

      case 'image': {
        const imgRun = this.createImageRun(node.attrs?.src, node.attrs?.width, node.attrs?.height);
        if (imgRun) {
          return new Paragraph({
            children: [imgRun],
            spacing: { before: 120, after: 120 },
          });
        }
        return null;
      }

      case 'table': {
        const rows: TableRow[] = [];
        if (node.content && Array.isArray(node.content)) {
          for (const rowNode of node.content) {
            const cells: TableCell[] = [];
            if (rowNode.content && Array.isArray(rowNode.content)) {
              for (const cellNode of rowNode.content) {
                const cellParagraphs: Paragraph[] = [];
                if (cellNode.content && Array.isArray(cellNode.content)) {
                  for (const p of cellNode.content) {
                    const runs = this.extractParagraphRuns(p.content);
                    cellParagraphs.push(new Paragraph({ children: runs }));
                  }
                }
                if (cellParagraphs.length === 0) {
                  cellParagraphs.push(new Paragraph({ text: '' }));
                }

                const isHeader = cellNode.type === 'tableHeader';
                const customBg = cellNode.attrs?.background ? cellNode.attrs.background.replace('#', '') : undefined;
                cells.push(
                  new TableCell({
                    children: cellParagraphs,
                    shading: customBg ? { fill: customBg } : (isHeader ? { fill: 'F1F5F9' } : undefined),
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                      left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                      right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
                    },
                  })
                );
              }
            }
            rows.push(new TableRow({ children: cells }));
          }
        }

        return new Table({
          rows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        });
      }

      default:
        if (node.text) {
          return new Paragraph({ text: node.text });
        }
        return null;
    }
  }

  private static mapHighlightColor(hex?: string): any {
    if (!hex) return 'yellow';
    const clean = hex.toLowerCase().replace('#', '');
    switch (clean) {
      case 'ffff00':
        return 'yellow';
      case '00ff00':
      case 'a3e635':
        return 'green';
      case '00ffff':
      case '67e8f9':
        return 'cyan';
      case 'ff00ff':
      case 'f472b6':
        return 'magenta';
      case '0000ff':
        return 'blue';
      case 'ff0000':
        return 'red';
      case '000080':
        return 'darkBlue';
      case '008080':
        return 'darkCyan';
      case '008000':
        return 'darkGreen';
      case '800080':
        return 'darkMagenta';
      case '800000':
        return 'darkRed';
      case '808000':
        return 'darkYellow';
      case '808080':
        return 'darkGray';
      case 'c0c0c0':
      case 'cbd5e1':
        return 'lightGray';
      case '000000':
        return 'black';
      default:
        return 'yellow';
    }
  }

  private static extractParagraphRuns(content: any[] | undefined): (TextRun | ExternalHyperlink | ImageRun)[] {
    if (!content || !Array.isArray(content)) return [];

    const runs: (TextRun | ExternalHyperlink | ImageRun)[] = [];
    for (const item of content) {
      if (item.type === 'text') {
        let bold = false;
        let italics = false;
        let underline = false;
        let strike = false;
        let subScript = false;
        let superScript = false;
        let linkHref: string | null = null;
        let highlight: any = undefined;
        let color: string | undefined = undefined;
        let font = 'Aptos';
        let size: number | undefined = undefined;

        if (item.marks && Array.isArray(item.marks)) {
          for (const mark of item.marks) {
            if (mark.type === 'bold') bold = true;
            if (mark.type === 'italic') italics = true;
            if (mark.type === 'underline') underline = true;
            if (mark.type === 'strike') strike = true;
            if (mark.type === 'subscript') subScript = true;
            if (mark.type === 'superscript') superScript = true;
            if (mark.type === 'highlight') {
              highlight = this.mapHighlightColor(mark.attrs?.color);
            }
            if (mark.type === 'link' && mark.attrs?.href) {
              linkHref = mark.attrs.href;
            }
            if (mark.type === 'textStyle') {
              if (mark.attrs?.color) {
                color = mark.attrs.color.replace('#', '');
              }
              if (mark.attrs?.fontFamily) {
                font = mark.attrs.fontFamily;
              }
              if (mark.attrs?.fontSize) {
                const numeric = parseFloat(mark.attrs.fontSize.toString());
                if (!isNaN(numeric)) {
                  size = Math.round(numeric * 2); // docx size is half-points
                }
              }
            }
          }
        }

        const textRun = new TextRun({
          text: item.text || '',
          bold,
          italics,
          underline: underline ? {} : undefined,
          strike,
          subScript: subScript ? true : undefined,
          superScript: superScript ? true : undefined,
          highlight,
          color,
          font,
          size,
        });

        if (linkHref) {
          runs.push(
            new ExternalHyperlink({
              children: [textRun],
              link: linkHref,
            })
          );
        } else {
          runs.push(textRun);
        }
      } else if (item.type === 'image') {
        const imgRun = this.createImageRun(item.attrs?.src, item.attrs?.width, item.attrs?.height);
        if (imgRun) {
          runs.push(imgRun);
        }
      }
    }
    return runs;
  }

  private static createImageRun(src?: string, width?: number, height?: number): ImageRun | null {
    if (!src || typeof src !== 'string' || !src.startsWith('data:')) {
      return null;
    }
    try {
      const parts = src.split(',');
      if (parts.length === 2) {
        const binaryString = atob(parts[1]);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const mimeMatch = parts[0].match(/image\/(jpeg|jpg|png|gif|bmp)/);
        const imgType: 'jpg' | 'png' | 'gif' | 'bmp' =
          mimeMatch && (mimeMatch[1] === 'jpeg' || mimeMatch[1] === 'jpg')
            ? 'jpg'
            : (mimeMatch?.[1] as any) || 'png';

        return new ImageRun({
          data: bytes,
          type: imgType,
          transformation: {
            width: Math.min(500, width || 450),
            height: Math.min(400, height || 300),
          },
        });
      }
    } catch (e) {
      console.warn('Could not parse image data for docx:', e);
    }
    return null;
  }

  private static getAlignment(align?: string): (typeof AlignmentType)[keyof typeof AlignmentType] {
    switch (align) {
      case 'center':
        return AlignmentType.CENTER;
      case 'right':
        return AlignmentType.RIGHT;
      case 'justify':
        return AlignmentType.JUSTIFIED;
      default:
        return AlignmentType.LEFT;
    }
  }
}
