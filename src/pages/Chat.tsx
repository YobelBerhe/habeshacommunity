import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import CitySearchBar from '@/components/CitySearchBar';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CHAT_BOARDS = [
  { id: 'general', name: 'General', description: 'General discussions' },
  { id: 'housing', name: 'Housing & Tips', description: 'Housing advice and tips' },
  { id: 'jobs', name: 'Jobs & Career', description: 'Job opportunities and career advice' },
  { id: 'services', name: 'Services', description: 'Local services and recommendations' },
  { id: 'events', name: 'Events & Community', description: 'Community events and gatherings' },
];

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  city: string;
  board: string;
  created_at: string;
}

export default function Chat() {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [activeBoard, setActiveBoard] = useState<string>('general');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, openAuth } = useAuth();

  const handleCitySelect = (city: string, lat?: number, lon?: number) => {
    setSelectedCity(city);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!user) {
      openAuth();
      return;
    }
    
    // Temporarily show toast until database types are updated
    toast.info('Chat functionality will be available soon');
    setMessage('');
  };

  // Load messages when city/board changes - temporarily disabled
  useEffect(() => {
    // Will implement after database types are updated
  }, [selectedCity, activeBoard]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-semibold">Chat</h1>
          </div>
          
          <div className="flex-1 max-w-xs mx-4">
            <CitySearchBar
              value={selectedCity}
              onCitySelect={handleCitySelect}
              placeholder="Choose city..."
              className="w-full"
            />
          </div>
          
          <div className="w-6" /> {/* Spacer for balance */}
        </div>
      </header>

      {!selectedCity ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <div className="text-6xl">🌍</div>
            <h2 className="text-xl font-semibold">Choose a city to view chats</h2>
            <p className="text-muted-foreground">
              Select your city above to join location-based discussions
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-73px)]">
          {/* Board tabs */}
          <div className="border-b bg-muted/30">
            <div className="flex overflow-x-auto">
              {CHAT_BOARDS.map((board) => (
                <button
                  key={board.id}
                  onClick={() => setActiveBoard(board.id)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeBoard === board.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {board.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chat content */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 chat-container p-4 space-y-4 overflow-y-auto">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">
                  {CHAT_BOARDS.find(b => b.id === activeBoard)?.name} - {selectedCity}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {CHAT_BOARDS.find(b => b.id === activeBoard)?.description}
                </p>
                <div className="text-sm text-muted-foreground">
                  Chat functionality coming soon!
                </div>
              </div>
            </div>

            {/* Message input - always black text */}
            <div className="force-input-light border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-lg bg-white text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loading}
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}