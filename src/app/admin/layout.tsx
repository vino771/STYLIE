"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Warehouse,
  Palette,
  BarChart3,
  LogOut,
  Plus,
  Sparkles
} from 'lucide-react';
import { useStylie } from '@/context/StylieContext';

const navItems = [
  { href: '/admin/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/products',   label: 'Products',    icon: Package },
  { href: '/admin/orders',     label: 'Orders',      icon: ShoppingBag },
  { href: '/admin/inventory',  label: 'Inventory',   icon: Warehouse },
  { href: '/admin/cms',        label: 'CMS',         icon: Palette },
  { href: '/admin/analytics',  label: 'Analytics',   icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, logoutAdmin } = useStylie();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login' || pathname === '/admin';

  useEffect(() => {
    if (!isAdminAuthenticated && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isAdminAuthenticated, isLoginPage]);

  // On login page or root /admin — just render content (login form or redirect)
  if (!isAdminAuthenticated || isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-[#0E1117] text-white font-inter">

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col h-screen sticky top-0 overflow-y-auto">
        
        {/* Brand */}
        <div className="px-6 py-7 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF5A1F] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-poppins font-extrabold text-sm text-white tracking-tight leading-none">STYLIE</p>
              <p className="text-[10px] text-white/40 font-inter mt-0.5 tracking-widest">ADMIN PORTAL</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-3 py-5 flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FF5A1F]/15 text-[#FF5A1F]'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}

          <div className="border-t border-white/5 mt-3 pt-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all bg-[#FF5A1F] text-white hover:bg-[#e04a12]"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              Add New Product
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 py-5 border-t border-white/5">
          <div className="px-4 py-3 mb-3">
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Logged in as</p>
            <p className="text-xs text-white font-semibold mt-1">admin@stylie.com</p>
          </div>
          <button
            onClick={() => { logoutAdmin(); router.replace('/admin/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-white/50 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow min-h-screen overflow-y-auto bg-[#0E1117]">
        {children}
      </main>
    </div>
  );
}
