import { useState } from 'react';
import { 
  ArrowLeft, Calendar, Clock, Video, MessageCircle,
  CheckCircle, CreditCard, Info, AlertCircle, Sparkles,
  DollarSign, Users, Award, Zap, ChevronRight, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface TimeSlot {
  id: string;
  day: string;
  date: string;
  fullDate: string;
  time: string;
  available: boolean;
}

interface SessionType {
  id: string;
  name: string;
  duration: string;
  durationMinutes: number;
  price: number;
  description: string;
  popular?: boolean;
}

const BookSession = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<string | null>(null);
  const [sessionTopic, setSessionTopic] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [communicationMethod, setCommunicationMethod] = useState('video');

  // Mock mentor data
  const mentor = {
    id: id || '1',
    name: 'Daniel Tesfay',
    avatar: 'DT',
    title: 'Senior Software Engineer at Google',
    rating: 4.9,
    reviews: 127,
    responseTime: '1 hour',
    verified: true
  };

  // Session types
  const sessionTypes: SessionType[] = [
    {
      id: '1',
      name: 'Career Guidance',
      duration: '45 minutes',
      durationMinutes: 45,
      price: 75,
      description: 'Get personalized advice on your career path and growth',
      popular: true
    },
    {
      id: '2',
      name: 'Interview Preparation',
      duration: '60 minutes',
      durationMinutes: 60,
      price: 100,
      description: 'Practice technical interviews and behavioral questions'
    },
    {
      id: '3',
      name: 'Code Review',
      duration: '30 minutes',
      durationMinutes: 30,
      price: 60,
      description: 'Review your code and get feedback on improvements'
    },
    {
      id: '4',
      name: 'Resume Review',
      duration: '30 minutes',
      durationMinutes: 30,
      price: 50,
      description: 'Optimize your resume for tech positions'
    }
  ];

  // Available dates (next 14 days)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      id: `date-${i}`,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString(),
      fullDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  // Time slots for selected date
  const timeSlots: TimeSlot[] = [
    { id: '1', day: 'Mon', date: 'Oct 28', fullDate: 'October 28, 2024', time: '9:00 AM', available: true },
    { id: '2', day: 'Mon', date: 'Oct 28', fullDate: 'October 28, 2024', time: '10:00 AM', available: true },
    { id: '3', day: 'Mon', date: 'Oct 28', fullDate: 'October 28, 2024', time: '11:00 AM', available: false },
    { id: '4', day: 'Mon', date: 'Oct 28', fullDate: 'October 28, 2024', time: '2:00 PM', available: true },
    { id: '5', day: 'Mon', date: 'Oct 28', fullDate: 'October 28, 2024', time: '3:00 PM', available: true },
    { id: '6', day: 'Mon', date: 'Oct 28', fullDate: 'October 28, 2024', time: '4:00 PM', available: false },
    { id: '7', day: 'Mon', date: 'Oct 28', fullDate: 'October 28, 2024', time: '5:00 PM', available: true },
    { id: '8', day: 'Mon', date: 'Oct 28', fullDate: 'October 28, 2024', time: '6:00 PM', available: true }
  ];

  const selectedSession = sessionTypes.find(s => s.id === selectedSessionType);
  const selectedTimeSlot = timeSlots.find(t => t.id === selectedTime);
  
  // Calculate totals
  const subtotal = selectedSession?.price || 0;
  const serviceFee = subtotal * 0.1; // 10% service fee
  const total = subtotal + serviceFee;

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedSessionType) {
        toast.error('Please select a session type');
        return;
      }
    } else if (currentStep === 2) {
      if (!selectedDate || !selectedTime) {
        toast.error('Please select a date and time');
        return;
      }
    } else if (currentStep === 3) {
      if (!sessionTopic.trim()) {
        toast.error('Please describe what you want to discuss');
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleConfirmBooking = () => {
    toast.loading('Processing your booking...');

    setTimeout(() => {
      toast.dismiss();
      toast.success('Session booked successfully!', {
        description: 'You will receive a confirmation email shortly'
      });

      setTimeout(() => {
        navigate('/mentor/sessions');
      }, 2000);
    }, 2000);
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-6">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate(`/mentor/${mentor.id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                {mentor.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Book a Session with {mentor.name}
              </h1>
              <p className="text-sm md:text-base opacity-90">{mentor.title}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index < totalSteps - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      currentStep > index + 1
                        ? 'bg-white text-blue-600'
                        : currentStep === index + 1
                        ? 'bg-white text-blue-600 ring-4 ring-white/30'
                        : 'bg-white/30 text-white'
                    }`}
                  >
                    {currentStep > index + 1 ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        currentStep > index + 1 ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span>Type</span>
              <span>Schedule</span>
              <span>Details</span>
              <span>Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Session Type */}
            {currentStep === 1 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-2">Choose Session Type</h2>
                <p className="text-muted-foreground mb-6">
                  Select the type of mentorship session you need
                </p>

                <div className="space-y-4">
                  {sessionTypes.map((session) => (
                    <Card
                      key={session.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedSessionType === session.id
                          ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'hover:border-blue-300 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedSessionType(session.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg">{session.name}</h3>
                            {session.popular && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {session.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {session.duration}
                            </div>
                            <div className="flex items-center gap-1 font-semibold text-blue-600">
                              <DollarSign className="w-4 h-4" />
                              ${session.price}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedSessionType === session.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedSessionType === session.id && (
                            <CheckCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Step 2: Date & Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-2">Select Date</h2>
                  <p className="text-muted-foreground mb-6">
                    Choose a day that works for you
                  </p>

                  <div className="grid grid-cols-7 gap-2 mb-8">
                    {availableDates.map((date) => (
                      <button
                        key={date.id}
                        onClick={() => setSelectedDate(date.fullDate)}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                          selectedDate === date.fullDate
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-muted'
                        }`}
                      >
                        <span className="text-xs text-muted-foreground mb-1">
                          {date.day}
                        </span>
                        <span className="text-lg font-bold">{date.date}</span>
                        <span className="text-xs text-muted-foreground">
                          {date.month}
                        </span>
                      </button>
                    ))}
                  </div>

                  {selectedDate && (
                    <>
                      <Separator className="my-6" />
                      
                      <h3 className="text-xl font-bold mb-4">Select Time</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        All times shown in your local timezone (PST)
                      </p>

                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedTime === slot.id ? 'default' : 'outline'}
                            className={`h-auto py-3 ${
                              !slot.available
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.id)}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {slot.time}
                          </Button>
                        ))}
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-blue-900 dark:text-blue-100">
                            <p className="font-semibold mb-1">Session Details:</p>
                            <p>
                              You'll receive a video call link 15 minutes before your
                              scheduled time. Please join on time to make the most of
                              your session.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </div>
            )}

            {/* Step 3: Session Details */}
            {currentStep === 3 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-2">Session Details</h2>
                <p className="text-muted-foreground mb-6">
                  Tell {mentor.name.split(' ')[0]} what you'd like to discuss
                </p>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="topic" className="text-base font-semibold mb-2">
                      What would you like to discuss? *
                    </Label>
                    <Textarea
                      id="topic"
                      value={sessionTopic}
                      onChange={(e) => setSessionTopic(e.target.value)}
                      placeholder="e.g., I'm preparing for interviews at FAANG companies and need help with system design..."
                      className="mt-2 min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {sessionTopic.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-base font-semibold mb-2">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Any specific questions or topics you want to cover..."
                      className="mt-2"
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Preferred Communication Method
                    </Label>
                    <RadioGroup value={communicationMethod} onValueChange={setCommunicationMethod}>
                      <div className="space-y-3">
                        <Card className="p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="video" id="video" />
                            <label
                              htmlFor="video"
                              className="flex items-center gap-3 flex-1 cursor-pointer"
                            >
                              <Video className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="font-semibold">Video Call</div>
                                <div className="text-sm text-muted-foreground">
                                  Face-to-face mentorship session
                                </div>
                              </div>
                            </label>
                            <Badge variant="secondary">Recommended</Badge>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="audio" id="audio" />
                            <label
                              htmlFor="audio"
                              className="flex items-center gap-3 flex-1 cursor-pointer"
                            >
                              <MessageCircle className="w-5 h-5 text-green-600" />
                              <div>
                                <div className="font-semibold">Audio Call</div>
                                <div className="text-sm text-muted-foreground">
                                  Voice-only conversation
                                </div>
                              </div>
                            </label>
                          </div>
                        </Card>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 4: Payment & Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Review & Confirm</h2>

                  <div className="space-y-4">
                    {/* Session Summary */}
                    <div className="flex items-start justify-between pb-4 border-b">
                      <div>
                        <h3 className="font-semibold mb-1">{selectedSession?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedSession?.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${selectedSession?.price}</div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Date & Time</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedDate} at {selectedTimeSlot?.time}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Pacific Standard Time (PST)
                        </p>
                      </div>
                    </div>

                    {/* Communication Method */}
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <Video className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Communication</h4>
                        <p className="text-sm text-muted-foreground">
                          {communicationMethod === 'video' ? 'Video Call' : 'Audio Call'}
                        </p>
                      </div>
                    </div>

                    {/* Session Topic */}
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Discussion Topic</h4>
                        <p className="text-sm text-muted-foreground">{sessionTopic}</p>
                        {additionalNotes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-semibold">Additional notes:</span>{' '}
                            {additionalNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Payment Card */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Details
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Session fee</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Service fee (10%)</span>
                      <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-blue-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-900 dark:text-amber-100">
                        <p className="font-semibold mb-1">Protected Payment</p>
                        <p>
                          Your payment is held securely until the session is completed.
                          Cancel up to 24 hours before for a full refund.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    onClick={handleConfirmBooking}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Confirm & Pay ${total.toFixed(2)}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By confirming, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Cancellation Policy
                    </a>
                  </p>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 4 && (
                <Button onClick={handleNext} size="lg">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Booking Summary</h3>

              {/* Mentor Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                    {mentor.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold">{mentor.name}</h4>
                  <p className="text-xs text-muted-foreground">{mentor.title}</p>
                </div>
              </div>

              {/* Summary Details */}
              <div className="space-y-3 text-sm">
                {selectedSession && (
                  <div>
                    <div className="text-muted-foreground mb-1">Session Type</div>
                    <div className="font-semibold">{selectedSession.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedSession.duration}
                    </div>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div>
                    <div className="text-muted-foreground mb-1">Scheduled For</div>
                    <div className="font-semibold">{selectedDate}</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedTimeSlot?.time}
                    </div>
                  </div>
                )}

                {currentStep >= 3 && sessionTopic && (
                  <div>
                    <div className="text-muted-foreground mb-1">Topic</div>
                    <div className="font-semibold text-xs line-clamp-2">
                      {sessionTopic}
                    </div>
                  </div>
                )}
              </div>

              {selectedSession && (
                <>
                  <Separator className="my-4" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Session fee</span>
                      <span className="font-semibold">${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee</span>
                      <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-base">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* Help Card */}
            <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Need Help?
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 text-xs">
                    Have questions? Contact our support team or read our booking guide.
                  </p>
                  <Button variant="link" className="h-auto p-0 text-blue-600 mt-2 text-xs">
                    View Booking Guide →
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSession;
