"use client";

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useStylie } from '@/context/StylieContext';

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col gap-4 hover:bg-white/8 transition-colors">
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-white/20" />
      </div>
      <div>
        <p className="font-poppins text-2xl font-extrabold text-white tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-0.5">{label}</p>
        <p className="text-[10px] text-white/30 mt-1">{sub}</p>
      </div>
    </div>
  );
}

const ORDER_STATUSES = [
  { id: 'ORD-8821', customer: 'Arjun Mehta', items: 3, total: '₹12,480', status: 'Delivered', date: '20 Jun 2026' },
  { id: 'ORD-8820', customer: 'Priya Sharma', items: 1, total: '₹6,299', status: 'Processing', date: '20 Jun 2026' },
  { id: 'ORD-8819', customer: 'Kavya Reddy', items: 2, total: '₹18,950', status: 'Shipped', date: '19 Jun 2026' },
  { id: 'ORD-8818', customer: 'Rohit Gupta', items: 4, total: '₹31,200', status: 'Delivered', date: '19 Jun 2026' },
  { id: 'ORD-8817', customer: 'Sneha Iyer', items: 1, total: '₹4,499', status: 'Cancelled', date: '18 Jun 2026' },
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: 'bg-emerald-500/15 text-emerald-400',
  Processing: 'bg-amber-500/15 text-amber-400',
  Shipped: 'bg-blue-500/15 text-blue-400',
  Cancelled: 'bg-red-500/15 text-red-400',
};
const STATUS_ICONS: Record<string, React.ElementType> = {
  Delivered: CheckCircle2,
  Processing: Clock,
  Shipped: Truck,
  Cancelled: AlertCircle,
};

export default function AdminDashboard() {
  const { products, formatINR } = useStylie();

  const totalRevenue = products.reduce((acc, p) => acc + p.price * (1 - p.discount / 100) * (p.reviewsCount ?? 1), 0);
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock <= 5).length;

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 mb-10">
        <div>
          <p className="text-[10px] text-[#FF5A1F] font-bold tracking-widest uppercase mb-1">Welcome Back</p>
          <h1 className="font-poppins font-extrabold text-2xl text-white tracking-tight">Dashboard Overview</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5A1F] text-white rounded-xl text-xs font-semibold hover:bg-[#e04a12] transition-colors shadow-lg shadow-[#FF5A1F]/20"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          label="Total Revenue"
          value={formatINR(totalRevenue)}
          sub="+12.4% from last month"
          icon={TrendingUp}
          color="bg-[#FF5A1F]/20 text-[#FF5A1F]"
        />
        <StatCard
          label="Total Products"
          value={String(totalProducts)}
          sub={`${lowStock} items low stock`}
          icon={Package}
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          label="Orders This Month"
          value="248"
          sub="+8 from yesterday"
          icon={ShoppingBag}
          color="bg-purple-500/20 text-purple-400"
        />
        <StatCard
          label="Active Customers"
          value="1,842"
          sub="38 new this week"
          icon={Users}
          color="bg-emerald-500/20 text-emerald-400"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
          <h2 className="font-poppins font-bold text-sm text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[10px] text-[#FF5A1F] font-bold hover:underline uppercase tracking-wider">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Order ID</th>
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Customer</th>
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Items</th>
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Total</th>
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Status</th>
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody>
              {ORDER_STATUSES.map((order) => {
                const StatusIcon = STATUS_ICONS[order.status];
                return (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/3 transition-colors last:border-0">
                    <td className="px-6 py-4 font-montserrat font-bold text-white/80">{order.id}</td>
                    <td className="px-6 py-4 font-semibold text-white">{order.customer}</td>
                    <td className="px-6 py-4 text-white/50">{order.items} item{order.items > 1 ? 's' : ''}</td>
                    <td className="px-6 py-4 font-montserrat font-bold text-white">{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_COLORS[order.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/40">{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-[20px] p-5 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-amber-400">{lowStock} products are low on stock</p>
            <p className="text-[10px] text-amber-400/70 mt-1">
              Visit the{' '}
              <Link href="/admin/inventory" className="underline">Inventory</Link>
              {' '}page to review and restock.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
