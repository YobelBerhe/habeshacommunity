import { useState } from 'react';
import { 
  Shield, UserPlus, Search, MoreVertical, Crown,
  CheckCircle, XCircle, AlertCircle, Mail, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'ceo' | 'admin' | 'moderator';
  assignedBy: string;
  assignedAt: string;
  lastActive: string;
  actionsCount: number;
}

const RoleManagement = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'You (CEO)',
      email: 'ceo@habeshacommunity.com',
      avatar: 'CEO',
      role: 'ceo',
      assignedBy: 'System',
      assignedAt: '2024-01-01',
      lastActive: '2024-10-24',
      actionsCount: 1250
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'moderator'>('moderator');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ceo': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'moderator': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'ceo') return <Crown className="w-4 h-4" />;
    if (role === 'admin') return <Shield className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail) {
      toast.error('Please enter an email address');
      return;
    }

    // In production: Verify user exists, send invitation email
    toast.loading('Sending invitation...');

    setTimeout(() => {
      toast.dismiss();
      toast.success('Invitation sent!', {
        description: `${newAdminEmail} will receive an email to accept the ${newAdminRole} role.`
      });

      setShowAddDialog(false);
      setNewAdminEmail('');
      setNewAdminRole('moderator');
    }, 1500);
  };

  const handleRemoveRole = (adminId: string) => {
    const admin = admins.find(a => a.id === adminId);
    if (admin?.role === 'ceo') {
      toast.error('Cannot remove CEO role');
      return;
    }

    toast.loading('Removing admin access...');

    setTimeout(() => {
      setAdmins(prev => prev.filter(a => a.id !== adminId));
      toast.dismiss();
      toast.success('Admin access revoked');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Role Management
                </h1>
                <p className="text-base md:text-lg opacity-90">
                  Manage admin access and permissions (CEO Only)
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowAddDialog(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {admins.filter(a => a.role === 'ceo').length}
                </div>
                <div className="text-sm opacity-90">CEO</div>
              </div>
            </Card>
            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {admins.filter(a => a.role === 'admin').length}
                </div>
                <div className="text-sm opacity-90">Admins</div>
              </div>
            </Card>
            <Card className="p-4 bg-white/10 backdrop-blur border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {admins.filter(a => a.role === 'moderator').length}
                </div>
                <div className="text-sm opacity-90">Moderators</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Card className="p-6">
          <div className="space-y-4">
            {admins.map((admin) => (
              <Card key={admin.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                        {admin.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{admin.name}</h3>
                        <Badge className={getRoleColor(admin.role)}>
                          {getRoleIcon(admin.role)}
                          <span className="ml-1">{admin.role.toUpperCase()}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {admin.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Last active: {admin.lastActive}
                        </div>
                      </div>
                    </div>
                  </div>

                  {admin.role !== 'ceo' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleRemoveRole(admin.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Remove Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Permissions Reference */}
        <Card className="p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">Role Permissions Reference</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  CEO
                </Badge>
                <span className="text-sm font-semibold">Full Access</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ✅ All permissions including role management, user deletion, and system settings
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
                <span className="text-sm font-semibold">Most Access</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ✅ Approve mentors, manage users, handle payments, view reports
                <br />
                ❌ Cannot manage roles or delete users permanently
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Moderator
                </Badge>
                <span className="text-sm font-semibold">Limited Access</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ✅ View applications, moderate content, view basic analytics
                <br />
                ❌ Cannot approve/reject or access payment information
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Invite someone to help manage Habesha Community
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email Address</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Select value={newAdminRole} onValueChange={(value: any) => setNewAdminRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moderator">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Moderator - Limited access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Admin - Full access (except roles)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  They will receive an email invitation to accept this role. You can revoke access anytime.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin}>
              <UserPlus className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
