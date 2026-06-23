"use client";

import React, { useState } from 'react';
import { Check, Edit3, Save, Eye } from 'lucide-react';

interface CMSBlock {
  id: string;
  section: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'url';
}

const INITIAL_BLOCKS: CMSBlock[] = [
  { id: 'hero_title', section: 'Hero Banner', label: 'Hero Headline', value: 'WEAR THE FUTURE', type: 'text' },
  { id: 'hero_sub', section: 'Hero Banner', label: 'Hero Subheadline', value: 'Premium contemporary fashion for the modern individual.', type: 'textarea' },
  { id: 'hero_cta', section: 'Hero Banner', label: 'CTA Button Text', value: 'Shop New Arrivals', type: 'text' },
  { id: 'hero_img', section: 'Hero Banner', label: 'Hero Background Image URL', value: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200', type: 'url' },
  { id: 'marquee_text', section: 'Scrolling Banner', label: 'Marquee Text', value: 'NEW ARRIVALS — FREE DELIVERY OVER ₹15,000 — LUXURY FASHION — MADE TO LAST — SUSTAINABLE ATELIERS —', type: 'textarea' },
  { id: 'collection_title', section: 'Featured Collection', label: 'Section Title', value: 'THE ATELIER EDIT', type: 'text' },
  { id: 'collection_sub', section: 'Featured Collection', label: 'Section Subtitle', value: 'Curated drops. Zero compromise.', type: 'text' },
  { id: 'shipping_banner', section: 'Shipping Strip', label: 'Shipping Banner Text', value: 'Free Express Delivery on orders over ₹15,000 — Complimentary Returns', type: 'textarea' },
  { id: 'footer_tagline', section: 'Footer', label: 'Brand Tagline', value: 'Premium Indian fashion. Designed to outlast trends.', type: 'text' },
  { id: 'footer_email', section: 'Footer', label: 'Contact Email', value: 'hello@stylie.in', type: 'text' },
];

export default function AdminCMS() {
  const [blocks, setBlocks] = useState<CMSBlock[]>(INITIAL_BLOCKS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const grouped = blocks.reduce<Record<string, CMSBlock[]>>((acc, b) => {
    if (!acc[b.section]) acc[b.section] = [];
    acc[b.section].push(b);
    return acc;
  }, {});

  const updateBlock = (id: string, value: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, value } : b)));
  };

  const handleSave = (id: string) => {
    setEditingId(null);
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">

      <div className="mb-8">
        <p className="text-[10px] text-[#FF5A1F] font-bold tracking-widest uppercase mb-1">Content Management</p>
        <h1 className="font-poppins font-extrabold text-2xl text-white tracking-tight">CMS Editor</h1>
        <p className="text-xs text-white/30 mt-2">Edit homepage copy, banners, and public-facing content here.</p>
      </div>

      <div className="flex flex-col gap-8">
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="font-poppins font-bold text-sm text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FF5A1F] rounded-full" />
                {section}
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-5">
              {items.map((block) => {
                const isEditing = editingId === block.id;
                const isSaved = savedId === block.id;

                return (
                  <div key={block.id} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{block.label}</label>
                      <div className="flex items-center gap-2">
                        {isSaved && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                            <Check className="w-3 h-3" />
                            Saved
                          </span>
                        )}
                        {isEditing ? (
                          <button
                            onClick={() => handleSave(block.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF5A1F] text-white rounded-lg text-[10px] font-bold hover:bg-[#e04a12] transition-colors"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(block.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 rounded-lg text-[10px] font-bold hover:text-white hover:bg-white/10 transition-all"
                          >
                            <Edit3 className="w-3 h-3" />
                            Edit
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      block.type === 'textarea' ? (
                        <textarea
                          value={block.value}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          rows={3}
                          autoFocus
                          className="bg-white/5 border border-[#FF5A1F]/40 text-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 transition-all resize-none w-full"
                        />
                      ) : (
                        <input
                          type={block.type === 'url' ? 'url' : 'text'}
                          value={block.value}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          autoFocus
                          className="bg-white/5 border border-[#FF5A1F]/40 text-white rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#FF5A1F]/60 transition-all w-full"
                        />
                      )
                    ) : (
                      <div className="bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-xs text-white/60 font-medium leading-relaxed">
                        {block.value || <span className="text-white/20 italic">Empty</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
