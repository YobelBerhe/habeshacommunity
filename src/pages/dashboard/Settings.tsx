import { useState } from 'react';
import { 
  ArrowLeft, Bell, Lock, Eye, Globe, Moon, Sun,
  Smartphone, Mail, Shield, CreditCard, Trash2,
  CheckCircle, AlertTriangle, Key, User, Heart,
  Award, ShoppingBag, Users, Download, LogOut,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Notification settings
  const [notifications, setNotifications] = useState({
    newMatches: true,
    messages: true,
    sessionReminders: true,
    marketplaceUpdates: true,
    communityActivity: false,
    emailDigest: true,
    pushNotifications: true,
    smsNotifications: false
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showLocation: true,
    showOnlineStatus: true,
    allowMessages: true,
    showInSearch: true
  });

  // Account settings
  const [account, setAccount] = useState({
    email: 'michael@example.com',
    phone: '+1 (555) 123-4567',
    language: 'en',
    timezone: 'America/New_York'
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    toast.success('Notification settings updated');
  };

  const togglePrivacy = (key: string) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    toast.success('Privacy settings updated');
  };

  const handleSaveAccount = () => {
    toast.success('Account settings saved');
  };

  const handleChangePassword = () => {
    toast.success('Password change email sent');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requested');
  };

  const handleExportData = () => {
    toast.success('Data export started. You\'ll receive an email when ready.');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/auth/login');
  };

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
            <h1 className="text-lg md:text-xl font-bold">Settings</h1>
            <div className="w-24" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={account.email}
                    onChange={(e) => setAccount({...account, email: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={account.phone}
                    onChange={(e) => setAccount({...account, phone: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={account.language} onValueChange={(value) => setAccount({...account, language: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ti">Tigrinya (ትግርኛ)</SelectItem>
                        <SelectItem value="am">Amharic (አማርኛ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={account.timezone} onValueChange={(value) => setAccount({...account, timezone: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Africa/Addis_Ababa">East Africa Time</SelectItem>
                        <SelectItem value="Europe/London">GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveAccount}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Connected Accounts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Google</div>
                      <div className="text-xs text-muted-foreground">michael@example.com</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Phone Number</div>
                      <div className="text-xs text-muted-foreground">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Verify</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center text-red-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Zone
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                  <div>
                    <div className="font-semibold">Export Your Data</div>
                    <div className="text-sm text-muted-foreground">Download all your account data</div>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
                  <div>
                    <div className="font-semibold">Delete Account</div>
                    <div className="text-sm text-muted-foreground">Permanently delete your account and all data</div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Push Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: 'newMatches', label: 'New Matches', description: 'Get notified when you have a new match', icon: Heart },
                  { key: 'messages', label: 'Messages', description: 'Notifications for new messages', icon: MessageCircle },
                  { key: 'sessionReminders', label: 'Session Reminders', description: 'Reminders for upcoming mentor sessions', icon: Award },
                  { key: 'marketplaceUpdates', label: 'Marketplace Updates', description: 'Updates on your listings and interests', icon: ShoppingBag },
                  { key: 'communityActivity', label: 'Community Activity', description: 'Replies to your posts and mentions', icon: Users }
                ].map(({ key, label, description, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{label}</div>
                        <div className="text-sm text-muted-foreground">{description}</div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications[key as keyof typeof notifications] as boolean}
                      onCheckedChange={() => toggleNotification(key)}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Email & SMS Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Email Digest</div>
                      <div className="text-sm text-muted-foreground">Weekly summary of activity</div>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailDigest}
                    onCheckedChange={() => toggleNotification('emailDigest')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">SMS Notifications</div>
                      <div className="text-sm text-muted-foreground">Text message alerts</div>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={() => toggleNotification('smsNotifications')}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Profile Privacy</h3>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Who can see your profile?</Label>
                  <Select 
                    value={privacy.profileVisibility} 
                    onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Everyone</SelectItem>
                      <SelectItem value="members">Members Only</SelectItem>
                      <SelectItem value="connections">Connections Only</SelectItem>
                      <SelectItem value="private">Only Me</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {[
                  { key: 'showLocation', label: 'Show Location', description: 'Display your city/location on profile' },
                  { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Let others see when you\'re active' },
                  { key: 'allowMessages', label: 'Allow Messages', description: 'Let anyone send you messages' },
                  { key: 'showInSearch', label: 'Show in Search', description: 'Appear in search results' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold">{label}</div>
                      <div className="text-sm text-muted-foreground">{description}</div>
                    </div>
                    <Switch
                      checked={privacy[key as keyof typeof privacy] as boolean}
                      onCheckedChange={() => togglePrivacy(key)}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Blocked Users</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't blocked any users yet
              </p>
              <Button variant="outline" className="w-full">
                Manage Blocked Users
              </Button>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Password & Authentication</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Password</div>
                      <div className="text-sm text-muted-foreground">Last changed 3 months ago</div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleChangePassword}>
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">Add extra security to your account</div>
                    </div>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Current Device</div>
                      <div className="text-sm text-muted-foreground">Chrome on MacOS • Washington DC</div>
                      <div className="text-xs text-muted-foreground">Active now</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    Active
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Sign Out All Other Sessions
              </Button>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Appearance</h3>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setTheme('light')}
                      className="flex flex-col gap-2 h-auto p-4"
                    >
                      <Sun className="w-6 h-6" />
                      <span>Light</span>
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setTheme('dark')}
                      className="flex flex-col gap-2 h-auto p-4"
                    >
                      <Moon className="w-6 h-6" />
                      <span>Dark</span>
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      onClick={() => setTheme('system')}
                      className="flex flex-col gap-2 h-auto p-4"
                    >
                      <Smartphone className="w-6 h-6" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Data & Storage</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">Cache Size</div>
                    <div className="text-sm text-muted-foreground">12.5 MB</div>
                  </div>
                  <Button variant="outline" size="sm">Clear Cache</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">Download Quality</div>
                    <div className="text-sm text-muted-foreground">Standard</div>
                  </div>
                  <Select defaultValue="standard">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-red-200 dark:border-red-800">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
