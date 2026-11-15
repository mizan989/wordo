import React, { useState, useEffect, useRef } from 'react';
import {
  Scissors,
  Copy,
  Clipboard,
  Paintbrush,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Highlighter,
  Baseline,
  RemoveFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Indent,
  Outdent,
  Table as TableIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  Sparkles,
  FileDown,
  Printer,
  ChevronDown,
  ChevronUp,
  Quote,
  Code,
  Minus,
  FileText,
  FileCheck,
  Check,
  Calendar,
  Palette,
  Columns,
  Trash2,
  Plus,
  BookOpen,
  Languages,
  Volume2,
  Eye,
  Layers,
  Bookmark,
  Hash,
  MessageSquare,
  Maximize2,
  Sun,
  Moon,
  BookmarkCheck,
  HelpCircle,
  Clock,
  CheckCircle2,
  Undo2,
  Redo2,
  ArrowDownAZ,
  Pilcrow,
  Smile,
  Video,
  PenTool,
  Headphones,
  MessageCircle,
  Keyboard,
  Megaphone,
  ExternalLink,
  Edit3,
  Sliders,
  ChevronRight,
  Mic,
  LayoutGrid,
  RefreshCw,
  CheckCheck,
  RotateCcw,
  Info as InfoIcon,
  ChevronLeft,
  XCircle,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { FONT_SIZE_STEPS } from '../extensions/typography';
import { FileMenuDropdown } from './FileMenuDropdown';

interface RibbonToolbarProps {
  editor: Editor | null;
  documentTitle?: string;
  onOpenSearch: () => void;
  onOpenSpellCheck: () => void;
  onOpenWordCount: () => void;
  onOpenRecovery: () => void;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onOpenSettings?: () => void;
  currentZoom: number;
  onZoomChange: (zoom: number) => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showNavSidebar: boolean;
  onToggleNavSidebar: () => void;
  pageSettings?: any;
  onUpdatePageSettings?: (settings: any) => void;

  // File Backstage & Menu Integration
  onOpenFileMenu?: () => void;
  onNew?: () => void;
  onNewFromTemplate?: (template: any) => void;
  onOpen?: () => void;
  onOpenRecent?: (doc: any) => void;
  recentDocuments?: any[];
  onSave?: () => void;
  onSaveAs?: () => void;
  onExportHtml?: () => void;
  onExportTxt?: () => void;
  onPrint?: () => void;
  onCloseDocument?: () => void;
  onOpenAbout?: () => void;
  onOpenShortcuts?: () => void;
  onRename?: () => void;
  onOpenInfo?: () => void;

  // Word Online / M365 Deep Features
  onOpenSymbolModal?: () => void;
  onOpenDateTimeModal?: () => void;
  onOpenCitationModal?: () => void;
  onOpenTranslateModal?: () => void;
  onOpenAccessibilityModal?: () => void;
  onToggleReadAloud?: () => void;
  isReadAloudOpen?: boolean;
  onToggleFocusMode?: () => void;
  isFocusMode?: boolean;
  paperTheme?: 'white' | 'dark' | 'sepia';
  onSetPaperTheme?: (theme: 'white' | 'dark' | 'sepia') => void;
}

export const CLOUD_FONTS = [
  'Aptos',
  'Aptos Display',
  'Aptos Serif',
  'Aptos Narrow',
  'Aptos Mono',
  'Bierstadt',
  'Grandview',
  'Seaford',
  'Skeena',
  'Tenorite',
  'Bahnschrift',
  'Cascadia Code',
  'Cascadia Mono',
  'Sitka Text',
  'Sitka Heading',
  'Sitka Display',
  'Constantia',
  'Corbel',
  'Candara',
];

export const STANDARD_FONTS = [
  'Abadi MT',
  'Agency FB',
  'Aharoni Bold',
  'Aldhabi',
  'Algerian',
  'Almanac MT',
  'American Uncial',
  'Andale Mono',
  'Andalus',
  'Andy',
  'Angsana New',
  'AngsanaUPC',
  'Aparajita',
  'Arabic Transparent',
  'Arabic Typesetting',
  'Arial',
  'Arial Black',
  'Arial Narrow',
  'Arial Narrow Special',
  'Arial Nova',
  'Arial Rounded MT',
  'Arial Special',
  'Arial Unicode MS',
  'Augsburger Initials',
  'Avenir Next LT Pro',
  'BIZ UDGothic',
  'BIZ UDMincho Medium',
  'Baskerville Old Face',
  'Batang',
  'BatangChe',
  'Bauhaus 93',
  'Beesknees ITC',
  'Bell MT',
  'Bembo',
  'Berlin Sans FB',
  'Bernard MT Condensed',
  'Bickley Script',
  'Biome',
  'Blackadder ITC',
  'Bodoni MT',
  'Bodoni MT Condensed',
  'Bon Apetit MT',
  'Book Antiqua',
  'Bookman Old Style',
  'Bookshelf Symbol',
  'Bradley Hand ITC',
  'Braggadocio',
  'BriemScript',
  'Britannic Bold',
  'Broadway',
  'Browallia New',
  'BrowalliaUPC',
  'Brush Script MT',
  'Calibri',
  'Californian FB',
  'Calisto MT',
  'Cambria',
  'Cariadings',
  'Castellar',
  'Cavolini',
  'Centaur',
  'Century',
  'Century Gothic',
  'Century Schoolbook',
  'Chiller',
  'Colonna MT',
  'Comic Sans MS',
  'Consolas',
  'Contemporary Brush',
  'Cooper Black',
  'Copperplate Gothic',
  'Cordia New',
  'CordiaUPC',
  'Courier New',
  'Curlz MT',
  'DFKai-SB',
  'Dante',
  'DaunPenh',
  'David',
  'Daytona',
  'Desdemona',
  'DilleniaUPC',
  'Directions MT',
  'DokChampa',
  'Dotum',
  'DotumChe',
  'Ebrima',
  'Eckmann',
  'Edda',
  'Edwardian Script ITC',
  'Elephant',
  'Engravers MT',
  'Enviro',
  'Eras ITC',
  'Estrangelo Edessa',
  'EucrosiaUPC',
  'Euphemia',
  'Eurostile',
  'FangSong',
  'Felix Titling',
  'Fine Hand',
  'Fixed Miriam Transparent',
  'Flexure',
  'Footlight MT',
  'Forte',
  'FrankRuehl',
  'Franklin Gothic',
  'Franklin Gothic Medium',
  'FreesiaUPC',
  'Freestyle Script',
  'French Script MT',
  'Futura',
  'Gabriola',
  'Gadugi',
  'Garamond',
  'Garamond MT',
  'Gautami',
  'Georgia',
  'Georgia Ref',
  'Gigi',
  'Gill Sans MT',
  'Gill Sans MT Condensed',
  'Gisha',
  'Gloucester',
  'Goudy Old Style',
  'Goudy Stout',
  'Gradl',
  'Grotesque',
  'Gulim',
  'GulimChe',
  'Gungsuh',
  'GungsuhChe',
  'HGGothicE',
  'HGMinchoE',
  'HGSoeiKakugothicUB',
  'Hadassah Friedlaender',
  'Haettenschweiler',
  'Harlow Solid Italic',
  'Harrington',
  'High Tower Text',
  'Holidays MT',
  'HoloLens MDL2 Assets',
  'Impact',
  'Imprint MT Shadow',
  'Informal Roman',
  'IrisUPC',
  'Iskoola Pota',
  'JasmineUPC',
  'Javanese Text',
  'Jokerman',
  'Juice ITC',
  'KaiTi',
  'Kalinga',
  'Kartika',
  'Keystrokes MT',
  'Khmer UI',
  'Kigelia',
  'Kino MT',
  'KodchiangUPC',
  'Kokila',
  'Kristen ITC',
  'Kunstler Script',
  'LCD',
  'Lao UI',
  'Latha',
  'Leelawadee',
  'Levenim MT',
  'LilyUPC',
  'Lucida Blackletter',
  'Lucida Bright',
  'Lucida Bright Math',
  'Lucida Calligraphy',
  'Lucida Console',
  'Lucida Fax',
  'Lucida Handwriting',
  'Lucida Sans',
  'Lucida Sans Typewriter',
  'Lucida Sans Unicode',
  'MS Gothic',
  'MS LineDraw',
  'MS Mincho',
  'MS Outlook',
  'MS PMincho',
  'MS Reference',
  'MT Extra',
  'MV Boli',
  'Magneto',
  'Maiandra GD',
  'Malgun Gothic',
  'Mangal',
  'Map Symbols',
  'Marlett',
  'Matisse ITC',
  'Matura MT Script Capitals',
  'McZee',
  'Mead Bold',
  'Meiryo',
  'Mercurius Script MT Bold',
  'Microsoft GothicNeo',
  'Microsoft Himalaya',
  'Microsoft JhengHei',
  'Microsoft JhengHei UI',
  'Microsoft New Tai Lue',
  'Microsoft PhagsPa',
  'Microsoft Sans Serif',
  'Microsoft Tai Le',
  'Microsoft Uighur',
  'Microsoft YaHei',
  'Microsoft YaHei UI',
  'Microsoft Yi Baiti',
  'MingLiU',
  'MingLiU-ExtB',
  'MingLiU_HKSCS',
  'MingLiU_HKSCS-ExtB',
  'Minion Web',
  'Miriam',
  'Miriam Fixed',
  'Mistral',
  'Modern Love',
  'Modern No. 20',
  'Mongolian Baiti',
  'Monotype Corsiva',
  'Monotype Sorts',
  'Monotype.com',
  'MoolBoran',
  'Myanmar Text',
  'NSimSun',
  'Narkisim',
  'New Caledonia',
  'News Gothic MT',
  'Niagara',
  'Nirmala UI',
  'Nyala',
  'OCR A Extended',
  'OCR-B-Digits',
  'OCRB',
  'Old English Text MT',
  'Onyx',
  'PMingLiU',
  'PMingLiU-ExtB',
  'Palace Script MT',
  'Palatino Linotype',
  'Papyrus',
  'Parade',
  'Parchment',
  'Parties MT',
  'Peignot Medium',
  'Pepita MT',
  'Perpetua',
  'Perpetua Titling MT',
  'Placard Condensed',
  'Plantagenet Cherokee',
  'Playbill',
  'Poor Richard',
  'Posterama',
  'Pristina',
  'Quire Sans',
  'Raavi',
  'Rage Italic',
  'Ransom',
  'Ravie',
  'RefSpecialty',
  'Rockwell',
  'Rockwell Nova',
  'Rod',
  'Runic MT Condensed',
  'STCaiyun',
  'STFangsong',
  'STHupo',
  'STKaiti',
  'STXihei',
  'STXingkai',
  'STXinwei',
  'STZhongsong',
  'Sabon Next LT',
  'Sagona',
  'Sakkal Majalla',
  'Script MT Bold',
  'Segoe Chess',
  'Segoe Print',
  'Segoe Script',
  'Segoe UI',
  'Segoe UI Symbol',
  'Selawik',
  'Shonar Bangla',
  'Showcard Gothic',
  'Shruti',
  'Signs MT',
  'SimHei',
  'SimSun',
  'SimSun-ExtB',
  'Simplified Arabic Fixed',
  'Sitka',
  'Skeena Indigenous',
  'Snap ITC',
  'Sports MT',
  'Stencil',
  'Stop',
  'Sylfaen',
  'Symbol',
  'Tahoma',
  'Temp Installer Font',
  'Tempo Grunge',
  'Tempus Sans ITC',
  'The Hand',
  'The Serif Hand',
  'Times New Roman',
  'Times New Roman Special',
  'Tisa Offc Serif Pro',
  'Traditional Arabic',
  'Transport MT',
  'Trebuchet MS',
  'Tunga',
  'Tw Cen MT',
  'Univers',
  'Urdu Typesetting',
  'Utsaah',
  'Vacation MT',
  'Vani',
  'Verdana',
  'Verdana Ref',
  'Vijaya',
  'Viner Hand ITC',
  'Vivaldi',
  'Vixar ASCI',
  'Vladimir Script',
  'Vrinda',
  'Walbaum',
  'Webdings',
  'Westminster',
  'Wide Latin',
  'Wingdings',
];

const FONT_FAMILIES = [...CLOUD_FONTS, ...STANDARD_FONTS];

const FONT_SIZES = ['8', '9', '10', '10.5', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'];

// Microsoft Office Theme Colors
const THEME_BASE_COLORS = [
  '#ffffff',
  '#000000',
  '#e7e6e6',
  '#44546a',
  '#4472c4',
  '#ed7d31',
  '#a5a5a5',
  '#ffc000',
  '#5b9bd5',
  '#70ad47',
];

const THEME_SHADES = [
  ['#f2f2f2', '#7f7f7f', '#d0cece', '#d6dce4', '#d9e1f2', '#fce4d6', '#ededed', '#fff2cc', '#deebf7', '#e2efda'],
  ['#d9d9d9', '#595959', '#aeabab', '#acb9ca', '#b4c6e7', '#f8cbad', '#dbdbdb', '#ffe699', '#bdd7ee', '#c6e0b4'],
  ['#bfbfbf', '#3f3f3f', '#757171', '#8497b0', '#8ea9db', '#f4b084', '#c9c9c9', '#ffd966', '#9bc2e6', '#a9d08e'],
  ['#a6a6a6', '#262626', '#3a3838', '#333f48', '#305496', '#c65911', '#7b7b7b', '#bf8f00', '#2f5597', '#548235'],
  ['#7f7f7f', '#0c0c0c', '#161616', '#222a35', '#203764', '#833c0c', '#525252', '#806000', '#1f3864', '#375623'],
];

const STANDARD_COLORS = [
  '#c00000',
  '#ff0000',
  '#ffc000',
  '#ffff00',
  '#92d050',
  '#00b050',
  '#00b0f0',
  '#0070c0',
  '#002060',
  '#7030a0',
];

const WORD_HIGHLIGHT_COLORS = [
  { name: 'Yellow', color: '#ffff00' },
  { name: 'Bright Green', color: '#00ff00' },
  { name: 'Turquoise', color: '#00ffff' },
  { name: 'Pink', color: '#ff00ff' },
  { name: 'Blue', color: '#0000ff' },
  { name: 'Red', color: '#ff0000' },
  { name: 'Dark Blue', color: '#000080' },
  { name: 'Teal', color: '#008080' },
  { name: 'Green', color: '#008000' },
  { name: 'Violet', color: '#800080' },
  { name: 'Dark Red', color: '#800000' },
  { name: 'Dark Yellow', color: '#808000' },
  { name: '50% Gray', color: '#808080' },
  { name: '25% Gray', color: '#c0c0c0' },
  { name: 'Black', color: '#000000' },
];

const SPECIAL_SYMBOLS = [
  '©', '®', '™', '€', '£', '¥', '₹', '¢', '§', '¶',
  '°', '±', '≠', '≤', '≥', '×', '÷', '√', '∞', 'π',
  '∑', 'µ', 'Ω', '←', '↑', '→', '↓', '—', '–', '•',
  '★', '✓', '✗', '½', '¼', '¾', '‰', 'α', 'β', 'λ',
];

const PAGE_COLORS = [
  { name: 'Standard White', color: '#ffffff' },
  { name: 'Classic Cream', color: '#fdf6e2' },
  { name: 'Warm Sepia', color: '#fbf0d9' },
  { name: 'Mint Fresh', color: '#f0fdf4' },
  { name: 'Soft Blue', color: '#f0f9ff' },
  { name: 'Charcoal Dark', color: '#1e293b' },
];

const WATERMARK_PRESETS = [
  'CONFIDENTIAL',
  'DRAFT',
  'DO NOT COPY',
  'URGENT',
  'SAMPLE',
  'ORIGINAL',
];

export const RibbonToolbar: React.FC<RibbonToolbarProps> = ({
  editor,
  onOpenSearch,
  onOpenSpellCheck,
  onOpenWordCount,
  onOpenRecovery,
  onExportDocx,
  onExportPdf,
  onOpenSettings,
  currentZoom,
  onZoomChange,
  showRuler,
  onToggleRuler,
  showNavSidebar,
  onToggleNavSidebar,
  pageSettings,
  onUpdatePageSettings,
  onOpenSymbolModal,
  onOpenDateTimeModal,
  onOpenCitationModal,
  onOpenTranslateModal,
  onOpenAccessibilityModal,
  onToggleReadAloud,
  isReadAloudOpen,
  onToggleFocusMode,
  isFocusMode,
  paperTheme,
  onSetPaperTheme,
  onOpenFileMenu,
  onNew,
  onNewFromTemplate,
  onOpen,
  onOpenRecent,
  recentDocuments,
  onSave,
  onSaveAs,
  onExportHtml,
  onExportTxt,
  onPrint,
  onCloseDocument,
  onOpenAbout,
  onOpenShortcuts,
  documentTitle,
  onRename,
  onOpenInfo,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'insert' | 'layout' | 'references' | 'review' | 'view' | 'help' | 'table'>('home');
  const [showFileDropdown, setShowFileDropdown] = useState(false);
  const [isSimplifiedRibbon, setIsSimplifiedRibbon] = useState(false);
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(false);
  const [showMarginsDropdown, setShowMarginsDropdown] = useState(false);
  const [showOrientationDropdown, setShowOrientationDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showBreaksDropdown, setShowBreaksDropdown] = useState(false);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [showLineNumbersDropdown, setShowLineNumbersDropdown] = useState(false);
  const [showPageBordersDropdown, setShowPageBordersDropdown] = useState(false);
  const [showEditingDropdown, setShowEditingDropdown] = useState(false);
  const [selectedFont, setSelectedFont] = useState('Aptos');
  const [customFontSize, setCustomFontSize] = useState<string | null>(null);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showCaseMenu, setShowCaseMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showSymbolPicker, setShowSymbolPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPageColorPicker, setShowPageColorPicker] = useState(false);
  const [showWatermarkPicker, setShowWatermarkPicker] = useState(false);
  const [showCoverPageMenu, setShowCoverPageMenu] = useState(false);
  const [showCalloutMenu, setShowCalloutMenu] = useState(false);
  const [showTocMenu, setShowTocMenu] = useState(false);
  const [showCopilotMenu, setShowCopilotMenu] = useState(false);
  const [tableGrid, setTableGrid] = useState({ rows: 3, cols: 3 });

  // Insert Tab Dropdowns
  const [showPictureDropdown, setShowPictureDropdown] = useState(false);
  const [showDrawingDropdown, setShowDrawingDropdown] = useState(false);
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);
  const [showBookmarksDropdown, setShowBookmarksDropdown] = useState(false);
  const [showPageNumbersDropdown, setShowPageNumbersDropdown] = useState(false);
  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false);

  // References Tab Dropdowns
  const [showFootnotesDropdown, setShowFootnotesDropdown] = useState(false);

  // Review Tab Dropdowns & Tracking
  const [showProofingDropdown, setShowProofingDropdown] = useState(false);
  const [showTranslateDropdown, setShowTranslateDropdown] = useState(false);
  const [showCommentsDropdown, setShowCommentsDropdown] = useState(false);
  const [showMarkupDropdown, setShowMarkupDropdown] = useState(false);
  const [showTrackingDropdown, setShowTrackingDropdown] = useState(false);
  const [showChangesDropdown, setShowChangesDropdown] = useState(false);
  const [trackChangesMode, setTrackChangesMode] = useState<'Off' | 'For Everyone' | 'Just Mine'>('Off');
  const [markupViewMode, setMarkupViewMode] = useState<'All Markup' | 'Simple Markup' | 'No Markup' | 'Original'>('All Markup');

  // View Tab Dropdowns
  const [showZoomDropdown, setShowZoomDropdown] = useState(false);

  // Layout Paragraph State
  const [indentLeft, setIndentLeft] = useState(0);
  const [indentRight, setIndentRight] = useState(0);
  const [spacingBefore, setSpacingBefore] = useState(0);
  const [spacingAfter, setSpacingAfter] = useState(8);

  // Format Painter State
  const [formatPainter, setFormatPainter] = useState<{
    active: boolean;
    isPinned: boolean;
    data: any;
  } | null>(null);

  const colorInputRef = useRef<HTMLInputElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setShowFontSizeDropdown(false);
      setShowCaseMenu(false);
      setShowSpacingMenu(false);
      setShowColorPicker(false);
      setShowHighlightPicker(false);
      setShowTablePicker(false);
      setShowSymbolPicker(false);
      setShowDatePicker(false);
      setShowPageColorPicker(false);
      setShowWatermarkPicker(false);
      setShowCoverPageMenu(false);
      setShowCalloutMenu(false);
      setShowTocMenu(false);
      setShowCopilotMenu(false);
      setShowMarginsDropdown(false);
      setShowOrientationDropdown(false);
      setShowSizeDropdown(false);
      setShowBreaksDropdown(false);
      setShowColumnsDropdown(false);
      setShowLineNumbersDropdown(false);
      setShowPageBordersDropdown(false);
      setShowEditingDropdown(false);
      setShowFileDropdown(false);
      setShowPictureDropdown(false);
      setShowDrawingDropdown(false);
      setShowLinkDropdown(false);
      setShowBookmarksDropdown(false);
      setShowPageNumbersDropdown(false);
      setShowEmojiDropdown(false);
      setShowFootnotesDropdown(false);
      setShowProofingDropdown(false);
      setShowTranslateDropdown(false);
      setShowCommentsDropdown(false);
      setShowMarkupDropdown(false);
      setShowTrackingDropdown(false);
      setShowChangesDropdown(false);
      setShowZoomDropdown(false);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Format painter application handler
  useEffect(() => {
    if (!editor || !formatPainter?.active) return;

    const handleSelection = () => {
      const { selection } = editor.state;
      if (selection.empty) return;

      const { marks, paragraph } = formatPainter.data;
      const chain = editor.chain().focus();

      if (marks.bold) chain.setBold(); else chain.unsetBold();
      if (marks.italic) chain.setItalic(); else chain.unsetItalic();
      if (marks.underline) chain.setUnderline(); else chain.unsetUnderline();
      if (marks.strike) chain.setStrike(); else chain.unsetStrike();
      if (marks.subscript) chain.setSubscript(); else chain.unsetSubscript();
      if (marks.superscript) chain.setSuperscript(); else chain.unsetSuperscript();
      if (marks.color) chain.setColor(marks.color); else chain.unsetColor();
      if (marks.highlight) chain.setHighlight({ color: marks.highlight }); else chain.unsetHighlight();
      if (marks.fontSize || marks.fontFamily) {
        chain.setMark('textStyle', {
          fontSize: marks.fontSize,
          fontFamily: marks.fontFamily,
        });
      }
      if (paragraph?.lineHeight) {
        chain.updateAttributes('paragraph', { lineHeight: paragraph.lineHeight });
      }
      chain.run();

      if (!formatPainter.isPinned) {
        setFormatPainter(null);
      }
    };

    editor.on('selectionUpdate', handleSelection);
    return () => {
      editor.off('selectionUpdate', handleSelection);
    };
  }, [editor, formatPainter]);

  if (!editor) return null;

  const lastSelectionRef = useRef<any>(null);
  const isTableActive = editor.isActive('table');
  const currentFontSize = editor.getAttributes('textStyle')?.fontSize || '11';
  const currentFontFamily = editor.getAttributes('textStyle')?.fontFamily || selectedFont;

  const toggleFormatting = (mark: 'bold' | 'italic' | 'underline' | 'strike' | 'subscript' | 'superscript') => {
    if (!editor) return;
    const { selection } = editor.state;
    if (selection.empty && (mark === 'bold' || mark === 'italic' || mark === 'underline' || mark === 'strike')) {
      const { $from } = selection;
      const text = $from.parent.textBetween(0, $from.parent.content.size, undefined, '\uFFFC');
      const offset = $from.parentOffset;
      let start = offset;
      let end = offset;
      while (start > 0 && /\S/.test(text[start - 1])) start--;
      while (end < text.length && /\S/.test(text[end])) end++;
      if (start < end) {
        const from = $from.start() + start;
        const to = $from.start() + end;
        editor
          .chain()
          .focus()
          .setTextSelection({ from, to })
          .toggleMark(mark)
          .setTextSelection(selection.from)
          .run();
        return;
      }
    }

    if (mark === 'bold') editor.chain().focus().toggleBold().run();
    else if (mark === 'italic') editor.chain().focus().toggleItalic().run();
    else if (mark === 'underline') editor.chain().focus().toggleUnderline().run();
    else if (mark === 'strike') editor.chain().focus().toggleStrike().run();
    else if (mark === 'subscript') editor.chain().focus().toggleSubscript().run();
    else if (mark === 'superscript') editor.chain().focus().toggleSuperscript().run();
  };

  const handleCopyFormatting = (isPinned = false) => {
    const currentTextStyle = editor.getAttributes('textStyle');
    const marks = {
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      underline: editor.isActive('underline'),
      strike: editor.isActive('strike'),
      subscript: editor.isActive('subscript'),
      superscript: editor.isActive('superscript'),
      color: currentTextStyle?.color,
      highlight: editor.getAttributes('highlight')?.color,
      fontSize: currentTextStyle?.fontSize,
      fontFamily: currentTextStyle?.fontFamily,
    };
    const paragraph = editor.getAttributes('paragraph');
    setFormatPainter({
      active: true,
      isPinned,
      data: { marks, paragraph },
    });
  };

  const handleClearFormatting = () => {
    editor
      .chain()
      .focus()
      .unsetAllMarks()
      .setParagraph()
      .updateAttributes('paragraph', {
        lineHeight: '1.15',
        indent: 0,
        spaceBefore: false,
        spaceAfter: true,
      })
      .run();
  };

  const handleInsertOnlineVideo = () => {
    const url = prompt('Enter the URL of the online video (YouTube, Vimeo, etc.):');
    if (!url || !editor) return;
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      const vid = url.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${vid}`;
    } else if (url.includes('youtu.be/')) {
      const vid = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${vid}`;
    }
    const html = `<div class="wordo-video-embed" style="margin: 16px 0; text-align: center;"><iframe src="${embedUrl}" width="560" height="315" frameborder="0" allowfullscreen style="max-width: 100%; border-radius: 8px; border: 1px solid #cbd5e1;"></iframe></div><p></p>`;
    editor.chain().focus().insertContent(html).run();
  };

  const handleInsertBookmark = () => {
    const name = prompt('Enter bookmark name:');
    if (!name || !editor) return;
    editor.chain().focus().insertContent(`<span id="bookmark-${name.toLowerCase().replace(/\s+/g, '-')}" class="wordo-bookmark" title="Bookmark: ${name}" style="background-color: #e0f2fe; border-bottom: 2px solid #0284c7; padding: 0 2px;">🔖 ${name}</span>&nbsp;`).run();
  };

  const handleInsertComment = () => {
    if (!editor) return;
    const { selection } = editor.state;
    if (selection.empty) {
      alert('Please select text to add a comment to.');
      return;
    }
    const commentText = prompt('Enter your comment:');
    if (!commentText) return;
    editor.chain().focus().setHighlight({ color: '#fef08a' }).run();
  };

  const handleRemoveTableOfContents = () => {
    if (!editor) return;
    const html = editor.getHTML();
    const clean = html.replace(/<div class="wordo-toc"[\s\S]*?<\/div>/gi, '');
    editor.commands.setContent(clean);
  };

  const handleScrollToFootnotes = () => {
    const el = document.querySelector('.wordo-footnote') || document.querySelector('sup');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleIndentChange = (delta: number) => {
    const newVal = Math.max(0, Number((indentLeft + delta).toFixed(2)));
    setIndentLeft(newVal);
    if (editor) {
      if (delta > 0) (editor.commands as any).indentParagraph?.();
      else (editor.commands as any).outdentParagraph?.();
    }
  };

  const handleIndentRightChange = (delta: number) => {
    const newVal = Math.max(0, Number((indentRight + delta).toFixed(2)));
    setIndentRight(newVal);
  };

  const handleSpacingBeforeChange = (delta: number) => {
    const newVal = Math.max(0, spacingBefore + delta);
    setSpacingBefore(newVal);
    if (editor) {
      editor.chain().focus().updateAttributes('paragraph', { spaceBefore: newVal > 0 }).run();
    }
  };

  const handleSpacingAfterChange = (delta: number) => {
    const newVal = Math.max(0, spacingAfter + delta);
    setSpacingAfter(newVal);
    if (editor) {
      editor.chain().focus().updateAttributes('paragraph', { spaceAfter: newVal > 0 }).run();
    }
  };

  const handleInsertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowTablePicker(false);
  };

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          editor.chain().focus().setImage({ src: reader.result as string }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleInsertLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter Web Address (URL):', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const getDateOptions = () => {
    const d = new Date();
    return [
      d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      d.toLocaleDateString('en-US'),
      d.toISOString().slice(0, 10),
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      `${d.toLocaleDateString('en-US')} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
    ];
  };

  const handleInsertCoverPage = (template: 'executive' | 'modern' | 'academic') => {
    if (!editor) return;
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let coverHtml = '';
    if (template === 'executive') {
      coverHtml = `
        <div class="wordo-cover-page" style="padding: 48px 0; text-align: left; min-height: 850px; display: flex; flex-direction: column; justify-content: space-between; border-bottom: 2px solid #185abd; margin-bottom: 48px;">
          <div>
            <div style="height: 8px; width: 80px; background: #185abd; margin-bottom: 32px;"></div>
            <h1 style="font-size: 32pt; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 12px;">EXECUTIVE REPORT</h1>
            <h3 style="font-size: 16pt; font-weight: 400; color: #64748b; margin-top: 0;">Comprehensive Analysis & Strategy Document</h3>
          </div>
          <div style="border-top: 1px solid #cbd5e1; padding-top: 24px; margin-top: 150px;">
            <p style="font-size: 11pt; font-weight: 600; margin: 0; color: #1e293b;">Author: Microsoft 365 Team</p>
            <p style="font-size: 10pt; color: #64748b; margin: 4px 0 0 0;">Date: ${dateStr}</p>
            <p style="font-size: 10pt; color: #64748b; margin: 4px 0 0 0;">Organization: Wordo Cloud</p>
          </div>
        </div>
        <div class="wordo-page-break" style="break-before: page; page-break-before: always; height: 1px; border-bottom: 1px dashed #cbd5e1; margin: 24px 0;"></div>
      `;
    } else if (template === 'modern') {
      coverHtml = `
        <div class="wordo-cover-page" style="padding: 60px 0; text-align: center; min-height: 850px; display: flex; flex-direction: column; justify-content: space-between; margin-bottom: 48px;">
          <div style="margin-top: 80px;">
            <h1 style="font-size: 36pt; font-weight: 900; color: #185abd; letter-spacing: -0.5px; margin-bottom: 16px;">DOCUMENT TITLE</h1>
            <p style="font-size: 14pt; color: #475569; max-width: 600px; margin: 0 auto;">A concise subtitle or abstract detailing the purpose of this project.</p>
          </div>
          <div style="margin-bottom: 40px;">
            <p style="font-size: 12pt; font-weight: 600; color: #1e293b; margin: 0;">Prepared By: Author Name</p>
            <p style="font-size: 10pt; color: #64748b; margin-top: 4px;">${dateStr}</p>
          </div>
        </div>
        <div class="wordo-page-break" style="break-before: page; page-break-before: always; height: 1px; border-bottom: 1px dashed #cbd5e1; margin: 24px 0;"></div>
      `;
    } else {
      coverHtml = `
        <div class="wordo-cover-page" style="padding: 48px 0; min-height: 850px; display: flex; flex-direction: column; justify-content: space-between; margin-bottom: 48px;">
          <div style="border-left: 4px solid #185abd; padding-left: 20px;">
            <h1 style="font-size: 28pt; font-weight: bold; color: #1e293b; margin-bottom: 8px;">RESEARCH PAPER TITLE</h1>
            <p style="font-size: 12pt; color: #64748b; margin: 0;">Academic Term / Subject Area</p>
          </div>
          <div style="margin-top: 180px; font-size: 11pt; color: #334155;">
            <p style="margin: 4px 0;"><strong>Student Name:</strong> Author</p>
            <p style="margin: 4px 0;"><strong>Course:</strong> Advanced Studies</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${dateStr}</p>
          </div>
        </div>
        <div class="wordo-page-break" style="break-before: page; page-break-before: always; height: 1px; border-bottom: 1px dashed #cbd5e1; margin: 24px 0;"></div>
      `;
    }
    editor.chain().focus().setTextSelection(0).insertContent(coverHtml).run();
    setShowCoverPageMenu(false);
  };

  const handleInsertCallout = (type: 'note' | 'tip' | 'warning' | 'important') => {
    if (!editor) return;
    const styles = {
      note: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', title: 'Note', icon: 'ℹ️' },
      tip: { bg: '#f0fdf4', border: '#22c55e', text: '#166534', title: 'Tip', icon: '💡' },
      warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', title: 'Warning', icon: '⚠️' },
      important: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', title: 'Important', icon: '❗' },
    }[type];

    const html = `
      <div class="wordo-callout" style="background-color: ${styles.bg}; border-left: 4px solid ${styles.border}; color: ${styles.text}; padding: 12px 16px; margin: 16px 0; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-weight: 600; font-size: 10.5pt;">${styles.icon} ${styles.title}</p>
        <p style="margin: 4px 0 0 0; font-size: 10pt; opacity: 0.95;">Write your callout message here...</p>
      </div>
    `;
    editor.chain().focus().insertContent(html).run();
    setShowCalloutMenu(false);
  };

  const handleInsertTableOfContents = () => {
    if (!editor) return;
    const json = editor.getJSON();
    const headings: { level: number; text: string }[] = [];

    const extract = (node: any) => {
      if (node.type === 'heading' && node.content) {
        const text = node.content.map((c: any) => c.text || '').join('');
        if (text.trim()) {
          headings.push({ level: node.attrs?.level || 1, text: text.trim() });
        }
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(extract);
      }
    };
    extract(json);

    if (headings.length === 0) {
      headings.push(
        { level: 1, text: 'Executive Summary' },
        { level: 2, text: 'Project Goals & Objectives' },
        { level: 1, text: 'Market Analysis & Insights' },
        { level: 2, text: 'Competitive Landscape' },
        { level: 1, text: 'Conclusion & Next Steps' }
      );
    }

    const itemsHtml = headings
      .map((h, i) => {
        const indent = (h.level - 1) * 20;
        const pageNum = i + 1;
        return `
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-left: ${indent}px; margin-bottom: 6px; font-size: 11pt; color: #1e293b;">
          <span style="font-weight: ${h.level === 1 ? '600' : '400'};">${h.text}</span>
          <span style="flex: 1; border-bottom: 1px dotted #94a3b8; margin: 0 8px; height: 1em;"></span>
          <span style="font-weight: ${h.level === 1 ? '600' : '400'}; color: #64748b;">${pageNum}</span>
        </div>
      `;
      })
      .join('');

    const tocHtml = `
      <div class="wordo-toc" style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 24px; margin: 24px 0; background-color: #f8fafc;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 16pt; font-weight: bold; color: #0f172a;">Table of Contents</h2>
          <span style="font-size: 9pt; color: #64748b; font-style: italic;">Auto-generated</span>
        </div>
        ${itemsHtml}
      </div>
    `;

    editor.chain().focus().insertContent(tocHtml).run();
    setShowTocMenu(false);
  };

  const handleInsertFootnote = () => {
    if (!editor) return;
    const html = editor.getHTML();
    const count = (html.match(/<sup>\[\d+\]<\/sup>/g) || []).length + 1;
    editor.chain().focus().insertContent(`<sup>[${count}]</sup>`).run();
    const noteHtml = `<p style="font-size: 9pt; color: #64748b; margin-top: 12px; border-top: 1px solid #e2e8f0; padding-top: 4px;"><sup>[${count}]</sup> Footnote text...</p>`;
    editor.chain().focus().insertContent(noteHtml).run();
  };

  const handleInsertEndnote = () => {
    if (!editor) return;
    editor.chain().focus().insertContent(`<sup>(i)</sup>`).run();
  };

  const handleInsertCaption = (type: 'Figure' | 'Table') => {
    if (!editor) return;
    editor.chain().focus().insertContent(`<p style="font-size: 9pt; color: #64748b; font-style: italic; margin-top: 4px;"><strong>${type} 1:</strong> Description of ${type.toLowerCase()}...</p>`).run();
  };

  const handleWordoCopilotRewrite = (style: 'formal' | 'concise' | 'expand' | 'tone') => {
    if (!editor) return;
    const { from, to, empty } = editor.state.selection;
    if (empty) {
      alert('Please select or highlight some text in your document to use Wordo Copilot.');
      return;
    }
    const text = editor.state.doc.textBetween(from, to, ' ');
    let rewritten = text;
    if (style === 'formal') {
      rewritten = text
        .replace(/\b(can't|cannot)\b/gi, 'is unable to')
        .replace(/\b(don't)\b/gi, 'does not')
        .replace(/\b(get)\b/gi, 'obtain')
        .replace(/\b(tell)\b/gi, 'inform')
        .replace(/\b(help)\b/gi, 'assist')
        .replace(/\b(big)\b/gi, 'substantial')
        .replace(/\b(good)\b/gi, 'favorable');
    } else if (style === 'concise') {
      rewritten = text
        .replace(/\bin order to\b/gi, 'to')
        .replace(/\bdue to the fact that\b/gi, 'because')
        .replace(/\bat this point in time\b/gi, 'now')
        .replace(/\ba large number of\b/gi, 'many')
        .replace(/\bfor the purpose of\b/gi, 'for');
    } else if (style === 'expand') {
      rewritten = `${text} Furthermore, this strategic aspect warrants thorough examination in order to achieve optimal outcomes and maintain continuous alignment across all stakeholders.`;
    } else if (style === 'tone') {
      rewritten = text.charAt(0).toUpperCase() + text.slice(1);
      if (!rewritten.endsWith('.')) rewritten += '.';
    }
    editor.chain().focus().insertContent(rewritten).run();
    setShowCopilotMenu(false);
  };

  return (
    <div className="relative z-50 bg-[#f3f2f1] dark:bg-[#201f1e] border-b border-[#e1dfdd] dark:border-[#37373d] shadow-2xs select-none overflow-visible">
      {/* Ribbon Tabs Row */}
      <div className="flex items-center justify-between px-3 pt-1 border-b border-[#e1dfdd] dark:border-[#333333] text-xs bg-[#f3f2f1] dark:bg-[#201f1e] overflow-visible">
        <div className="flex items-center space-x-1">
          {/* File Tab */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFileDropdown(!showFileDropdown);
              }}
              onMouseDown={(e) => e.preventDefault()}
              className={`px-3 py-1 font-medium transition-colors rounded-t-sm ${
                showFileDropdown
                  ? 'bg-white dark:bg-[#252423] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-[#333]'
              }`}
            >
              File
            </button>

            {/* Exact Fluent File Dropdown from Image 8 */}
            <FileMenuDropdown
              isOpen={showFileDropdown}
              onClose={() => setShowFileDropdown(false)}
              onNew={() => {
                setShowFileDropdown(false);
                onNew?.();
              }}
              onNewFromTemplate={(tmpl) => {
                setShowFileDropdown(false);
                onNewFromTemplate?.(tmpl);
              }}
              onOpenLocalFile={() => {
                setShowFileDropdown(false);
                onOpen?.();
              }}
              onOpenRecent={(doc) => {
                setShowFileDropdown(false);
                onOpenRecent?.(doc);
              }}
              recentDocuments={recentDocuments || []}
              onSaveAs={() => {
                setShowFileDropdown(false);
                onSaveAs?.();
              }}
              onExportDocx={() => {
                setShowFileDropdown(false);
                onExportDocx?.();
              }}
              onExportPdf={() => {
                setShowFileDropdown(false);
                onExportPdf?.();
              }}
              onExportHtml={() => {
                setShowFileDropdown(false);
                onExportHtml?.();
              }}
              onExportTxt={() => {
                setShowFileDropdown(false);
                onExportTxt?.();
              }}
              onPrint={() => {
                setShowFileDropdown(false);
                onPrint?.();
              }}
              onRename={() => {
                setShowFileDropdown(false);
                onRename?.();
              }}
              onOpenRecovery={() => {
                setShowFileDropdown(false);
                onOpenRecovery?.();
              }}
              onCloseDocument={() => {
                setShowFileDropdown(false);
                onCloseDocument?.();
              }}
              onOpenInfo={() => {
                setShowFileDropdown(false);
                onOpenWordCount?.();
              }}
              documentTitle={documentTitle || 'Document'}
            />
          </div>

          {[
            { id: 'home', label: 'Home' },
            { id: 'insert', label: 'Insert' },
            { id: 'layout', label: 'Layout' },
            { id: 'references', label: 'References' },
            { id: 'review', label: 'Review' },
            { id: 'view', label: 'View' },
            { id: 'help', label: 'Help' },
            ...(isTableActive ? [{ id: 'table', label: 'Table Design & Layout', isContextual: true }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setShowFileDropdown(false);
                setActiveTab(tab.id as any);
                if (isRibbonCollapsed) setIsRibbonCollapsed(false);
              }}
              onMouseDown={(e) => e.preventDefault()}
              className={`px-3 py-1 font-medium transition-colors relative rounded-t-sm ${
                tab.isContextual
                  ? activeTab === tab.id
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-indigo-700 dark:text-indigo-400 hover:bg-gray-200/80 dark:hover:bg-[#333]'
                  : activeTab === tab.id
                  ? 'text-[#185abd] dark:text-[#5fa2f8] font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200/80 dark:hover:bg-[#333]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span
                  className={`absolute bottom-0 left-2 right-2 h-[2.5px] rounded-full transition-all duration-150 ${
                    tab.isContextual ? 'bg-indigo-600' : 'bg-[#185abd] dark:bg-[#5fa2f8]'
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right side of Tabs row: Comments button, Editing dropdown */}
        <div className="flex items-center space-x-1.5 pb-0.5">
          <button
            onClick={() => onOpenWordCount?.()}
            onMouseDown={(e) => e.preventDefault()}
            title="Comments"
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
            <span>Comments</span>
          </button>

          <button
            onClick={() => {}}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-gray-500" />
            <span>Editing</span>
            <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Ribbon Command Strip */}
      {!isRibbonCollapsed && (
        <div className="h-[84px] bg-white dark:bg-[#252423] border-b border-[#edebe9] dark:border-[#2d2c2b] shadow-2xs px-3 py-1 flex items-stretch justify-between overflow-visible text-xs text-gray-700 dark:text-gray-200 transition-all">
          <div className="flex items-stretch space-x-1 flex-1">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            {/* 0. Undo */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={() => editor.chain().focus().undo().run()}
                onMouseDown={(e) => e.preventDefault()}
                title="Undo (Ctrl+Z)"
                className="flex flex-col items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <Undo2 className="w-4 h-4 text-[#185abd]" />
                <span className="text-[10px] flex items-center">Undo <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" /></span>
              </button>
              <div className="h-3" />
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 1. Clipboard */}
            <div className="flex flex-col justify-between h-full px-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    navigator.clipboard.readText().then((text) => {
                      editor.commands.insertContent(text);
                    });
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Paste (Ctrl+V)"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <Clipboard className="w-5 h-5 text-[#185abd]" />
                  <span className="text-[10px] flex items-center">Paste <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" /></span>
                </button>
                <div className="flex flex-col space-y-0.5">
                  <button
                    onClick={() => document.execCommand('cut')}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Cut (Ctrl+X)"
                    className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-[10px]"
                  >
                    <Scissors className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                    <span>Cut</span>
                  </button>
                  <button
                    onClick={() => document.execCommand('copy')}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Copy (Ctrl+C)"
                    className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-[10px]"
                  >
                    <Copy className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                    <span>Copy</span>
                  </button>
                </div>
                <button
                  onClick={() => handleCopyFormatting(false)}
                  onDoubleClick={() => handleCopyFormatting(true)}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Format Painter (Ctrl+Shift+C / Ctrl+Shift+V) - Double-click to pin"
                  className={`p-1 px-1.5 rounded flex flex-col items-center justify-center transition-colors ${
                    formatPainter?.active
                      ? 'bg-[#185abd] text-white shadow-xs'
                      : 'hover:bg-gray-100 dark:hover:bg-[#333]'
                  }`}
                >
                  <Paintbrush className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] text-center leading-tight">Format<br/>Painter</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center">Clipboard</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 2. Font Controls */}
            <div className="flex flex-col justify-between h-full px-1">
              <div className="space-y-1">
              {/* Row 1 */}
              <div className="flex items-center space-x-1">
                <select
                  value={currentFontFamily}
                  onFocus={() => {
                    lastSelectionRef.current = editor.state.selection;
                  }}
                  onChange={(e) => {
                    const font = e.target.value;
                    setSelectedFont(font);
                    if (lastSelectionRef.current && !lastSelectionRef.current.empty) {
                      editor.commands.setTextSelection(lastSelectionRef.current);
                    }
                    (editor.commands as any).setFontFamily(font);
                  }}
                  className="h-6 px-1.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-[#444] rounded text-xs outline-hidden w-36 font-medium truncate"
                  title="Font Family"
                >
                  <optgroup label="☁️ Office 365 Cloud Fonts">
                    {CLOUD_FONTS.map((f) => (
                      <option key={f} value={f} style={{ fontFamily: `"${f}", sans-serif` }}>
                        ☁️ {f}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Standard Fonts">
                    {STANDARD_FONTS.map((f) => (
                      <option key={f} value={f} style={{ fontFamily: `"${f}", sans-serif` }}>
                        {f}
                      </option>
                    ))}
                  </optgroup>
                </select>

                {/* Font Size */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={customFontSize !== null ? customFontSize : currentFontSize}
                    onChange={(e) => setCustomFontSize(e.target.value)}
                    onFocus={() => {
                      lastSelectionRef.current = editor.state.selection;
                      setCustomFontSize(currentFontSize);
                    }}
                    onBlur={() => {
                      if (customFontSize !== null && customFontSize.trim() !== '') {
                        const parsed = parseFloat(customFontSize);
                        if (!isNaN(parsed) && parsed > 0 && parsed <= 500) {
                          if (lastSelectionRef.current && !lastSelectionRef.current.empty) {
                            editor.commands.setTextSelection(lastSelectionRef.current);
                          }
                          (editor.commands as any).setFontSize(parsed);
                        }
                      }
                      setCustomFontSize(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const parsed = parseFloat((e.target as HTMLInputElement).value);
                        if (!isNaN(parsed) && parsed > 0 && parsed <= 500) {
                          if (lastSelectionRef.current && !lastSelectionRef.current.empty) {
                            editor.commands.setTextSelection(lastSelectionRef.current);
                          }
                          (editor.commands as any).setFontSize(parsed);
                        }
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    className="h-6 w-10 px-1 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-[#444] rounded-l text-xs outline-hidden text-center text-gray-800 dark:text-gray-100 font-medium"
                    title="Font Size (select or type)"
                  />
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFontSizeDropdown(!showFontSizeDropdown);
                    }}
                    className="h-6 px-0.5 bg-gray-100 dark:bg-[#383838] border-y border-r border-gray-300 dark:border-[#444] rounded-r hover:bg-gray-200 dark:hover:bg-[#444]"
                  >
                    <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
                  </button>
                  {showFontSizeDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 w-16 max-h-56 overflow-y-auto bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded shadow-xl z-50 py-1"
                    >
                      {FONT_SIZES.map((s) => (
                        <button
                          key={s}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (lastSelectionRef.current && !lastSelectionRef.current.empty) {
                              editor.commands.setTextSelection(lastSelectionRef.current);
                            }
                            (editor.commands as any).setFontSize(s);
                            setShowFontSizeDropdown(false);
                          }}
                          className={`w-full text-left px-2 py-0.5 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/40 ${
                            currentFontSize === s ? 'font-bold text-[#185abd]' : ''
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => (editor.commands as any).growFontSize()}
                  title="Increase Font Size (Ctrl+Shift+>)"
                  className="h-6 px-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center text-xs font-bold"
                >
                  A<ChevronUp className="w-3 h-3 -ml-0.5 text-blue-600" />
                </button>

                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => (editor.commands as any).shrinkFontSize()}
                  title="Decrease Font Size (Ctrl+Shift+<)"
                  className="h-6 px-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center text-[11px]"
                >
                  A<ChevronDown className="w-3 h-3 -ml-0.5 text-blue-600" />
                </button>

                {/* Case */}
                <div className="relative">
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCaseMenu(!showCaseMenu);
                    }}
                    title="Change Case (Shift+F3)"
                    className="h-6 px-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center text-xs font-serif font-bold text-gray-700 dark:text-gray-200"
                  >
                    <span>Aa</span>
                    <ChevronDown className="w-2.5 h-2.5 ml-0.5 text-gray-400" />
                  </button>
                  {showCaseMenu && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-xl py-1 z-50 text-xs"
                    >
                      {[
                        { id: 'sentence', label: 'Sentence case.' },
                        { id: 'lower', label: 'lowercase' },
                        { id: 'upper', label: 'UPPERCASE' },
                        { id: 'title', label: 'Capitalize Each Word' },
                        { id: 'toggle', label: 'tOGGLE cASE' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            (editor.commands as any).transformCase(item.id);
                            setShowCaseMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-800 dark:text-gray-200"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClearFormatting}
                  title="Clear All Formatting (Ctrl+Space)"
                  className="h-6 px-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center text-gray-500 hover:text-red-600"
                >
                  <RemoveFormatting className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Row 2 */}
              <div className="flex items-center space-x-0.5">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggleFormatting('bold')}
                  title="Bold (Ctrl+B)"
                  className={`p-1 rounded transition-colors ${
                    editor.isActive('bold')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggleFormatting('italic')}
                  title="Italic (Ctrl+I)"
                  className={`p-1 rounded transition-colors ${
                    editor.isActive('italic')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggleFormatting('underline')}
                  title="Underline (Ctrl+U)"
                  className={`p-1 rounded transition-colors ${
                    editor.isActive('underline')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggleFormatting('strike')}
                  title="Strikethrough"
                  className={`p-1 rounded transition-colors ${
                    editor.isActive('strike')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggleFormatting('subscript')}
                  title="Subscript (Ctrl+=)"
                  className={`p-1 rounded transition-colors ${
                    editor.isActive('subscript')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <Subscript className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggleFormatting('superscript')}
                  title="Superscript (Ctrl+Shift++)"
                  className={`p-1 rounded transition-colors ${
                    editor.isActive('superscript')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <Superscript className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-3.5 bg-gray-300 dark:bg-gray-700 mx-0.5" />

                {/* Highlighter */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHighlightPicker(!showHighlightPicker);
                      setShowColorPicker(false);
                    }}
                    title="Text Highlight Color"
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center"
                  >
                    <div className="flex flex-col items-center">
                      <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                      <div
                        className="w-3.5 h-0.5 mt-0.5 rounded-full"
                        style={{
                          backgroundColor:
                            editor.getAttributes('highlight')?.color || '#ffff00',
                        }}
                      />
                    </div>
                    <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </button>
                  {showHighlightPicker && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-2 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl z-50 w-44"
                    >
                      <button
                        onClick={() => {
                          editor.chain().focus().unsetHighlight().run();
                          setShowHighlightPicker(false);
                        }}
                        className="w-full text-left px-2 py-1 mb-1 text-[11px] hover:bg-gray-100 dark:hover:bg-[#383838] rounded flex items-center space-x-1"
                      >
                        <RemoveFormatting className="w-3 h-3 text-gray-500" />
                        <span>No Color</span>
                      </button>
                      <div className="grid grid-cols-5 gap-1.5 pt-1 border-t border-gray-200 dark:border-gray-700">
                        {WORD_HIGHLIGHT_COLORS.map((h) => (
                          <button
                            key={h.color}
                            onClick={() => {
                              editor.chain().focus().toggleHighlight({ color: h.color }).run();
                              setShowHighlightPicker(false);
                            }}
                            title={h.name}
                            className="w-5 h-5 rounded-xs border border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: h.color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Font Color */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColorPicker(!showColorPicker);
                      setShowHighlightPicker(false);
                    }}
                    title="Font Color"
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center"
                  >
                    <div className="flex flex-col items-center">
                      <Baseline className="w-3.5 h-3.5 text-red-600" />
                      <div
                        className="w-3.5 h-0.5 mt-0.5 rounded-full"
                        style={{
                          backgroundColor:
                            editor.getAttributes('textStyle')?.color || '#c00000',
                        }}
                      />
                    </div>
                    <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </button>
                  {showColorPicker && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-2.5 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl z-50 w-52 text-xs"
                    >
                      <button
                        onClick={() => {
                          editor.chain().focus().unsetColor().run();
                          setShowColorPicker(false);
                        }}
                        className="w-full text-left px-2 py-1 mb-2 font-medium hover:bg-gray-100 dark:hover:bg-[#383838] rounded flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-1.5">
                          <div className="w-3.5 h-3.5 bg-black dark:bg-white border border-gray-400 rounded-xs" />
                          <span>Automatic</span>
                        </div>
                        {!editor.getAttributes('textStyle')?.color && (
                          <Check className="w-3 h-3 text-[#185abd]" />
                        )}
                      </button>

                      <div className="text-[10px] text-gray-500 font-semibold mb-1">
                        Theme Colors
                      </div>
                      <div className="grid grid-cols-10 gap-1 mb-1">
                        {THEME_BASE_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              editor.chain().focus().setColor(c).run();
                              setShowColorPicker(false);
                            }}
                            className="w-4 h-4 border border-gray-300 hover:scale-110"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <div className="space-y-0.5 mb-2">
                        {THEME_SHADES.map((row, rIdx) => (
                          <div key={rIdx} className="grid grid-cols-10 gap-1">
                            {row.map((c, cIdx) => (
                              <button
                                key={`${rIdx}-${cIdx}`}
                                onClick={() => {
                                  editor.chain().focus().setColor(c).run();
                                  setShowColorPicker(false);
                                }}
                                className="w-4 h-3 border border-gray-200 dark:border-gray-700 hover:scale-110"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>

                      <div className="text-[10px] text-gray-500 font-semibold mb-1">
                        Standard Colors
                      </div>
                      <div className="grid grid-cols-10 gap-1 mb-2">
                        {STANDARD_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              editor.chain().focus().setColor(c).run();
                              setShowColorPicker(false);
                            }}
                            className="w-4 h-4 rounded-xs border border-gray-300 hover:scale-110"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      <div className="pt-1.5 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => colorInputRef.current?.click()}
                          className="w-full text-left px-2 py-1 text-[11px] hover:bg-gray-100 dark:hover:bg-[#383838] rounded text-[#185abd] font-medium"
                        >
                          More Colors...
                        </button>
                        <input
                          ref={colorInputRef}
                          type="color"
                          className="sr-only"
                          onChange={(e) => {
                            editor.chain().focus().setColor(e.target.value).run();
                            setShowColorPicker(false);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>
              <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-400 dark:text-gray-500 font-normal">
                <span>Font</span>
                <button
                  onClick={onOpenSettings}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Font options"
                  className="p-0.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                >
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
                </button>
              </div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 3. Paragraph */}
            <div className="flex flex-col justify-between h-full px-1">
              <div className="space-y-1">
              <div className="flex items-center space-x-0.5">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  title="Bulleted List"
                  className={`p-1 rounded ${
                    editor.isActive('bulletList')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  title="Numbered List"
                  className={`p-1 rounded ${
                    editor.isActive('orderedList')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().toggleTaskList().run()}
                  title="Checklist Task"
                  className={`p-1 rounded ${
                    editor.isActive('taskList')
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3 bg-gray-300 dark:bg-gray-600 mx-1" />
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => (editor.commands as any).outdentParagraph()}
                  title="Decrease Indent"
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
                >
                  <Outdent className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => (editor.commands as any).indentParagraph()}
                  title="Increase Indent"
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#333]"
                >
                  <Indent className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center space-x-0.5">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  title="Align Left (Ctrl+L)"
                  className={`p-1 rounded ${
                    editor.isActive({ textAlign: 'left' })
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  title="Align Center (Ctrl+E)"
                  className={`p-1 rounded ${
                    editor.isActive({ textAlign: 'center' })
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  title="Align Right (Ctrl+R)"
                  className={`p-1 rounded ${
                    editor.isActive({ textAlign: 'right' })
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  title="Justify (Ctrl+J)"
                  className={`p-1 rounded ${
                    editor.isActive({ textAlign: 'justify' })
                      ? 'bg-[#185abd] text-white'
                      : 'hover:bg-gray-200 dark:hover:bg-[#333]'
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-3 bg-gray-300 dark:bg-gray-600 mx-0.5" />

                {/* Line Spacing */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSpacingMenu(!showSpacingMenu);
                    }}
                    title="Line and Paragraph Spacing"
                    className="h-6 px-1.5 rounded hover:bg-gray-200 dark:hover:bg-[#333] flex items-center space-x-0.5 text-[11px] font-medium"
                  >
                    <span>{editor.getAttributes('paragraph')?.lineHeight || '1.15'}</span>
                    <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
                  </button>
                  {showSpacingMenu && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 w-56 bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl py-1 z-50 text-xs"
                    >
                      {['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'].map((val) => (
                        <button
                          key={val}
                          onClick={() => {
                            (editor.commands as any).setLineHeight(val);
                            setShowSpacingMenu(false);
                          }}
                          className="w-full text-left px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/40 flex items-center justify-between"
                        >
                          <span>{val}</span>
                          {(editor.getAttributes('paragraph')?.lineHeight || '1.15') === val && (
                            <Check className="w-3 h-3 text-[#185abd]" />
                          )}
                        </button>
                      ))}
                      <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          (editor.commands as any).toggleSpaceBefore();
                          setShowSpacingMenu(false);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                      >
                        {editor.getAttributes('paragraph')?.spaceBefore
                          ? 'Remove Space Before Paragraph'
                          : 'Add Space Before Paragraph'}
                      </button>
                      <button
                        onClick={() => {
                          (editor.commands as any).toggleSpaceAfter();
                          setShowSpacingMenu(false);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                      >
                        {editor.getAttributes('paragraph')?.spaceAfter === false
                          ? 'Add Space After Paragraph'
                          : 'Remove Space After Paragraph'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              </div>
              <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-400 dark:text-gray-500 font-normal">
                <span>Paragraph</span>
                <button
                  onClick={onOpenSettings}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Paragraph options"
                  className="p-0.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                >
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
                </button>
              </div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 4. Quick Styles */}
            <div className="flex flex-col justify-between h-full px-1">
              <div className="flex items-center space-x-1">
              <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`flex flex-col items-start px-2 py-1 rounded border min-w-[62px] text-left transition-colors ${
                  !editor.isActive('heading') && !editor.isActive('blockquote')
                    ? 'border-[#185abd] bg-blue-50/80 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                <span className="text-[12px] font-medium leading-none">AaBbCc</span>
                <span className="text-[10px] text-gray-500 mt-1">Normal</span>
              </button>

              <button
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .setParagraph()
                    .updateAttributes('paragraph', { spaceAfter: false, lineHeight: '1.0' })
                    .run();
                }}
                className="flex flex-col items-start px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333] min-w-[70px] text-left transition-colors"
              >
                <span className="text-[12px] font-medium leading-none">AaBbCc</span>
                <span className="text-[10px] text-gray-500 mt-1">No Spacing</span>
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`flex flex-col items-start px-2 py-1 rounded border min-w-[68px] text-left transition-colors ${
                  editor.isActive('heading', { level: 1 })
                    ? 'border-[#185abd] bg-blue-50/80 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                <span className="text-[13px] font-bold text-[#185abd] leading-none">AaBbCc</span>
                <span className="text-[10px] text-gray-500 mt-1">Heading 1</span>
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`flex flex-col items-start px-2 py-1 rounded border min-w-[68px] text-left transition-colors ${
                  editor.isActive('heading', { level: 2 })
                    ? 'border-[#185abd] bg-blue-50/80 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                <span className="text-[12px] font-bold text-[#2b579a] leading-none">AaBbCc</span>
                <span className="text-[10px] text-gray-500 mt-1">Heading 2</span>
              </button>

              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`flex flex-col items-start px-2 py-1 rounded border min-w-[68px] text-left transition-colors ${
                  editor.isActive('heading', { level: 3 })
                    ? 'border-[#185abd] bg-blue-50/80 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                <span className="text-[12px] font-bold text-[#424242] dark:text-gray-300 leading-none">
                  AaBbCc
                </span>
                <span className="text-[10px] text-gray-500 mt-1">Heading 3</span>
              </button>

              <button
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .setParagraph()
                    .setMark('textStyle', { fontSize: '26', fontFamily: 'Aptos' })
                    .setColor('#185abd')
                    .run();
                }}
                className="flex flex-col items-start px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333] min-w-[55px] text-left transition-colors"
              >
                <span className="text-[14px] font-light text-[#185abd] leading-none">Title</span>
                <span className="text-[10px] text-gray-500 mt-1">Title</span>
              </button>

              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`flex flex-col items-start px-2 py-1 rounded border min-w-[55px] text-left transition-colors ${
                  editor.isActive('blockquote')
                    ? 'border-[#185abd] bg-blue-50/80 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#333]'
                }`}
              >
                <span className="text-[11px] italic font-serif leading-none">"Quote"</span>
                <span className="text-[10px] text-gray-500 mt-1">Quote</span>
              </button>
              </div>
              <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-400 dark:text-gray-500 font-normal">
                <span>Styles</span>
                <button
                  onClick={onOpenSettings}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Styles pane"
                  className="p-0.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                >
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
                </button>
              </div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 5. Editing */}
            <div className="flex flex-col justify-between h-full px-1">
              <div className="flex flex-col space-y-0.5">
                <button
                  onClick={onOpenSearch}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center space-x-1.5 px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-[11px]"
                  title="Find (Ctrl+F)"
                >
                  <Search className="w-3.5 h-3.5 text-[#185abd]" />
                  <span>Find</span>
                </button>
                <button
                  onClick={onOpenSearch}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center space-x-1.5 px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-[11px]"
                  title="Replace (Ctrl+H)"
                >
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">ab→ac</span>
                  <span>Replace</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().selectAll().run()}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-[11px]"
                  title="Select All (Ctrl+A)"
                >
                  <span>Select</span>
                  <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                </button>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center">Editing</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 6. Voice */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={() => {
                  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SpeechRec) {
                    alert('Dictation requires Web Speech API support.');
                    return;
                  }
                  try {
                    const rec = new SpeechRec();
                    rec.onresult = (evt: any) => {
                      const text = evt.results?.[0]?.[0]?.transcript;
                      if (text) editor.chain().focus().insertContent(text + ' ').run();
                    };
                    rec.start();
                  } catch (err) {
                    console.error('Dictation error:', err);
                  }
                }}
                onMouseDown={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-xs"
                title="Dictate (Speech to Text)"
              >
                <Mic className="w-4 h-4 text-[#185abd]" />
                <span className="text-[10px] mt-0.5">Dictate</span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center">Voice</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 7. Proofing */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={onOpenSpellCheck}
                onMouseDown={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-xs"
                title="Editor / AI Proofing Assistant"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] mt-0.5 font-medium">Editor</span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center">Proofing</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 8. Add-ins */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={onOpenSettings}
                onMouseDown={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-xs"
                title="Office Add-ins and Extensions"
              >
                <div className="grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-2xs" />
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-2xs" />
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-2xs" />
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-2xs" />
                </div>
                <span className="text-[10px] mt-0.5">Add-ins</span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center">Add-ins</div>
            </div>
          </>
        )}

        {/* INSERT TAB */}
        {activeTab === 'insert' && (
          <>
            {/* 1. Pages */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={() => {
                  editor.chain().focus().insertContent('<div class="wordo-page-break" style="break-before: page; page-break-before: always; height: 1px; border-bottom: 1px dashed #cbd5e1; margin: 24px 0;"></div><p></p>').run();
                }}
                onMouseDown={(e) => e.preventDefault()}
                title="Page Break (Ctrl+Enter)"
                className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <div className="w-5 h-5 flex flex-col items-center justify-center border border-gray-400 dark:border-gray-500 rounded-xs mb-0.5">
                  <div className="w-3 h-0.5 border-b border-dashed border-[#185abd]" />
                </div>
                <span className="text-[10px]">Page Break</span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Pages</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 2. Tables */}
            <div className="flex flex-col justify-between items-center h-full px-1 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTablePicker(!showTablePicker);
                }}
                onMouseDown={(e) => e.preventDefault()}
                title="Insert Table"
                className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <TableIcon className="w-4 h-4 text-[#185abd] dark:text-[#5fa2f8] mb-0.5" />
                <span className="text-[10px] flex items-center">
                  Table <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                </span>
              </button>
              {showTablePicker && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 p-3 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 animate-in fade-in duration-100 w-[216px] min-w-[216px]"
                >
                  <div className="text-[11px] font-medium mb-1.5 text-gray-700 dark:text-gray-200">
                    Insert Table ({tableGrid.rows} × {tableGrid.cols})
                  </div>
                  <div className="grid grid-cols-10 gap-1 mb-2 w-max">
                    {Array.from({ length: 10 }).map((_, r) =>
                      Array.from({ length: 10 }).map((_, c) => (
                        <div
                          key={`${r}-${c}`}
                          onMouseEnter={() => setTableGrid({ rows: r + 1, cols: c + 1 })}
                          onClick={() => handleInsertTable(r + 1, c + 1)}
                          className={`w-3.5 h-3.5 shrink-0 border border-gray-300 dark:border-gray-600 cursor-pointer rounded-2xs ${
                            r < tableGrid.rows && c < tableGrid.cols
                              ? 'bg-[#185abd]/30 border-[#185abd]'
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}
                        />
                      ))
                    )}
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-1 text-center">
                    <button
                      onClick={() => handleInsertTable(4, 4)}
                      className="text-xs text-[#185abd] dark:text-[#5fa2f8] hover:underline"
                    >
                      Insert Standard 4×4 Table
                    </button>
                  </div>
                </div>
              )}
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Tables</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 3. Illustrations */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                {/* Picture dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPictureDropdown(!showPictureDropdown);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Insert Picture"
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-600 mb-0.5" />
                    <span className="text-[10px] flex items-center">
                      Picture <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showPictureDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-44 text-xs"
                    >
                      <button
                        onClick={() => {
                          setShowPictureDropdown(false);
                          handleInsertImage();
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded flex items-center space-x-2"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>This Device...</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowPictureDropdown(false);
                          const url = prompt('Enter image URL:');
                          if (url && editor) editor.chain().focus().setImage({ src: url }).run();
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded flex items-center space-x-2"
                      >
                        <Search className="w-3.5 h-3.5 text-purple-600" />
                        <span>Online Pictures...</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Drawing dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDrawingDropdown(!showDrawingDropdown);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Drawing & Callouts"
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                  >
                    <PenTool className="w-4 h-4 text-purple-600 mb-0.5" />
                    <span className="text-[10px] flex items-center">
                      Drawing <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showDrawingDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-44 text-xs"
                    >
                      <button
                        onClick={() => {
                          setShowDrawingDropdown(false);
                          handleInsertCallout('note');
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded font-medium"
                      >
                        Note Box (Blue)
                      </button>
                      <button
                        onClick={() => {
                          setShowDrawingDropdown(false);
                          handleInsertCallout('tip');
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-green-50 dark:hover:bg-green-950/40 text-green-700 dark:text-green-300 rounded font-medium"
                      >
                        Tip Box (Green)
                      </button>
                      <button
                        onClick={() => {
                          setShowDrawingDropdown(false);
                          handleInsertCallout('warning');
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded font-medium"
                      >
                        Warning Box (Amber)
                      </button>
                      <button
                        onClick={() => {
                          setShowDrawingDropdown(false);
                          editor.chain().focus().setHorizontalRule().run();
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                      >
                        Horizontal Line Divider
                      </button>
                      <button
                        onClick={() => {
                          setShowDrawingDropdown(false);
                          editor.chain().focus().toggleCodeBlock().run();
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                      >
                        Code Snippet Box
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Illustrations</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 4. Links */}
            <div className="flex flex-col justify-between items-center h-full px-1 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLinkDropdown(!showLinkDropdown);
                }}
                onMouseDown={(e) => e.preventDefault()}
                title="Link (Ctrl+K)"
                className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <LinkIcon className="w-4 h-4 text-blue-600 mb-0.5" />
                <span className="text-[10px] flex items-center">
                  Link <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                </span>
              </button>
              {showLinkDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-44 text-xs"
                >
                  <button
                    onClick={() => {
                      setShowLinkDropdown(false);
                      handleInsertLink();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                  >
                    Insert Link... (Ctrl+K)
                  </button>
                  <button
                    onClick={() => {
                      setShowLinkDropdown(false);
                      editor.chain().focus().unsetLink().run();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded text-red-600"
                  >
                    Remove Link
                  </button>
                </div>
              )}
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Links</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 5. Table of Contents */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={handleInsertTableOfContents}
                onMouseDown={(e) => e.preventDefault()}
                title="Insert Table of Contents"
                className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <Layers className="w-4 h-4 text-[#185abd] dark:text-[#5fa2f8] mb-0.5" />
                <span className="text-[10px] text-center leading-tight">Table of<br/>Contents</span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Table of Contents</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 6. Bookmarks */}
            <div className="flex flex-col justify-between items-center h-full px-1 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBookmarksDropdown(!showBookmarksDropdown);
                }}
                onMouseDown={(e) => e.preventDefault()}
                title="Bookmarks"
                className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <Bookmark className="w-4 h-4 text-amber-600 mb-0.5" />
                <span className="text-[10px] flex items-center">
                  Bookmarks <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                </span>
              </button>
              {showBookmarksDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-44 text-xs"
                >
                  <button
                    onClick={() => {
                      setShowBookmarksDropdown(false);
                      handleInsertBookmark();
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                  >
                    Add Bookmark...
                  </button>
                </div>
              )}
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Bookmarks</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 7. Media */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={handleInsertOnlineVideo}
                onMouseDown={(e) => e.preventDefault()}
                title="Online Video"
                className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <Video className="w-4 h-4 text-blue-500 mb-0.5" />
                <span className="text-[10px] text-center leading-tight">Online<br/>Video</span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Media</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 8. Comments */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={handleInsertComment}
                onMouseDown={(e) => e.preventDefault()}
                title="New Comment"
                className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <div className="relative mb-0.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <Plus className="w-2 h-2 text-emerald-700 absolute -top-0.5 -right-0.5" />
                </div>
                <span className="text-[10px] text-center leading-tight">New<br/>Comment</span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Comments</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 9. Header & Footer */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onOpenSettings?.()}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Header & Footer Options"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <div className="w-4 h-4 border border-gray-400 rounded-xs flex flex-col justify-between p-0.5 mb-0.5">
                    <div className="w-full h-0.5 bg-orange-500" />
                    <div className="w-full h-0.5 bg-orange-500" />
                  </div>
                  <span className="text-[10px] text-center leading-tight">Header &<br/>Footer</span>
                </button>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPageNumbersDropdown(!showPageNumbersDropdown);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Page Numbers"
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                  >
                    <Hash className="w-4 h-4 text-blue-600 mb-0.5" />
                    <span className="text-[10px] flex items-center text-center leading-tight">
                      Page<br/>Numbers <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showPageNumbersDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-48 text-xs"
                    >
                      <button
                        onClick={() => {
                          setShowPageNumbersDropdown(false);
                          editor.chain().focus().insertContent('<p style="text-align: right; font-size: 10pt; color: #64748b;">Page 1</p>').run();
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                      >
                        Top of Page
                      </button>
                      <button
                        onClick={() => {
                          setShowPageNumbersDropdown(false);
                          editor.chain().focus().insertContent('<p style="text-align: center; font-size: 10pt; color: #64748b; margin-top: 24px;">— 1 —</p>').run();
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                      >
                        Bottom of Page
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Header & Footer</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 10. Symbols */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    editor.chain().focus().insertContent('<span style="font-family: serif; font-style: italic;">f(x) = a·x² + b·x + c</span>').run();
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Insert Math Equation"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <span className="font-serif text-sm font-bold text-gray-700 dark:text-gray-200">π</span>
                  <span className="text-[10px]">Equation</span>
                </button>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSymbolPicker(!showSymbolPicker);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Insert Symbol"
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                  >
                    <span className="font-serif text-sm font-bold text-amber-600">Ω</span>
                    <span className="text-[10px] flex items-center">
                      Symbol <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showSymbolPicker && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-1 p-2 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 grid grid-cols-8 gap-1 w-64"
                    >
                      {SPECIAL_SYMBOLS.map((sym) => (
                        <button
                          key={sym}
                          onClick={() => {
                            editor.chain().focus().insertContent(sym).run();
                            setShowSymbolPicker(false);
                          }}
                          className="w-7 h-7 flex items-center justify-center text-sm font-sans hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
                        >
                          {sym}
                        </button>
                      ))}
                      <div className="col-span-8 border-t border-gray-200 dark:border-gray-700 pt-1 mt-1 text-center">
                        <button
                          onClick={() => {
                            setShowSymbolPicker(false);
                            onOpenSymbolModal?.();
                          }}
                          className="w-full py-1 text-xs text-[#185abd] dark:text-[#5fa2f8] hover:underline font-medium"
                        >
                          More Symbols...
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Symbols</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 11. Emojis */}
            <div className="flex flex-col justify-between items-center h-full px-1 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmojiDropdown(!showEmojiDropdown);
                }}
                onMouseDown={(e) => e.preventDefault()}
                title="Emojis"
                className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <Smile className="w-4 h-4 text-amber-500 mb-0.5" />
                <span className="text-[10px] flex items-center">
                  Emoji <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                </span>
              </button>
              {showEmojiDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1 p-2 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 grid grid-cols-6 gap-1 w-52"
                >
                  {['😀', '😂', '😊', '😍', '👍', '👎', '❤️', '🎉', '🔥', '✨', '💡', '📌', '🚀', '⭐', '✅', '❌', '⚠️', '📝'].map((em) => (
                    <button
                      key={em}
                      onClick={() => {
                        editor.chain().focus().insertContent(em).run();
                        setShowEmojiDropdown(false);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-base hover:bg-gray-100 dark:hover:bg-[#333] rounded"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Emojis</div>
            </div>
          </>
        )}

        {/* LAYOUT TAB */}
        {activeTab === 'layout' && (
          <>
            {/* 1. Page Setup */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                {/* Margins */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMarginsDropdown(!showMarginsDropdown);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    title="Page Margins"
                  >
                    <div className="w-4 h-5 border border-dashed border-[#185abd] dark:border-blue-400 rounded-xs flex items-center justify-center mb-0.5">
                      <div className="w-2 h-3 bg-[#185abd]/20 dark:bg-blue-400/20" />
                    </div>
                    <span className="text-[10px] flex items-center">
                      Margins <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showMarginsDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-64 text-xs"
                    >
                      {[
                        { label: 'Normal', desc: 'Top: 1" · Bottom: 1" · Left: 1" · Right: 1"', m: { top: 96, bottom: 96, left: 96, right: 96 } },
                        { label: 'Narrow', desc: 'Top: 0.5" · Bottom: 0.5" · Left: 0.5" · Right: 0.5"', m: { top: 48, bottom: 48, left: 48, right: 48 } },
                        { label: 'Moderate', desc: 'Top: 1" · Bottom: 1" · Left: 0.75" · Right: 0.75"', m: { top: 96, bottom: 96, left: 72, right: 72 } },
                        { label: 'Wide', desc: 'Top: 1" · Bottom: 1" · Left: 1.5" · Right: 1.5"', m: { top: 96, bottom: 96, left: 144, right: 144 } },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            onUpdatePageSettings?.({ ...(pageSettings || {}), margins: item.m });
                            setShowMarginsDropdown(false);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-left transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-200">{item.label}</div>
                            <div className="text-[10px] text-gray-500">{item.desc}</div>
                          </div>
                          {pageSettings?.margins?.left === item.m.left && <Check className="w-4 h-4 text-[#185abd]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Orientation */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOrientationDropdown(!showOrientationDropdown);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    title="Page Orientation"
                  >
                    <RotateCcw className="w-4 h-4 text-blue-600 mb-0.5" />
                    <span className="text-[10px] flex items-center">
                      Orientation <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showOrientationDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-44 text-xs"
                    >
                      <button
                        onClick={() => {
                          onUpdatePageSettings?.({ ...(pageSettings || {}), orientation: 'portrait' });
                          setShowOrientationDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <span>Portrait</span>
                        {pageSettings?.orientation !== 'landscape' && <Check className="w-4 h-4 text-[#185abd]" />}
                      </button>
                      <button
                        onClick={() => {
                          onUpdatePageSettings?.({ ...(pageSettings || {}), orientation: 'landscape' });
                          setShowOrientationDropdown(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <span>Landscape</span>
                        {pageSettings?.orientation === 'landscape' && <Check className="w-4 h-4 text-[#185abd]" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Size */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSizeDropdown(!showSizeDropdown);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    title="Paper Size"
                  >
                    <div className="w-4 h-5 border border-gray-400 dark:border-gray-500 rounded-xs flex items-center justify-center mb-0.5">
                      <span className="text-[8px] font-bold">A4</span>
                    </div>
                    <span className="text-[10px] flex items-center">
                      Size <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showSizeDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-52 text-xs"
                    >
                      {[
                        { label: 'Letter', desc: '8.5" × 11"', size: 'letter' },
                        { label: 'A4', desc: '8.27" × 11.69"', size: 'a4' },
                        { label: 'Legal', desc: '8.5" × 14"', size: 'legal' },
                        { label: 'Executive', desc: '7.25" × 10.5"', size: 'executive' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            onUpdatePageSettings?.({ ...(pageSettings || {}), pageSize: item.size });
                            setShowSizeDropdown(false);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        >
                          <div>
                            <div className="font-semibold">{item.label}</div>
                            <div className="text-[10px] text-gray-500">{item.desc}</div>
                          </div>
                          {pageSettings?.pageSize === item.size && <Check className="w-4 h-4 text-[#185abd]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Columns */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColumnsDropdown(!showColumnsDropdown);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    title="Columns"
                  >
                    <Columns className="w-4 h-4 text-emerald-600 mb-0.5" />
                    <span className="text-[10px] flex items-center">
                      Columns <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showColumnsDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-40 text-xs"
                    >
                      {['One', 'Two', 'Three'].map((col, idx) => (
                        <button
                          key={col}
                          onClick={() => {
                            onUpdatePageSettings?.({ ...(pageSettings || {}), columns: idx + 1 });
                            setShowColumnsDropdown(false);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        >
                          <span>{col}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Breaks */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBreaksDropdown(!showBreaksDropdown);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    title="Breaks"
                  >
                    <Minus className="w-4 h-4 text-indigo-600 mb-0.5" />
                    <span className="text-[10px] flex items-center">
                      Breaks <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showBreaksDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-52 text-xs"
                    >
                      <button
                        onClick={() => {
                          setShowBreaksDropdown(false);
                          editor.chain().focus().insertContent('<div class="wordo-page-break" style="break-before: page; page-break-before: always; height: 1px; border-bottom: 1px dashed #cbd5e1; margin: 24px 0;"></div><p></p>').run();
                        }}
                        className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-[#333]"
                      >
                        <div className="font-semibold">Page Break</div>
                        <div className="text-[10px] text-gray-500">Mark point where page ends (Ctrl+Enter)</div>
                      </button>
                      <button
                        onClick={() => {
                          setShowBreaksDropdown(false);
                          editor.chain().focus().insertContent('<div class="wordo-section-break" style="break-before: page; page-break-before: always; height: 2px; border-bottom: 2px solid #94a3b8; margin: 24px 0;"></div><p></p>').run();
                        }}
                        className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-[#333]"
                      >
                        <div className="font-semibold">Section Break (Next Page)</div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Line Numbers */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLineNumbersDropdown(!showLineNumbersDropdown);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    title="Line Numbers"
                  >
                    <div className="w-4 h-4 flex items-center justify-center text-[9px] font-bold text-gray-600 dark:text-gray-300 border border-gray-400 rounded-xs mb-0.5">
                      12
                    </div>
                    <span className="text-[10px] flex items-center">
                      Line Numbers <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showLineNumbersDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-44 text-xs"
                    >
                      {['None', 'Continuous', 'Restart Each Page'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setShowLineNumbersDropdown(false)}
                          className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-[#333]"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Page Setup</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 2. Paragraph Steppers */}
            <div className="flex flex-col justify-between h-full px-2">
              <div className="flex flex-col space-y-1">
                {/* Row 1: Indent Left & Spacing Before */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-gray-500 font-medium w-10">Indent</span>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">Left:</span>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#2d2d2d] px-1 py-0.5 text-[10px]">
                      <span className="w-6 text-center">{indentLeft}"</span>
                      <div className="flex flex-col ml-0.5">
                        <button onClick={() => handleIndentChange(0.25)} className="hover:text-blue-600"><ChevronUp className="w-2 h-2" /></button>
                        <button onClick={() => handleIndentChange(-0.25)} className="hover:text-blue-600"><ChevronDown className="w-2 h-2" /></button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-gray-500 font-medium w-12">Spacing</span>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">Before:</span>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#2d2d2d] px-1 py-0.5 text-[10px]">
                      <span className="w-8 text-center">{spacingBefore} pt</span>
                      <div className="flex flex-col ml-0.5">
                        <button onClick={() => handleSpacingBeforeChange(2)} className="hover:text-blue-600"><ChevronUp className="w-2 h-2" /></button>
                        <button onClick={() => handleSpacingBeforeChange(-2)} className="hover:text-blue-600"><ChevronDown className="w-2 h-2" /></button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Indent Right & Spacing After */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-10" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">Right:</span>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#2d2d2d] px-1 py-0.5 text-[10px]">
                      <span className="w-6 text-center">{indentRight}"</span>
                      <div className="flex flex-col ml-0.5">
                        <button onClick={() => handleIndentRightChange(0.25)} className="hover:text-blue-600"><ChevronUp className="w-2 h-2" /></button>
                        <button onClick={() => handleIndentRightChange(-0.25)} className="hover:text-blue-600"><ChevronDown className="w-2 h-2" /></button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <div className="w-12" />
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">After:</span>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#2d2d2d] px-1 py-0.5 text-[10px]">
                      <span className="w-8 text-center">{spacingAfter} pt</span>
                      <div className="flex flex-col ml-0.5">
                        <button onClick={() => handleSpacingAfterChange(2)} className="hover:text-blue-600"><ChevronUp className="w-2 h-2" /></button>
                        <button onClick={() => handleSpacingAfterChange(-2)} className="hover:text-blue-600"><ChevronDown className="w-2 h-2" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-400 dark:text-gray-500 font-normal select-none">
                <span>Paragraph</span>
                <button onClick={onOpenSettings} title="Paragraph Settings" className="hover:text-gray-600">
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 3. Page Background */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                {/* Page Borders */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPageBordersDropdown(!showPageBordersDropdown);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    title="Page Borders"
                  >
                    <div className="w-4 h-5 border-2 border-indigo-600 rounded-xs mb-0.5" />
                    <span className="text-[10px] flex items-center">
                      Page Borders <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showPageBordersDropdown && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute left-0 top-full mt-1 p-1 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-44 text-xs"
                    >
                      {['None', 'Box (Thin)', 'Box (Medium)', 'Shadow', 'Custom...'].map((b) => (
                        <button
                          key={b}
                          onClick={() => {
                            setShowPageBordersDropdown(false);
                            onUpdatePageSettings?.({ ...(pageSettings || {}), pageBorder: b });
                          }}
                          className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-[#333]"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Page Color */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPageColorPicker(!showPageColorPicker);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    title="Page Color"
                  >
                    <Palette className="w-4 h-4 text-purple-600 mb-0.5" />
                    <span className="text-[10px] flex items-center">
                      Page Color <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </span>
                  </button>
                  {showPageColorPicker && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full mt-1 p-2 bg-white dark:bg-[#252423] border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl z-50 w-44"
                    >
                      {PAGE_COLORS.map((pc) => (
                        <button
                          key={pc.name}
                          onClick={() => {
                            onUpdatePageSettings?.({ ...(pageSettings || {}), backgroundColor: pc.color });
                            setShowPageColorPicker(false);
                          }}
                          className="w-full flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-xs"
                        >
                          <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: pc.color || '#ffffff' }} />
                          <span>{pc.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Page Background</div>
            </div>
          </>
        )}

        {/* REFERENCES TAB */}
        {activeTab === 'references' && (
          <>
            {/* 1. Table of Contents */}
            <div className="flex flex-col justify-between h-full px-1">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleInsertTableOfContents}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Insert Table of Contents"
                  className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <Layers className="w-5 h-5 text-[#185abd] dark:text-[#5fa2f8] mb-0.5" />
                  <span className="text-[10px] font-semibold text-center leading-tight">Insert Table of<br/>Contents</span>
                </button>

                <div className="flex flex-col space-y-0.5">
                  <button
                    onClick={handleInsertTableOfContents}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Update Table of Contents"
                    className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-[10px]"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-600" />
                    <span>Update Table of Contents</span>
                  </button>
                  <button
                    onClick={handleRemoveTableOfContents}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Remove Table of Contents"
                    className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-[10px] text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Table of Contents</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Table of Contents</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 2. Footnotes */}
            <div className="flex flex-col justify-between h-full px-1">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleInsertFootnote}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Insert Footnote"
                  className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <div className="flex items-baseline mb-0.5">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Ab</span>
                    <span className="text-[10px] font-bold text-[#185abd]">1</span>
                  </div>
                  <span className="text-[10px] font-semibold text-center leading-tight">Insert<br/>Footnote</span>
                </button>

                <div className="flex flex-col space-y-0.5">
                  <button
                    onClick={handleInsertEndnote}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Insert Endnote"
                    className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-[10px]"
                  >
                    <FileText className="w-3 h-3 text-blue-500" />
                    <span>Insert Endnote</span>
                  </button>
                  <button
                    onClick={handleScrollToFootnotes}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Show Footnotes"
                    className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-[10px]"
                  >
                    <Eye className="w-3 h-3 text-teal-600" />
                    <span>Show Footnotes</span>
                  </button>
                  <button
                    onClick={handleScrollToFootnotes}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Show Endnotes"
                    className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-[10px]"
                  >
                    <Eye className="w-3 h-3 text-indigo-600" />
                    <span>Show Endnotes</span>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Footnotes</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 3. Insights */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={onOpenSearch}
                onMouseDown={(e) => e.preventDefault()}
                title="Search Smart Insights"
                className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <div className="relative mb-0.5">
                  <Search className="w-4 h-4 text-blue-600" />
                  <InfoIcon className="w-2.5 h-2.5 text-blue-800 absolute -bottom-1 -right-1" />
                </div>
                <span className="text-[10px] mt-0.5">Search</span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Insights</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 4. Citation & Bibliography */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={() => onOpenCitationModal?.()}
                onMouseDown={(e) => e.preventDefault()}
                title="Manage Citations & Bibliography"
                className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <div className="w-4 h-5 border-2 border-red-500 rounded-xs flex items-center justify-center mb-0.5">
                  <span className="text-[8px] font-bold text-red-500">[]</span>
                </div>
                <span className="text-[10px] flex items-center">
                  Citations <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                </span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Citation & Bibliography</div>
            </div>
          </>
        )}

        {/* REVIEW TAB */}
        {activeTab === 'review' && (
          <>
            {/* 1. Proofing */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={onOpenSpellCheck}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Editor / Grammar Check"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 mb-0.5" />
                  <span className="text-[10px] flex items-center font-semibold">
                    Editor <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </span>
                </button>

                <button
                  onClick={onOpenSpellCheck}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Spelling & Grammar"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <div className="flex items-center mb-0.5">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">ABC</span>
                    <Check className="w-3 h-3 text-emerald-600 -ml-1 -mt-1" />
                  </div>
                  <span className="text-[10px] flex items-center text-center leading-tight">
                    Spelling &<br/>Grammar <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </span>
                </button>

                <button
                  onClick={onOpenWordCount}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Word Count"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <div className="text-xs font-bold text-blue-600 mb-0.5">123</div>
                  <span className="text-[10px] flex items-center text-center leading-tight">
                    Word<br/>Count <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Proofing</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 2. Accessibility */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={() => onOpenAccessibilityModal?.()}
                onMouseDown={(e) => e.preventDefault()}
                title="Check Accessibility"
                className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <Eye className="w-4 h-4 text-teal-600 mb-0.5" />
                <span className="text-[10px] text-center leading-tight">Check<br/>Accessibility</span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Accessibility</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 3. Translate */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <button
                onClick={() => onOpenTranslateModal?.()}
                onMouseDown={(e) => e.preventDefault()}
                title="Translate"
                className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
              >
                <Languages className="w-4 h-4 text-blue-600 mb-0.5" />
                <span className="text-[10px] flex items-center">
                  Translate <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                </span>
              </button>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Translate</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 4. Comments */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleInsertComment}
                  onMouseDown={(e) => e.preventDefault()}
                  title="New Comment"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <div className="relative mb-0.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <Plus className="w-2 h-2 text-emerald-700 absolute -top-0.5 -right-0.5" />
                  </div>
                  <span className="text-[10px] text-center leading-tight">New<br/>Comment</span>
                </button>

                <button
                  onClick={() => {}}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Previous Comment"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-gray-500"
                >
                  <ChevronLeft className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">Previous</span>
                </button>

                <button
                  onClick={() => {}}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Next Comment"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-gray-500"
                >
                  <ChevronRight className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">Next</span>
                </button>

                <button
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run();
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Delete Comment"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors text-red-500"
                >
                  <Trash2 className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] flex items-center">
                    Delete <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </span>
                </button>

                <button
                  onClick={onToggleNavSidebar}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Show Comments Pane"
                  className={`flex flex-col items-center justify-center p-1 px-1.5 rounded border transition-colors ${
                    showNavSidebar
                      ? 'border-[#185abd] bg-blue-50 dark:bg-blue-950/40 text-[#185abd]'
                      : 'border-transparent hover:bg-gray-100 dark:hover:bg-[#333]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] text-center leading-tight">Show<br/>Comments</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Comments</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 5. Markup */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => {}}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-gray-500"
                >
                  <MessageSquare className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] flex items-center">
                    Filter <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </span>
                </button>

                <div className="flex flex-col space-y-0.5">
                  <span className="text-[10px] text-gray-500 font-medium">Markup view:</span>
                  <select
                    value={markupViewMode}
                    onChange={(e) => setMarkupViewMode(e.target.value as any)}
                    className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#2d2d2d] px-1.5 py-0.5 text-[10px] text-gray-700 dark:text-gray-200 focus:outline-none"
                  >
                    <option value="All Markup">All Markup</option>
                    <option value="Simple Markup">Simple Markup</option>
                    <option value="No Markup">No Markup</option>
                    <option value="Original">Original</option>
                  </select>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Markup</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 6. Tracking */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex flex-col space-y-0.5 justify-center mt-1">
                <span className="text-[10px] text-gray-500 font-medium">Track Changes:</span>
                <select
                  value={trackChangesMode}
                  onChange={(e) => setTrackChangesMode(e.target.value as any)}
                  className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#2d2d2d] px-1.5 py-0.5 text-[10px] text-gray-700 dark:text-gray-200 focus:outline-none"
                >
                  <option value="Off">Off</option>
                  <option value="For Everyone">For Everyone</option>
                  <option value="Just Mine">Just Mine</option>
                </select>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Tracking</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 7. Changes */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {}}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Accept Change"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-emerald-600"
                >
                  <Check className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] flex items-center">
                    Accept <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </span>
                </button>

                <button
                  onClick={() => {}}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Reject Change"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-red-600"
                >
                  <XCircle className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] flex items-center">
                    Reject <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </span>
                </button>

                <button
                  onClick={() => {}}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Previous Change"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-gray-500"
                >
                  <ChevronLeft className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">Previous</span>
                </button>

                <button
                  onClick={() => {}}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Next Change"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-gray-500"
                >
                  <ChevronRight className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">Next</span>
                </button>

                <button
                  onClick={() => {}}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Mark All as Read"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-blue-600"
                >
                  <CheckCheck className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] text-center leading-tight">Mark All<br/>as Read</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Changes</div>
            </div>
          </>
        )}

        {/* VIEW TAB */}
        {activeTab === 'view' && (
          <>
            {/* 1. Document Views */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {}}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Separate Pages View"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded border border-[#185abd] bg-blue-50 dark:bg-blue-950/40 text-[#185abd] transition-colors"
                >
                  <FileText className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] font-semibold text-center leading-tight">Separate<br/>Pages</span>
                </button>

                <button
                  onClick={() => onToggleReadAloud?.()}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Immersive Reader"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-purple-600 transition-colors"
                >
                  <div className="flex items-center mb-0.5">
                    <BookOpen className="w-4 h-4" />
                    <Volume2 className="w-3 h-3 -ml-1 text-purple-500" />
                  </div>
                  <span className="text-[10px] text-center leading-tight">Immersive<br/>Reader</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Document Views</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 2. Zoom */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Search className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-[10px] text-gray-500 font-medium">Zoom:</span>
                  <select
                    value={currentZoom}
                    onChange={(e) => onZoomChange(Number(e.target.value))}
                    className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#2d2d2d] px-1.5 py-0.5 text-[10px] text-gray-700 dark:text-gray-200 focus:outline-none"
                  >
                    {[50, 75, 100, 125, 150, 200].map((z) => (
                      <option key={z} value={z}>{z}%</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => onZoomChange(100)}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Reset to 100%"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <div className="w-5 h-4 border border-blue-600 rounded flex items-center justify-center text-[8px] font-bold text-blue-600 mb-0.5">
                    100
                  </div>
                  <span className="text-[10px]">100%</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Zoom</div>
            </div>

            <div className="w-[1px] h-12 bg-gray-200 dark:bg-gray-700 self-center mx-1 flex-shrink-0" />

            {/* 3. Show */}
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={onToggleRuler}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Horizontal Ruler"
                  className={`flex flex-col items-center justify-center p-1 px-1.5 rounded transition-colors ${
                    showRuler
                      ? 'border border-[#185abd] bg-blue-50 dark:bg-blue-950/40 text-[#185abd] font-semibold'
                      : 'hover:bg-gray-100 dark:hover:bg-[#333] text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Sliders className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">Ruler</span>
                </button>

                <button
                  onClick={onToggleNavSidebar}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Navigation Pane"
                  className={`flex flex-col items-center justify-center p-1 px-1.5 rounded transition-colors ${
                    showNavSidebar
                      ? 'border border-[#185abd] bg-blue-50 dark:bg-blue-950/40 text-[#185abd] font-semibold'
                      : 'hover:bg-gray-100 dark:hover:bg-[#333] text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">Navigation</span>
                </button>

                <button
                  onClick={() => onOpenSettings?.()}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Header & Footer"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <FileText className="w-4 h-4 text-orange-500 mb-0.5" />
                  <span className="text-[10px] text-center leading-tight">Header &<br/>Footer</span>
                </button>

                <button
                  onClick={handleScrollToFootnotes}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Footnotes"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <span className="text-[11px] font-bold text-gray-500 mb-0.5">Ab¹</span>
                  <span className="text-[10px]">Footnotes</span>
                </button>

                <button
                  onClick={handleScrollToFootnotes}
                  onMouseDown={(e) => e.preventDefault()}
                  title="Endnotes"
                  className="flex flex-col items-center justify-center p-1 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-400 mb-0.5" />
                  <span className="text-[10px]">Endnotes</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Show</div>
            </div>
          </>
        )}

        {/* HELP TAB */}
        {activeTab === 'help' && (
          <>
            <div className="flex flex-col justify-between items-center h-full px-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onOpenShortcuts?.()}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                  title="Wordo Help & Guide"
                >
                  <HelpCircle className="w-4 h-4 text-[#185abd] mb-0.5" />
                  <span className="text-[10px]">Help</span>
                </button>

                <button
                  onClick={() => {
                    alert('Wordo Help Desk: Online support is available 24/7 in offline mode via built-in documentation and shortcuts.');
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                  title="Contact Support"
                >
                  <Headphones className="w-4 h-4 text-emerald-600 mb-0.5" />
                  <span className="text-[10px] text-center leading-tight">Contact<br/>Support</span>
                </button>

                <button
                  onClick={() => {
                    prompt('We appreciate your feedback! What can we improve in Wordo?');
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                  title="Send Feedback"
                >
                  <MessageCircle className="w-4 h-4 text-blue-500 mb-0.5" />
                  <span className="text-[10px]">Feedback</span>
                </button>

                <button
                  onClick={() => onOpenShortcuts?.()}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                  title="Keyboard Shortcuts (Ctrl+/)"
                >
                  <Keyboard className="w-4 h-4 text-purple-600 mb-0.5" />
                  <span className="text-[10px] text-center leading-tight">Keyboard<br/>Shortcuts</span>
                </button>

                <button
                  onClick={() => onOpenAbout?.()}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center p-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                  title="What's New in Wordo 365"
                >
                  <Megaphone className="w-4 h-4 text-amber-500 mb-0.5" />
                  <span className="text-[10px] text-center leading-tight">What's<br/>New</span>
                </button>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-normal text-center select-none">Help</div>
            </div>
          </>
        )}

        {/* CONTEXTUAL TABLE TAB */}
        {activeTab === 'table' && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 pr-2 border-r border-gray-300 dark:border-gray-700">
              <div className="flex flex-col space-y-0.5">
                <button
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px] flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3 text-blue-600" />
                  <span>Row Above</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px] flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3 text-blue-600" />
                  <span>Row Below</span>
                </button>
              </div>

              <div className="flex flex-col space-y-0.5">
                <button
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px] flex items-center space-x-1"
                >
                  <Columns className="w-3 h-3 text-emerald-600" />
                  <span>Col Left</span>
                </button>
                <button
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="px-2 py-0.5 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px] flex items-center space-x-1"
                >
                  <Columns className="w-3 h-3 text-emerald-600" />
                  <span>Col Right</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-1 pr-2 border-r border-gray-300 dark:border-gray-700">
              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 rounded text-[11px]"
              >
                Delete Row
              </button>
              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 rounded text-[11px]"
              >
                Delete Col
              </button>
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 rounded text-[11px]"
              >
                Delete Table
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => editor.chain().focus().mergeCells().run()}
                className="px-2 py-1 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px]"
              >
                Merge Cells
              </button>
              <button
                onClick={() => editor.chain().focus().splitCell().run()}
                className="px-2 py-1 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px]"
              >
                Split Cell
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                className="px-2 py-1 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 rounded text-[11px]"
              >
                Toggle Header Row
              </button>
            </div>
          </div>
        )}
          </div>
          {/* Far right: Collapse Ribbon Chevron */}
          <div className="flex items-center pl-2 border-l border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
              onMouseDown={(e) => e.preventDefault()}
              title="Collapse the ribbon"
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#333] text-gray-500 transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
