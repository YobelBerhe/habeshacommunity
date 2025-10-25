import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  Clock, Maximize, Minimize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function SessionRoom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [sessionStartTime] = useState(Date.now());
  const [duration, setDuration] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      setDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  // Format duration HH:MM:SS
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = async () => {
    // TODO: Save session duration to database for dispute resolution
    toast.success('Session completed!', {
      description: `Duration: ${formatDuration(duration)}`
    });

    navigate('/mentor/sessions');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Timer */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur z-50 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Badge className="bg-red-500 text-white px-4 py-2 text-lg">
            <Clock className="w-5 h-5 mr-2" />
            {formatDuration(duration)}
          </Badge>
          
          <div className="text-white text-sm">
            Session Recording: ON
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="h-screen pt-20 pb-24 px-4">
        <div className="grid md:grid-cols-2 gap-4 h-full max-w-7xl mx-auto">
          {/* Remote Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded">
              Mentor Name
            </div>
          </div>

          {/* Local Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded">
              You
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur p-6">
        <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
          <Button
            size="lg"
            variant={isVideoOn ? 'secondary' : 'destructive'}
            onClick={() => setIsVideoOn(!isVideoOn)}
            className="rounded-full w-14 h-14"
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button
            size="lg"
            variant={isAudioOn ? 'secondary' : 'destructive'}
            onClick={() => setIsAudioOn(!isAudioOn)}
            className="rounded-full w-14 h-14"
          >
            {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          <Button
            size="lg"
            variant="destructive"
            onClick={handleEndSession}
            className="rounded-full w-16 h-16"
          >
            <PhoneOff className="w-8 h-8" />
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-full w-14 h-14"
          >
            {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
