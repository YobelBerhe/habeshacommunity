import React from "react";

interface MentorIntroVideoProps {
  youtubeLink?: string;
}

const MentorIntroVideo: React.FC<MentorIntroVideoProps> = ({ youtubeLink }) => {
  if (!youtubeLink) return null;

  // Safely extract the YouTube video ID from a full link
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
    <section className="mt-6 bg-card p-4 rounded-2xl shadow-sm border border-border transition-all">
      <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
        <span>🎥</span> Free 15-Minute Intro Video
      </h3>

      {/* Thumbnail Preview on Load */}
      {!showVideo ? (
        <div
          className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => setShowVideo(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="Intro video thumbnail"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
            <button className="bg-white/90 text-red-600 rounded-full px-6 py-2 text-sm md:text-base font-semibold shadow-md group-hover:bg-white transition">
              ▶ Play Intro
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="Mentor Introduction Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      )}

      {/* Description text (hidden on very small screens) */}
      <p className="text-sm text-muted-foreground mt-3 hidden sm:block">
        This intro video is streamed directly from YouTube. Click play to learn more about this
        mentor and their approach.
      </p>
    </section>
  );
};

export default MentorIntroVideo;
