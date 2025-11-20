import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Sun, Moon, Zap, Bell, Home, BookOpen, CheckSquare, Compass } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSEO } from "@/hooks/useSEO";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SpiritualHome = () => {
  useSEO({ title: "Today - HabeshaCommunity", description: "Daily Bible verses, prayers, and spiritual content" });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'today' | 'community'>('today');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 18 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab('today')} className="relative">
              <span className={`text-xl font-semibold ${activeTab === 'today' ? 'text-white' : 'text-gray-500'}`}>Today</span>
              {activeTab === 'today' && <div className="absolute -bottom-3 left-0 right-0 h-1 bg-red-500 rounded-full" />}
            </button>
            <button onClick={() => setActiveTab('community')} className="relative">
              <span className={`text-xl font-semibold ${activeTab === 'community' ? 'text-white' : 'text-gray-500'}`}>Community</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative"><Zap className="w-6 h-6" /><span className="absolute -top-1 -right-1 text-xs font-bold">3</span></button>
            <button><Bell className="w-6 h-6" /></button>
            <Avatar className="w-10 h-10 border-2 border-white"><AvatarFallback className="bg-purple-600 text-white font-semibold">Y</AvatarFallback></Avatar>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 flex items-center gap-3">
        {hour < 18 ? <Sun className="w-7 h-7 text-yellow-400" /> : <Moon className="w-7 h-7 text-blue-300" />}
        <h1 className="text-xl font-bold tracking-wide">{greeting}, YOBEL</h1>
      </div>

      <div className="px-4 space-y-6">
        <Card className="relative h-[500px] rounded-3xl overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
          <div className="relative h-full flex flex-col justify-between p-6 text-white">
            <div className="text-center pt-8">
              <p className="text-sm text-white/70 mb-2">Verse of the Day</p>
              <p className="text-lg font-semibold mb-4">2 Timothy 1:7</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed text-center px-4">
                "For God has not given us a spirit of fear and timidity, but of power, love, and self-discipline."
              </blockquote>
            </div>
            <div className="flex items-center justify-around pt-4 border-t border-white/20">
              <button className="flex flex-col items-center gap-1"><Heart className="w-6 h-6" /><span className="text-sm">1.5M</span></button>
              <button className="flex flex-col items-center gap-1"><MessageCircle className="w-6 h-6" /><span className="text-sm">22.6K</span></button>
              <button className="flex flex-col items-center gap-1"><Share2 className="w-6 h-6" /><span className="text-sm">560.8K</span></button>
              <button className="flex flex-col items-center gap-1"><MoreHorizontal className="w-6 h-6" /><span className="text-sm">More</span></button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 bg-orange-500 rounded-full" /><span className="text-xs text-gray-400">0</span></div>
              <p className="text-xs text-gray-400 mb-1">Guided Scripture</p>
              <h3 className="text-lg font-semibold mb-1">The Power You Need</h3>
              <div className="flex items-center gap-2 text-gray-400"><Play className="w-4 h-4" /><span className="text-sm">2-5 min</span></div>
            </div>
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><div className="w-16 h-16 bg-white/20 rounded-lg" /></div>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Continue Where You Left Off</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <Card className="min-w-[280px] rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-700 border-0 cursor-pointer" onClick={() => navigate('/spiritual/plans')}>
              <div className="relative">
                <button className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center"><MoreHorizontal className="w-5 h-5" /></button>
                <div className="h-48 flex items-center justify-center p-6 bg-gradient-to-br from-cyan-400 to-blue-600"><div className="w-24 h-32 bg-black/40 rounded-lg" /></div>
                <div className="p-4 bg-gradient-to-t from-black/50">
                  <h3 className="text-lg font-bold mb-2">The Messianic Torah</h3>
                  <div className="flex items-center gap-2 text-sm"><BookOpen className="w-4 h-4" /><span>22 Sessions</span></div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-3">
          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl p-5 flex items-center justify-between cursor-pointer" onClick={() => navigate('/spiritual/videos')}>
            <div><h3 className="text-xl font-bold mb-1">Videos</h3><p className="text-sm text-gray-400">Overviews on Biblical topics</p></div>
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-300 to-red-500" />
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl p-5 flex items-center justify-between cursor-pointer" onClick={() => navigate('/spiritual/podcasts')}>
            <div><h3 className="text-xl font-bold mb-1">Podcasts</h3><p className="text-sm text-gray-400">Deep-dive conversations</p></div>
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-pink-400 to-orange-400" />
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl p-5 flex items-center justify-between cursor-pointer" onClick={() => navigate('/spiritual/plans')}>
            <div><h3 className="text-xl font-bold mb-1">Classes</h3><p className="text-sm text-gray-400">Study the Bible with a scholar</p></div>
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600" />
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 z-50">
        <div className="flex items-center justify-around py-3 px-4">
          <button className="flex flex-col items-center gap-1" onClick={() => navigate('/spiritual')}><Home className="w-6 h-6" /><span className="text-xs font-medium">Home</span></button>
          <button className="flex flex-col items-center gap-1 text-gray-500" onClick={() => navigate('/spiritual/bible-reader')}><BookOpen className="w-6 h-6" /><span className="text-xs">Bible</span></button>
          <button className="flex flex-col items-center gap-1 text-gray-500" onClick={() => navigate('/spiritual/plans')}><CheckSquare className="w-6 h-6" /><span className="text-xs">Plans</span></button>
          <button className="flex flex-col items-center gap-1 text-gray-500" onClick={() => navigate('/spiritual/discover')}><Compass className="w-6 h-6" /><span className="text-xs">Discover</span></button>
          <button className="flex flex-col items-center gap-1 text-gray-500" onClick={() => navigate('/account/settings')}><MoreHorizontal className="w-6 h-6" /><span className="text-xs">More</span></button>
        </div>
      </div>
    </div>
  );
};

export default SpiritualHome;
