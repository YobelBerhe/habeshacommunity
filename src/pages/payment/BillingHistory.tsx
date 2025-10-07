import { useState } from 'react';
import { 
  ArrowLeft, CreditCard, Download, Calendar, Check,
  AlertCircle, Crown, TrendingUp, DollarSign, Receipt,
  X, RefreshCw, Star, Gift, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  invoice?: string;
  method: string;
}

const BillingHistory = () => {
  const navigate = useNavigate();

  const subscription = {
    plan: 'Premium Annual',
    status: 'active',
    nextBilling: '2025-10-07',
    amount: 199.99,
    method: 'Visa •••• 4242',
    since: '2024-10-07'
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-10-07',
      description: 'Premium Annual Subscription',
      amount: 199.99,
      status: 'completed',
      invoice: 'INV-2024-001',
      method: 'Visa •••• 4242'
    },
    {
      id: '2',
      date: '2024-09-15',
      description: 'Mentor Session - Career Guidance',
      amount: 120.00,
      status: 'completed',
      invoice: 'INV-2024-002',
      method: 'Visa •••• 4242'
    },
    {
      id: '3',
      date: '2024-08-22',
      description: 'Featured Marketplace Listing',
      amount: 29.99,
      status: 'completed',
      invoice: 'INV-2024-003',
      method: 'PayPal'
    },
    {
      id: '4',
      date: '2024-07-10',
      description: 'Premium Monthly Subscription',
      amount: 19.99,
      status: 'refunded',
      invoice: 'INV-2024-004',
      method: 'Visa •••• 4242'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'refunded': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const handleCancelSubscription = () => {
    toast.success('Subscription cancelled', {
      description: 'You\'ll continue to have access until the end of your billing period'
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/dashboard/settings')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Billing & Payments
              </h1>
              <p className="text-base md:text-lg opacity-90">
                Manage your subscription and payment history
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{subscription.plan}</h3>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      <Check className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${subscription.amount}</div>
                  <div className="text-sm text-muted-foreground">per year</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Next Billing Date</div>
                  <div className="font-semibold flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(subscription.nextBilling).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Payment Method</div>
                  <div className="font-semibold flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {subscription.method}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Change Plan
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Update Payment
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:bg-red-50">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You'll lose access to all premium features at the end of your billing period.
                        Are you sure you want to cancel?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Premium</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelSubscription} className="bg-red-600 hover:bg-red-700">
                        Yes, Cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Payment History</h2>

              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{transaction.description}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })} • {transaction.method}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-lg">${transaction.amount.toFixed(2)}</div>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status === 'completed' && <Check className="w-3 h-3 mr-1" />}
                            {transaction.status === 'failed' && <X className="w-3 h-3 mr-1" />}
                            {transaction.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </Badge>
                        </div>

                        {transaction.invoice && transaction.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadInvoice(transaction.invoice!)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Spending Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-bold text-primary">$199.99</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Last Month</span>
                    <span className="font-bold">$149.99</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="font-semibold">Total Lifetime</span>
                    <span className="font-bold text-xl text-primary">$569.97</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2">Refer & Earn</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Give friends 1 month free and get 1 month free for each referral
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Gift className="w-4 h-4 mr-2" />
                  Refer Friends
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Payment Methods</h3>
                <Button variant="ghost" size="sm">
                  Add New
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">Visa •••• 4242</div>
                      <div className="text-xs text-muted-foreground">Expires 12/25</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Default</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;
