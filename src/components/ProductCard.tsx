"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star, X, Check } from 'lucide-react';
import { useStylie, Product, ColorOption } from '@/context/StylieContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart, formatINR } = useStylie();
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountedPrice = product.price * (1 - product.discount / 100);
  const savingsAmount = product.price - discountedPrice;
  const isSaved = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0], 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleModalAdd = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    setQuickViewOpen(false);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <>
      <div 
        className="group relative flex flex-col bg-brand-white border border-brand-border/40 rounded-[20px] overflow-hidden card-lift"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-brand-white/80 backdrop-blur-md border border-brand-border/40 rounded-full flex items-center justify-center text-brand-dark hover:text-brand-orange hover:bg-brand-white transition-all shadow-sm"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'text-brand-orange fill-brand-orange' : 'text-brand-dark'}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-brand-dark text-brand-white text-[9px] font-bold tracking-wider rounded-lg font-inter uppercase">
              NEW
            </span>
          )}
          {product.discount > 0 && (
            <span className="px-2.5 py-1 bg-brand-orange text-brand-white text-[9px] font-bold tracking-wider rounded-lg font-inter">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Image Frame (4:5 Ratio) */}
        <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-brand-beige">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              hovered && product.images[1] ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
            loading="lazy"
          />
          {product.images[1] && (
            <img 
              src={product.images[1]} 
              alt={`${product.title} - Alternative`} 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              loading="lazy"
            />
          )}

          {/* Quick Action Overlay on Desktop */}
          <div className="absolute inset-0 bg-brand-dark/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-11 h-11 bg-brand-white text-brand-dark rounded-xl flex items-center justify-center hover:bg-brand-orange hover:text-brand-white shadow-lg"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={handleQuickAdd}
              disabled={addedAnimation}
              className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex-grow py-3 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange hover:text-brand-white flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Quick Add
                </>
              )}
            </button>
          </div>
        </Link>

        {/* Content Description */}
        <div className="p-5 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] text-brand-muted tracking-wider uppercase font-inter">{product.brand}</span>
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-3 h-3 fill-amber-500" />
                <span className="font-montserrat text-[10px] font-bold text-brand-dark">{product.rating}</span>
              </div>
            </div>
            <Link 
              href={`/product/${product.id}`}
              className="font-inter font-bold text-sm text-brand-dark hover:text-brand-orange transition-colors line-clamp-1"
            >
              {product.title}
            </Link>
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-brand-border/20">
            {/* Price section in Montserrat */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                {product.discount > 0 ? (
                  <>
                    <span className="font-montserrat text-sm font-semibold text-brand-orange">
                      {formatINR(discountedPrice)}
                    </span>
                    <span className="font-montserrat text-xs text-brand-muted line-through">
                      {formatINR(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-montserrat text-sm font-semibold text-brand-dark">
                    {formatINR(product.price)}
                  </span>
                )}
              </div>
              {product.discount > 0 && (
                <span className="inline-flex items-center self-start px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold rounded">
                  Save {formatINR(savingsAmount)}
                </span>
              )}
            </div>
            
            {/* Mobile Actions: Simple Cart icon button visible on touchscreens */}
            <button 
              onClick={handleQuickAdd}
              className="md:hidden w-8 h-8 bg-brand-dark text-brand-white rounded-lg flex items-center justify-center hover:bg-brand-orange transition-colors active:scale-95"
              aria-label="Add to Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-white rounded-[24px] max-w-2xl w-full p-6 md:p-8 flex flex-col md:flex-row gap-6 relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setQuickViewOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 border border-brand-border rounded-full hover:bg-brand-gray transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Image Gallery */}
            <div className="w-full md:w-1/2 bg-brand-beige rounded-2xl overflow-hidden aspect-[4/5] relative">
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Specifications */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-xs text-brand-muted tracking-wider uppercase font-inter">{product.brand}</span>
                <h3 className="font-poppins text-lg font-bold text-brand-dark mt-1 mb-2">{product.title}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="font-montserrat text-xs font-bold text-brand-dark">{product.rating}</span>
                  </div>
                  <span className="text-xs text-brand-muted">({product.reviewsCount} reviews)</span>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  {product.discount > 0 ? (
                    <>
                      <span className="font-montserrat text-lg font-bold text-brand-orange">
                        {formatINR(discountedPrice)}
                      </span>
                      <span className="font-montserrat text-sm text-brand-muted line-through">
                        {formatINR(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="font-montserrat text-lg font-bold text-brand-dark">
                      {formatINR(product.price)}
                    </span>
                  )}
                </div>
                {product.discount > 0 && (
                  <span className="inline-flex items-center mb-4 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-lg">
                    🎉 Save {formatINR(savingsAmount)}
                  </span>
                )}

                <p className="font-inter text-xs text-brand-muted leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Color Selector */}
                <div className="mb-4">
                  <span className="font-inter text-xs font-bold text-brand-muted block mb-2 uppercase">Color: {selectedColor.name}</span>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                          selectedColor.hex === c.hex 
                            ? 'border-brand-orange ring-1 ring-brand-orange' 
                            : 'border-brand-border hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {selectedColor.hex === c.hex && (
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            c.hex === '#F7F7F7' || c.hex === '#EFEEE6' ? 'bg-brand-dark' : 'bg-brand-white'
                          }`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                  <span className="font-inter text-xs font-bold text-brand-muted block mb-2 uppercase">Size: {selectedSize}</span>
                  <div className="flex gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          selectedSize === s
                            ? 'bg-brand-dark text-brand-white border-brand-dark'
                            : 'bg-brand-white text-brand-dark border-brand-border hover:bg-brand-beige'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleModalAdd}
                className="w-full bg-brand-dark text-brand-white py-4 rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart — {formatINR(discountedPrice)}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
