"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Check } from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-brand-beige border-t border-brand-border py-16 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Description */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-poppins text-2xl tracking-tighter text-brand-dark font-extrabold">
            STYLIE<span className="w-2.5 h-2.5 bg-brand-orange rounded-full inline-block"></span>
          </Link>
          <p className="font-inter text-xs text-brand-muted leading-relaxed max-w-sm">
            Discover fashion that feels premium, comfortable, and made for everyone. We design minimalist wardrobe essentials that inspire confidence.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-brand-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a 
              href="mailto:hello@atelier-stylie.com" 
              className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-brand-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation / Shop links */}
        <div>
          <h4 className="font-poppins text-xs font-bold tracking-wider text-brand-dark mb-5">SHOP</h4>
          <ul className="flex flex-col gap-3 font-inter text-xs text-brand-muted">
            <li><Link href="/shop?category=men" className="hover:text-brand-orange transition-colors">Men's Collection</Link></li>
            <li><Link href="/shop?category=women" className="hover:text-brand-orange transition-colors">Women's Collection</Link></li>
            <li><Link href="/shop?category=kids" className="hover:text-brand-orange transition-colors">Kids Wear</Link></li>
            <li><Link href="/shop?category=genz" className="hover:text-brand-orange transition-colors">GENZ Urban Drops</Link></li>
            <li><Link href="/shop?category=accessories" className="hover:text-brand-orange transition-colors">Accessories</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="font-poppins text-xs font-bold tracking-wider text-brand-dark mb-5">ASSISTANCE</h4>
          <ul className="flex flex-col gap-3 font-inter text-xs text-brand-muted">
            <li><Link href="/#help" className="hover:text-brand-orange transition-colors">Contact Support</Link></li>
            <li><Link href="/#shipping" className="hover:text-brand-orange transition-colors">Shipping & Delivery</Link></li>
            <li><Link href="/#returns" className="hover:text-brand-orange transition-colors">Returns & Exchanges</Link></li>
            <li><Link href="/#privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
            <li><Link href="/#terms" className="hover:text-brand-orange transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="font-poppins text-xs font-bold tracking-wider text-brand-dark mb-5">ATELIER NEWSLETTER</h4>
          <p className="font-inter text-xs text-brand-muted leading-relaxed mb-4">
            Subscribe to receive exclusive access to capsule collections, promotions, and styling updates.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center border border-brand-border rounded-xl overflow-hidden bg-brand-white focus-within:ring-1 focus-within:ring-brand-orange focus-within:border-brand-orange transition-all">
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-transparent text-xs text-brand-dark focus:outline-none placeholder-brand-muted"
            />
            <button 
              type="submit" 
              className="p-3 bg-brand-dark text-brand-white hover:bg-brand-orange transition-colors flex items-center justify-center"
              aria-label="Subscribe"
            >
              {subscribed ? <Check className="w-4 h-4 text-emerald-400" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          {subscribed && (
            <span className="text-[10px] text-brand-orange font-inter mt-1.5 inline-block font-semibold">
              Thank you! You are now subscribed to the STYLIE Atelier.
            </span>
          )}
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-brand-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-inter text-[10px] text-brand-muted">
          © {new Date().getFullYear()} STYLIE E-Commerce Ltd. Crafted for premium luxury.
        </p>
        <p className="font-inter text-[10px] text-brand-muted">
          742 Luxury Avenue, New York, NY 10001 | hello@atelier-stylie.com
        </p>
      </div>
    </footer>
  );
}
