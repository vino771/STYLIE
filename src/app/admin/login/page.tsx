"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useStylie } from '@/context/StylieContext';

export default function AdminLogin() {
  const { isAdminAuthenticated, loginAdmin } = useStylie();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAdminAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((res) => setTimeout(res, 600)); // Simulate network

    const success = loginAdmin(email, password);
    if (success) {
      router.replace('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try admin@stylie.com / Admin@1234');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1117] flex items-center justify-center p-6 font-inter">
      
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FF5A1F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#FF5A1F]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-14 h-14 bg-[#FF5A1F] rounded-2xl flex items-center justify-center shadow-xl shadow-[#FF5A1F]/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="font-poppins font-extrabold text-xl text-white tracking-tight">STYLIE Admin</h1>
            <p className="text-xs text-white/40 mt-1">Secure portal — authorized staff only</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  id="admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stylie.com"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 focus:ring-1 focus:ring-[#FF5A1F]/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl pl-10 pr-10 py-3 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 focus:ring-1 focus:ring-[#FF5A1F]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-400 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="w-full py-3.5 bg-[#FF5A1F] text-white rounded-xl text-xs font-bold hover:bg-[#e04a12] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A1F]/20 mt-1"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Admin Portal'
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-center text-[10px] text-white/20 mt-6 leading-relaxed">
            Demo credentials: <span className="text-white/40 font-semibold">admin@stylie.com</span> / <span className="text-white/40 font-semibold">Admin@1234</span>
          </p>
        </div>

        <p className="text-center text-[10px] text-white/20 mt-6">
          © 2026 STYLIE — Internal Admin Portal. Not publicly accessible.
        </p>
      </div>
    </div>
  );
}
