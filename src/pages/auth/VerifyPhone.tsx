import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyPhone() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const returnTo = searchParams.get('returnTo') || '/';

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyOtp = async (code: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: 'sms'
      });

      if (error) throw error;

      toast.success('Phone verified!');
      navigate(returnTo);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error('Invalid code', { description: error.message });
      setOtp(['', '', '', '', '', '']);
      const firstInput = document.getElementById('otp-0');
      firstInput?.focus();
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setResending(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms'
        }
      });

      if (error) throw error;

      toast.success('Code resent!', { description: 'Check your phone' });
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Verify Your Phone</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the 6-digit code sent to<br />
            <span className="font-semibold">{phone}</span>
          </p>
        </div>

        <div className="space-y-6">
          {/* OTP Input */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all"
                disabled={loading}
              />
            ))}
          </div>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={resendOtp}
              disabled={resending}
              className="text-blue-600 hover:underline font-semibold disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend Code'}
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
