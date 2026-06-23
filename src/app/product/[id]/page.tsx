"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ChevronDown, 
  Truck, 
  RefreshCcw, 
  Check, 
  ThumbsUp, 
  ZoomIn, 
  X,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Move,
  Send
} from 'lucide-react';
import { useStylie, Product, ColorOption } from '@/context/StylieContext';
import ProductCard from '@/components/ProductCard';

// ─── Review Type ────────────────────────────────────────────────────────────────
interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpfulCount: number;
  verified: boolean;
  voted?: boolean;
}

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const { 
    products, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    recentlyViewed, 
    addRecentlyViewed,
    formatINR,
    profile
  } = useStylie();

  // Find current product
  const product = products.find((p) => p.id === productId);

  // ─── Core States ──────────────────────────────────────────────────────────────
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'faq'>('desc');
  const [reviewSort, setReviewSort] = useState<'newest' | 'helpful'>('newest');

  // ─── Zoom Modal States ────────────────────────────────────────────────────────
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // ─── Review States ────────────────────────────────────────────────────────────
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState(profile?.name || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Pre-fill reviewer name when profile is loaded
  useEffect(() => {
    if (profile?.name) {
      setReviewName(profile.name);
    }
  }, [profile]);

  // Setup defaults when product loads
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setSelectedImageIdx(0);
      addRecentlyViewed(product.id);

      // Load reviews from localStorage
      const storageKey = `stylie_reviews_${product.id}`;
      const savedReviews = localStorage.getItem(storageKey);
      if (savedReviews) {
        setReviewsList(JSON.parse(savedReviews));
      } else {
        const initialReviews: Review[] = [
          {
            id: 'r1',
            user: 'Marcus K.',
            rating: 5,
            date: 'June 10, 2026',
            title: 'Absolutely gorgeous fit',
            content: `The tailoring is top notch. Feels extremely premium, exactly what I expected from Stylie. It holds its silhouette perfectly and the material weight is substantial.`,
            helpfulCount: 24,
            verified: true
          },
          {
            id: 'r2',
            user: 'Eleanor P.',
            rating: 4,
            date: 'May 28, 2026',
            title: 'Premium feel but runs slightly large',
            content: `Beautiful hand-feel. The stitching is excellent and the color is gorgeous. I suggest sizing down by one if you prefer a slim tailored fit, otherwise it's a great relaxed look.`,
            helpfulCount: 12,
            verified: true
          }
        ];
        setReviewsList(initialReviews);
        localStorage.setItem(storageKey, JSON.stringify(initialReviews));
      }
    }
  }, [product, productId]);

  // ─── Not Found ────────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center">
        <h2 className="font-poppins text-2xl font-bold text-brand-dark">Product Not Found</h2>
        <p className="font-inter text-xs text-brand-muted mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="mt-6 inline-block px-6 py-2.5 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  // ─── Derived Values ───────────────────────────────────────────────────────────
  const discountedPrice = product.price * (1 - product.discount / 100);
  const savingsAmount = product.price - discountedPrice;
  const isSaved = wishlist.includes(product.id);

  // Compute average rating from reviews
  const avgRating = reviewsList.length > 0
    ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length
    : product.rating;

  // ─── Zoom Modal Handlers ──────────────────────────────────────────────────────
  const openLightbox = () => {
    setLightboxOpen(true);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleModalMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleModalMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleModalMouseUp = () => {
    setIsDragging(false);
  };

  const handleLightboxWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel((prev) => Math.min(prev + 0.25, 4));
    } else {
      setZoomLevel((prev) => {
        const next = Math.max(prev - 0.25, 1);
        if (next === 1) setPanOffset({ x: 0, y: 0 });
        return next;
      });
    }
  };

  const goToPrevImage = () => {
    setSelectedImageIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
    handleResetZoom();
  };

  const goToNextImage = () => {
    setSelectedImageIdx((prev) => (prev + 1) % product.images.length);
    handleResetZoom();
  };

  // ─── Cart Actions ─────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!selectedColor) return;
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedColor) return;
    addToCart(product, selectedSize, selectedColor, 1);
    router.push('/checkout');
  };

  // ─── Review Submission ────────────────────────────────────────────────────────
  const handleReviewSubmit = () => {
    setReviewError('');
    setReviewSuccess(false);

    // Validation
    if (!reviewName.trim()) {
      setReviewError('Please enter your name.');
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError('Please select a rating between 1 and 5 stars.');
      return;
    }
    if (!reviewTitle.trim()) {
      setReviewError('Please enter a review title.');
      return;
    }
    if (!reviewContent.trim() || reviewContent.trim().length < 10) {
      setReviewError('Please write at least 10 characters of feedback.');
      return;
    }

    const newReview: Review = {
      id: `r_${Date.now()}`,
      user: reviewName.trim(),
      rating: reviewRating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: reviewTitle.trim(),
      content: reviewContent.trim(),
      helpfulCount: 0,
      verified: false
    };

    const updated = [newReview, ...reviewsList];
    setReviewsList(updated);
    localStorage.setItem(`stylie_reviews_${product.id}`, JSON.stringify(updated));

    // Reset form
    setReviewTitle('');
    setReviewContent('');
    setReviewRating(5);
    setReviewHoverRating(0);
    setReviewSuccess(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSuccess(false);
    }, 2500);
  };

  // Helpful vote
  const handleHelpfulVote = (reviewId: string) => {
    const updated = reviewsList.map((r) => {
      if (r.id === reviewId && !r.voted) {
        return { ...r, helpfulCount: r.helpfulCount + 1, voted: true };
      }
      return r;
    });
    setReviewsList(updated);
    localStorage.setItem(`stylie_reviews_${product.id}`, JSON.stringify(updated));
  };

  // ─── Derived Lists ────────────────────────────────────────────────────────────
  const recommended = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const recentProducts = products
    .filter((p) => recentlyViewed.includes(p.id) && p.id !== product.id)
    .slice(0, 4);

  const getDeliveryEstimate = () => {
    const today = new Date();
    const minDay = new Date(today);
    minDay.setDate(today.getDate() + 3);
    const maxDay = new Date(today);
    maxDay.setDate(today.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${minDay.toLocaleDateString('en-US', options)} – ${maxDay.toLocaleDateString('en-US', options)}`;
  };

  // Sort reviews
  const sortedReviews = [...reviewsList].sort((a, b) => {
    if (reviewSort === 'helpful') return b.helpfulCount - a.helpfulCount;
    // newest: use id as fallback (newer reviews have higher timestamp ids)
    return 0; // keep insertion order (newest first since we prepend)
  });

  // Rating distribution for bar chart
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewsList.filter((r) => r.rating === star).length
  }));
  const maxRatingCount = Math.max(...ratingDistribution.map((d) => d.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      
      {/* Breadcrumb */}
      <div className="text-xs text-brand-muted mb-8 flex items-center gap-1.5 font-inter">
        <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-dark transition-colors">Shop</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-brand-dark transition-colors capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-brand-dark font-semibold truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Main product columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COLUMN: Gallery */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-[120px]">
          
          {/* Main Showcase Image — click to open zoom modal */}
          <div 
            className="w-full aspect-[4/5] bg-brand-beige border border-brand-border/40 rounded-[28px] overflow-hidden relative cursor-pointer group/img"
            onClick={openLightbox}
          >
            <img 
              src={product.images[selectedImageIdx]} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-[1.03]"
            />
            
            {/* Zoom Icon Overlay */}
            <div className="absolute bottom-4 right-4 z-10 w-10 h-10 bg-brand-white/90 backdrop-blur-md border border-brand-border/40 rounded-full flex items-center justify-center text-brand-dark shadow-lg opacity-0 group-hover/img:opacity-100 transition-all duration-300 hover:bg-brand-orange hover:text-brand-white hover:scale-110">
              <ZoomIn className="w-4.5 h-4.5" />
            </div>

            {product.discount > 0 && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-brand-orange text-brand-white text-[10px] font-bold tracking-wider rounded-lg uppercase">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden bg-brand-beige border transition-all ${
                    selectedImageIdx === idx 
                      ? 'border-brand-orange ring-1 ring-brand-orange' 
                      : 'border-brand-border/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail view" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Product Configurator */}
        <div className="flex flex-col gap-6">
          
          {/* Brand & Stars */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-brand-muted tracking-widest uppercase font-inter font-bold">{product.brand}</span>
              <div className="flex items-center gap-1">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < Math.floor(avgRating) ? 'fill-amber-500' : 'text-brand-border'}`} 
                    />
                  ))}
                </div>
                <span className="font-montserrat text-xs font-bold text-brand-dark ml-1">{avgRating.toFixed(1)}</span>
                <span className="text-[10px] text-brand-muted">({reviewsList.length} reviews)</span>
              </div>
            </div>
            <h1 className="font-poppins text-3xl md:text-4xl text-brand-dark font-extrabold tracking-tight mt-1">{product.title}</h1>
          </div>

          {/* Price Box */}
          <div className="p-5 bg-brand-beige border border-brand-border/40 rounded-[20px] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-brand-muted block font-bold uppercase mb-0.5">Price</span>
              <div className="flex items-baseline gap-3">
                {product.discount > 0 ? (
                  <>
                    <span className="font-montserrat text-2xl font-bold text-brand-orange">{formatINR(discountedPrice)}</span>
                    <span className="font-montserrat text-sm text-brand-muted line-through">{formatINR(product.price)}</span>
                  </>
                ) : (
                  <span className="font-montserrat text-2xl font-bold text-brand-dark">{formatINR(product.price)}</span>
                )}
              </div>
              {/* Save ₹X Tag */}
              {product.discount > 0 && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-lg">
                  🎉 Save {formatINR(savingsAmount)}
                </span>
              )}
            </div>

            {/* Availability details */}
            <div className="text-right">
              <span className="text-[10px] text-brand-muted block font-bold uppercase mb-0.5">Availability</span>
              {product.stock > 0 ? (
                <span className="text-xs text-brand-dark font-semibold flex items-center gap-1.5 justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  In Stock ({product.stock} items left)
                </span>
              ) : (
                <span className="text-xs text-brand-orange font-semibold">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <span className="font-inter text-xs font-bold text-brand-muted block mb-3 uppercase">Color: {selectedColor?.name}</span>
            <div className="flex gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setSelectedColor(c)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    selectedColor?.hex === c.hex 
                      ? 'border-brand-orange ring-1 ring-brand-orange' 
                      : 'border-brand-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor?.hex === c.hex && (
                    <span className={`w-2 h-2 rounded-full ${
                      c.hex === '#F7F7F7' || c.hex === '#EFEEE6' ? 'bg-brand-dark' : 'bg-brand-white'
                    }`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <span className="font-inter text-xs font-bold text-brand-muted uppercase">Size: {selectedSize}</span>
              <button className="text-[10px] text-brand-orange font-bold uppercase hover:underline">Size Chart</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-5 py-3 rounded-xl border text-xs font-semibold transition-all ${
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={addedAnimation || product.stock <= 0}
              className={`flex-grow py-4 rounded-2xl font-inter text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                addedAnimation 
                  ? 'bg-brand-orange text-brand-white shadow-md' 
                  : 'bg-brand-dark text-brand-white hover:bg-brand-orange shadow-sm'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  Item Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart — {formatINR(discountedPrice)}
                </>
              )}
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="px-8 py-4 border border-brand-dark rounded-2xl font-inter text-xs font-semibold hover:bg-brand-beige text-brand-dark transition-colors"
            >
              Buy Now
            </button>

            {/* Wishlist toggle */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-4 border border-brand-border rounded-2xl flex items-center justify-center text-brand-dark hover:bg-brand-beige hover:border-brand-dark transition-all"
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'text-brand-orange fill-brand-orange' : 'text-brand-dark'}`} />
            </button>
          </div>

          {/* Trust badges & Estimates */}
          <div className="border-t border-brand-border/40 pt-6 flex flex-col gap-3 font-inter text-xs text-brand-muted">
            <div className="flex items-center gap-3">
              <Truck className="w-4.5 h-4.5 text-brand-orange" />
              <span>Estimated Delivery: <span className="font-semibold text-brand-dark">{getDeliveryEstimate()}</span> (Free Express)</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCcw className="w-4.5 h-4.5 text-brand-orange" />
              <span>Complimentary Returns: 30-day trial return envelope included.</span>
            </div>
          </div>

        </div>

      </div>

      {/* -------------------- DETAILS, REVIEWS & FAQ ACCORDION TABS -------------------- */}
      <section className="mt-20 border-t border-brand-border/40 pt-10">
        
        {/* Tab Headers */}
        <div className="flex gap-8 border-b border-brand-border/40 pb-3 mb-8">
          {[
            { id: 'desc', label: 'PRODUCT DETAILS' },
            { id: 'reviews', label: `REVIEWS (${reviewsList.length})` },
            { id: 'faq', label: 'FAQ / HELP' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`font-poppins text-xs font-bold tracking-wider relative pb-3 transition-colors ${
                activeTab === tab.id ? 'text-brand-orange' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-orange" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="min-h-[200px]">
          
          {/* Tab 1: Product details bullet list */}
          {activeTab === 'desc' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <div>
                <h3 className="font-poppins text-sm font-bold text-brand-dark mb-4">SPECIFICATIONS</h3>
                <p className="font-inter text-xs text-brand-muted leading-relaxed mb-4">{product.description}</p>
              </div>
              <div>
                <h3 className="font-poppins text-sm font-bold text-brand-dark mb-4">MATERIALS & CARE</h3>
                <ul className="list-disc list-inside font-inter text-xs text-brand-muted leading-relaxed flex flex-col gap-2">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="list-item">{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Reviews — Rating Summary + List + Submission Form */}
          {activeTab === 'reviews' && (
            <div className="flex flex-col gap-8 animate-fade-in">

              {/* ── Rating Summary Bar ─────────────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 p-6 bg-brand-beige border border-brand-border/40 rounded-[20px]">
                {/* Big average */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="font-montserrat text-5xl font-bold text-brand-dark">{avgRating.toFixed(1)}</span>
                  <div className="flex items-center gap-0.5 mt-2 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-amber-500 text-amber-500' : 'text-brand-border'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-brand-muted font-inter">Based on {reviewsList.length} reviews</span>
                </div>
                {/* Distribution bars */}
                <div className="flex flex-col gap-2 justify-center">
                  {ratingDistribution.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="font-inter text-xs font-bold text-brand-dark w-8 text-right">{star} ★</span>
                      <div className="flex-grow h-2.5 bg-brand-border/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${(count / maxRatingCount) * 100}%` }}
                        />
                      </div>
                      <span className="font-inter text-[10px] text-brand-muted w-6">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Sort + Write Review Toggle ─────────────────────────────────── */}
              <div className="flex justify-between items-center border-b border-brand-border/20 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-inter text-xs text-brand-muted">Sorted by</span>
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value as any)}
                    className="bg-brand-beige text-brand-dark border-none rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
                <button
                  onClick={() => { setShowReviewForm(!showReviewForm); setReviewError(''); setReviewSuccess(false); }}
                  className="px-4 py-2 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors flex items-center gap-1.5"
                >
                  <Star className="w-3.5 h-3.5" />
                  Write a Review
                </button>
              </div>

              {/* ── Review Submission Form ──────────────────────────────────────── */}
              {showReviewForm && (
                <div className="p-6 border border-brand-border/40 rounded-[20px] bg-brand-white animate-fade-in">
                  <h4 className="font-poppins text-sm font-bold text-brand-dark mb-5">Share Your Experience</h4>

                  {/* Star Rating Picker */}
                  <div className="mb-5">
                    <label className="font-inter text-xs font-bold text-brand-muted block mb-2 uppercase">Your Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setReviewHoverRating(star)}
                          onMouseLeave={() => setReviewHoverRating(0)}
                          onClick={() => setReviewRating(star)}
                          className="p-0.5 transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              star <= (reviewHoverRating || reviewRating)
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-brand-border'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-inter text-brand-muted">
                        {reviewHoverRating || reviewRating} / 5
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="mb-4">
                    <label className="font-inter text-xs font-bold text-brand-muted block mb-1.5 uppercase">Your Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. John D."
                      className="w-full px-4 py-3 border border-brand-border/60 rounded-xl text-xs font-inter text-brand-dark placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 transition-colors"
                    />
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="font-inter text-xs font-bold text-brand-muted block mb-1.5 uppercase">Review Title</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Summarize your experience in a few words"
                      className="w-full px-4 py-3 border border-brand-border/60 rounded-xl text-xs font-inter text-brand-dark placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 transition-colors"
                    />
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <label className="font-inter text-xs font-bold text-brand-muted block mb-1.5 uppercase">Detailed Feedback</label>
                    <textarea
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Tell us about the quality, fit, material, and your overall experience..."
                      rows={4}
                      className="w-full px-4 py-3 border border-brand-border/60 rounded-xl text-xs font-inter text-brand-dark placeholder:text-brand-muted/50 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange/30 transition-colors resize-none"
                    />
                  </div>

                  {/* Error / Success Messages */}
                  {reviewError && (
                    <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-inter font-semibold rounded-xl">
                      {reviewError}
                    </div>
                  )}
                  {reviewSuccess && (
                    <div className="mb-4 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-inter font-semibold rounded-xl flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Review submitted successfully! Thank you for your feedback.
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleReviewSubmit}
                    disabled={reviewSuccess}
                    className="w-full py-3.5 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Review
                  </button>
                </div>
              )}

              {/* ── Reviews List ────────────────────────────────────────────────── */}
              <div className="flex flex-col gap-6">
                {sortedReviews.map((rev) => (
                  <div key={rev.id} className="border-b border-brand-border/40 pb-6 last:border-0">
                    <div className="flex justify-between items-baseline mb-2">
                      <div>
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-500' : 'text-brand-border'}`} 
                            />
                          ))}
                        </div>
                        <h4 className="font-inter font-bold text-xs text-brand-dark">{rev.title}</h4>
                      </div>
                      <span className="text-[10px] text-brand-muted">{rev.date}</span>
                    </div>
                    
                    <p className="font-inter text-xs text-brand-muted leading-relaxed mb-3">{rev.content}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-inter text-[10px] font-bold text-brand-dark">{rev.user}</span>
                        {rev.verified && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-bold rounded uppercase">
                            Verified
                          </span>
                        )}
                      </div>

                      {/* Helpful vote */}
                      <button
                        onClick={() => handleHelpfulVote(rev.id)}
                        className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 border rounded-lg transition-all ${
                          rev.voted 
                            ? 'bg-brand-orange text-brand-white border-brand-orange' 
                            : 'text-brand-muted border-brand-border hover:bg-brand-beige hover:text-brand-dark'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Helpful ({rev.helpfulCount})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: FAQ dropdown accordion */}
          {activeTab === 'faq' && (
            <div className="flex flex-col gap-4 max-w-3xl animate-fade-in">
              {[
                { q: "What is the return policy?", a: "STYLIE offers a complimentary 30-day return policy. Every package contains an envelope with a pre-paid courier label. Simply slide the item in, stick the label on, and drop it off at any Post Office." },
                { q: "How does the sizing run?", a: "Most of our items are engineered for a comfortable, clean silhouette. For tailored coats, they run true to size. For varsity jackets, they are styled as slightly oversized. Check the size guide above for precise metric measures." },
                { q: "Where are the products made?", a: "We design all products in our New York atelier. We collaborate with eco-certified knitting mills in Inner Mongolia for cashmere, and high-fashion ateliers in Italy and Portugal for sewing construction." }
              ].map((faq, index) => (
                <div key={index} className="border border-brand-border/40 rounded-2xl p-4 bg-brand-beige">
                  <h4 className="font-poppins font-bold text-xs text-brand-dark flex justify-between items-center cursor-pointer">
                    {faq.q}
                    <ChevronDown className="w-4 h-4 text-brand-muted" />
                  </h4>
                  <p className="font-inter text-xs text-brand-muted mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </section>

      {/* -------------------- RECOMMENDED PRODUCTS -------------------- */}
      {recommended.length > 0 && (
        <section className="mt-20 border-t border-brand-border/40 pt-16">
          <h3 className="font-poppins text-lg font-bold text-brand-dark mb-8 tracking-tight">YOU MAY ALSO LIKE</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommended.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* -------------------- RECENTLY VIEWED PRODUCTS -------------------- */}
      {recentProducts.length > 0 && (
        <section className="mt-20 border-t border-brand-border/40 pt-16">
          <h3 className="font-poppins text-lg font-bold text-brand-dark mb-8 tracking-tight">RECENTLY VIEWED</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ==================== IMAGE ZOOM MODAL ==================== */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-md flex flex-col"
          onMouseUp={handleModalMouseUp}
          onMouseLeave={handleModalMouseUp}
        >
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 relative z-10">
            <span className="font-inter text-xs text-brand-white/60">
              {selectedImageIdx + 1} / {product.images.length}
            </span>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="w-9 h-9 bg-brand-white/10 border border-brand-white/20 rounded-full flex items-center justify-center text-brand-white hover:bg-brand-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-montserrat text-xs text-brand-white/80 min-w-[40px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 4}
                className="w-9 h-9 bg-brand-white/10 border border-brand-white/20 rounded-full flex items-center justify-center text-brand-white hover:bg-brand-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </button>
              {zoomLevel > 1 && (
                <button
                  onClick={handleResetZoom}
                  className="ml-1 w-9 h-9 bg-brand-white/10 border border-brand-white/20 rounded-full flex items-center justify-center text-brand-white hover:bg-brand-white/20 transition-colors"
                  title="Reset zoom"
                >
                  <Move className="w-4 h-4" />
                </button>
              )}
            </div>

            <button 
              onClick={closeLightbox}
              className="w-9 h-9 border border-brand-white/30 rounded-full flex items-center justify-center hover:bg-brand-white/10 text-brand-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Container */}
          <div
            ref={zoomContainerRef}
            className="flex-grow flex items-center justify-center overflow-hidden relative"
            onMouseDown={handleModalMouseDown}
            onMouseMove={handleModalMouseMove}
            onWheel={handleLightboxWheel}
            style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            onClick={() => { if (zoomLevel <= 1) handleZoomIn(); }}
          >
            <img 
              src={product.images[selectedImageIdx]} 
              alt={product.title}
              className="max-h-[80vh] max-w-[85vw] object-contain rounded-2xl select-none"
              draggable={false}
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }}
            />
          </div>

          {/* Prev / Next navigation */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-white/10 border border-brand-white/20 rounded-full flex items-center justify-center text-brand-white hover:bg-brand-white/20 transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-white/10 border border-brand-white/20 rounded-full flex items-center justify-center text-brand-white hover:bg-brand-white/20 transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Thumbnail strip at bottom */}
          {product.images.length > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 px-6 relative z-10">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedImageIdx(idx); handleResetZoom(); }}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIdx === idx 
                      ? 'border-brand-orange opacity-100' 
                      : 'border-brand-white/20 opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
