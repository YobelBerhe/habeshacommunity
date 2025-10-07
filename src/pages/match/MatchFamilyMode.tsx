import { useState, useEffect } from 'react';
import { 
  Heart, Users, MessageCircle, ThumbsUp, ThumbsDown, Share2, 
  Mail, ArrowLeft, Eye, Star, CheckCircle, Clock, Send,
  UserPlus, Settings, Info, Sparkles, AlertCircle, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone?: string;
  status: 'pending' | 'active';
  hasVoted: boolean;
  vote?: 'approve' | 'decline' | 'needs-discussion';
  comment?: string;
  votedAt?: string;
}

interface SharedProfile {
  id: string;
  profileId: string;
  name: string;
  age: number;
  location: string;
  origin: string;
  profession: string;
  education: string;
  faith: string;
  compatibility: number;
  sharedAt: string;
  status: 'pending' | 'approved' | 'declined' | 'discussing';
  approvalCount: number;
  declineCount: number;
  totalVotes: number;
  requiredVotes: number;
  viewCount: number;
}

const MatchFamilyMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('shared');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [sharedProfiles, setSharedProfiles] = useState<SharedProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<SharedProfile | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Demo data
  const demoFamilyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'Aisha Desta (Mother)',
      relationship: 'Mother',
      email: 'aisha@example.com',
      phone: '+1 202-555-0123',
      status: 'active',
      hasVoted: true,
      vote: 'approve',
      comment: 'She seems like a wonderful person with strong faith. I would love to meet her.',
      votedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Solomon Desta (Father)',
      relationship: 'Father',
      email: 'solomon@example.com',
      phone: '+1 202-555-0124',
      status: 'active',
      hasVoted: true,
      vote: 'needs-discussion',
      comment: 'Good background and education. Would like to know more about her family.',
      votedAt: '2024-01-15T11:45:00Z'
    },
    {
      id: '3',
      name: 'Ruth Desta (Sister)',
      relationship: 'Sister',
      email: 'ruth@example.com',
      status: 'active',
      hasVoted: false
    },
    {
      id: '4',
      name: 'Elder Tesfaye',
      relationship: 'Family Friend',
      email: 'tesfaye@example.com',
      status: 'pending',
      hasVoted: false
    }
  ];

  const demoSharedProfiles: SharedProfile[] = [
    {
      id: '1',
      profileId: '1',
      name: 'Sara Desta',
      age: 27,
      location: 'Washington DC',
      origin: 'Addis Ababa',
      profession: 'Healthcare Administrator',
      education: 'Masters in Public Health',
      faith: 'Orthodox Christian',
      compatibility: 92,
      sharedAt: '2024-01-15T09:00:00Z',
      status: 'discussing',
      approvalCount: 1,
      declineCount: 0,
      totalVotes: 2,
      requiredVotes: 3,
      viewCount: 3
    },
    {
      id: '2',
      profileId: '2',
      name: 'Rahel Yohannes',
      age: 25,
      location: 'Toronto',
      origin: 'Mekelle',
      profession: 'Elementary Teacher',
      education: 'BA Education',
      faith: 'Protestant Christian',
      compatibility: 95,
      sharedAt: '2024-01-14T15:00:00Z',
      status: 'approved',
      approvalCount: 3,
      declineCount: 0,
      totalVotes: 3,
      requiredVotes: 3,
      viewCount: 4
    },
    {
      id: '3',
      profileId: '3',
      name: 'Meron Kidane',
      age: 26,
      location: 'Atlanta',
      origin: 'Asmara',
      profession: 'Nurse',
      education: 'BSN Nursing',
      faith: 'Catholic',
      compatibility: 88,
      sharedAt: '2024-01-13T10:00:00Z',
      status: 'pending',
      approvalCount: 0,
      declineCount: 0,
      totalVotes: 0,
      requiredVotes: 3,
      viewCount: 1
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // TODO: Replace with real Supabase query
      setFamilyMembers(demoFamilyMembers);
      setSharedProfiles(demoSharedProfiles);

      // If id is provided, find and select that profile
      if (id) {
        const profile = demoSharedProfiles.find(p => p.profileId === id);
        if (profile) {
          setSelectedProfile(profile);
          setActiveTab('details');
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'declined': return 'bg-gradient-to-r from-red-500 to-rose-500';
      case 'discussing': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'declined': return ThumbsDown;
      case 'discussing': return MessageCircle;
      default: return Clock;
    }
  };

  const getVoteIcon = (vote?: string) => {
    switch (vote) {
      case 'approve': return ThumbsUp;
      case 'decline': return ThumbsDown;
      case 'needs-discussion': return MessageCircle;
      default: return null;
    }
  };

  const handleInviteMember = (formData: any) => {
    toast.success('Invitation sent!', {
      description: `${formData.name} will receive an email invitation`
    });
    setShowInviteDialog(false);
  };

  const handleShareProfile = () => {
    toast.success('Profile shared!', {
      description: 'Family members have been notified'
    });
    setShowShareDialog(false);
  };

  const handleViewFullProfile = (profileId: string) => {
    navigate(`/match/profile/${profileId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Family Mode</h1>
                <p className="text-xs text-muted-foreground">
                  {familyMembers.filter(m => m.status === 'active').length} family members
                </p>
              </div>
            </div>

            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share a Profile</DialogTitle>
                </DialogHeader>
                <ShareProfileForm onSubmit={handleShareProfile} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Info Banner */}
        <Card className="p-4 mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">How Family Mode Works</h3>
              <p className="text-sm text-muted-foreground">
                Share potential matches with your family for their input. You decide who to invite and 
                their feedback helps you make informed decisions. All information is kept private within your family circle.
              </p>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shared">
              Shared Profiles ({sharedProfiles.length})
            </TabsTrigger>
            <TabsTrigger value="family">
              Family Members ({familyMembers.length})
            </TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedProfile}>
              Details
            </TabsTrigger>
          </TabsList>

          {/* Shared Profiles Tab */}
          <TabsContent value="shared" className="mt-6">
            {sharedProfiles.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Profiles Shared Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by sharing potential matches with your family for their input
                </p>
                <Button
                  onClick={() => setShowShareDialog(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Your First Profile
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {sharedProfiles.map((profile) => {
                  const StatusIcon = getStatusIcon(profile.status);
                  const progressPercentage = (profile.totalVotes / profile.requiredVotes) * 100;

                  return (
                    <Card 
                      key={profile.id} 
                      className="overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedProfile(profile);
                        setActiveTab('details');
                      }}
                    >
                      {/* Header with Status */}
                      <div className={`${getStatusColor(profile.status)} text-white p-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="w-5 h-5" />
                            <span className="font-bold capitalize">{profile.status.replace('-', ' ')}</span>
                          </div>
                          <Badge className="bg-white/20 text-white hover:bg-white/30">
                            {profile.compatibility}% Match
                          </Badge>
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="p-5 space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-2xl font-bold">{profile.name}, {profile.age}</h3>
                            {profile.status === 'approved' && (
                              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm">{profile.location}</p>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Origin</p>
                            <p className="text-sm font-semibold">{profile.origin}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Faith</p>
                            <p className="text-sm font-semibold">{profile.faith}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Profession</p>
                            <p className="text-sm font-semibold truncate">{profile.profession}</p>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Education</p>
                            <p className="text-sm font-semibold truncate">{profile.education}</p>
                          </div>
                        </div>

                        {/* Voting Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">Family Feedback</span>
                            <span className="text-sm text-muted-foreground">
                              {profile.totalVotes}/{profile.requiredVotes} votes
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Vote Summary */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="font-semibold">{profile.approvalCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                              <span className="font-semibold">{profile.declineCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="font-semibold">{profile.viewCount}</span>
                            </div>
                          </div>

                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewFullProfile(profile.profileId);
                            }}
                          >
                            View Full Profile
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Family Members Tab */}
          <TabsContent value="family" className="mt-6">
            <div className="mb-6">
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Family Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Family Member</DialogTitle>
                  </DialogHeader>
                  <InviteFamilyForm onSubmit={handleInviteMember} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {familyMembers.map((member) => {
                const VoteIcon = member.vote ? getVoteIcon(member.vote) : null;
                
                return (
                  <Card key={member.id} className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.relationship}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                              {member.status}
                            </Badge>
                            {member.hasVoted && (
                              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Voted
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Latest Vote */}
                    {member.hasVoted && member.vote && VoteIcon && (
                      <div className={`
                        p-3 rounded-lg border-2
                        ${member.vote === 'approve' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : ''}
                        ${member.vote === 'decline' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : ''}
                        ${member.vote === 'needs-discussion' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' : ''}
                      `}>
                        <div className="flex items-center space-x-2 mb-2">
                          <VoteIcon className="w-4 h-4" />
                          <span className="font-semibold text-sm capitalize">
                            {member.vote.replace('-', ' ')}
                          </span>
                        </div>
                        {member.comment && (
                          <p className="text-sm text-foreground italic">"{member.comment}"</p>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Privacy Notice */}
            <Card className="p-4 mt-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Privacy & Security</h4>
                  <p className="text-sm text-muted-foreground">
                    Only people you invite can see shared profiles. You can remove family members at any time. 
                    All votes and comments are visible to you and other family members in this circle.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Profile Details Tab */}
          <TabsContent value="details" className="mt-6">
            {selectedProfile ? (
              <div className="space-y-6">
                {/* Profile Summary Card */}
                <Card className="overflow-hidden">
                  <div className={`${getStatusColor(selectedProfile.status)} text-white p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">{selectedProfile.name}, {selectedProfile.age}</h2>
                      <Badge className="bg-white/20 text-white">
                        <Sparkles className="w-4 h-4 mr-1" />
                        {selectedProfile.compatibility}% Match
                      </Badge>
                    </div>
                    <p className="opacity-90">{selectedProfile.location}</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Origin</p>
                        <p className="font-semibold">{selectedProfile.origin}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Faith</p>
                        <p className="font-semibold">{selectedProfile.faith}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Profession</p>
                        <p className="font-semibold">{selectedProfile.profession}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleViewFullProfile(selectedProfile.profileId)}
                      className="w-full"
                      variant="outline"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Complete Profile
                    </Button>
                  </div>
                </Card>

                {/* Family Feedback */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Family Feedback
                  </h3>

                  {/* Vote Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                      <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                        {selectedProfile.approvalCount}
                      </div>
                      <p className="text-sm text-muted-foreground">Approve</p>
                    </div>

                    <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                      <MessageCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                        {selectedProfile.totalVotes - selectedProfile.approvalCount - selectedProfile.declineCount}
                      </div>
                      <p className="text-sm text-muted-foreground">Discuss</p>
                    </div>

                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                      <ThumbsDown className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-red-700 dark:text-red-300">
                        {selectedProfile.declineCount}
                      </div>
                      <p className="text-sm text-muted-foreground">Decline</p>
                    </div>
                  </div>

                  {/* Individual Comments */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Comments & Feedback</h4>
                    {familyMembers
                      .filter(m => m.hasVoted && m.comment)
                      .map((member) => {
                        const VoteIcon = member.vote ? getVoteIcon(member.vote) : null;
                        
                        return (
                          <div key={member.id} className="border border-border rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold">
                                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.relationship}</p>
                                  </div>
                                  {VoteIcon && (
                                    <Badge className={`
                                      ${member.vote === 'approve' ? 'bg-green-500' : ''}
                                      ${member.vote === 'decline' ? 'bg-red-500' : ''}
                                      ${member.vote === 'needs-discussion' ? 'bg-amber-500' : ''}
                                      text-white
                                    `}>
                                      <VoteIcon className="w-3 h-3 mr-1" />
                                      {member.vote?.replace('-', ' ')}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-foreground">{member.comment}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(member.votedAt || '').toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    {familyMembers.filter(m => !m.hasVoted && m.status === 'active').length > 0 && (
                      <Card className="p-4 bg-muted/50">
                        <p className="text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Waiting for feedback from {familyMembers.filter(m => !m.hasVoted && m.status === 'active').length} family member(s)
                        </p>
                      </Card>
                    )}
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(`/inbox?user=${selectedProfile.profileId}`)}
                    disabled={selectedProfile.status !== 'approved'}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => navigate(`/match/profile/${selectedProfile.profileId}`)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Select a profile to view details</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Invite Family Form Component
const InviteFamilyForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.relationship || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Full name"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="relationship">Relationship *</Label>
        <Select value={formData.relationship} onValueChange={(value) => setFormData({ ...formData, relationship: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mother">Mother</SelectItem>
            <SelectItem value="father">Father</SelectItem>
            <SelectItem value="sister">Sister</SelectItem>
            <SelectItem value="brother">Brother</SelectItem>
            <SelectItem value="aunt">Aunt</SelectItem>
            <SelectItem value="uncle">Uncle</SelectItem>
            <SelectItem value="family-friend">Family Friend</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@example.com"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
          className="mt-1"
        />
      </div>

      <Button type="submit" className="w-full">
        <Send className="w-4 h-4 mr-2" />
        Send Invitation
      </Button>
    </form>
  );
};

// Share Profile Form Component
const ShareProfileForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const [selectedProfile, setSelectedProfile] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) {
      toast.error('Please select a profile to share');
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Select Profile to Share *</Label>
        <Select value={selectedProfile} onValueChange={setSelectedProfile}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Choose a match" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Sara Desta - 92% Match</SelectItem>
            <SelectItem value="2">Rahel Yohannes - 95% Match</SelectItem>
            <SelectItem value="3">Meron Kidane - 88% Match</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a note for your family..."
          className="mt-1 min-h-[100px]"
        />
      </div>

      <Button type="submit" className="w-full">
        <Share2 className="w-4 h-4 mr-2" />
        Share with Family
      </Button>
    </form>
  );
};

export default MatchFamilyMode;
