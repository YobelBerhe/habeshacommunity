import { offlineQueue } from '@/utils/offlineQueue';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { draftStorage } from '@/utils/draftStorage';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import MentorHeader from '@/components/MentorHeader';

export default function QueueManagement() {
  const { queueLength, isSyncing, clearQueue } = useOfflineQueue();
  const queue = offlineQueue.getQueue();
  const drafts = draftStorage.getAllDrafts();

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Offline Queue" backPath="/account/settings" />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Queue Status */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Queued Actions</h2>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold">{queueLength}</p>
              <p className="text-sm text-muted-foreground">
                {isSyncing ? 'Syncing...' : 'Waiting to sync'}
              </p>
            </div>
            
            {queueLength > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={clearQueue}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {queue.length > 0 && (
            <div className="space-y-2">
              {queue.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium capitalize">{action.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(action.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Retry {action.retries}/3
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Drafts */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Saved Drafts</h2>
          
          {drafts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No saved drafts
            </p>
          ) : (
            <div className="space-y-2">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium capitalize">{draft.type}</p>
                      <p className="text-xs text-muted-foreground">
                        Saved {formatDistanceToNow(draft.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => draftStorage.deleteDraft(draft.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
