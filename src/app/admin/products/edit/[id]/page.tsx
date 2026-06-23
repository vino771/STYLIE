"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, AlertCircle, X, Plus } from 'lucide-react';
import { useStylie } from '@/context/StylieContext';

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'One Size'];
const PRESET_COLORS = [
  { name: 'Chalk White', hex: '#F7F7F7' },
  { name: 'Ivory Beige', hex: '#EFEEE6' },
  { name: 'Midnight Black', hex: '#121818' },
  { name: 'Slate Gray', hex: '#909494' },
  { name: 'Burnt Orange', hex: '#FF5A1F' },
  { name: 'Desert Sand', hex: '#C4A882' },
  { name: 'Forest Green', hex: '#3A5A40' },
  { name: 'Navy Blue', hex: '#1B2A4A' },
];
const CATEGORIES = ['women', 'kids', 'genz', 'accessories'];

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</label>
      <input
        {...props}
        className="bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 transition-all"
      />
    </div>
  );
}

export default function AdminEditProduct() {
  const { id } = useParams<{ id: string }>();
  const { products, adminEditProduct } = useStylie();
  const router = useRouter();

  const product = products.find((p) => p.id === id);

  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('women');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [details, setDetails] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setBrand(product.brand);
      setCategory(product.category);
      setPrice(String(product.price));
      setDiscount(String(product.discount));
      setStock(String(product.stock));
      setDescription(product.description);
      setSelectedSizes(product.sizes);
      setSelectedColors(product.colors);
      setImages(product.images);
      setDetails(product.details.join('\n'));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-4 text-white/40">
        <AlertCircle className="w-8 h-8" />
        <p className="font-inter text-sm">Product not found.</p>
        <button onClick={() => router.push('/admin/products')} className="text-xs text-[#FF5A1F] font-bold hover:underline">
          Back to Products
        </button>
      </div>
    );
  }

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const toggleColor = (c: { name: string; hex: string }) =>
    setSelectedColors((prev) =>
      prev.some((x) => x.hex === c.hex) ? prev.filter((x) => x.hex !== c.hex) : [...prev, c]
    );

  const addImage = () => {
    if (imageUrl.trim()) {
      setImages((prev) => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const discountVal = parseFloat(discount) || 0;
    if (discountVal < 0 || discountVal > 90) {
      alert("Discount percentage must be between 0% and 90%.");
      return;
    }

    adminEditProduct(id, {
      title,
      brand,
      category: category as 'women' | 'kids' | 'genz' | 'accessories',
      price: parseFloat(price),
      discount: discountVal,
      stock: parseInt(stock),
      description,
      sizes: selectedSizes,
      colors: selectedColors,
      images: images.length > 0 ? images : product.images,
      details: details.split('\n').filter(Boolean),
    });

    setSuccess(true);
    setTimeout(() => router.push('/admin/products'), 1500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-[10px] text-[#FF5A1F] font-bold tracking-widest uppercase mb-0.5">Catalog Management</p>
          <h1 className="font-poppins font-extrabold text-2xl text-white tracking-tight">Edit Product</h1>
          <p className="text-xs text-white/30 mt-0.5 font-mono">{product.id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">

        {/* Basic Info */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-5">
          <h2 className="font-poppins font-bold text-sm text-white border-b border-white/10 pb-3">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <InputField label="Brand Name" value={brand} onChange={(e) => setBrand(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 appearance-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0E1117] capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <InputField label="Price (₹)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
            <InputField label="Discount (%)" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} min="0" max="90" />
          </div>
          {(parseFloat(price) || 0) > 0 && (
            <div className="text-xs text-white/50 bg-[#0E1117]/60 border border-white/5 px-4 py-2.5 rounded-xl font-mono">
              Live Price Helper: <span className="text-[#FF5A1F] font-bold">₹{Math.round((parseFloat(price) || 0) * (1 - (parseFloat(discount) || 0) / 100)).toLocaleString('en-IN')}</span>
              {(parseFloat(discount) || 0) > 0 && (
                <span className="ml-2 text-emerald-400 font-semibold">(Savings: ₹{Math.round((parseFloat(price) || 0) * ((parseFloat(discount) || 0) / 100)).toLocaleString('en-IN')})</span>
              )}
            </div>
          )}
          <InputField label="Stock Quantity" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required min="0" />
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 transition-all resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Materials & Care (one per line)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 transition-all resize-none"
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4">
          <h2 className="font-poppins font-bold text-sm text-white border-b border-white/10 pb-3">Available Sizes</h2>
          <div className="flex flex-wrap gap-2">
            {PRESET_SIZES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleSize(s)}
                className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all ${
                  selectedSizes.includes(s)
                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                    : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4">
          <h2 className="font-poppins font-bold text-sm text-white border-b border-white/10 pb-3">Available Colors</h2>
          <div className="flex flex-wrap gap-3">
            {PRESET_COLORS.map((c) => {
              const isSelected = selectedColors.some((x) => x.hex === c.hex);
              return (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => toggleColor(c)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-[#FF5A1F] bg-[#FF5A1F]/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                  {c.name}
                  {isSelected && <Check className="w-3 h-3 text-[#FF5A1F]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4">
          <h2 className="font-poppins font-bold text-sm text-white border-b border-white/10 pb-3">Product Images</h2>
          <div className="flex gap-3">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="flex-grow bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 transition-all"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-3 bg-white/10 border border-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/15 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
          {images.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt="" className="w-20 h-24 object-cover rounded-xl bg-white/5 border border-white/10" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-grow py-4 border border-white/10 rounded-2xl text-xs font-semibold text-white/50 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={success}
            className={`flex-grow py-4 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              success
                ? 'bg-emerald-500 text-white'
                : 'bg-[#FF5A1F] text-white hover:bg-[#e04a12] shadow-lg shadow-[#FF5A1F]/20'
            }`}
          >
            {success ? (
              <><Check className="w-4 h-4" /> Changes Saved! Redirecting...</>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
