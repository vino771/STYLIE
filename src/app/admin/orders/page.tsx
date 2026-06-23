"use client";

import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, Truck, AlertCircle, Package, Filter } from 'lucide-react';

const MOCK_ORDERS = [
  { id: 'ORD-8821', customer: 'Arjun Mehta', email: 'arjun@gmail.com', items: [{ name: 'Tailored Wool Blazer', qty: 2, price: '₹5,999' }], total: 12480, status: 'Delivered', date: '20 Jun 2026', payment: 'UPI', city: 'Mumbai' },
  { id: 'ORD-8820', customer: 'Priya Sharma', email: 'priya@gmail.com', items: [{ name: 'Cashmere Knit Cardigan', qty: 1, price: '₹6,299' }], total: 6299, status: 'Processing', date: '20 Jun 2026', payment: 'Cards', city: 'Delhi' },
  { id: 'ORD-8819', customer: 'Kavya Reddy', email: 'kavya@gmail.com', items: [{ name: 'Wide Leg Linen Trousers', qty: 1, price: '₹4,499' }, { name: 'Silk Blend Midi Dress', qty: 1, price: '₹8,299' }], total: 18950, status: 'Shipped', date: '19 Jun 2026', payment: 'Cards', city: 'Hyderabad' },
  { id: 'ORD-8818', customer: 'Rohit Gupta', email: 'rohit@gmail.com', items: [{ name: 'Heritage Varsity Jacket', qty: 1, price: '₹12,999' }, { name: 'Relaxed Fit Chinos', qty: 3, price: '₹3,499' }], total: 31200, status: 'Delivered', date: '19 Jun 2026', payment: 'COD', city: 'Pune' },
  { id: 'ORD-8817', customer: 'Sneha Iyer', email: 'sneha@gmail.com', items: [{ name: 'Minimal Leather Belt', qty: 1, price: '₹2,999' }], total: 4499, status: 'Cancelled', date: '18 Jun 2026', payment: 'UPI', city: 'Chennai' },
  { id: 'ORD-8816', customer: 'Kiran Singh', email: 'kiran@gmail.com', items: [{ name: 'Merino Wool Coat', qty: 1, price: '₹18,999' }], total: 18999, status: 'Processing', date: '18 Jun 2026', payment: 'Wallet', city: 'Bengaluru' },
  { id: 'ORD-8815', customer: 'Aditya Nair', email: 'aditya@gmail.com', items: [{ name: 'Classic Tailored Blazer', qty: 1, price: '₹14,999' }], total: 14999, status: 'Shipped', date: '17 Jun 2026', payment: 'Cards', city: 'Kochi' },
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

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] text-[#FF5A1F] font-bold tracking-widest uppercase mb-1">Order Management</p>
        <h1 className="font-poppins font-extrabold text-2xl text-white tracking-tight">
          Orders <span className="text-white/30 text-lg">({MOCK_ORDERS.length})</span>
        </h1>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => {
          const count = MOCK_ORDERS.filter((o) => o.status === s).length;
          const Icon = STATUS_ICONS[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`p-4 rounded-[16px] border text-left transition-all ${filterStatus === s ? 'border-[#FF5A1F] bg-[#FF5A1F]/10' : 'border-white/10 bg-white/5 hover:bg-white/8'}`}
            >
              <div className={`flex items-center gap-2 text-xs font-bold mb-1 ${STATUS_COLORS[s].split(' ')[1]}`}>
                <Icon className="w-3.5 h-3.5" />
                {s}
              </div>
              <p className="font-poppins text-xl font-extrabold text-white">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#FF5A1F]/60 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {['Order ID', 'Customer', 'City', 'Total', 'Payment', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const StatusIcon = STATUS_ICONS[order.status];
                return (
                  <React.Fragment key={order.id}>
                    <tr
                      className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <td className="px-6 py-4 font-montserrat font-bold text-white/80">{order.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{order.customer}</p>
                        <p className="text-[10px] text-white/30">{order.email}</p>
                      </td>
                      <td className="px-6 py-4 text-white/50">{order.city}</td>
                      <td className="px-6 py-4 font-montserrat font-bold text-white">{formatINR(order.total)}</td>
                      <td className="px-6 py-4 text-white/50">{order.payment}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-[10px] font-bold ${STATUS_COLORS[order.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/40">{order.date}</td>
                    </tr>
                    {expanded === order.id && (
                      <tr className="bg-white/3 border-b border-white/5">
                        <td colSpan={7} className="px-6 py-4">
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3">Order Items</p>
                          <div className="flex flex-col gap-1.5">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                  <Package className="w-3.5 h-3.5 text-white/30" />
                                  <span className="text-white/70 font-medium">{item.name}</span>
                                  <span className="text-white/30">×{item.qty}</span>
                                </div>
                                <span className="font-montserrat font-bold text-white">{item.price}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
