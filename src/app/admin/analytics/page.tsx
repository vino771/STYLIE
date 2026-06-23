"use client";

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ShoppingBag, Users, Star, ArrowUpRight, Package } from 'lucide-react';
import { useStylie } from '@/context/StylieContext';

const MONTHLY_REVENUE = [
  { month: 'Jan', value: 182000 },
  { month: 'Feb', value: 215000 },
  { month: 'Mar', value: 248000 },
  { month: 'Apr', value: 198000 },
  { month: 'May', value: 312000 },
  { month: 'Jun', value: 389000 },
];

const TOP_PRODUCTS = [
  { name: 'Merino Wool Overcoat', category: 'Women', revenue: 82400, orders: 42, growth: 18.2 },
  { name: 'Silk Blend Midi Dress', category: 'Women', revenue: 74800, orders: 38, growth: 12.4 },
  { name: 'Cashmere Knit Cardigan', category: 'Women', revenue: 63200, orders: 55, growth: 8.7 },
  { name: 'Satin Slip Dress', category: 'Women', revenue: 58900, orders: 29, growth: 5.2 },
  { name: 'Retro Varsity Bomber', category: 'GenZ', revenue: 52100, orders: 61, growth: 22.5 },
];

const TRAFFIC_SOURCES = [
  { source: 'Organic Search', pct: 42, color: '#FF5A1F' },
  { source: 'Direct', pct: 24, color: '#F7F7F7' },
  { source: 'Social Media', pct: 18, color: '#909494' },
  { source: 'Email Campaign', pct: 10, color: '#BDC3C3' },
  { source: 'Referral', pct: 6, color: '#DEE1E1' },
];

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function AdminAnalytics() {
  const { products } = useStylie();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.value));
  const totalRevenue = MONTHLY_REVENUE.reduce((acc, m) => acc + m.value, 0);
  const avgOrderValue = Math.round(totalRevenue / 248);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 mb-10">
        <div>
          <p className="text-[10px] text-[#FF5A1F] font-bold tracking-widest uppercase mb-1">Business Intelligence</p>
          <h1 className="font-poppins font-extrabold text-2xl text-white tracking-tight">Sales Analytics</h1>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                period === p
                  ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                  : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'Total Revenue', value: formatINR(totalRevenue), sub: '+24.1% vs last period', icon: TrendingUp, up: true },
          { label: 'Orders Placed', value: '248', sub: '+8 from last period', icon: ShoppingBag, up: true },
          { label: 'Avg Order Value', value: formatINR(avgOrderValue), sub: '-2.3% vs last period', icon: Package, up: false },
          { label: 'New Customers', value: '184', sub: '+38 from last period', icon: Users, up: true },
        ].map(({ label, value, sub, icon: Icon, up }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-[20px] p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#FF5A1F]" />
              </div>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {sub.split(' ')[0]}
              </span>
            </div>
            <p className="font-poppins text-xl font-extrabold text-white">{value}</p>
            <p className="text-[10px] text-white/30 mt-0.5 font-bold uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[24px] p-6">
          <h2 className="font-poppins font-bold text-sm text-white mb-6">Monthly Revenue (2026)</h2>
          <div className="flex items-end gap-3 h-44">
            {MONTHLY_REVENUE.map((m) => {
              const heightPct = (m.value / maxRevenue) * 100;
              return (
                <div key={m.month} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="relative flex flex-col justify-end w-full" style={{ height: '160px' }}>
                    <div
                      className="w-full bg-[#FF5A1F]/20 rounded-t-lg group-hover:bg-[#FF5A1F]/40 transition-all duration-300 relative"
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatINR(m.value)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/30 font-bold">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
          <h2 className="font-poppins font-bold text-sm text-white mb-6">Traffic Sources</h2>
          <div className="flex flex-col gap-3.5">
            {TRAFFIC_SOURCES.map((s) => (
              <div key={s.source}>
                <div className="flex justify-between text-[10px] font-bold mb-1.5">
                  <span className="text-white/60">{s.source}</span>
                  <span className="text-white">{s.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="font-poppins font-bold text-sm text-white">Top Performing Products</h2>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              {['Product', 'Category', 'Revenue', 'Orders', 'Growth'].map((h) => (
                <th key={h} className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_PRODUCTS.map((p, idx) => (
              <tr key={p.name} className="border-b border-white/5 hover:bg-white/3 transition-colors last:border-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold text-white/40">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-white">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/50 capitalize">{p.category}</td>
                <td className="px-6 py-4 font-montserrat font-bold text-white">{formatINR(p.revenue)}</td>
                <td className="px-6 py-4 text-white/70">{p.orders}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 text-xs font-bold ${p.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {p.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(p.growth)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Rated Products (from real context) */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] p-6">
        <h2 className="font-poppins font-bold text-sm text-white mb-5">Highest Rated Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topRated.map((p) => (
            <div key={p.id} className="bg-white/5 rounded-2xl p-4 flex gap-3">
              <img src={p.images[0]} alt="" className="w-12 h-14 object-cover rounded-xl bg-white/10 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{p.title}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{p.brand}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-400">{p.rating}</span>
                  <span className="text-[10px] text-white/30">({p.reviewsCount})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
