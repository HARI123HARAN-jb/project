"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { Bot, LogIn } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { setUser } = useStore();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data, data.token);
      toast.success('Successfully logged in!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials or API server not running');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone) return toast.error("Please enter your mobile number");
    
    // Auto-format: extract only digits, take last 10
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) return toast.error("Please enter a valid 10-digit number");

    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone: cleanPhone });
      setOtpSent(true);
      toast.success("OTP sent to " + cleanPhone);
    } catch (err: any) {
      const errorMsg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { phone: cleanPhone, otp });
      setUser(data, data.token);
      toast.success('Successfully logged in!');
      router.push('/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Invalid OTP';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600"></div>
        
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot size={32} className="text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-muted-foreground text-center text-sm mb-8">Sign in to your Sai Elite account</p>

        {loginMethod === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 pl-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="you@company.in"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1 pl-1 pr-1">
                <label className="text-sm font-medium">Password</label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-semibold rounded-xl px-4 py-3 hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'Authenticating...' : <><LogIn size={18} className="mr-2" /> Sign In</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
             <div>
              <label className="block text-sm font-medium mb-1 pl-1">Mobile Number</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                  className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                  placeholder="+91 9876543210"
                  required
                />
                {!otpSent && (
                  <button 
                    type="button" 
                    onClick={handleSendOtp}
                    disabled={loading || !phone}
                    className="bg-secondary text-secondary-foreground px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  >
                    Get OTP
                  </button>
                )}
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium mb-1 pl-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-background border border-input text-center tracking-widest text-lg rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="------"
                  maxLength={6}
                  required
                />
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !otpSent}
              className="w-full bg-primary text-primary-foreground font-semibold rounded-xl px-4 py-3 hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account? <Link href="/register" className="text-primary font-medium hover:underline">Create account</Link>
        </div>
        
        {/* OTP/Email Toggle */}
        <div className="mt-6 text-center text-xs text-muted-foreground border-t border-border pt-4">
          {loginMethod === 'email' ? (
            <span>Or login instantly with <button onClick={() => setLoginMethod('otp')} className="text-primary font-medium hover:underline">Mobile OTP</button></span>
          ) : (
             <span>Or use traditional <button onClick={() => setLoginMethod('email')} className="text-primary font-medium hover:underline">Email & Password</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
