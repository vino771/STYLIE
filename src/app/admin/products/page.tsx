"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Edit2, Trash2, AlertCircle, Package, Star } from 'lucide-react';
import { useStylie } from '@/context/StylieContext';

export default function AdminProducts() {
  const { products, adminDeleteProduct, formatINR } = useStylie();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleDelete = (id: string) => {
    adminDeleteProduct(id);
    setConfirmDelete(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4 mb-8">
        <div>
          <p className="text-[10px] text-[#FF5A1F] font-bold tracking-widest uppercase mb-1">Catalog Management</p>
          <h1 className="font-poppins font-extrabold text-2xl text-white tracking-tight">
            Products <span className="text-white/30 text-lg">({products.length})</span>
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5A1F] text-white rounded-xl text-xs font-semibold hover:bg-[#e04a12] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search products or brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 transition-all"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 transition-all appearance-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c} className="bg-[#0E1117]">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Product</th>
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Category</th>
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Price</th>
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Stock</th>
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Rating</th>
                <th className="text-left px-6 py-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-white/30 font-inter">
                    <Package className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    No products match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const discountedPrice = product.price * (1 - product.discount / 100);
                  return (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/3 transition-colors last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-10 h-12 object-cover rounded-lg bg-white/10 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate max-w-[160px]">{product.title}</p>
                            <p className="text-[10px] text-white/40 mt-0.5">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize px-2.5 py-1 bg-white/8 text-white/70 rounded-lg text-[10px] font-bold">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-montserrat font-bold text-white">{formatINR(discountedPrice)}</p>
                        {product.discount > 0 && (
                          <p className="text-[10px] text-white/30 line-through">{formatINR(product.price)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-montserrat font-bold ${product.stock <= 5 ? 'text-amber-400' : 'text-white'}`}>
                          {product.stock}
                        </span>
                        {product.stock <= 5 && (
                          <AlertCircle className="w-3 h-3 text-amber-400 inline ml-1 mb-0.5" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-white">{product.rating}</span>
                          <span className="text-white/30 text-[10px]">({product.reviewsCount})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                            title="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(product.id)}
                            className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#161B24] border border-white/10 rounded-[24px] p-8 max-w-sm w-full flex flex-col gap-5 shadow-2xl">
            <div className="w-12 h-12 bg-red-500/15 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-sm text-white">Delete Product?</h3>
              <p className="font-inter text-xs text-white/40 mt-1">
                This will permanently remove the product from the catalog. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-grow py-3 border border-white/10 rounded-xl text-xs font-semibold text-white/60 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-grow py-3 bg-red-500 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
