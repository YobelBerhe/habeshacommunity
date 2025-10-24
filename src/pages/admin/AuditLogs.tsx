import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Shield, User, Ban, CheckCircle, XCircle, Clock,
  Filter, Download, Eye, Search, Calendar, AlertCircle,
  FileText, Award, DollarSign, Flag, Mail, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  action: string;
  category: 'user' | 'mentor' | 'payment' | 'content' | 'system' | 'security';
  description: string;
  adminUser: {
    name: string;
    role: string;
    avatar: string;
  };
  targetUser?: {
    name: string;
    email: string;
  };
  metadata?: Record<string, any>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: '1',
      action: 'MENTOR_APPROVED',
      category: 'mentor',
      description: 'Approved mentor verification application',
      adminUser: {
        name: 'Admin User',
        role: 'admin',
        avatar: 'AU'
      },
      targetUser: {
        name: 'Daniel Tesfay',
        email: 'daniel@example.com'
      },
      metadata: {
        applicationId: 'APP-001',
        approvalReason: 'All documents verified'
      },
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...'
    },
    {
      id: '2',
      action: 'USER_BANNED',
      category: 'security',
      description: 'Banned user for violating community guidelines',
      adminUser: {
        name: 'Admin User',
        role: 'admin',
        avatar: 'AU'
      },
      targetUser: {
        name: 'Spam User',
        email: 'spam@example.com'
      },
      metadata: {
        banReason: 'Repeated spam posting',
        duration: 'permanent'
      },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ipAddress: '192.168.1.1'
    },
    {
      id: '3',
      action: 'REFUND_PROCESSED',
      category: 'payment',
      description: 'Processed refund for dispute',
      adminUser: {
        name: 'Admin User',
        role: 'admin',
        avatar: 'AU'
      },
      targetUser: {
        name: 'Sara Woldu',
        email: 'sara@example.com'
      },
      metadata: {
        disputeId: 'DIS-123',
        amount: 150,
        reason: 'Service not delivered'
      },
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      ipAddress: '192.168.1.1'
    },
    {
      id: '4',
      action: 'ROLE_CHANGED',
      category: 'user',
      description: 'Changed user role from User to Moderator',
      adminUser: {
        name: 'CEO',
        role: 'ceo',
        avatar: 'CE'
      },
      targetUser: {
        name: 'Meron Kidane',
        email: 'meron@example.com'
      },
      metadata: {
        previousRole: 'user',
        newRole: 'moderator'
      },
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      ipAddress: '192.168.1.2'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminUser.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user': return <User className="w-4 h-4" />;
      case 'mentor': return <Award className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'content': return <FileText className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'mentor': return 'bg-amber-100 text-amber-800';
      case 'payment': return 'bg-green-100 text-green-800';
      case 'content': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Admin', 'Action', 'Category', 'Target User', 'Description'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.adminUser.name,
        log.action,
        log.category,
        log.targetUser?.name || '-',
        `"${log.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success('Audit logs exported successfully!');
  };

  const stats = {
    total: logs.length,
    user: logs.filter(l => l.category === 'user').length,
    mentor: logs.filter(l => l.category === 'mentor').length,
    payment: logs.filter(l => l.category === 'payment').length,
    security: logs.filter(l => l.category === 'security').length
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Audit Logs
          </h1>
          <p className="text-gray-600">
            Track all administrative actions and system events
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Total Logs</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.user}</p>
              <p className="text-xs text-gray-600">User Actions</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.mentor}</p>
              <p className="text-xs text-gray-600">Mentor Actions</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.payment}</p>
              <p className="text-xs text-gray-600">Payments</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.security}</p>
              <p className="text-xs text-gray-600">Security</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportLogs} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>

        {/* Logs List */}
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Logs Found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </Card>
          ) : (
            filteredLogs.map((log) => (
              <Card key={log.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(log.category)}`}>
                    {getCategoryIcon(log.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm">{log.description}</h4>
                          <Badge className={getCategoryColor(log.category)} variant="secondary">
                            {log.category}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            <span className="font-semibold">{log.adminUser.name}</span>
                            <span className="text-gray-400">({log.adminUser.role})</span>
                          </div>
                          
                          {log.targetUser && (
                            <>
                              <span className="text-gray-400">→</span>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{log.targetUser.name}</span>
                              </div>
                            </>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                        </div>

                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs">
                            <span className="text-gray-500 font-semibold">Details: </span>
                            {Object.entries(log.metadata).map(([key, value]) => (
                              <span key={key} className="mr-3">
                                <span className="text-gray-600">{key}:</span>{' '}
                                <span className="font-semibold">{String(value)}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {log.ipAddress && (
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Info Card */}
        <Card className="p-6 mt-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold mb-1">Audit Log Retention Policy</p>
              <p className="text-xs">
                All administrative actions are logged and retained for 2 years for compliance and security purposes.
                Logs are encrypted and stored securely.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
