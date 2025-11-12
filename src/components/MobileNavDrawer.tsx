import React, { useState } from 'react';
import { 
  X, Activity, Church, Heart, UserPlus, ShoppingBag, Users,
  Settings, HelpCircle, Moon, ChevronRight, LogOut
} from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const categories = [
    { 
      icon: <Activity className="w-6 h-6" />, 
      label: 'Health', 
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/health',
      description: 'Track your wellness journey'
    },
    { 
      icon: <Church className="w-6 h-6" />, 
      label: 'Spiritual', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/spiritual',
      description: 'Faith resources & community'
    },
    { 
      icon: <Heart className="w-6 h-6" />, 
      label: 'Match', 
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      href: '/match',
      description: 'Find your perfect match'
    },
    { 
      icon: <UserPlus className="w-6 h-6" />, 
      label: 'Mentor', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/mentor',
      description: 'Connect with mentors'
    },
    { 
      icon: <ShoppingBag className="w-6 h-6" />, 
      label: 'Marketplace', 
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      href: '/marketplace',
      description: 'Buy & sell in community'
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      label: 'Community', 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      href: '/community',
      description: 'Join the conversation'
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-73px)]">
          {/* User Profile */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" 
                alt="Profile"
                className="w-14 h-14 rounded-full border-2 border-blue-600"
              />
              <div>
                <h3 className="font-semibold text-gray-900">Yobel Berhe</h3>
                <p className="text-sm text-gray-500">View profile</p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="p-2">
            <h3 className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase">
              Categories
            </h3>
            {categories.map((category, index) => (
              <a
                key={index}
                href={category.href}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                onClick={onClose}
              >
                <div className={`w-10 h-10 ${category.bgColor} rounded-full flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{category.label}</p>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          <hr className="my-2 border-gray-200" />

          {/* Settings & More */}
          <div className="p-2">
            <h3 className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase">
              Settings
            </h3>
            <a
              href="/settings"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={onClose}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <span className="flex-1 font-medium text-gray-900">Settings & Privacy</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </a>
            <a
              href="/help"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={onClose}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </div>
              <span className="flex-1 font-medium text-gray-900">Help & Support</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </a>
            <a
              href="/dark-mode"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={onClose}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Moon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="flex-1 font-medium text-gray-900">Dark Mode</span>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </a>
            <button
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors w-full"
              onClick={onClose}
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <span className="flex-1 font-medium text-gray-900 text-left">Log Out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-4 text-xs text-gray-500">
            <p>Privacy · Terms · Advertising · Cookies</p>
            <p className="mt-2">HabeshaCommunity © 2024</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavDrawer;
