"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useStylie } from '@/context/StylieContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCustomerAuthenticated, loginCustomer } = useStylie();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (isCustomerAuthenticated) {
      router.replace(redirect);
    }
  }, [isCustomerAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const ok = loginCustomer(email, password);
    if (ok) {
      router.replace(redirect);
    } else {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-white flex items-center justify-center px-6 py-20">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-beige rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 gap-3">
          <Link href="/" className="font-poppins text-3xl tracking-tighter text-brand-dark font-extrabold flex items-center gap-1">
            STYLIE<span className="w-2.5 h-2.5 bg-brand-orange rounded-full inline-block" />
          </Link>
          <p className="text-xs text-brand-muted font-inter text-center mt-1">Sign in to continue shopping</p>
        </div>

        {/* Card */}
        <div className="bg-brand-white border border-brand-border/60 rounded-[28px] p-8 shadow-xl shadow-brand-border/20">
          <h1 className="font-poppins font-extrabold text-lg text-brand-dark tracking-tight mb-6">Welcome back</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-[10px] font-bold text-brand-muted uppercase tracking-widest">Full Name</label>
              <input
                id="login-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                className="bg-brand-beige border-none rounded-xl px-4 py-3 text-xs font-medium font-inter focus:outline-none focus:ring-2 focus:ring-brand-orange text-brand-dark placeholder:text-brand-muted"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-[10px] font-bold text-brand-muted uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full bg-brand-beige border-none rounded-xl pl-10 pr-4 py-3 text-xs font-medium font-inter focus:outline-none focus:ring-2 focus:ring-brand-orange text-brand-dark placeholder:text-brand-muted"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-inter text-[10px] font-bold text-brand-muted uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="w-full bg-brand-beige border-none rounded-xl pl-10 pr-10 py-3 text-xs font-medium font-inter focus:outline-none focus:ring-2 focus:ring-brand-orange text-brand-dark placeholder:text-brand-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-600 font-inter leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-dark text-brand-white rounded-2xl text-xs font-bold font-inter hover:bg-brand-orange transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1 shadow-lg shadow-brand-dark/10"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-brand-white/30 border-t-brand-white animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Sign In &amp; Continue
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-brand-muted mt-6 font-inter">
            Enter any valid email + password (6+ chars) to sign in.
          </p>
        </div>

        <p className="text-center text-[11px] text-brand-muted mt-6 font-inter">
          <Link href="/" className="hover:text-brand-orange transition-colors font-semibold">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
