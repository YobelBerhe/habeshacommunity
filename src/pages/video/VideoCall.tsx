import { useState, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, Monitor,
  MonitorOff, MessageSquare, Users, Settings, Maximize,
  Minimize, Volume2, VolumeX, Grid, User, MoreVertical,
  Camera, Wifi, WifiOff, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const VideoCall = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'medium' | 'poor'>('good');
  const [callDuration, setCallDuration] = useState(0);

  // Demo participant
  const participant = {
    name: 'Sara Mehretab',
    avatar: 'SM',
    type: 'Match Video Date'
  };

  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast.success(isVideoOn ? 'Camera turned off' : 'Camera turned on');
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast.success(isAudioOn ? 'Microphone muted' : 'Microphone unmuted');
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.success(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started');
  };

  const endCall = () => {
    toast.success('Call ended');
    navigate(-1);
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'good': return 'text-green-600';
      case 'medium': return 'text-amber-600';
      case 'poor': return 'text-red-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Main Video Area */}
      <div className="relative h-full w-full">
        {/* Remote Video (Main) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
          {isVideoOn ? (
            <div className="text-center">
              <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-white/20 mb-4">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-6xl font-bold">
                  {participant.avatar}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{participant.name}</h3>
              <Badge className="bg-white/20 text-white">
                {participant.type}
              </Badge>
            </div>
          ) : (
            <div className="text-center">
              <VideoOff className="w-24 h-24 text-white/50 mb-4 mx-auto" />
              <p className="text-white/70 text-xl">Camera is off</p>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 md:w-64 md:h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
          {isVideoOn ? (
            <div className="h-full flex items-center justify-center">
              <Avatar className="w-20 h-20 md:w-24 md:h-24">
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white text-2xl font-bold">
                  You
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <VideoOff className="w-12 h-12 text-white/50" />
            </div>
          )}
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-black/50 text-white text-xs">You</Badge>
          </div>
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${getConnectionColor()}`}>
                {connectionQuality === 'good' && <Wifi className="w-5 h-5" />}
                {connectionQuality === 'medium' && <Wifi className="w-5 h-5" />}
                {connectionQuality === 'poor' && <WifiOff className="w-5 h-5" />}
                <span className="text-white text-sm font-medium capitalize">{connectionQuality}</span>
              </div>
              <div className="text-white font-mono text-sm">
                {formatDuration(callDuration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Camera className="w-4 h-4 mr-2" />
                    Change Camera
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mic className="w-4 h-4 mr-2" />
                    Change Microphone
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Audio Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            {/* Video Toggle */}
            <Button
              size="lg"
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full ${
                isVideoOn 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>

            {/* Audio Toggle */}
            <Button
              size="lg"
              onClick={toggleAudio}
              className={`w-14 h-14 rounded-full ${
                isAudioOn 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>

            {/* End Call */}
            <Button
              size="lg"
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="w-7 h-7" />
            </Button>

            {/* Screen Share */}
            <Button
              size="lg"
              onClick={toggleScreenShare}
              className={`w-14 h-14 rounded-full ${
                isScreenSharing 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
            </Button>

            {/* Chat Toggle */}
            <Button
              size="lg"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`w-14 h-14 rounded-full ${
                isChatOpen 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <MessageSquare className="w-6 h-6" />
            </Button>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="lg"
                  className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <MoreVertical className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Users className="w-4 h-4 mr-2" />
                  Invite Others
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Grid className="w-4 h-4 mr-2" />
                  Change Layout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Control Labels */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mt-3">
            <span className="text-white text-xs w-14 text-center">Video</span>
            <span className="text-white text-xs w-14 text-center">Audio</span>
            <span className="text-white text-xs w-16 text-center">End</span>
            <span className="text-white text-xs w-14 text-center">Share</span>
            <span className="text-white text-xs w-14 text-center">Chat</span>
            <span className="text-white text-xs w-14 text-center">More</span>
          </div>
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && (
          <div className="absolute right-0 top-0 bottom-0 w-80 md:w-96 bg-background/95 backdrop-blur border-l shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold">Chat</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <p className="text-sm text-muted-foreground text-center">
                  No messages yet. Say hi! 👋
                </p>
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <Button>Send</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connection Status Banner */}
        {connectionQuality !== 'good' && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2">
            <Badge className={`${
              connectionQuality === 'poor' ? 'bg-red-600' : 'bg-amber-600'
            } text-white px-4 py-2`}>
              {connectionQuality === 'poor' ? 'Poor Connection' : 'Unstable Connection'}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
