import { useState, useEffect } from 'react';
import { 
  Search, MessageCircle, Heart, Award, ShoppingBag,
  Users, Send, Paperclip, Smile, MoreVertical, Phone,
  Video, Info, Archive, Star, Trash2, Image, Check,
  CheckCheck, Clock, Pin, Filter, ArrowLeft, Activity, User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getOrCreateConversation } from '@/utils/conversations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  read: boolean;
  type?: 'text' | 'image' | 'file';
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  type: 'match' | 'mentor' | 'marketplace' | 'community';
  verified?: boolean;
  pinned?: boolean;
  messages: Message[];
}

const Inbox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    searchParams.get('conversation') || null
  );
  const [messageText, setMessageText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Handle incoming conversation from navigation state
  useEffect(() => {
    if (location.state?.openConversationId) {
      setSelectedConversation(location.state.openConversationId);
      
      // Show a welcome message if mentor name is provided
      if (location.state.mentorName) {
        toast.success(`Conversation with ${location.state.mentorName} opened`);
      }
    }
  }, [location.state]);


  // Demo conversations
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Sara Mehretab',
      avatar: 'SM',
      lastMessage: "Hey! I'd love to know more about you 😊",
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      type: 'match',
      verified: true,
      pinned: true,
      messages: [
        { id: '1', text: 'Hi! I saw your profile and we seem to have a lot in common', sender: 'other', timestamp: '10:30 AM', read: true },
        { id: '2', text: 'Hello! Yes, I noticed that too. I love that you enjoy hiking!', sender: 'me', timestamp: '10:32 AM', read: true },
        { id: '3', text: "Yes! I try to go every weekend. Have you been to any good trails recently?", sender: 'other', timestamp: '10:35 AM', read: true },
        { id: '4', text: "I went to Shenandoah last month, it was beautiful! Where do you usually go?", sender: 'me', timestamp: '10:38 AM', read: true },
        { id: '5', text: "Hey! I'd love to know more about you 😊", sender: 'other', timestamp: '10:40 AM', read: false }
      ]
    },
    {
      id: '2',
      name: 'Daniel Kidane',
      avatar: 'DK',
      lastMessage: "Your session is confirmed for tomorrow at 2 PM",
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      type: 'mentor',
      verified: true,
      pinned: false,
      messages: [
        { id: '1', text: "Hi! I'd like to book a career guidance session", sender: 'me', timestamp: 'Yesterday', read: true },
        { id: '2', text: "Of course! I have availability tomorrow afternoon. Does 2 PM work?", sender: 'other', timestamp: 'Yesterday', read: true },
        { id: '3', text: "Perfect! Yes, 2 PM works great for me", sender: 'me', timestamp: 'Yesterday', read: true },
        { id: '4', text: "Your session is confirmed for tomorrow at 2 PM", sender: 'other', timestamp: '1 hour ago', read: true }
      ]
    },
    {
      id: '3',
      name: 'Rahel Woldu',
      avatar: 'RW',
      lastMessage: "Is the coffee set still available?",
      timestamp: '3 hours ago',
      unread: 1,
      online: true,
      type: 'marketplace',
      verified: false,
      pinned: false,
      messages: [
        { id: '1', text: "Hi! I'm interested in your Traditional Coffee Set listing", sender: 'other', timestamp: '4 hours ago', read: true },
        { id: '2', text: "Hello! Yes, it's still available. Would you like to see more photos?", sender: 'me', timestamp: '3:30 PM', read: true },
        { id: '3', text: "Is the coffee set still available?", sender: 'other', timestamp: '3 hours ago', read: false }
      ]
    },
    {
      id: '4',
      name: 'Young Professionals Group',
      avatar: 'YP',
      lastMessage: "Michael: The networking event is this Friday!",
      timestamp: '5 hours ago',
      unread: 5,
      online: false,
      type: 'community',
      verified: true,
      pinned: false,
      messages: [
        { id: '1', text: "Hey everyone! Don't forget about the networking event", sender: 'other', timestamp: '5 hours ago', read: false }
      ]
    },
    {
      id: '5',
      name: 'Meron Tekle',
      avatar: 'MT',
      lastMessage: "Thanks for the great conversation!",
      timestamp: '1 day ago',
      unread: 0,
      online: false,
      type: 'match',
      verified: true,
      pinned: false,
      messages: [
        { id: '1', text: "It was nice chatting with you", sender: 'other', timestamp: '1 day ago', read: true },
        { id: '2', text: "Thanks for the great conversation!", sender: 'other', timestamp: '1 day ago', read: true }
      ]
    },
    {
      id: '6',
      name: 'Solomon Ghebre',
      avatar: 'SG',
      lastMessage: "You: Looking forward to the session!",
      timestamp: '2 days ago',
      unread: 0,
      online: false,
      type: 'mentor',
      verified: true,
      pinned: false,
      messages: [
        { id: '1', text: "Looking forward to the session!", sender: 'me', timestamp: '2 days ago', read: true }
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'match': return Heart;
      case 'mentor': return Award;
      case 'marketplace': return ShoppingBag;
      case 'community': return Users;
      default: return MessageCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'match': return 'text-pink-600 bg-pink-100 dark:bg-pink-900/30';
      case 'mentor': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'marketplace': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'community': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || conv.type === filterType;
    return matchesSearch && matchesType;
  });

  const activeConversation = conversations.find(c => c.id === selectedConversation);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to send messages');
        return;
      }

      // Get conversation to find the other participant
      const activeConv = conversations.find(c => c.id === selectedConversation);
      if (!activeConv) return;

      // Create or get conversation from database
      const { conversationId } = await getOrCreateConversation(
        activeConv.id, // Using conversation ID as user ID for demo
        messageText
      );

      toast.success('Message sent!');
      setMessageText('');
      
      // Reload the conversation (in production, would use real-time subscription)
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleAttachment = () => {
    toast.info('File upload coming soon!', {
      description: 'This feature is under development'
    });
  };

  const handleVideoCall = () => {
    if (!selectedConversation) return;
    navigate(`/video/${selectedConversation}`);
  };

  const handleAudioCall = () => {
    toast.info('Audio calls coming soon!', {
      description: 'This feature is under development'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)]">
        {/* Conversations List */}
        <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 border-r`}>
          {/* Header */}
          <div className="p-4 border-b bg-background/95 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="mr-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Messages
                </h1>
              </div>
              {totalUnread > 0 && (
                <Badge className="bg-red-500 text-white">
                  {totalUnread}
                </Badge>
              )}
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Tabs */}
            <div className="overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide snap-x snap-mandatory touch-pan-x -mx-4 px-4">
              <div className="inline-flex flex-nowrap items-center space-x-2 whitespace-nowrap">
                <div className="inline-block">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                    className="rounded-full"
                  >
                    All
                  </Button>
                </div>
                <div className="inline-block">
                  <Button
                    variant={filterType === 'match' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('match')}
                    className="rounded-full"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Matches
                  </Button>
                </div>
                <div className="inline-block">
                  <Button
                    variant={filterType === 'mentor' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('mentor')}
                    className="rounded-full"
                  >
                    <Award className="w-4 h-4 mr-1" />
                    Mentors
                  </Button>
                </div>
                <div className="inline-block">
                  <Button
                    variant={filterType === 'marketplace' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('marketplace')}
                    className="rounded-full"
                  >
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Market
                  </Button>
                </div>
                <div className="inline-block">
                  <Button
                    variant={filterType === 'health' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('health')}
                    className="rounded-full"
                  >
                    <Activity className="w-4 h-4 mr-1" />
                    Health
                  </Button>
                </div>
                <div className="inline-block">
                  <Button
                    variant={filterType === 'personal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('personal')}
                    className="rounded-full"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Personal
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredConversations.map((conversation) => {
                const TypeIcon = getTypeIcon(conversation.type);
                
                return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                      selectedConversation === conversation.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12 border-2 border-primary/20">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                            {conversation.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${getTypeColor(conversation.type)}`}>
                          <TypeIcon className="w-3 h-3" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold truncate">{conversation.name}</h4>
                            {conversation.pinned && (
                              <Pin className="w-3 h-3 text-primary" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {conversation.timestamp}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${conversation.unread > 0 ? 'font-semibold' : 'text-muted-foreground'}`}>
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <Badge className="ml-2 bg-primary text-primary-foreground flex-shrink-0">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {selectedConversation && activeConversation ? (
          <div className="flex flex-col flex-1">
            {/* Chat Header */}
            <div className="p-4 border-b bg-background/95 backdrop-blur flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>

                <Avatar className="w-10 h-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                    {activeConversation.avatar}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{activeConversation.name}</h3>
                    {activeConversation.verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleAudioCall}>
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleVideoCall}>
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Star className="w-4 h-4 mr-2" />
                      Star Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {activeConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[70%] ${message.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                      {message.sender === 'other' && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-bold">
                            {activeConversation.avatar}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.sender === 'me'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${message.sender === 'me' ? 'justify-end' : ''}`}>
                          <span>{message.timestamp}</span>
                          {message.sender === 'me' && (
                            message.read ? (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {activeConversation.online && Math.random() > 0.7 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                        {activeConversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background/95 backdrop-blur">
              <div className="flex items-end gap-2 max-w-4xl mx-auto">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={handleAttachment}>
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleAttachment}>
                    <Image className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex-1">
                  <Textarea
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[44px] max-h-32 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-muted/20">
            <div className="text-center">
              <MessageCircle className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Inbox;

