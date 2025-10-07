import { useState } from 'react';
import { 
  ArrowLeft, Calendar, Clock, Video, MessageSquare,
  CreditCard, CheckCircle, AlertCircle, Info, Zap,
  Globe, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const BookSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('60');
  const [meetingType, setMeetingType] = useState('video');
  const [message, setMessage] = useState('');

  // Demo mentor data
  const mentor = {
    name: 'Daniel Tesfay',
    title: 'Senior Software Engineer at Google',
    avatar: 'DT',
    timezone: 'PST (UTC-8)',
    responseTime: '2 hours'
  };

  const durations = [
    { value: '30', price: 75, label: '30 min', description: 'Quick consultation' },
    { value: '60', price: 120, label: '1 hour', description: 'Standard session', popular: true },
    { value: '90', price: 160, label: '1.5 hours', description: 'Deep dive' }
  ];

  const availableDates = [
    { date: '2024-12-20', day: 'Mon', dayNum: 20, available: true },
    { date: '2024-12-21', day: 'Tue', dayNum: 21, available: true },
    { date: '2024-12-22', day: 'Wed', dayNum: 22, available: false },
    { date: '2024-12-23', day: 'Thu', dayNum: 23, available: true },
    { date: '2024-12-24', day: 'Fri', dayNum: 24, available: true },
    { date: '2024-12-25', day: 'Sat', dayNum: 25, available: false },
    { date: '2024-12-26', day: 'Sun', dayNum: 26, available: false }
  ];

  const availableTimes = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', 
    '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    toast.success('Session booked successfully! 🎉', {
      description: 'Check your email for confirmation and meeting link'
    });

    setTimeout(() => {
      navigate('/mentor/sessions');
    }, 2000);
  };

  const selectedPrice = durations.find(d => d.value === selectedDuration)?.price || 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center gap-2">
              <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}`}>
                  {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">Date & Time</span>
              </div>
              <div className="w-12 h-0.5 bg-border mx-2" />
              <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}`}>
                  {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
                </div>
                <span className="ml-2 text-sm font-medium">Details</span>
              </div>
              <div className="w-12 h-0.5 bg-border mx-2" />
              <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground md:hidden">
              Step {step} of 3
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Select Session Duration</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {durations.map((duration) => (
                      <div
                        key={duration.value}
                        onClick={() => setSelectedDuration(duration.value)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedDuration === duration.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {duration.popular && (
                          <Badge className="mb-2 bg-gradient-to-r from-blue-500 to-cyan-500">
                            <Zap className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        <div className="text-2xl font-bold mb-1">{duration.label}</div>
                        <div className="text-sm text-muted-foreground mb-2">{duration.description}</div>
                        <div className="text-xl font-bold text-primary">${duration.price}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-2">Select Date</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Timezone: {mentor.timezone}
                  </p>
                  
                  <div className="grid grid-cols-7 gap-2 mb-8">
                    {availableDates.map((date) => (
                      <button
                        key={date.date}
                        onClick={() => date.available && setSelectedDate(date.date)}
                        disabled={!date.available}
                        className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                          selectedDate === date.date
                            ? 'border-primary bg-primary text-primary-foreground'
                            : date.available
                            ? 'border-border hover:border-primary'
                            : 'border-border bg-muted cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="text-xs">{date.day}</div>
                        <div className="text-lg font-bold">{date.dayNum}</div>
                      </button>
                    ))}
                  </div>

                  {selectedDate && (
                    <div>
                      <h3 className="font-bold mb-4">Available Times</h3>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => setSelectedTime(time)}
                            className="w-full"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>

                <Button
                  size="lg"
                  className="w-full"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(2)}
                >
                  Continue to Details
                </Button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Session Details</h2>

                  <div className="space-y-6">
                    {/* Meeting Type */}
                    <div>
                      <Label className="text-base mb-3 block">How would you like to meet?</Label>
                      <RadioGroup value={meetingType} onValueChange={setMeetingType}>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                            <RadioGroupItem value="video" id="video" />
                            <Label htmlFor="video" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <Video className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-semibold">Video Call</div>
                                  <div className="text-sm text-muted-foreground">Live video session via Google Meet/Zoom</div>
                                </div>
                              </div>
                            </Label>
                          </div>

                          <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                            <RadioGroupItem value="voice" id="voice" />
                            <Label htmlFor="voice" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-semibold">Voice Call</div>
                                  <div className="text-sm text-muted-foreground">Audio only call</div>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Message to Mentor */}
                    <div>
                      <Label htmlFor="message" className="text-base mb-2 block">
                        What would you like to discuss? *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell the mentor what you'd like help with, any specific topics or questions you have..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        This helps the mentor prepare for your session
                      </p>
                    </div>

                    {/* Info Box */}
                    <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <h4 className="font-semibold mb-1">Before your session</h4>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• You'll receive a calendar invite with meeting link</li>
                            <li>• The mentor will review your message beforehand</li>
                            <li>• Join 5 minutes early to test your connection</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1"
                    disabled={!message}
                    onClick={() => setStep(3)}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" placeholder="John Doe" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative mt-1">
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-1" />
                      </div>
                    </div>
                  </div>

                  <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <h4 className="font-semibold mb-1">100% Money-Back Guarantee</h4>
                        <p className="text-muted-foreground">
                          If you're not satisfied with your session, we'll refund you in full within 24 hours
                        </p>
                      </div>
                    </div>
                  </Card>
                </Card>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    onClick={handleBooking}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Confirm & Pay ${selectedPrice}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h3 className="font-bold mb-4">Booking Summary</h3>

              {/* Mentor Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                    {mentor.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold">{mentor.name}</div>
                  <div className="text-sm text-muted-foreground">{mentor.title}</div>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-4 text-sm">
                {selectedDuration && (
                  <div className="flex items-center justify-between">
