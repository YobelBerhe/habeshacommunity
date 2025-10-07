interface Draft {
  id: string;
  type: 'message' | 'listing' | 'review';
  content: any;
  timestamp: number;
}

class DraftStorage {
  private storageKey = 'drafts';

  saveDraft(type: Draft['type'], content: any, id?: string): string {
    const drafts = this.getAllDrafts();
    const draftId = id || `${type}-${Date.now()}`;

    const draft: Draft = {
      id: draftId,
      type,
      content,
      timestamp: Date.now(),
    };

    const existingIndex = drafts.findIndex(d => d.id === draftId);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.push(draft);
    }

    this.saveDrafts(drafts);
    return draftId;
  }

  getDraft(id: string): Draft | null {
    const drafts = this.getAllDrafts();
    return drafts.find(d => d.id === id) || null;
  }

  getDraftsByType(type: Draft['type']): Draft[] {
    return this.getAllDrafts().filter(d => d.type === type);
  }

  deleteDraft(id: string) {
    const drafts = this.getAllDrafts().filter(d => d.id !== id);
    this.saveDrafts(drafts);
  }

  getAllDrafts(): Draft[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const drafts = JSON.parse(stored);
        // Remove drafts older than 7 days
        return drafts.filter((d: Draft) => 
          Date.now() - d.timestamp < 7 * 24 * 60 * 60 * 1000
        );
      }
    } catch (error) {
      console.error('[Drafts] Failed to load:', error);
    }
    return [];
  }

  private saveDrafts(drafts: Draft[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(drafts));
    } catch (error) {
      console.error('[Drafts] Failed to save:', error);
    }
  }

  clearAll() {
    localStorage.removeItem(this.storageKey);
  }
}

export const draftStorage = new DraftStorage();
