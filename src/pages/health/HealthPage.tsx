import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Video, Store, Users, Search, Grid, MessageCircle, 
  Bell, ChevronDown, Plus, Image, Smile, Calendar,
  Heart, UserPlus, Briefcase, ShoppingBag, Church, Activity,
  TrendingUp, Apple, Dumbbell, Moon as Sleep, Droplet
} from 'lucide-react';

const HealthPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const healthFilters = [
    { id: 'all', label: 'All Posts', icon: <Activity className="w-5 h-5" /> },
    { id: 'nutrition', label: 'Nutrition', icon: <Apple className="w-5 h-5" /> },
    { id: 'fitness', label: 'Fitness', icon: <Dumbbell className="w-5 h-5" /> },
    { id: 'mental', label: 'Mental Health', icon: <Heart className="w-5 h-5" /> },
    { id: 'sleep', label: 'Sleep', icon: <Sleep className="w-5 h-5" /> },
    { id: 'hydration', label: 'Hydration', icon: <Droplet className="w-5 h-5" /> },
  ];

  const healthPosts = [
    {
      id: 1,
      author: 'Dr. Mekdes Haile',
      title: 'Family Medicine Specialist',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DrMekdes',
      time: '1h',
      category: 'nutrition',
      content: 'Traditional Ethiopian injera is rich in probiotics! The fermentation process creates beneficial bacteria that support gut health. Here are 5 health benefits of incorporating injera into your diet...',
      image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?w=800',
      likes: 892,
      comments: 124,
      shares: 67
    },
    {
      id: 2,
      author: 'Habesha Fitness Hub',
      title: 'Community Fitness Group',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HFH',
      time: '3h',
      category: 'fitness',
      content: '🏃‍♀️ Join our FREE outdoor bootcamp this Saturday at 7 AM! Location: Golden Gate Park. Bring water and a positive attitude! All fitness levels welcome. Let\'s stay healthy together! 💪',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
      likes: 456,
      comments: 89,
      shares: 34
    },
    {
      id: 3,
      author: 'Rahel Tesfaye',
      title: 'Certified Nutritionist',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahel',
      time: '5h',
      category: 'nutrition',
      content: 'Meal prep Sunday! 🥗 Here\'s my weekly Ethiopian-inspired healthy meal plan. Each meal under 500 calories but packed with flavor and nutrition. Recipes in comments!',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      likes: 1243,
      comments: 267,
      shares: 145
    }
  ];

  const healthResources = [
    {
      title: 'Free Health Checkup',
      description: 'This weekend at community center',
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=health1',
      type: 'event'
    },
    {
      title: 'Ethiopian Recipes',
      description: 'Healthy traditional cooking',
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=health2',
      type: 'resource'
    },
    {
      title: 'Fitness Challenge',
      description: '30-day community challenge',
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=health3',
      type: 'challenge'
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              H
            </div>
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-60">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search Health"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 gap-2">
            <button onClick={() => navigate('/')} className="px-12 h-14 flex items-center justify-center border-b-4 border-transparent text-gray-500 hover:bg-gray-100 rounded-lg">
              <Home className="w-6 h-6" />
            </button>
            <button className="px-12 h-14 flex items-center justify-center border-b-4 border-blue-600 text-blue-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </button>
          </div>

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

      <div className="pt-14 max-w-[1920px] mx-auto">
        <div className="flex">
          <aside className="hidden lg:block w-[360px] fixed left-0 h-[calc(100vh-56px)] overflow-y-auto pt-4 px-2">
            <div className="px-3 mb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-7 h-7 text-green-600" />
                Health
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Your wellness community
              </p>
            </div>

            <hr className="border-gray-300 my-2" />

            <div className="space-y-1">
              {healthFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className={`${
                    activeFilter === filter.id ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {filter.icon}
                  </div>
                  <span className="font-medium text-[15px]">{filter.label}</span>
                </button>
              ))}
            </div>

            <hr className="border-gray-300 my-4" />

            <div className="px-3">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">QUICK ACTIONS</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  + Create Health Post
                </button>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Track Today's Activity
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  View My Health Stats
                </button>
              </div>
            </div>

            <div className="m-3 bg-white rounded-lg shadow-sm p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Your Health Today</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Exercise</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">45 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Apple className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-gray-600">Calories</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">1,850/2,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Water</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">6/8 cups</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 lg:ml-[360px] lg:mr-[360px] px-0 md:px-8 pb-8">
            <div className="max-w-[680px] mx-auto pt-4">
              <div className="bg-white rounded-lg shadow mb-4 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" 
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <button className="flex-1 text-left bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-gray-500">
                    Share your health journey...
                  </button>
                </div>
                <hr className="border-gray-300 mb-3" />
                <div className="flex justify-between">
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
                    <Image className="w-6 h-6 text-green-500" />
                    <span className="text-gray-600 font-medium text-[15px]">Photo</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <span className="text-gray-600 font-medium text-[15px]">Event</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                    <span className="text-gray-600 font-medium text-[15px]">Progress</span>
                  </button>
                </div>
              </div>

              {healthPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow mb-4">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.avatar} 
                        alt={post.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-[15px]">{post.author}</h3>
                        <p className="text-xs text-gray-500">{post.title} · {post.time}</p>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="px-4 pb-3">
                    <p className="text-[15px] leading-relaxed">{post.content}</p>
                  </div>

                  {post.image && (
                    <div className="w-full">
                      <img 
                        src={post.image} 
                        alt="Post content"
                        className="w-full object-cover"
                      />
                    </div>
                  )}

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

          <aside className="hidden xl:block w-[360px] fixed right-0 h-[calc(100vh-56px)] overflow-y-auto pt-4 px-4">
            <div className="mb-4">
              <h3 className="text-gray-500 font-semibold text-[17px] mb-3">Health Events & Resources</h3>
              {healthResources.map((resource, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer mb-2">
                  <img 
                    src={resource.image} 
                    alt={resource.title}
                    className="w-[80px] h-[80px] rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-[15px]">{resource.title}</h4>
                    <p className="text-xs text-gray-500">{resource.description}</p>
                    <span className="text-xs text-blue-600 font-medium">{resource.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-gray-300 my-4" />

            <div>
              <h3 className="text-gray-500 font-semibold text-[17px] mb-3">Health Professionals</h3>
              <div className="space-y-1">
                {['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Aisha Patel'].map((name, idx) => (
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
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <span className="text-[15px]">{name}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
