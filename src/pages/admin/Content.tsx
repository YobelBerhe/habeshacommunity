import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { MessageSquare, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminContent() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'messages' | 'forum'>('messages');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Load recent messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(display_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      // Load recent forum posts
      const { data: forumData } = await supabase
        .from('forum_messages')
        .select(`
          *,
          author:profiles!forum_messages_author_id_fkey(display_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      setMessages(messagesData || []);
      setForumPosts(forumData || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string, type: 'message' | 'forum') => {
    try {
      const table = type === 'message' ? 'messages' : 'forum_messages';
      const { error } = await supabase.from(table).delete().eq('id', id);

      if (error) throw error;

      toast({
        title: "Content Deleted",
        description: "The content has been removed",
      });

      loadContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
          <p className="text-gray-600">Monitor and moderate user-generated content</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 px-4 lg:px-6 py-4 font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5 inline-block mr-2" />
              <span className="hidden sm:inline">Direct Messages</span>
              <span className="sm:hidden">Messages</span>
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex-1 px-4 lg:px-6 py-4 font-medium transition-colors ${
                activeTab === 'forum'
                  ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5 inline-block mr-2" />
              <span className="hidden sm:inline">Forum Posts</span>
              <span className="sm:hidden">Forum</span>
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">Loading...</div>
          ) : activeTab === 'messages' ? (
            messages.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">No messages found</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-white rounded-xl shadow-md p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{msg.sender?.display_name || 'Anonymous'}</span>
                        <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700">{msg.content}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => deleteMessage(msg.id, 'message')}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            forumPosts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">No forum posts found</div>
            ) : (
              forumPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-md p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{post.author?.display_name || 'Anonymous'}</span>
                        <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700">{post.body}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => deleteMessage(post.id, 'forum')}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
