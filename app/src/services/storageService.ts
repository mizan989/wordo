// Document Recovery, Autosave and Recent Documents Service
import { RecoveryDraft, RecentDocument } from '../types';

const RECOVERY_KEY = 'wordclient_active_recovery_draft';
const RECOVERY_DRAFTS_KEY = 'wordclient_all_recovery_drafts';
const RECENT_KEY = 'wordclient_recent_documents';
const THEME_KEY = 'wordclient_theme_preference';

export class StorageService {
  /**
   * Save an autosave recovery draft associated with its original document where possible
   */
  public static saveDraft(
    title: string,
    contentHtml: string,
    contentJson?: any,
    pageSettings?: any,
    filePath?: string,
    fileFormat?: 'docx' | 'html' | 'txt'
  ): void {
    try {
      const draftId = filePath
        ? `draft_${btoa(unescape(encodeURIComponent(filePath))).replace(/[^a-zA-Z0-9]/g, '_')}`
        : 'current_session';
      const draft: RecoveryDraft = {
        id: draftId,
        title: title || 'Untitled Document',
        timestamp: Date.now(),
        contentHtml,
        contentJson,
        pageSettings,
        filePath,
        fileFormat,
      };

      // Always maintain active recovery draft for main session recovery
      localStorage.setItem(RECOVERY_KEY, JSON.stringify(draft));

      // Also maintain association by document path
      const allRaw = localStorage.getItem(RECOVERY_DRAFTS_KEY);
      const allDrafts: Record<string, RecoveryDraft> = allRaw ? JSON.parse(allRaw) : {};
      allDrafts[draftId] = draft;
      localStorage.setItem(RECOVERY_DRAFTS_KEY, JSON.stringify(allDrafts));
    } catch (e) {
      console.warn('Could not save recovery draft to localStorage:', e);
    }
  }

  /**
   * Check for an existing recoverable draft from a previous session or specific filePath
   */
  public static getRecoverableDraft(filePath?: string): RecoveryDraft | null {
    try {
      if (filePath) {
        const draftId = `draft_${btoa(unescape(encodeURIComponent(filePath))).replace(/[^a-zA-Z0-9]/g, '_')}`;
        const allRaw = localStorage.getItem(RECOVERY_DRAFTS_KEY);
        if (allRaw) {
          const allDrafts: Record<string, RecoveryDraft> = JSON.parse(allRaw);
          if (allDrafts[draftId] && allDrafts[draftId].contentHtml?.trim().length > 0) {
            return allDrafts[draftId];
          }
        }
      }

      const raw = localStorage.getItem(RECOVERY_KEY);
      if (!raw) return null;
      const draft: RecoveryDraft = JSON.parse(raw);
      if (draft && draft.contentHtml && draft.contentHtml.trim().length > 0) {
        return draft;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Discard the active recovery draft or draft associated with a specific file path
   */
  public static discardRecoverableDraft(filePath?: string): void {
    try {
      if (filePath) {
        const draftId = `draft_${btoa(unescape(encodeURIComponent(filePath))).replace(/[^a-zA-Z0-9]/g, '_')}`;
        const allRaw = localStorage.getItem(RECOVERY_DRAFTS_KEY);
        if (allRaw) {
          const allDrafts: Record<string, RecoveryDraft> = JSON.parse(allRaw);
          delete allDrafts[draftId];
          localStorage.setItem(RECOVERY_DRAFTS_KEY, JSON.stringify(allDrafts));
        }

        const raw = localStorage.getItem(RECOVERY_KEY);
        if (raw) {
          const draft: RecoveryDraft = JSON.parse(raw);
          if (draft.filePath === filePath || draft.id === draftId) {
            localStorage.removeItem(RECOVERY_KEY);
          }
        }
      } else {
        localStorage.removeItem(RECOVERY_KEY);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Add a document to recent list, avoiding stale HTML snapshots when original file exists
   */
  public static addRecentDocument(
    title: string,
    snippet: string,
    filePath?: string,
    contentHtml?: string,
    pageSettings?: any
  ): void {
    try {
      const recents = this.getRecentDocuments();
      const existingIndex = recents.findIndex((r) => (filePath && r.filePath === filePath) || r.title === title);

      const newEntry: RecentDocument = {
        id: `recent_${Date.now()}`,
        title,
        filePath,
        lastOpened: Date.now(),
        previewSnippet: snippet.slice(0, 120),
        // If file exists on disk, do not retain stale snapshot so fresh disk content is used
        contentHtml: filePath ? undefined : contentHtml,
        pageSettings,
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
