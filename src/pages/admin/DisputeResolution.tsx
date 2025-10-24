import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  AlertTriangle, CheckCircle, XCircle, Clock, DollarSign,
  MessageSquare, Eye, FileText, Calendar, User, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Dispute {
  id: string;
  type: 'refund' | 'service_not_delivered' | 'quality_issue' | 'payment_hold';
  status: 'pending' | 'investigating' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  mentee: {
    name: string;
    email: string;
    avatar: string;
  };
  mentor: {
    name: string;
    email: string;
    avatar: string;
  };
  bookingId: string;
  amount: number;
  sessionDate: string;
  description: string;
  evidence?: string[];
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export default function DisputeResolution() {
  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: '1',
      type: 'service_not_delivered',
      status: 'pending',
      priority: 'high',
      mentee: {
        name: 'Sara Woldu',
        email: 'sara@example.com',
        avatar: 'SW'
      },
      mentor: {
        name: 'Daniel Tesfay',
        email: 'daniel@example.com',
        avatar: 'DT'
      },
      bookingId: 'BK-12345',
      amount: 150,
      sessionDate: '2024-10-20T14:00:00Z',
      description: 'Mentor did not show up for scheduled session. I waited 30 minutes.',
      evidence: ['screenshot1.jpg', 'email_confirmation.pdf'],
      createdAt: '2024-10-20T14:35:00Z'
    },
    {
      id: '2',
      type: 'quality_issue',
      status: 'investigating',
      priority: 'medium',
      mentee: {
        name: 'Meron Kidane',
        email: 'meron@example.com',
        avatar: 'MK'
      },
      mentor: {
        name: 'Haben Ghebru',
        email: 'haben@example.com',
        avatar: 'HG'
      },
      bookingId: 'BK-12346',
      amount: 100,
      sessionDate: '2024-10-21T10:00:00Z',
      description: 'Session was rushed and did not cover agreed topics.',
      createdAt: '2024-10-21T11:00:00Z'
    }
  ]);

  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolution, setResolution] = useState('');
  const [resolveAction, setResolveAction] = useState<'refund' | 'reject'>('refund');

  const handleResolve = async () => {
    if (!selectedDispute || !resolution.trim()) {
      toast.error('Please provide a resolution note');
      return;
    }

    toast.loading('Processing dispute resolution...');

    // In production: Update Supabase, process refund, send emails
    setTimeout(() => {
      setDisputes(prev => prev.map(d => 
        d.id === selectedDispute.id 
          ? { 
              ...d, 
              status: resolveAction === 'refund' ? 'resolved' : 'rejected',
              resolvedAt: new Date().toISOString(),
              resolution: resolution
            }
          : d
      ));

      toast.dismiss();
      
      if (resolveAction === 'refund') {
        toast.success('Dispute resolved - Refund processed', {
          description: 'Both parties have been notified'
        });
      } else {
        toast.success('Dispute rejected', {
          description: 'User has been notified of the decision'
        });
      }

      setShowResolveDialog(false);
      setSelectedDispute(null);
      setResolution('');
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'refund': return 'Refund Request';
      case 'service_not_delivered': return 'Service Not Delivered';
      case 'quality_issue': return 'Quality Issue';
      case 'payment_hold': return 'Payment Hold';
      default: return type;
    }
  };

  const pendingCount = disputes.filter(d => d.status === 'pending').length;
  const investigatingCount = disputes.filter(d => d.status === 'investigating').length;
  const resolvedCount = disputes.filter(d => d.status === 'resolved').length;

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Dispute Resolution
          </h1>
          <p className="text-gray-600">
            Handle payment disputes and service complaints
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{investigatingCount}</div>
              <div className="text-sm text-gray-600">Investigating</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{resolvedCount}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
          </Card>
        </div>

        {/* Disputes List */}
        <div className="space-y-4">
          {disputes.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Active Disputes</h3>
              <p className="text-gray-600">All disputes have been resolved</p>
            </Card>
          ) : (
            disputes.map((dispute) => (
              <Card key={dispute.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{getTypeLabel(dispute.type)}</h3>
                        <Badge className={getPriorityColor(dispute.priority)}>
                          {dispute.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{dispute.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Mentee</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-500 text-white text-xs">
                                {dispute.mentee.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold">{dispute.mentee.name}</p>
                              <p className="text-xs text-gray-500">{dispute.mentee.email}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Mentor</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-purple-500 text-white text-xs">
                                {dispute.mentor.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold">{dispute.mentor.name}</p>
                              <p className="text-xs text-gray-500">{dispute.mentor.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">${dispute.amount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(dispute.sessionDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Opened {new Date(dispute.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {dispute.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDispute(dispute);
                          setShowResolveDialog(true);
                          setResolveAction('reject');
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedDispute(dispute);
                          setShowResolveDialog(true);
                          setResolveAction('refund');
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resolve & Refund
                      </Button>
                    </div>
                  )}
                </div>

                {dispute.evidence && dispute.evidence.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-600 mb-2">Evidence Provided:</p>
                    <div className="flex gap-2">
                      {dispute.evidence.map((file, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resolveAction === 'refund' ? 'Resolve Dispute with Refund' : 'Reject Dispute'}
            </DialogTitle>
            <DialogDescription>
              {resolveAction === 'refund' 
                ? `Process a $${selectedDispute?.amount} refund to ${selectedDispute?.mentee.name}`
                : `Reject the dispute claim from ${selectedDispute?.mentee.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Resolution Notes *
            </label>
            <Textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder={
                resolveAction === 'refund'
                  ? 'Explain why the refund is being processed...'
                  : 'Explain why the dispute is being rejected...'
              }
              rows={4}
            />

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                {resolveAction === 'refund' 
                  ? '✅ Refund will be processed within 5-7 business days. Both parties will be notified.'
                  : '❌ The mentee will be notified of the rejection and can appeal if needed.'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleResolve}
              className={resolveAction === 'refund' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {resolveAction === 'refund' ? 'Process Refund' : 'Reject Dispute'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
