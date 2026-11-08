export type DocumentLayout = 'pages' | 'continuous' | 'web';

export type PaperSize = 'a4' | 'letter' | 'legal';

export type PaperOrientation = 'portrait' | 'landscape';

export interface PageSettings {
  size: PaperSize;
  orientation: PaperOrientation;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  presetId?: string;
  headerLeft?: string;
  headerRight?: string;
  footerLeft?: string;
  footerRight?: string;
  headerText?: string;
  footerText?: string;
  showPageNumbers: boolean;
  pageColor?: string;
  watermarkText?: string;
  darkModePageWhite?: boolean;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  lastModified: number;
  createdAt: number;
  format: 'docx' | 'txt' | 'html' | 'wc';
  filePath?: string;
  isDirty: boolean;
}

export interface RecoveryDraft {
  id: string;
  title: string;
  timestamp: number;
  contentHtml: string;
  contentJson?: any;
  pageSettings?: PageSettings;
}

export interface RecentDocument {
  id: string;
  title: string;
  filePath?: string;
  lastOpened: number;
  previewSnippet: string;
  contentHtml?: string;
  pageSettings?: PageSettings;
}

export interface SpellIssue {
  id: string;
  word: string;
  index: number;
  length: number;
  type: 'spelling' | 'grammar' | 'style';
  message: string;
  suggestions: string[];
}

export interface DocumentStats {
  words: number;
  characters: number;
  charactersWithoutSpaces: number;
  paragraphs: number;
  sentences: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}
