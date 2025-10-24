import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import { 
  Search, Filter, Download, Eye, Edit, MoreVertical, User,
  Shield, Ban, CheckCircle, XCircle, Mail, Phone, MapPin,
  Calendar, Award, Crown, AlertCircle, UserX, Lock, Unlock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  display_name: string;
  email?: string; // Email comes from auth.users, not profiles
  avatar_url?: string;
  bio?: string;
  city?: string;
  country?: string;
  created_at: string;
  role?: 'user' | 'mentor' | 'moderator' | 'admin' | 'ceo';
  is_verified?: boolean;
  is_banned?: boolean;
  last_active?: string;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [newRole, setNewRole] = useState<string>('user');
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'verified' && user.is_verified) ||
      (filterStatus === 'banned' && user.is_banned) ||
      (filterStatus === 'active' && !user.is_banned);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleChangeRole = async () => {
    if (!selectedUser) return;

    toast.loading('Updating user role...');

    // In production: Update Supabase
    setTimeout(() => {
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, role: newRole as any } : u
      ));
      
      toast.dismiss();
      toast.success('Role updated successfully!');
      setShowRoleDialog(false);
      setSelectedUser(null);
    }, 1000);
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      toast.error('Please provide a ban reason');
      return;
    }

    toast.loading('Processing ban...');

    // In production: Update Supabase, send email notification
    setTimeout(() => {
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, is_banned: true } : u
      ));
      
      toast.dismiss();
      toast.success('User banned successfully');
      setShowBanDialog(false);
      setSelectedUser(null);
      setBanReason('');
    }, 1000);
  };

  const handleUnbanUser = async (user: UserProfile) => {
    toast.loading('Unbanning user...');

    // In production: Update Supabase
    setTimeout(() => {
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, is_banned: false } : u
      ));
      
      toast.dismiss();
      toast.success('User unbanned successfully');
    }, 1000);
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ceo':
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"><Crown className="w-3 h-3 mr-1" />CEO</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-green-100 text-green-800"><Shield className="w-3 h-3 mr-1" />Moderator</Badge>;
      case 'mentor':
        return <Badge className="bg-amber-100 text-amber-800"><Award className="w-3 h-3 mr-1" />Mentor</Badge>;
      default:
        return <Badge variant="secondary"><User className="w-3 h-3 mr-1" />User</Badge>;
    }
  };

  const exportUsers = () => {
    // Convert to CSV
    const csv = [
      ['Name', 'Email', 'Role', 'Location', 'Joined', 'Status'].join(','),
      ...filteredUsers.map(u => [
        u.display_name || 'Anonymous',
        u.email || '',
        u.role || 'user',
        `${u.city || ''} ${u.country || ''}`.trim() || '-',
        new Date(u.created_at).toLocaleDateString(),
        u.is_banned ? 'Banned' : 'Active'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success('Users exported successfully!');
  };

  const stats = {
    total: users.length,
    active: users.filter(u => !u.is_banned).length,
    banned: users.filter(u => u.is_banned).length,
    verified: users.filter(u => u.is_verified).length,
    mentors: users.filter(u => u.role === 'mentor').length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'ceo').length
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">
            Manage all registered users, roles, and permissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Total Users</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-gray-600">Active</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.banned}</p>
              <p className="text-xs text-gray-600">Banned</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.verified}</p>
              <p className="text-xs text-gray-600">Verified</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.mentors}</p>
              <p className="text-xs text-gray-600">Mentors</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              <p className="text-xs text-gray-600">Admins</p>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="mentor">Mentors</SelectItem>
                <SelectItem value="moderator">Moderators</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="ceo">CEO</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportUsers} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>

        {/* Users Table - Desktop */}
        <div className="hidden lg:block">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">User</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Location</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Joined</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              {user.avatar_url ? (
                                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white font-bold">
                                  {user.display_name?.[0] || 'U'}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{user.display_name || 'Anonymous'}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.city && user.country ? `${user.city}, ${user.country}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {user.is_banned ? (
                            <Badge variant="destructive">
                              <Ban className="w-3 h-3 mr-1" />
                              Banned
                            </Badge>
                          ) : user.is_verified ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Active</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setShowUserDetail(true);
                              }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setNewRole(user.role || 'user');
                                setShowRoleDialog(true);
                              }}>
                                <Shield className="w-4 h-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.is_banned ? (
                                <DropdownMenuItem 
                                  onClick={() => handleUnbanUser(user)}
                                  className="text-green-600"
                                >
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Unban User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowBanDialog(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Ban User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Users Grid - Mobile */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <Card className="p-6 text-center text-gray-500">Loading users...</Card>
          ) : filteredUsers.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">No users found</Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <Avatar className="w-12 h-12">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white font-bold">
                        {user.display_name?.[0] || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {user.display_name || 'Anonymous'}
                      </p>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {user.city && user.country ? `${user.city}, ${user.country}` : 'Location not set'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {user.is_banned ? (
                    <Badge variant="destructive" className="text-xs">
                      <Ban className="w-3 h-3 mr-1" />
                      Banned
                    </Badge>
                  ) : user.is_verified ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserDetail(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedUser(user);
                      setNewRole(user.role || 'user');
                      setShowRoleDialog(true);
                    }}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Role
                  </Button>
                  {user.is_banned ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-green-600"
                      onClick={() => handleUnbanUser(user)}
                    >
                      <Unlock className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowBanDialog(true);
                      }}
                    >
                      <Ban className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={showUserDetail} onOpenChange={setShowUserDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  {selectedUser.avatar_url ? (
                    <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-2xl font-bold">
                      {selectedUser.display_name?.[0] || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedUser.display_name || 'Anonymous'}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    {selectedUser.is_verified && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Location</p>
                  <p className="font-semibold">
                    {selectedUser.city && selectedUser.country 
                      ? `${selectedUser.city}, ${selectedUser.country}` 
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Joined</p>
                  <p className="font-semibold">
                    {new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {selectedUser.bio && (
                <>
                  <Separator />
                  <div>
                    <p className="text-gray-600 mb-2">Bio</p>
                    <p className="text-sm">{selectedUser.bio}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Assign a new role to {selectedUser?.display_name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>User - Basic access</span>
                  </div>
                </SelectItem>
                <SelectItem value="mentor">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Mentor - Can offer mentorship</span>
                  </div>
                </SelectItem>
                <SelectItem value="moderator">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Moderator - Content moderation</span>
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

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  The user will be notified of their role change via email.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban {selectedUser?.display_name}? This action can be reversed.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Reason for ban *
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="e.g., Violation of community guidelines, spam, harassment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 min-h-[100px]"
            />

            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-900 dark:text-red-100">
                  The user will lose access to the platform immediately and receive an email notification.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowBanDialog(false);
              setBanReason('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleBanUser}
              className="bg-red-600 hover:bg-red-700"
            >
              <Ban className="w-4 h-4 mr-2" />
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
