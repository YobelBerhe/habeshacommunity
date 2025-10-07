interface QueuedAction {
  id: string;
  type: 'favorite' | 'message' | 'listing' | 'booking';
  action: () => Promise<any>;
  data: any;
  timestamp: number;
  retries: number;
}

class OfflineQueue {
  private queue: QueuedAction[] = [];
  private processing = false;
  private storageKey = 'offline-queue';

  constructor() {
    this.loadQueue();
    this.setupOnlineListener();
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only load items less than 24 hours old
        this.queue = parsed.filter((item: QueuedAction) => 
          Date.now() - item.timestamp < 24 * 60 * 60 * 1000
        );
        this.saveQueue();
      }
    } catch (error) {
      console.error('[Queue] Failed to load queue:', error);
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.error('[Queue] Failed to save queue:', error);
    }
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      console.log('[Queue] Connection restored, processing queue...');
      this.processQueue();
    });
  }

  add(action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) {
    const queuedAction: QueuedAction = {
      ...action,
      id: `${action.type}-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(queuedAction);
    this.saveQueue();
    
    console.log('[Queue] Added action:', queuedAction.type);

    // Try to process immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }

    return queuedAction.id;
  }

  async processQueue() {
    if (this.processing || !navigator.onLine || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const results = { success: 0, failed: 0 };

    console.log(`[Queue] Processing ${this.queue.length} actions...`);

    while (this.queue.length > 0) {
      const action = this.queue[0];

      try {
        await action.action();
        this.queue.shift(); // Remove successful action
        results.success++;
        console.log('[Queue] Success:', action.type);
      } catch (error) {
        console.error('[Queue] Failed:', action.type, error);
        
        action.retries++;
        
        // Remove if too many retries or too old
        if (action.retries >= 3 || Date.now() - action.timestamp > 24 * 60 * 60 * 1000) {
          this.queue.shift();
          results.failed++;
        } else {
          // Move to end of queue for retry
          this.queue.push(this.queue.shift()!);
          break; // Stop processing on failure
        }
      }

      this.saveQueue();
    }

    this.processing = false;

    if (results.success > 0 || results.failed > 0) {
      return results;
    }
  }

  getQueueLength() {
    return this.queue.length;
  }

  clear() {
    this.queue = [];
    this.saveQueue();
  }

  getQueue() {
    return [...this.queue];
  }
}

export const offlineQueue = new OfflineQueue();
