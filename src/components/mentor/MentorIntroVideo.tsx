import React from "react";
import { Card } from "@/components/ui/card";
import { Play, Video } from "lucide-react";

interface MentorIntroVideoProps {
  youtubeLink?: string;
}

const MentorIntroVideo: React.FC<MentorIntroVideoProps> = ({ youtubeLink }) => {
  if (!youtubeLink) return null;

  const getYouTubeID = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtube.com")) {
        return urlObj.searchParams.get("v");
      }
      if (urlObj.hostname.includes("youtu.be")) {
        return urlObj.pathname.slice(1);
      }
    } catch (error) {
      console.warn("Invalid YouTube URL:", error);
    }
    return null;
  };

  const videoId = getYouTubeID(youtubeLink);
  const [showVideo, setShowVideo] = React.useState(false);

  if (!videoId) return null;

  return (
    <Card className="overflow-hidden border-2">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          Free 15-Minute Introduction
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Get to know this mentor before booking
        </p>
      </div>

      <div className="p-4">
        {!showVideo ? (
          <div
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-lg"
            onClick={() => setShowVideo(true)}
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="Intro video thumbnail"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/20 group-hover:from-black/70 transition-all" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl scale-150" />
                <button className="relative bg-white hover:bg-white/90 text-primary rounded-full p-6 shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-current" />
                </button>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-white text-sm font-medium">Click to play introduction video</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="Mentor Introduction Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default MentorIntroVideo;
