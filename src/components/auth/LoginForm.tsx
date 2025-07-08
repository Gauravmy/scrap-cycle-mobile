
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Phone, KeyRound, ArrowRight, Leaf } from 'lucide-react';

interface LoginFormProps {
  userType: 'customer' | 'partner';
}

const LoginForm: React.FC<LoginFormProps> = ({ userType }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
      toast.success('OTP sent successfully! Use 123456 to login');
    }, 1500);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(phone, otp, userType);
    setLoading(false);
    
    if (!success) {
      toast.error('Invalid OTP. Please try 123456');
    } else {
      toast.success(`Welcome to ScrapCycle ${userType === 'customer' ? 'Customer' : 'Partner'} App!`);
    }
  };

  const isCustomer = userType === 'customer';
  const primaryColor = isCustomer ? 'green' : 'blue';
  const bgGradient = isCustomer 
    ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50' 
    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50';

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgGradient} p-4 relative overflow-hidden`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
        <CardHeader className="text-center pb-8 pt-8">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-${primaryColor}-100 flex items-center justify-center`}>
            {isCustomer ? (
              <Leaf className={`h-8 w-8 text-${primaryColor}-600`} />
            ) : (
              <KeyRound className={`h-8 w-8 text-${primaryColor}-600`} />
            )}
          </div>
          <CardTitle className={`text-3xl font-bold text-${primaryColor}-800 mb-2`}>
            {isCustomer ? 'Welcome Back' : 'Partner Portal'}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {step === 'phone' 
              ? 'Enter your phone number to continue' 
              : 'Enter the verification code sent to your phone'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 focus:border-green-400 rounded-xl transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className={`w-full h-14 bg-${primaryColor}-600 hover:bg-${primaryColor}-700 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending OTP...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Send OTP
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-[0.5em] h-16 border-2 focus:border-green-400 rounded-xl font-mono"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 text-center">
                    💡 Demo Hint: Use <span className="font-mono font-bold">123456</span> to login
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className={`w-full h-14 bg-${primaryColor}-600 hover:bg-${primaryColor}-700 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg`}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify & Login'
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full h-12 text-gray-600 hover:text-gray-800 rounded-xl"
                  onClick={() => setStep('phone')}
                >
                  ← Back to Phone Number
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
