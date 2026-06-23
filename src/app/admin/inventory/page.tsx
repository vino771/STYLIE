"use client";

import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2, PackageSearch, Plus } from 'lucide-react';
import { useStylie } from '@/context/StylieContext';

export default function AdminInventory() {
  const { products, adminEditProduct, formatINR } = useStylie();
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStockValue, setNewStockValue] = useState<string>('');

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    if (stockFilter === 'low') return matchSearch && p.stock > 0 && p.stock <= 10;
    if (stockFilter === 'out') return matchSearch && p.stock === 0;
    return matchSearch;
  });

  const handleUpdateStock = (id: string) => {
    const val = parseInt(newStockValue);
    if (!isNaN(val) && val >= 0) {
      adminEditProduct(id, { stock: val });
    }
    setEditingId(null);
    setNewStockValue('');
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    if (stock <= 5) return { label: 'Critical Low', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    if (stock <= 10) return { label: 'Low Stock', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: 'In Stock', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <div className="mb-8">
        <p className="text-[10px] text-[#FF5A1F] font-bold tracking-widest uppercase mb-1">Stock Management</p>
        <h1 className="font-poppins font-extrabold text-2xl text-white tracking-tight">Inventory</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-5">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Inventory Value</p>
          <p className="font-poppins text-xl font-extrabold text-white">{formatINR(totalValue)}</p>
          <p className="text-[10px] text-white/30 mt-1">Across {products.length} products</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-[20px] p-5">
          <p className="text-[10px] text-amber-400/70 font-bold uppercase tracking-widest mb-2">Low Stock</p>
          <p className="font-poppins text-xl font-extrabold text-amber-400">{lowStockCount}</p>
          <p className="text-[10px] text-amber-400/50 mt-1">Needs restocking soon</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-[20px] p-5">
          <p className="text-[10px] text-red-400/70 font-bold uppercase tracking-widest mb-2">Out of Stock</p>
          <p className="font-poppins text-xl font-extrabold text-red-400">{outOfStockCount}</p>
          <p className="text-[10px] text-red-400/50 mt-1">Requires immediate action</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#FF5A1F]/60 transition-all"
          />
        </div>
        {(['all', 'low', 'out'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStockFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
              stockFilter === f
                ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All Products' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Update Stock'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-white/30">
                    <PackageSearch className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    No products match filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const status = getStockStatus(p.stock);
                  const isEditing = editingId === p.id;
                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt="" className="w-9 h-11 object-cover rounded-lg bg-white/10" />
                          <div>
                            <p className="font-semibold text-white">{p.title}</p>
                            <p className="text-[10px] text-white/30">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-white/50">{p.category}</td>
                      <td className="px-6 py-4 font-montserrat font-bold text-white">{formatINR(p.price)}</td>
                      <td className="px-6 py-4 font-montserrat font-bold text-2xl text-white">{p.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={newStockValue}
                              onChange={(e) => setNewStockValue(e.target.value)}
                              autoFocus
                              min="0"
                              className="w-20 bg-white/10 border border-[#FF5A1F]/60 text-white rounded-lg px-3 py-2 text-xs focus:outline-none"
                            />
                            <button onClick={() => handleUpdateStock(p.id)} className="p-1.5 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingId(p.id); setNewStockValue(String(p.stock)); }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/10 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            Update
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
