// Document Recovery, Autosave and Recent Documents Service
import { RecoveryDraft, RecentDocument } from '../types';

const RECOVERY_KEY = 'wordclient_active_recovery_draft';
const RECENT_KEY = 'wordclient_recent_documents';
const THEME_KEY = 'wordclient_theme_preference';

export class StorageService {
  /**
   * Save an autosave recovery draft
   */
  public static saveDraft(title: string, contentHtml: string, contentJson?: any): void {
    try {
      const draft: RecoveryDraft = {
        id: 'current_session',
        title: title || 'Untitled Document',
        timestamp: Date.now(),
        contentHtml,
        contentJson,
      };
      localStorage.setItem(RECOVERY_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn('Could not save recovery draft to localStorage:', e);
    }
  }

  /**
   * Check for an existing recoverable draft from a previous session
   */
  public static getRecoverableDraft(): RecoveryDraft | null {
    try {
      const raw = localStorage.getItem(RECOVERY_KEY);
      if (!raw) return null;
      const draft: RecoveryDraft = JSON.parse(raw);
      // If draft is valid and has content
      if (draft && draft.contentHtml && draft.contentHtml.trim().length > 0) {
        return draft;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Discard the active recovery draft
   */
  public static discardRecoverableDraft(): void {
    try {
      localStorage.removeItem(RECOVERY_KEY);
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Add a document to recent list
   */
  public static addRecentDocument(title: string, snippet: string, filePath?: string): void {
    try {
      const recents = this.getRecentDocuments();
      const existingIndex = recents.findIndex((r) => r.title === title || (filePath && r.filePath === filePath));

      const newEntry: RecentDocument = {
        id: `recent_${Date.now()}`,
        title,
        filePath,
        lastOpened: Date.now(),
        previewSnippet: snippet.slice(0, 120),
      };

      if (existingIndex >= 0) {
        recents.splice(existingIndex, 1);
      }

      recents.unshift(newEntry);
      // Keep up to 10 recents
      const trimmed = recents.slice(0, 10);
      localStorage.setItem(RECENT_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Failed to update recent files:', e);
    }
  }

  /**
   * Get all recent documents
   */
  public static getRecentDocuments(): RecentDocument[] {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (!raw) return [];
      return JSON.parse(raw) || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Theme persistence
   */
  public static getSavedTheme(): 'light' | 'dark' {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      // Default to light
      return 'light';
    } catch {
      return 'light';
    }
  }

  public static saveTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn(e);
    }
  }
}
