import React, { useState } from 'react';
import { 
  Home, Video, Store, Users, Search, Grid, MessageCircle, 
  Bell, ChevronDown, Plus, Image, Smile, Calendar,
  Heart, UserPlus, Briefcase, ShoppingBag, Church, Activity
} from 'lucide-react';

const HabeshaCommunityHome = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Your 7 Categories - matches Facebook's navigation style
  const leftNavItems = [
    { 
      icon: <Activity className="w-9 h-9" />, 
      label: 'Health', 
      color: 'text-green-600',
      href: '/health' 
    },
    { 
      icon: <Church className="w-9 h-9" />, 
      label: 'Spiritual', 
      color: 'text-purple-600',
      href: '/spiritual' 
    },
    { 
      icon: <Heart className="w-9 h-9" />, 
      label: 'Match', 
      color: 'text-pink-600',
      href: '/match' 
    },
    { 
      icon: <UserPlus className="w-9 h-9" />, 
      label: 'Mentor', 
      color: 'text-blue-600',
      href: '/mentor' 
    },
    { 
      icon: <ShoppingBag className="w-9 h-9" />, 
      label: 'Marketplace', 
      color: 'text-cyan-600',
      href: '/marketplace' 
    },
    { 
      icon: <Users className="w-9 h-9" />, 
      label: 'Community', 
      color: 'text-indigo-600',
      href: '/community' 
    },
  ];

  // Sample posts (you'll replace with real data)
  const posts = [
    {
      id: 1,
      author: 'Habesha Health Hub',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HH',
      time: '2h',
      category: 'Health',
      content: 'Join our free nutrition workshop this Saturday! Learn about traditional Ethiopian diet and modern wellness practices.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
      likes: 234,
      comments: 45,
      shares: 12
    },
    {
      id: 2,
      author: 'Ethiopian Orthodox Community',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EOC',
      time: '4h',
      category: 'Spiritual',
      content: 'Prayer service tonight at 7 PM. All are welcome to join us for evening prayers and fellowship.',
      likes: 567,
      comments: 89,
      shares: 23
    },
    {
      id: 3,
      author: 'Habesha Mentorship Network',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HMN',
      time: '6h',
      category: 'Mentor',
      content: 'Looking for career guidance? Our mentors are here to help! Book a free 30-minute session today.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      likes: 189,
      comments: 34,
      shares: 8
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ============================================ */}
      {/* FACEBOOK-STYLE HEADER - PIXEL PERFECT */}
      {/* ============================================ */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left - Logo & Search */}
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              H
            </div>
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-60">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search HabeshaCommunity"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* Center - Navigation Tabs */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-2">
            <button 
              onClick={() => setActiveTab('home')}
              className={`px-12 h-14 flex items-center justify-center border-b-4 ${
                activeTab === 'home' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:bg-gray-100'
              } rounded-lg transition-all`}
            >
              <Home className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              className={`px-12 h-14 flex items-center justify-center border-b-4 ${
                activeTab === 'video' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:bg-gray-100'
              } rounded-lg transition-all`}
            >
              <Video className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setActiveTab('groups')}
              className={`px-12 h-14 flex items-center justify-center border-b-4 ${
                activeTab === 'groups' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:bg-gray-100'
              } rounded-lg transition-all`}
            >
              <Users className="w-6 h-6" />
            </button>
          </div>

          {/* Right - Icons & Profile */}
          <div className="flex items-center gap-2 justify-end flex-1">
            <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
              <Grid className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <button className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================ */}
      <div className="pt-14 max-w-[1920px] mx-auto">
        <div className="flex">
          {/* ============================================ */}
          {/* LEFT SIDEBAR - YOUR 7 CATEGORIES */}
          {/* ============================================ */}
          <aside className="hidden lg:block w-[360px] fixed left-0 h-[calc(100vh-56px)] overflow-y-auto pt-4 px-2">
            <div className="space-y-1">
              {/* User Profile */}
              <a href="/profile" className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" 
                  alt="Profile"
                  className="w-9 h-9 rounded-full"
                />
                <span className="font-medium text-[15px]">Yobel Berhe</span>
              </a>

              {/* Your 7 Categories - Facebook Style */}
              {leftNavItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer group"
                >
                  <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="font-medium text-[15px]">{item.label}</span>
                </a>
              ))}

              <hr className="my-2 border-gray-300" />

              {/* See More */}
              <button className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer w-full">
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                  <ChevronDown className="w-5 h-5" />
                </div>
                <span className="font-medium text-[15px]">See more</span>
              </button>
            </div>

            {/* Footer Links - Facebook Style */}
            <div className="mt-4 px-2 pb-4">
              <div className="text-xs text-gray-500 leading-relaxed">
                <a href="#" className="hover:underline">Privacy</a> · 
                <a href="#" className="hover:underline"> Terms</a> · 
                <a href="#" className="hover:underline"> Advertising</a> · 
                <a href="#" className="hover:underline"> Cookies</a> · 
                <a href="#" className="hover:underline"> More</a>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                HabeshaCommunity © 2024
              </div>
            </div>
          </aside>

          {/* ============================================ */}
          {/* CENTER FEED - FACEBOOK CARDS */}
          {/* ============================================ */}
          <main className="flex-1 lg:ml-[360px] lg:mr-[360px] px-0 md:px-8 pb-8">
            <div className="max-w-[680px] mx-auto pt-4">
              {/* ============================================ */}
              {/* CREATE POST BOX - FACEBOOK STYLE */}
              {/* ============================================ */}
              <div className="bg-white rounded-lg shadow mb-4 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" 
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <button className="flex-1 text-left bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-gray-500">
                    What's on your mind, Yobel?
                  </button>
                </div>
                <hr className="border-gray-300 mb-3" />
                <div className="flex justify-between">
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
                    <Video className="w-6 h-6 text-red-500" />
                    <span className="text-gray-600 font-medium text-[15px]">Live video</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
                    <Image className="w-6 h-6 text-green-500" />
                    <span className="text-gray-600 font-medium text-[15px]">Photo/video</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
                    <Smile className="w-6 h-6 text-yellow-500" />
                    <span className="text-gray-600 font-medium text-[15px]">Feeling/activity</span>
                  </button>
                </div>
              </div>

              {/* ============================================ */}
              {/* POSTS FEED - FACEBOOK CARDS */}
              {/* ============================================ */}
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow mb-4">
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.avatar} 
                        alt={post.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-[15px]">{post.author}</h3>
                        <p className="text-xs text-gray-500">{post.time} · 🌍</p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-[15px] leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="w-full">
                      <img 
                        src={post.image} 
                        alt="Post content"
                        className="w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Like/Comment/Share Counts */}
                  <div className="px-4 py-3 flex items-center justify-between text-gray-500 text-[15px]">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="w-[18px] h-[18px] bg-blue-600 rounded-full flex items-center justify-center text-[10px]">
                          👍
                        </div>
                        <div className="w-[18px] h-[18px] bg-red-600 rounded-full flex items-center justify-center text-[10px]">
                          ❤️
                        </div>
                      </div>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>

                  <hr className="border-gray-300" />

                  {/* Like/Comment/Share Buttons */}
                  <div className="px-4 py-1 flex">
                    <button className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded-lg">
                      <Heart className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600 font-medium text-[15px]">Like</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded-lg">
                      <MessageCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600 font-medium text-[15px]">Comment</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 flex-1 py-2 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-gray-600 font-medium text-[15px]">Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* ============================================ */}
          {/* RIGHT SIDEBAR - CONTACTS & SPONSORED */}
          {/* ============================================ */}
          <aside className="hidden xl:block w-[360px] fixed right-0 h-[calc(100vh-56px)] overflow-y-auto pt-4 px-4">
            {/* Sponsored */}
            <div className="mb-4">
              <h3 className="text-gray-500 font-semibold text-[17px] mb-3">Sponsored</h3>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <img 
                  src="https://api.dicebear.com/7.x/shapes/svg?seed=ad1" 
                  alt="Ad"
                  className="w-[100px] h-[100px] rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-medium text-[15px]">Health Workshop</h4>
                  <p className="text-xs text-gray-500">habeshacommunity.com</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-300 my-4" />

            {/* Contacts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 font-semibold text-[17px]">Contacts</h3>
                <div className="flex items-center gap-2">
                  <button className="text-gray-500 hover:bg-gray-200 p-2 rounded-full">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="text-gray-500 hover:bg-gray-200 p-2 rounded-full">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="text-gray-500 hover:bg-gray-200 p-2 rounded-full">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                {['Abebe Kebede', 'Meron Tesfaye', 'Daniel Haile', 'Sara Yohannes', 'Michael Tadesse'].map((name, idx) => (
                  <a 
                    key={idx}
                    href="#"
                    className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                  >
                    <div className="relative">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                        alt={name}
                        className="w-9 h-9 rounded-full"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-[15px] font-medium">{name}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ============================================ */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* ============================================ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around py-2">
        <button className="flex flex-col items-center py-2 px-4">
          <Home className="w-6 h-6 text-blue-600" />
        </button>
        <button className="flex flex-col items-center py-2 px-4">
          <Video className="w-6 h-6 text-gray-500" />
        </button>
        <button className="flex flex-col items-center py-2 px-4">
          <Users className="w-6 h-6 text-gray-500" />
        </button>
        <button className="flex flex-col items-center py-2 px-4">
          <Bell className="w-6 h-6 text-gray-500" />
        </button>
        <button className="flex flex-col items-center py-2 px-4">
          <Grid className="w-6 h-6 text-gray-500" />
        </button>
      </nav>
    </div>
  );
};

export default HabeshaCommunityHome;
