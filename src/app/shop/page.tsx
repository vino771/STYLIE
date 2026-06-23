"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, X, Star, Sparkles } from 'lucide-react';
import { useStylie, Product, ColorOption } from '@/context/StylieContext';
import ProductCard from '@/components/ProductCard';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, formatINR } = useStylie();

  // Route parameters
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');

  // Filter States
  const [searchVal, setSearchVal] = useState(queryParam || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(50000); // max price filter
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  // UI state
  const [loading, setLoading] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Mega-menu subcategories that map to product-level filtering by keyword
  const MEGA_MENU_SUBS = [
    'kurta set','kurtas','tops','dresses','co-ord sets','bottoms','jumpsuits','shirts','kaftans','night suit','nighty','dupatta',
    'bags','jewellery','belts','watches','hair accessories',
    'trending','new arrivals','best sellers','wedding edit','office edit'
  ];

  // Sync category and search query from route parameters
  useEffect(() => {
    const cat = categoryParam || 'all';
    // Redirect men → women
    if (cat === 'men') {
      router.replace('/shop?category=women');
      return;
    }
    setSelectedCategory(cat);
  }, [categoryParam]);

  useEffect(() => {
    setSearchVal(queryParam || '');
  }, [queryParam]);

  // Simulate skeleton load on filter change
  const triggerFilterChange = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  };

  // Trigger loading when filters update
  useEffect(() => {
    triggerFilterChange();
    setVisibleCount(8); // Reset pagination on filter change
  }, [selectedCategory, selectedBrand, priceRange, selectedSize, selectedColor, onlyDiscounted, minRating, onlyInStock, sortBy, searchVal]);

  // Gather unique filters from products list
  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const sizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
  const colorsMap = new Map<string, string>();
  products.flatMap((p) => p.colors).forEach((c) => colorsMap.set(c.name, c.hex));
  const colors = Array.from(colorsMap.entries()).map(([name, hex]) => ({ name, hex }));

  // Apply filters
  const filteredProducts = products.filter((p) => {
    // 1. Search Query
    if (searchVal.trim() !== '') {
      const match = 
        p.title.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.description.toLowerCase().includes(searchVal.toLowerCase());
      if (!match) return false;
    }

    // 2. Category — handle standard categories and mega-menu subcategory keywords
    if (selectedCategory !== 'all') {
      const cat = selectedCategory.toLowerCase();
      if (MEGA_MENU_SUBS.includes(cat)) {
        if (p.collectionCategory?.toLowerCase() !== cat) return false;
      } else if (['women','kids','genz','accessories'].includes(cat)) {
        if (p.category !== cat) return false;
      }
      // unknown cat: show all
    }

    // 3. Brand
    if (selectedBrand !== 'all') {
      if (p.brand !== selectedBrand) return false;
    }

    // 4. Price
    const currentPrice = p.price * (1 - p.discount / 100);
    if (currentPrice > priceRange) return false;

    // 5. Size
    if (selectedSize !== 'all') {
      if (!p.sizes.includes(selectedSize)) return false;
    }

    // 6. Color
    if (selectedColor !== 'all') {
      if (!p.colors.some((c) => c.name === selectedColor)) return false;
    }

    // 7. Discount
    if (onlyDiscounted) {
      if (p.discount === 0) return false;
    }

    // 8. Rating
    if (p.rating < minRating) return false;

    // 9. Stock
    if (onlyInStock) {
      if (p.stock <= 0) return false;
    }

    return true;
  });

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.price * (1 - a.discount / 100);
    const priceB = b.price * (1 - b.discount / 100);

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    
    // Default newest: custom id sorting or isNew
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    return a.id.localeCompare(b.id);
  });

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  const clearAllFilters = () => {
    setSearchVal('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange(50000);
    setSelectedSize('all');
    setSelectedColor('all');
    setOnlyDiscounted(false);
    setMinRating(0);
    setOnlyInStock(false);
    setSortBy('newest');
    router.replace('/shop');
  };

  // Skeleton Card component
  const SkeletonCard = () => (
    <div className="border border-brand-border/30 rounded-[20px] overflow-hidden p-0 bg-brand-white flex flex-col gap-4 animate-pulse aspect-[4/6]">
      <div className="bg-brand-beige aspect-[4/5] w-full" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 w-1/3 bg-brand-gray rounded" />
        <div className="h-4 w-3/4 bg-brand-gray rounded" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-4 w-1/4 bg-brand-gray rounded" />
          <div className="h-6 w-8 bg-brand-gray rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      
      {/* Page Title */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:justify-between items-baseline gap-2">
        <div>
          <span className="text-[10px] text-brand-orange font-bold tracking-widest uppercase font-inter">THE COLLECTION</span>
          <h1 className="font-poppins text-4xl md:text-5xl font-extrabold tracking-tight mt-1 text-brand-dark">STYLIE ATELIER</h1>
        </div>
        <p className="font-inter text-xs text-brand-muted max-w-sm leading-relaxed">
          Showing {sortedProducts.length} Premium garments engineered for luxury comfort.
        </p>
      </div>

      {/* Sticky Filters bar */}
      <div className="sticky top-20 z-30 glass-effect border border-brand-border rounded-2xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        
        {/* Search & Category quick filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Quick Search */}
          <div className="relative w-full sm:w-60">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-brand-beige text-brand-dark border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-inter focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-muted" />
          </div>

          {/* Quick Category buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Women', 'Kids', 'GenZ', 'Accessories'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat.toLowerCase())}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.toLowerCase()
                    ? 'bg-brand-dark text-brand-white'
                    : 'bg-brand-beige text-brand-dark hover:bg-brand-gray'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sort and Drawer toggles */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-brand-border/40 pt-3 sm:pt-0">
          
          {/* Sorting */}
          <div className="relative flex items-center gap-1">
            <ArrowUpDown className="w-4 h-4 text-brand-muted absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-brand-beige border-none text-brand-dark pl-9 pr-8 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-orange appearance-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Sort: Top Rated</option>
            </select>
          </div>

          {/* Advanced Filter Button */}
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              showFiltersPanel 
                ? 'bg-brand-orange text-brand-white border-brand-orange' 
                : 'bg-brand-white text-brand-dark border-brand-border hover:bg-brand-beige'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Drawer / Collapsible filter panel */}
        {showFiltersPanel && (
          <div className="w-full lg:w-72 bg-brand-beige border border-brand-border rounded-[24px] p-6 flex flex-col gap-6 lg:sticky lg:top-[160px] max-h-[80vh] overflow-y-auto no-scrollbar shadow-sm">
            <div className="flex justify-between items-center border-b border-brand-border/60 pb-3">
              <h3 className="font-poppins font-bold text-sm text-brand-dark flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                FILTER OPTIONS
              </h3>
              <button 
                onClick={clearAllFilters}
                className="text-[10px] text-brand-orange font-bold uppercase hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-inter text-xs font-bold text-brand-muted uppercase">Max Price</span>
                <span className="font-montserrat text-xs font-bold text-brand-dark">{formatINR(priceRange)}</span>
              </div>
              <input 
                type="range" 
                min="4000" 
                max="50000" 
                step="1000"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-brand-orange cursor-pointer"
              />
            </div>

            {/* Brand Filter */}
            <div>
              <span className="font-inter text-xs font-bold text-brand-muted block mb-3 uppercase">Brand</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-brand-white border border-brand-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <span className="font-inter text-xs font-bold text-brand-muted block mb-3 uppercase">Size</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${
                    selectedSize === 'all'
                      ? 'bg-brand-dark text-brand-white border-brand-dark'
                      : 'bg-brand-white text-brand-dark border-brand-border hover:bg-brand-beige'
                  }`}
                >
                  All
                </button>
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-2 border rounded-lg text-xs font-semibold transition-all ${
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

            {/* Color Filter */}
            <div>
              <span className="font-inter text-xs font-bold text-brand-muted block mb-3 uppercase">Color</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`w-7 h-7 rounded-full border text-[9px] font-bold flex items-center justify-center transition-all ${
                    selectedColor === 'all' ? 'border-brand-orange ring-1 ring-brand-orange' : 'border-brand-border bg-brand-white hover:scale-105'
                  }`}
                >
                  ALL
                </button>
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                      selectedColor === c.name 
                        ? 'border-brand-orange ring-1 ring-brand-orange' 
                        : 'border-brand-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        c.hex === '#F7F7F7' || c.hex === '#EFEEE6' ? 'bg-brand-dark' : 'bg-brand-white'
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <span className="font-inter text-xs font-bold text-brand-muted block mb-2 uppercase">Minimum Rating</span>
              <div className="flex gap-2.5">
                {[0, 4.5, 4.7, 4.9].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`flex-grow py-2 border rounded-lg text-xs font-semibold flex items-center justify-center gap-0.5 transition-all ${
                      minRating === rating
                        ? 'bg-brand-dark text-brand-white border-brand-dark'
                        : 'bg-brand-white text-brand-dark border-brand-border hover:bg-brand-beige'
                    }`}
                  >
                    {rating === 0 ? 'Any' : (
                      <>
                        {rating} <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Toggles */}
            <div className="flex flex-col gap-3 border-t border-brand-border/40 pt-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-border text-brand-orange focus:ring-brand-orange cursor-pointer"
                />
                <span className="font-inter text-xs font-semibold text-brand-dark">Only Sale / Discounts</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-border text-brand-orange focus:ring-brand-orange cursor-pointer"
                />
                <span className="font-inter text-xs font-semibold text-brand-dark">Only In Stock</span>
              </label>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="flex-grow w-full">
          {loading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            /* Actual Product Cards Grid */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {displayedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Load More/Infinite scroll trigger */}
              {sortedProducts.length > displayedProducts.length && (
                <div className="mt-12 text-center">
                  <button
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        setVisibleCount(prev => prev + 4);
                        setLoading(false);
                      }, 400);
                    }}
                    className="px-8 py-4 bg-brand-dark text-brand-white rounded-2xl font-inter text-xs font-semibold hover:bg-brand-orange transition-colors"
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="bg-brand-beige border border-brand-border/40 rounded-[24px] p-12 text-center flex flex-col items-center justify-center gap-4">
              <span className="font-poppins text-lg font-bold text-brand-dark">No Products Match Filters</span>
              <p className="font-inter text-xs text-brand-muted max-w-sm leading-relaxed">
                We couldn't find any premium garments matching your current filter choices. Try clearing some options or checking spelling.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center font-inter text-xs text-brand-muted">
        Loading Shop Catalog...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
