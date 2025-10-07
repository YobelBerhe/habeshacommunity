import { useState } from 'react';
import { 
  CreditCard, Lock, Check, Star, Crown, Zap, Shield,
  ArrowLeft, Heart, Award, ShoppingBag, Users, Sparkles,
  AlertCircle, Info, Gift, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  popular?: boolean;
  features: string[];
  badge?: string;
}

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'premium-monthly';

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [selectedPlan, setSelectedPlan] = useState(planId);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    country: 'US',
    postalCode: ''
  });

  const plans: PricingPlan[] = [
    {
      id: 'premium-monthly',
      name: 'Premium Monthly',
      price: 19.99,
      interval: 'month',
      features: [
        'Unlimited matches',
        'Priority mentor booking',
        'Featured marketplace listings',
        'Ad-free experience',
        'Advanced AI matching',
        'Video calls included',
        'Priority support'
      ]
    },
    {
      id: 'premium-yearly',
      name: 'Premium Annual',
      price: 199.99,
      interval: 'year',
      popular: true,
      badge: 'Save 17%',
      features: [
        'Everything in Monthly',
        '2 months FREE',
        'Exclusive events access',
        'Premium badge',
        'Early feature access',
        'Dedicated support',
        'Gift premium to friends'
      ]
    },
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      price: 499.99,
      interval: 'month',
      badge: 'Best Value',
      features: [
        'Everything in Annual',
        'One-time payment',
        'Lifetime updates',
        'VIP status forever',
        'Exclusive perks',
        'Priority everything',
        'No recurring charges'
      ]
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[0];

  const handlePayment = async () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!cardInfo.number || !cardInfo.name || !cardInfo.expiry || !cardInfo.cvv) {
      toast.error('Please fill in all payment details');
      return;
    }

    toast.loading('Processing payment...');
    
    setTimeout(() => {
      toast.dismiss();
      toast.success('Payment successful! 🎉', {
        description: 'Welcome to Premium! Your benefits are now active.'
      });
      
      setTimeout(() => {
        navigate('/dashboard?upgraded=true');
      }, 2000);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center">
                <Crown className="w-8 h-8 mr-3" />
                Upgrade to Premium
              </h1>
              <p className="text-base md:text-lg opacity-90">
                Unlock all features and maximize your experience
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Select Your Plan</h2>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      )}
                      {plan.badge && !plan.popular && (
                        <Badge className="absolute -top-3 left-4 bg-gradient-to-r from-green-500 to-teal-500 text-white">
                          {plan.badge}
                        </Badge>
                      )}
                      
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={plan.id} id={plan.id} />
                        <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg">{plan.name}</h3>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                ${plan.price}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {plan.interval === 'year' ? '/year' : plan.id === 'lifetime' ? 'one-time' : '/month'}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {plan.features.slice(0, 3).map((feature, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              
              <div className="flex gap-3 mb-6">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="flex-1"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Credit Card
                </Button>
                <Button
                  variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('paypal')}
                  className="flex-1"
                >
                  PayPal
                </Button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative mt-1">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.number}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          if (formatted.replace(/\s/g, '').length <= 16) {
                            setCardInfo({ ...cardInfo, number: formatted });
                          }
                        }}
                        maxLength={19}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardInfo.name}
                      onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={(e) => {
                          const formatted = formatExpiry(e.target.value);
                          if (formatted.length <= 5) {
                            setCardInfo({ ...cardInfo, expiry: formatted });
                          }
                        }}
                        maxLength={5}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cardInfo.cvv}
                        onChange={(e) => {
                          if (e.target.value.length <= 4) {
                            setCardInfo({ ...cardInfo, cvv: e.target.value });
                          }
                        }}
                        maxLength={4}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select value={cardInfo.country} onValueChange={(value) => setCardInfo({ ...cardInfo, country: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="ER">Eritrea</SelectItem>
                          <SelectItem value="ET">Ethiopia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        placeholder="12345"
                        value={cardInfo.postalCode}
                        onChange={(e) => setCardInfo({ ...cardInfo, postalCode: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <Card className="p-8 text-center bg-muted/50">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">PayPal Checkout</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You'll be redirected to PayPal to complete your purchase securely
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Continue with PayPal
                  </Button>
                </Card>
              )}
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I agree to the{' '}
                    <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
                    I understand this is a recurring subscription that will automatically renew.
                  </Label>
                </div>

                <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <h4 className="font-semibold mb-1">Secure Payment</h4>
                      <p className="text-muted-foreground">
                        Your payment information is encrypted and secure. We never store your card details.
                      </p>
                    </div>
                  </div>
                </Card>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={handlePayment}
                  disabled={!agreedToTerms}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Pay ${currentPlan.price} Now
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="font-semibold">{currentPlan.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Billing</span>
                  <span className="font-semibold capitalize">
                    {currentPlan.interval === 'year' ? 'Annual' : currentPlan.id === 'lifetime' ? 'One-time' : 'Monthly'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-bold">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${currentPlan.price}</div>
                    {currentPlan.interval === 'year' && (
                      <div className="text-xs text-muted-foreground">
                        ${(currentPlan.price / 12).toFixed(2)}/month
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-3">What's Included:</h4>
                {currentPlan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
              <h3 className="font-bold mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-amber-600" />
                Premium Benefits
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Heart, label: 'Unlimited Matches', color: 'text-pink-600' },
                  { icon: Award, label: 'Priority Mentor Access', color: 'text-blue-600' },
                  { icon: ShoppingBag, label: 'Featured Listings', color: 'text-green-600' },
                  { icon: Users, label: 'Exclusive Events', color: 'text-purple-600' },
                  { icon: Zap, label: 'AI-Powered Features', color: 'text-amber-600' }
                ].map((benefit, i) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${benefit.color}`} />
                      <span className="text-sm font-medium">{benefit.label}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold mb-2">30-Day Money Back</h4>
                <p className="text-sm text-muted-foreground">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
