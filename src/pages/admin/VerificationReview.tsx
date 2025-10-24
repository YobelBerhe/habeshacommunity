import { useState } from 'react';
import { 
  CheckCircle, XCircle, Eye, Download, Calendar,
  User, Mail, Phone, Briefcase, DollarSign, Shield,
  Clock, AlertCircle, FileText, Video, ExternalLink,
  MessageSquare, Flag, Search, Filter, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface MentorApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category: string;
  expertise: string;
  yearsExperience: number;
  currentRole: string;
  company: string;
  bio: string;
  hourlyRate: number;
  youtubeIntroVideo?: string;
  idFrontUrl: string;
  idBackUrl: string;
  selfieVideoUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

const VerificationReview = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<MentorApplication[]>([
    // Mock data - In production, fetch from Supabase
    {
      id: '1',
      firstName: 'Daniel',
      lastName: 'Tesfay',
      email: 'daniel.tesfay@gmail.com',
      phone: '+1 (555) 123-4567',
      category: 'Technology & IT',
      expertise: 'Software Engineering',
      yearsExperience: 10,
      currentRole: 'Senior Software Engineer',
      company: 'Google',
      bio: 'Experienced software engineer with 10+ years at top tech companies...',
      hourlyRate: 150,
      youtubeIntroVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      idFrontUrl: '/uploads/id-front-1.jpg',
      idBackUrl: '/uploads/id-back-1.jpg',
      selfieVideoUrl: '/uploads/selfie-video-1.mp4',
      status: 'pending',
      submittedAt: '2024-10-24T10:30:00Z'
    },
    {
      id: '2',
      firstName: 'Sara',
      lastName: 'Woldu',
      email: 'sara.woldu@gmail.com',
      phone: '+1 (555) 987-6543',
      category: 'Business & Entrepreneurship',
      expertise: 'Startup Founder',
      yearsExperience: 8,
      currentRole: 'CEO & Founder',
      company: 'TechStart Eritrea',
      bio: 'Built 3 successful startups, passionate about helping entrepreneurs...',
      hourlyRate: 120,
      youtubeIntroVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      idFrontUrl: '/uploads/id-front-2.jpg',
      idBackUrl: '/uploads/id-back-2.jpg',
      selfieVideoUrl: '/uploads/selfie-video-2.mp4',
      status: 'pending',
      submittedAt: '2024-10-23T14:15:00Z'
    }
  ]);

  const [selectedApplication, setSelectedApplication] = useState<MentorApplication | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      app.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  const handleReviewClick = (application: MentorApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setReviewAction(action);
    setShowReviewDialog(true);
    setRejectionReason('');
  };

  const handleConfirmReview = () => {
    if (!selectedApplication || !reviewAction) return;

    if (reviewAction === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    toast.loading('Processing review...');

    // In production: Update Supabase, send email notification
    setTimeout(() => {
      setApplications(prev => prev.map(app => 
        app.id === selectedApplication.id 
          ? { 
              ...app, 
              status: reviewAction, 
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'Admin',
              rejectionReason: reviewAction === 'reject' ? rejectionReason : undefined
            }
          : app
      ));

      toast.dismiss();
      
      if (reviewAction === 'approve') {
        toast.success('Mentor application approved!', {
          description: `${selectedApplication.firstName} has been notified and can now accept sessions.`
        });
      } else {
        toast.success('Application rejected', {
          description: `${selectedApplication.firstName} has been notified with the reason.`
        });
      }

      setShowReviewDialog(false);
      setSelectedApplication(null);
      setReviewAction(null);
      setRejectionReason('');
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Mentor Verification Review
              </h1>
              <p className="text-base md:text-lg opacity-90">
                Review and approve mentor applications
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/admin')}
            >
              Back to Admin
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold">{pendingCount}</div>
                <div className="text-sm opacity-90">Pending Review</div>
              </div>
            </Card>
            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold">{approvedCount}</div>
                <div className="text-sm opacity-90">Approved</div>
              </div>
            </Card>
            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold">{rejectedCount}</div>
                <div className="text-sm opacity-90">Rejected</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Applications Found</h3>
              <p className="text-muted-foreground">
                {filterStatus === 'pending' 
                  ? 'No pending applications to review'
                  : 'Try adjusting your filters'}
              </p>
            </Card>
          ) : (
            filteredApplications.map((application) => (
              <Card key={application.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                      {application.firstName[0]}{application.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {application.firstName} {application.lastName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {application.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {application.phone}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{application.currentRole}</span>
                        <span className="text-muted-foreground">@ {application.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span>{application.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{application.yearsExperience} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-bold text-green-600">${application.hourlyRate}/hr</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {application.bio}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        ID Uploaded
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Video className="w-3 h-3 mr-1" />
                        Verification Video
                      </Badge>
                      {application.youtubeIntroVideo && (
                        <Badge variant="secondary" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Intro Video
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                      </div>

                      {application.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleReviewClick(application, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleReviewClick(application, 'approve')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Review Confirmation Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve Mentor Application' : 'Reject Application'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve' 
                ? `You are about to approve ${selectedApplication?.firstName} ${selectedApplication?.lastName} as a verified mentor.`
                : `Please provide a reason for rejecting this application.`}
            </DialogDescription>
          </DialogHeader>

          {reviewAction === 'reject' && (
            <div className="py-4">
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Documents not clear, verification video quality issues..."
                className="mt-2"
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReview}
              className={reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {reviewAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detailed View Dialog */}
      {selectedApplication && !showReviewDialog && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review all information submitted by the applicant
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Name:</span> {selectedApplication.firstName} {selectedApplication.lastName}</div>
                    <div><span className="text-muted-foreground">Email:</span> {selectedApplication.email}</div>
                    <div><span className="text-muted-foreground">Phone:</span> {selectedApplication.phone}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Professional Information</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Category:</span> {selectedApplication.category}</div>
                    <div><span className="text-muted-foreground">Expertise:</span> {selectedApplication.expertise}</div>
                    <div><span className="text-muted-foreground">Experience:</span> {selectedApplication.yearsExperience} years</div>
                    <div><span className="text-muted-foreground">Current Role:</span> {selectedApplication.currentRole}</div>
                    <div><span className="text-muted-foreground">Company:</span> {selectedApplication.company}</div>
                    <div><span className="text-muted-foreground">Hourly Rate:</span> ${selectedApplication.hourlyRate}/hr</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">{selectedApplication.bio}</p>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-3">Identity Documents</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h5 className="text-sm font-semibold mb-2">ID Front</h5>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </Card>
                    <Card className="p-4">
                      <h5 className="text-sm font-semibold mb-2">ID Back</h5>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-3">Verification Video</h4>
                  <Card className="p-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                      <Video className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Watch Verification Video
                    </Button>
                  </Card>
                </div>

                {selectedApplication.youtubeIntroVideo && (
                  <div>
                    <h4 className="font-semibold mb-3">Introduction Video</h4>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${selectedApplication.youtubeIntroVideo.split('v=')[1]}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {selectedApplication.status === 'pending' && (
              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowReviewDialog(true);
                    setReviewAction('reject');
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setShowReviewDialog(true);
                    setReviewAction('approve');
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VerificationReview;
