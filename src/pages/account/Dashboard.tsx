import React, { useState } from 'react';
import { 
  User, Heart, MessageCircle, Calendar, Bell, Settings, 
  CreditCard, Shield, Star, TrendingUp, Eye, Edit, Save,
  LogOut, ChevronRight, Clock, MapPin, Globe, Briefcase,
  GraduationCap, Church, Coffee, Video, Phone, Mail,
  Camera, X, Check, DollarSign, Download, Upload, Link,
  Award, Target, Sparkles, AlertCircle, CheckCircle, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  // Mock user data - replace with actual data from Supabase
  const userData = {
    name: 'Sara Desta',
    age: 27,
    email: 'sara.desta@email.com',
    phone: '+1 (202) 555-0123',
    location: 'Washington DC, USA',
    origin: 'Addis Ababa, Ethiopia',
    profession: 'Healthcare Administrator',
    education: 'Masters in Public Health',
    faith: 'Orthodox Christian',
    verified: true,
    subscriptionTier: 'Premium',
    memberSince: 'January 2024',
    profileViews: 342,
    matches: 12,
    messages: 5
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    toast.success('Logged out successfully');
  };

  // Sidebar Navigation
  const Sidebar = () => (
    <div className="w-64 bg-background border-r border-border h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="font-bold text-lg">HabeshaCommunity</span>
        </div>

        {/* User Quick Info */}
        <div className="bg-gradient-subtle rounded-xl p-4 mb-6 border border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-match rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-foreground">{userData.name}</p>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-muted-foreground">Verified</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-card rounded-lg p-2 border border-border">
              <p className="text-lg font-bold text-primary">{userData.matches}</p>
              <p className="text-xs text-muted-foreground">Matches</p>
            </div>
            <div className="bg-card rounded-lg p-2 border border-border">
              <p className="text-lg font-bold text-secondary">{userData.profileViews}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
            <div className="bg-card rounded-lg p-2 border border-border">
              <p className="text-lg font-bold text-accent">{userData.messages}</p>
              <p className="text-xs text-muted-foreground">Chats</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {[
            { id: 'overview', icon: TrendingUp, label: 'Overview' },
            { id: 'profile', icon: User, label: 'My Profile' },
            { id: 'matches', icon: Heart, label: 'Matches' },
            { id: 'messages', icon: MessageCircle, label: 'Messages', badge: 5 },
            { id: 'bookings', icon: Calendar, label: 'Bookings' },
            { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3 },
            { id: 'subscription', icon: CreditCard, label: 'Subscription' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-gradient-primary text-white'
                  : 'text-foreground hover:bg-accent/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === item.id ? 'bg-white text-primary' : 'bg-destructive text-destructive-foreground'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Upgrade Banner */}
        {userData.subscriptionTier !== 'Premium' && (
          <div className="mt-6 bg-gradient-match rounded-xl p-4 text-white">
            <Sparkles className="w-6 h-6 mb-2" />
            <p className="font-bold mb-1">Upgrade to Premium</p>
            <p className="text-xs text-pink-100 mb-3">Unlock unlimited features</p>
            <button className="w-full bg-white text-primary py-2 rounded-lg text-sm font-bold hover:shadow-lg transition-all">
              Upgrade Now
            </button>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="absolute bottom-0 w-64 p-6 border-t border-border">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          <LogOut className="w-5 h-5 text-foreground" />
          <span className="font-medium text-foreground">Logout</span>
        </button>
      </div>
    </div>
  );

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-primary rounded-2xl p-8 text-white shadow-elegant">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {userData.name.split(' ')[0]}! 👋</h2>
        <p className="text-white/80">Here's what's happening with your account today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { icon: Heart, label: 'New Matches', value: '3 today', trend: '+2' },
          { icon: MessageCircle, label: 'Unread Messages', value: '5 new', trend: '+5' },
          { icon: Eye, label: 'Profile Views', value: '24 today', trend: '+12' },
          { icon: Star, label: 'Compatibility', value: '92% avg', trend: '+3%' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-card rounded-xl shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-green-600 text-sm font-semibold">{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <div className="bg-card rounded-xl shadow-md p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Recent Matches</h3>
            <button className="text-primary text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Michael T.', compatibility: 88, mutual: true, time: '2h ago' },
              { name: 'Daniel A.', compatibility: 85, mutual: false, time: '1d ago' },
              { name: 'Yohannes M.', compatibility: 90, mutual: true, time: '2d ago' }
            ].map((match, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-match rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{match.name}</p>
                    <p className="text-xs text-muted-foreground">{match.compatibility}% match • {match.time}</p>
                  </div>
                </div>
                {match.mutual && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold">
                    Mutual
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-card rounded-xl shadow-md p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Pending Actions</h3>
            <span className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-bold">3</span>
          </div>
          <div className="space-y-3">
            {[
              { action: 'Complete your profile', icon: User, priority: 'high' },
              { action: 'Upload verification photo', icon: Camera, priority: 'high' },
              { action: 'Add video introduction', icon: Video, priority: 'medium' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.priority === 'high' ? 'bg-destructive/10' : 'bg-warning/10'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.priority === 'high' ? 'text-destructive' : 'text-warning'
                    }`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.action}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-card rounded-xl shadow-md p-6 border border-border">
        <h3 className="font-bold text-foreground mb-4">Upcoming Bookings</h3>
        <div className="space-y-3">
          {[
            { type: 'Mentorship Session', with: 'Dr. Abraham K.', date: 'Tomorrow, 3:00 PM', topic: 'Career Guidance' },
            { type: 'Video Call', with: 'Rahel Y.', date: 'Friday, 7:00 PM', topic: 'First Date' }
          ].map((booking, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border-2 border-border rounded-xl hover:border-primary transition-colors">
              <div className="flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">{booking.type}</p>
                  <p className="text-sm text-muted-foreground">with {booking.with}</p>
                  <p className="text-xs text-muted-foreground">{booking.date}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Profile Tab
  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
        <div className="relative h-48 bg-gradient-subtle">
          <button className="absolute top-4 right-4 p-2 bg-background rounded-lg shadow-lg hover:bg-muted transition-colors">
            <Camera className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-end space-x-6 -mt-16">
            <div className="relative">
              <div className="w-32 h-32 bg-background rounded-2xl shadow-xl border-4 border-background flex items-center justify-center">
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                <Camera className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{userData.name}, {userData.age}</h2>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {userData.location}
                  </p>
                </div>
                <button 
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editMode ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                  <span>{editMode ? 'Save' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="mt-6 bg-gradient-subtle rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-foreground">Profile Completion</span>
              <span className="text-green-600 font-bold">85%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 mb-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all" style={{ width: '85%' }} />
            </div>
            <p className="text-sm text-muted-foreground">Add video introduction and 2 more photos to reach 100%</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-card rounded-xl shadow-md p-6 border border-border">
          <h3 className="font-bold text-foreground mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
              <input 
                type="text" 
                value={userData.name}
                disabled={!editMode}
                className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Age</label>
                <input 
                  type="number" 
                  value={userData.age}
                  disabled={!editMode}
                  className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Gender</label>
                <select 
                  disabled={!editMode}
                  className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
                >
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Email</label>
              <input 
                type="email" 
                value={userData.email}
                disabled={!editMode}
                className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Phone</label>
              <input 
                type="tel" 
                value={userData.phone}
                disabled={!editMode}
                className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Background */}
        <div className="bg-card rounded-xl shadow-md p-6 border border-border">
          <h3 className="font-bold text-foreground mb-4">Background & Heritage</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Current Location</label>
              <input 
                type="text" 
                value={userData.location}
                disabled={!editMode}
                className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Place of Origin</label>
              <input 
                type="text" 
                value={userData.origin}
                disabled={!editMode}
                className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Education</label>
              <input 
                type="text" 
                value={userData.education}
                disabled={!editMode}
                className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Profession</label>
              <input 
                type="text" 
                value={userData.profession}
                disabled={!editMode}
                className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Faith & Values */}
        <div className="bg-card rounded-xl shadow-md p-6 border border-border md:col-span-2">
          <h3 className="font-bold text-foreground mb-4">Faith & Values</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Religious Affiliation</label>
              <select 
                disabled={!editMode}
                className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
              >
                <option>{userData.faith}</option>
                <option>Orthodox Christian</option>
                <option>Catholic</option>
                <option>Protestant</option>
                <option>Muslim</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Faith Importance</label>
              <select 
                disabled={!editMode}
                className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
              >
                <option>Extremely Important</option>
                <option>Very Important</option>
                <option>Moderately Important</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-muted-foreground">About Me</label>
              <textarea 
                disabled={!editMode}
                rows={4}
                className="w-full mt-1 px-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground disabled:opacity-60"
                placeholder="Tell us about yourself, your values, and what you're looking for..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Photos Section */}
      <div className="bg-card rounded-xl shadow-md p-6 border border-border">
        <h3 className="font-bold text-foreground mb-4">Photos (4/6)</h3>
        <div className="grid grid-cols-6 gap-4">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="aspect-square bg-gradient-subtle rounded-xl flex items-center justify-center relative group border border-border">
              <Camera className="w-8 h-8 text-muted-foreground" />
              <button className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          ))}
          {[5, 6].map((idx) => (
            <button key={idx} className="aspect-square border-2 border-dashed border-border rounded-xl flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Messages Tab
  const MessagesTab = () => (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Conversation List */}
      <div className="bg-card rounded-xl shadow-md border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-foreground mb-3">Messages (5)</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border-2 border-input rounded-lg focus:border-primary focus:outline-none bg-background text-foreground"
            />
            <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {[
            { name: 'Michael T.', message: 'Would love to meet for coffee!', time: '2m ago', unread: 2, online: true },
            { name: 'Daniel A.', message: 'Thank you for connecting', time: '1h ago', unread: 0, online: false },
            { name: 'Yohannes M.', message: 'How about this weekend?', time: '3h ago', unread: 1, online: true }
          ].map((conv, idx) => (
            <div key={idx} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-match rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-foreground truncate">{conv.name}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.message}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="md:col-span-2 bg-card rounded-xl shadow-md border border-border flex flex-col" style={{ height: '600px' }}>
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-match rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Michael T.</p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Video className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-3 max-w-xs shadow-sm">
              <p className="text-sm text-foreground">Hi Sara! I really enjoyed reading your profile.</p>
              <p className="text-xs text-muted-foreground mt-1">10:23 AM</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-gradient-primary rounded-2xl rounded-tr-sm p-3 max-w-xs shadow-sm">
              <p className="text-sm text-white">Thank you! I saw you're also in healthcare. Great to connect!</p>
              <p className="text-xs text-white/70 mt-1">10:25 AM</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <input 
              type="text" 
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border-2 border-input rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
            />
            <button className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center hover:shadow-lg transition-all">
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Bookings Tab
  const BookingsTab = () => (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-card rounded-xl shadow-md p-4 border border-border">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">Upcoming</button>
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">Past</button>
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">Cancelled</button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {[
          { 
            type: 'Mentorship Session', 
            with: 'Dr. Abraham K.', 
            date: 'Tomorrow, March 15', 
            time: '3:00 PM - 4:00 PM',
            topic: 'Career Growth Strategy',
            cost: '$75',
            status: 'confirmed'
          },
          { 
            type: 'Video Chat', 
            with: 'Rahel Y.', 
            date: 'Friday, March 17', 
            time: '7:00 PM - 8:00 PM',
            topic: 'First Virtual Date',
            cost: 'Free',
            status: 'pending'
          }
        ].map((booking, idx) => (
          <div key={idx} className="bg-card rounded-xl shadow-md p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-foreground">{booking.type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'confirmed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-1">with <span className="font-semibold text-foreground">{booking.with}</span></p>
                  <p className="text-sm text-muted-foreground">{booking.topic}</p>
                </div>
              </div>
              <p className="font-bold text-2xl text-foreground">{booking.cost}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="font-semibold text-foreground">{booking.date}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Time</p>
                <p className="font-semibold text-foreground">{booking.time}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Join Call
              </button>
              <button className="px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors font-medium text-foreground">
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Booking CTA */}
      <div className="bg-gradient-match rounded-xl p-6 text-white text-center">
        <Calendar className="w-12 h-12 mx-auto mb-3" />
        <h3 className="font-bold text-xl mb-2">Book a Mentorship Session</h3>
        <p className="text-pink-100 mb-4">Connect with experienced mentors for guidance</p>
        <button className="px-6 py-3 bg-white text-primary rounded-lg font-bold hover:shadow-xl transition-all">
          Browse Mentors
        </button>
      </div>
    </div>
  );

  // Subscription Tab
  const SubscriptionTab = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-gradient-match rounded-xl p-8 text-white shadow-elegant">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{userData.subscriptionTier} Plan</h2>
            <p className="text-pink-100">Member since {userData.memberSince}</p>
          </div>
          <Award className="w-16 h-16" />
        </div>
        <p className="text-2xl font-bold mb-1">$29.99/month</p>
        <p className="text-pink-100">Next billing date: April 15, 2025</p>
      </div>

      {/* Plan Features */}
      <div className="bg-card rounded-xl shadow-md p-6 border border-border">
        <h3 className="font-bold text-foreground mb-4">Your Premium Features</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'Unlimited messaging',
            'Video introductions',
            'Verified badge',
            'Profile boost weekly',
            'Advanced matching',
            'See who viewed you',
            'Family review mode',
            'Priority support'
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-card rounded-xl shadow-md p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Billing History</h3>
          <button className="text-primary text-sm font-medium flex items-center hover:underline">
            <Download className="w-4 h-4 mr-1" />
            Download All
          </button>
        </div>
        <div className="space-y-3">
          {[
            { date: 'March 15, 2025', amount: '$29.99', status: 'Paid', invoice: '#INV-2025-03' },
            { date: 'February 15, 2025', amount: '$29.99', status: 'Paid', invoice: '#INV-2025-02' },
            { date: 'January 15, 2025', amount: '$29.99', status: 'Paid', invoice: '#INV-2025-01' }
          ].map((bill, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-semibold text-foreground">{bill.invoice}</p>
                <p className="text-sm text-muted-foreground">{bill.date}</p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="font-bold text-foreground">{bill.amount}</p>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold">
                  {bill.status}
                </span>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-card rounded-xl shadow-md p-6 border border-border">
        <h3 className="font-bold text-foreground mb-4">Payment Method</h3>
        <div className="flex items-center justify-between p-4 border-2 border-border rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Visa ending in 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/2025</p>
            </div>
          </div>
          <button className="px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors font-medium text-foreground">
            Update
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">
          Change Plan
        </button>
        <button className="px-6 py-3 bg-destructive/10 text-destructive rounded-lg font-medium hover:bg-destructive/20 transition-colors">
          Cancel Subscription
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      <Sidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'profile' && 'My Profile'}
            {activeTab === 'matches' && 'My Matches'}
            {activeTab === 'messages' && 'Messages'}
            {activeTab === 'bookings' && 'My Bookings'}
            {activeTab === 'notifications' && 'Notifications'}
            {activeTab === 'subscription' && 'Subscription & Billing'}
            {activeTab === 'settings' && 'Account Settings'}
          </h1>
          <p className="text-muted-foreground">
            {activeTab === 'overview' && 'Welcome to your personal dashboard'}
            {activeTab === 'profile' && 'Manage your profile and personal information'}
            {activeTab === 'messages' && 'Connect with your matches'}
            {activeTab === 'bookings' && 'View and manage your appointments'}
            {activeTab === 'subscription' && 'Manage your subscription and payment details'}
          </p>
        </div>

        {/* Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'bookings' && <BookingsTab />}
        {activeTab === 'subscription' && <SubscriptionTab />}
      </div>
    </div>
  );
};

export default UserDashboard;
