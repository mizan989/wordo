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
  LevelFormat,
  VerticalAlign,
} from 'docx';
import { PlatformService } from './platform';

export class DocxService {
  /**
   * Imports a DOCX file from an ArrayBuffer and converts to structured HTML,
   * preserving embedded images, tables, lists, and formatting.
   * Surfaces meaningful import warnings to the user.
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

      // Clean and surface meaningful warnings without overwhelming technical internals
      const rawMessages: string[] = result.messages?.map((m: any) => m.message) || [];
      const userWarnings: string[] = [];

      for (const msg of rawMessages) {
        const lower = msg.toLowerCase();
        if (lower.includes('unrecognised style') || lower.includes('unrecognized style')) {
          // Normal harmless formatting fallback; skip spamming user
          continue;
        }
        if (lower.includes('table') || lower.includes('row') || lower.includes('column')) {
          userWarnings.push('Complex table layout was simplified to match standard editor tables.');
        } else if (lower.includes('image') || lower.includes('drawing')) {
          userWarnings.push('Some advanced graphics or shapes were imported as static images.');
        } else if (lower.includes('hyperlink') || lower.includes('link')) {
          userWarnings.push('Some hyperlink formatting was simplified.');
        } else if (!userWarnings.includes(msg)) {
          userWarnings.push(msg);
        }
      }

      return {
        html: result.value,
        warnings: Array.from(new Set(userWarnings)),
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
      const numberingConfigs: any[] = [];
      let listCounter = 0;
      const exportWarnings: string[] = [];

      // Parse Tiptap JSON content into docx library elements
      if (editorJson && editorJson.content && Array.isArray(editorJson.content)) {
        for (const node of editorJson.content) {
          const docElement = this.convertNodeToDocx(node, 0, () => {
            listCounter++;
            return `num_list_${listCounter}`;
          }, numberingConfigs, exportWarnings);

          if (docElement) {
            if (Array.isArray(docElement)) {
              docChildren.push(...docElement);
            } else {
              docChildren.push(docElement);
            }
          }
        }
      }

      if (exportWarnings.length > 0) {
        console.warn('[Wordo DOCX Export Warnings]:', exportWarnings);
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
        numbering: numberingConfigs.length > 0 ? { config: numberingConfigs } : undefined,
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

  private static convertNodeToDocx(
    node: any,
    currentLevel: number = 0,
    getNextListRef: () => string,
    numberingConfigs: any[],
    warnings: string[]
  ): Paragraph | Table | (Paragraph | Table)[] | null {
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
        return this.convertListItems(node, currentLevel, 'bullet', undefined, getNextListRef, numberingConfigs, warnings);
      }

      case 'orderedList':
      case 'ordered_list': {
        const startNumber = typeof node.attrs?.start === 'number' ? node.attrs.start : 1;
        const listRef = getNextListRef();

        numberingConfigs.push({
          reference: listRef,
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              start: startNumber,
            },
            {
              level: 1,
              format: LevelFormat.LOWER_LETTER,
              text: '%2.',
              alignment: AlignmentType.LEFT,
              start: 1,
            },
            {
              level: 2,
              format: LevelFormat.LOWER_ROMAN,
              text: '%3.',
              alignment: AlignmentType.LEFT,
              start: 1,
            },
            {
              level: 3,
              format: LevelFormat.DECIMAL,
              text: '%4.',
              alignment: AlignmentType.LEFT,
              start: 1,
            },
          ],
        });

        return this.convertListItems(node, currentLevel, 'ordered', listRef, getNextListRef, numberingConfigs, warnings);
      }

      case 'taskList':
      case 'task_list': {
        return this.convertListItems(node, currentLevel, 'task', undefined, getNextListRef, numberingConfigs, warnings);
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
                const cellChildren: (Paragraph | Table)[] = [];
                if (cellNode.content && Array.isArray(cellNode.content)) {
                  for (const childBlock of cellNode.content) {
                    const block = this.convertNodeToDocx(childBlock, 0, getNextListRef, numberingConfigs, warnings);
                    if (block) {
                      if (Array.isArray(block)) {
                        cellChildren.push(...block);
                      } else {
                        cellChildren.push(block);
                      }
                    }
                  }
                }
                if (cellChildren.length === 0) {
                  cellChildren.push(new Paragraph({ text: '' }));
                }

                const isHeader = cellNode.type === 'tableHeader';
                const customBg = cellNode.attrs?.background
                  ? cellNode.attrs.background.replace('#', '')
                  : undefined;

                const colSpan = cellNode.attrs?.colspan || undefined;
                const rowSpan = cellNode.attrs?.rowspan || undefined;

                let cellWidthConfig: any = undefined;
                if (cellNode.attrs?.colwidth && Array.isArray(cellNode.attrs.colwidth) && cellNode.attrs.colwidth[0]) {
                  cellWidthConfig = {
                    size: Math.round(cellNode.attrs.colwidth[0] * 15),
                    type: WidthType.DXA,
                  };
                }

                cells.push(
                  new TableCell({
                    children: cellChildren,
                    columnSpan: colSpan,
                    rowSpan: rowSpan,
                    width: cellWidthConfig,
                    verticalAlign: VerticalAlign.TOP,
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

      default: {
        // Fallback for unsupported nodes: preserve any text or children rather than discarding
        if (node.content && Array.isArray(node.content)) {
          const fallbackChildren: (Paragraph | Table)[] = [];
          for (const sub of node.content) {
            const childResult = this.convertNodeToDocx(sub, currentLevel, getNextListRef, numberingConfigs, warnings);
            if (childResult) {
              if (Array.isArray(childResult)) fallbackChildren.push(...childResult);
              else fallbackChildren.push(childResult);
            }
          }
          if (fallbackChildren.length > 0) {
            warnings.push(`Unsupported node type '${node.type}' converted via child block fallback.`);
            return fallbackChildren;
          }
        }
        if (node.text) {
          warnings.push(`Unsupported inline node converted to text run.`);
          return new Paragraph({ text: node.text });
        }
        warnings.push(`Skipped unrecognized empty node type '${node.type}'.`);
        return null;
      }
    }
  }

  /**
   * Recursively convert list items preserving nested list hierarchy and numbering
   */
  private static convertListItems(
    listNode: any,
    level: number,
    type: 'bullet' | 'ordered' | 'task',
    numberingRef: string | undefined,
    getNextListRef: () => string,
    numberingConfigs: any[],
    warnings: string[]
  ): Paragraph[] {
    const paragraphs: Paragraph[] = [];
    if (!listNode.content || !Array.isArray(listNode.content)) return paragraphs;

    for (const item of listNode.content) {
      if (!item.content || !Array.isArray(item.content)) continue;

      const isChecked = item.attrs?.checked;
      const taskPrefix = isChecked ? '☑ ' : '☐ ';

      for (const child of item.content) {
        if (child.type === 'paragraph') {
          const runs = this.extractParagraphRuns(child.content);
          if (type === 'bullet') {
            paragraphs.push(
              new Paragraph({
                children: runs,
                bullet: { level },
                spacing: { after: 80 },
              })
            );
          } else if (type === 'ordered' && numberingRef) {
            paragraphs.push(
              new Paragraph({
                children: runs,
                numbering: { reference: numberingRef, level },
                spacing: { after: 80 },
              })
            );
          } else if (type === 'task') {
            paragraphs.push(
              new Paragraph({
                children: [new TextRun({ text: taskPrefix, bold: true, font: 'Aptos' }), ...runs],
                indent: { left: (level + 1) * 360 },
                spacing: { after: 80 },
              })
            );
          }
        } else if (child.type === 'bulletList' || child.type === 'bullet_list') {
          paragraphs.push(
            ...this.convertListItems(child, level + 1, 'bullet', undefined, getNextListRef, numberingConfigs, warnings)
          );
        } else if (child.type === 'orderedList' || child.type === 'ordered_list') {
          paragraphs.push(
            ...this.convertListItems(child, level + 1, 'ordered', numberingRef, getNextListRef, numberingConfigs, warnings)
          );
        } else if (child.type === 'taskList' || child.type === 'task_list') {
          paragraphs.push(
            ...this.convertListItems(child, level + 1, 'task', undefined, getNextListRef, numberingConfigs, warnings)
          );
        } else {
          // Other nested node in list item (e.g. blockquote, codeblock)
          const nested = this.convertNodeToDocx(child, level + 1, getNextListRef, numberingConfigs, warnings);
          if (nested) {
            if (Array.isArray(nested)) {
              for (const n of nested) {
                if (n instanceof Paragraph) paragraphs.push(n);
              }
            } else if (nested instanceof Paragraph) {
              paragraphs.push(nested);
            }
          }
        }
      }
    }

    return paragraphs;
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

  /**
   * Create an ImageRun with aspect-ratio preservation and max bounds fitting
   */
  private static createImageRun(src?: string, rawWidth?: number, rawHeight?: number): ImageRun | null {
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

        // Proportional dimension scaling preserving aspect ratio
        const maxWidth = 580;
        const maxHeight = 780;

        let width = rawWidth && rawWidth > 0 ? rawWidth : 450;
        let height = rawHeight && rawHeight > 0 ? rawHeight : 300;

        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = Math.round(maxWidth / aspectRatio);
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = Math.round(maxHeight * aspectRatio);
        }

        return new ImageRun({
          data: bytes,
          type: imgType,
          transformation: {
            width,
            height,
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
