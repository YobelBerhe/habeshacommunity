import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import {
  ArrowLeft, Search, Send, Filter, Phone, Video, Info,
  Heart, Users, Award, ShoppingBag, Home, Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Conversation {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  category: 'all' | 'personal' | 'health' | 'match' | 'mentor' | 'market' | 'community';
}

export default function Inbox() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user');
  const userName = searchParams.get('name');

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false); // Toggle filters

  // Categories with icons
  const categories = [
    { id: 'all', label: 'All', icon: Users, color: 'text-gray-500' },
    { id: 'personal', label: 'Personal', icon: Home, color: 'text-purple-500' },
    { id: 'health', label: 'Health', icon: Stethoscope, color: 'text-green-500' },
    { id: 'match', label: 'Matches', icon: Heart, color: 'text-pink-500' },
    { id: 'mentor', label: 'Mentors', icon: Award, color: 'text-blue-500' },
    { id: 'market', label: 'Market', icon: ShoppingBag, color: 'text-orange-500' }
  ];

  // Mock conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      userId: 'user1',
      name: 'Sara Woldu',
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2m ago',
      unread: 2,
      online: true,
      category: 'match'
    },
    {
      id: '2',
      userId: 'user2',
      name: 'Daniel Tesfay',
      lastMessage: 'Thanks for the session!',
      timestamp: '1h ago',
      unread: 0,
      online: false,
      category: 'mentor'
    },
    {
      id: '3',
      userId: 'user3',
      name: 'Meron Kidane',
      lastMessage: 'Is the item still available?',
      timestamp: '3h ago',
      unread: 1,
      online: true,
      category: 'market'
    },
    {
      id: '4',
      userId: 'user4',
      name: 'Health Coach',
      lastMessage: 'Your workout plan is ready!',
      timestamp: '5h ago',
      unread: 0,
      online: true,
      category: 'health'
    }
  ]);

  const [messages, setMessages] = useState([
    { id: '1', senderId: 'user1', text: 'Hey! How are you?', timestamp: '10:30 AM', isOwn: false },
    { id: '2', senderId: user?.id, text: 'Hi! I\'m good, thanks!', timestamp: '10:32 AM', isOwn: true },
    { id: '3', senderId: 'user1', text: 'Great to hear! Want to grab coffee?', timestamp: '10:33 AM', isOwn: false }
  ]);

  useEffect(() => {
    if (userId && userName) {
      const existingConv = conversations.find(c => c.userId === userId);
      if (existingConv) {
        setSelectedConversation(existingConv.id);
      } else {
        const newConv: Conversation = {
          id: `new-${userId}`,
          userId: userId,
          name: userName,
          avatar: userName[0],
          lastMessage: 'Start a conversation...',
          timestamp: 'Now',
          unread: 0,
          online: true,
          category: 'all'
        };
        setConversations(prev => [newConv, ...prev]);
        setSelectedConversation(newConv.id);
      }
    }
  }, [userId, userName]);

  const filteredConversations = conversations.filter(conv => {
    const matchesCategory = activeCategory === 'all' || conv.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || '',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* CLEAN HEADER - Minimal like old design */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Messages</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Filter Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5" />
              {activeCategory !== 'all' && (
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-blue-500 rounded-full" />
              )}
            </Button>
          </div>
        </div>

        {/* COLLAPSIBLE FILTERS - Only show when toggled */}
        {showFilters && (
          <div className="border-t animate-in slide-in-from-top">
            {/* Search Bar */}
            <div className="px-4 pt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Pills - Horizontal Scroll */}
            <div className="overflow-x-auto hide-scrollbar px-4 py-3">
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className="whitespace-nowrap flex-shrink-0 gap-2"
                  >
                    <category.icon className={`w-4 h-4 ${activeCategory === category.id ? '' : category.color}`} />
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Same as before */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r`}>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Search className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-2">No conversations found</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map((conv) => {
                  const category = categories.find(c => c.id === conv.category);
                  return (
                    <div
                      key={conv.id}
                      className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted transition-colors ${
                        selectedConversation === conv.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedConversation(conv.id)}
                    >
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          {conv.avatar ? (
                            <AvatarImage src={conv.avatar} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                              {conv.name.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold truncate">{conv.name}</p>
                            {/* Small category indicator */}
                            {category && activeCategory === 'all' && (
                              <category.icon className={`w-3.5 h-3.5 ${category.color} flex-shrink-0`} />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      </div>

                      {conv.unread > 0 && (
                        <Badge className="bg-blue-500 flex-shrink-0">{conv.unread}</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area - Same as before */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-background">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>

                <Avatar className="w-10 h-10">
                  {selectedConv?.avatar ? (
                    <AvatarImage src={selectedConv.avatar} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                      {selectedConv?.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div>
                  <p className="font-semibold">{selectedConv?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConv?.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      message.isOwn
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-muted-foreground'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t p-4 bg-background">
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                />

                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-muted/20">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose from your messages on the left</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
