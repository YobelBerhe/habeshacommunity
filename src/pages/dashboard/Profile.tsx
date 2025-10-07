import { useState } from 'react';
import { 
  ArrowLeft, Edit, Save, X, Upload, MapPin, Calendar,
  Briefcase, GraduationCap, Heart, Globe, Mail, Phone,
  Instagram, Facebook, Twitter, Linkedin, CheckCircle,
  Star, Award, TrendingUp, Users, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Michael',
    lastName: 'Tesfay',
    bio: 'Software engineer passionate about building products that help the Habesha community. Love coffee, hiking, and traditional music.',
    location: 'Washington DC, USA',
    email: 'michael@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1995-03-15',
    occupation: 'Software Engineer',
    company: 'Tech Corp',
    education: 'M.S. Computer Science - Stanford University',
    languages: 'Tigrinya, English, Amharic',
    interests: 'Technology, Travel, Music, Food',
    website: 'https://michael.dev',
    instagram: '@michael_tesfay',
    facebook: 'michael.tesfay',
    twitter: '@michaeltesfay',
    linkedin: 'michael-tesfay'
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Save to Supabase
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setIsEditing(false);
  };

  // Profile stats
  const stats = [
    { label: 'Profile Views', value: '1.2K', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Connections', value: '234', icon: Users, color: 'text-green-600' },
    { label: 'Posts', value: '67', icon: MessageCircle, color: 'text-purple-600' },
    { label: 'Rating', value: '4.8', icon: Star, color: 'text-amber-600' }
  ];

  // Activity timeline
  const timeline = [
    {
      type: 'match',
      title: 'New Match',
      description: 'Connected with Sara M.',
      date: '2 days ago',
      icon: Heart,
      color: 'from-pink-500 to-rose-500'
    },
    {
      type: 'mentor',
      title: 'Completed Session',
      description: 'Career guidance with Daniel K.',
      date: '5 days ago',
      icon: Award,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'post',
      title: 'Forum Post',
      description: 'Posted in General Discussion',
      date: '1 week ago',
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  // Reviews/Testimonials
  const reviews = [
    {
      id: '1',
      author: 'Sara M.',
      avatar: 'SM',
      rating: 5,
      text: 'Great conversation and very respectful. Highly recommend!',
      date: '1 week ago',
      type: 'Match'
    },
    {
      id: '2',
      author: 'Daniel K.',
      avatar: 'DK',
      rating: 5,
      text: 'Excellent mentee. Prepared, engaged, and took action on advice.',
      date: '2 weeks ago',
      type: 'Mentor'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-4xl font-bold">
                    MT
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                )}
                <div className="absolute top-0 right-0">
                  <Badge className="bg-blue-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-1">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-muted-foreground mb-4">{formData.occupation}</p>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                {formData.location}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                      <div className="font-bold text-lg">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Social Links</h3>
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Instagram</Label>
                    <Input
                      value={formData.instagram}
                      onChange={(e) => updateFormData('instagram', e.target.value)}
                      placeholder="@username"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Facebook</Label>
                    <Input
                      value={formData.facebook}
                      onChange={(e) => updateFormData('facebook', e.target.value)}
                      placeholder="username"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Twitter</Label>
                    <Input
                      value={formData.twitter}
                      onChange={(e) => updateFormData('twitter', e.target.value)}
                      placeholder="@username"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">LinkedIn</Label>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => updateFormData('linkedin', e.target.value)}
                      placeholder="username"
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.instagram && (
                    <a href="#" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Instagram className="w-4 h-4" />
                      {formData.instagram}
                    </a>
                  )}
                  {formData.facebook && (
                    <a href="#" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Facebook className="w-4 h-4" />
                      {formData.facebook}
                    </a>
                  )}
                  {formData.twitter && (
                    <a href="#" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Twitter className="w-4 h-4" />
                      {formData.twitter}
                    </a>
                  )}
                  {formData.linkedin && (
                    <a href="#" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Linkedin className="w-4 h-4" />
                      {formData.linkedin}
                    </a>
                  )}
                </div>
              )}
            </Card>

            {/* Quick Info */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined January 2024
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {formData.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  Speaks {formData.languages}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="about">
              <TabsList className="w-full">
                <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
                <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">About Me</h3>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => updateFormData('bio', e.target.value)}
                      placeholder="Write about yourself..."
                      className="min-h-[120px]"
                    />
                  ) : (
                    <p className="text-muted-foreground">{formData.bio}</p>
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData('phone', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Location</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Professional Information</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Occupation</Label>
                        <Input
                          value={formData.occupation}
                          onChange={(e) => updateFormData('occupation', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={formData.company}
                          onChange={(e) => updateFormData('company', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Education</Label>
                      <Input
                        value={formData.education}
                        onChange={(e) => updateFormData('education', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Website</Label>
                      <Input
                        type="url"
                        value={formData.website}
                        onChange={(e) => updateFormData('website', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="https://"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Interests & Languages</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Languages</Label>
                      <Input
                        value={formData.languages}
                        onChange={(e) => updateFormData('languages', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="e.g., Tigrinya, English, Amharic"
                      />
                    </div>

                    <div>
                      <Label>Interests</Label>
                      <Input
                        value={formData.interests}
                        onChange={(e) => updateFormData('interests', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                        placeholder="e.g., Technology, Travel, Music"
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {timeline.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 border-b pb-4 last:border-0">
                            <h4 className="font-bold mb-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-12 h-12 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white font-bold">
                          {review.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold">{review.author}</h4>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                          <Badge variant="secondary">{review.type}</Badge>
                        </div>
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.text}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
