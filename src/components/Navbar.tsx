"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { useStylie } from '@/context/StylieContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    cart, 
    wishlist, 
    products, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    toggleWishlist,
    appliedCoupon,
    formatINR,
    enabledCollections
  } = useStylie();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const megaMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Track scroll position to change navbar opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawers when path changes
  useEffect(() => {
    setSearchOpen(false);
    setCartOpen(false);
    setWishlistOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (megaMenuCloseTimer.current) clearTimeout(megaMenuCloseTimer.current);
    };
  }, []);

  // Compute Cart Calculations
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.price * (1 - item.product.discount / 100);
    return acc + price * item.quantity;
  }, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = subtotal * (appliedCoupon.value / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }
  const finalPrice = Math.max(0, subtotal - discountAmount);

  // Search filter
  const filteredProducts = searchQuery.trim() === '' ? [] : products.filter(
    (p) => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'GENZ', href: '/shop?category=genz' }
  ];

  const MEGA_MENU = {
    CLOTHING: ['Kurta Set','Kurtas','Tops','Dresses','Co-Ord Sets','Bottoms','Jumpsuits','Shirts','Kaftans','Night Suit','Nighty','Dupatta'],
    ACCESSORIES: ['Bags','Jewellery','Belts','Watches','Hair Accessories'],
    EDITS: ['Trending','New Arrivals','Best Sellers','Wedding Edit','Office Edit'],
  };
  const visibleMegaMenu = Object.entries(MEGA_MENU)
    .map(([group, items]) => [group, items.filter((item) => enabledCollections.includes(item))] as const)
    .filter(([, items]) => items.length > 0);

  const openMegaMenu = () => {
    if (megaMenuCloseTimer.current) clearTimeout(megaMenuCloseTimer.current);
    setMegaMenuOpen(true);
  };

  const closeMegaMenu = () => {
    megaMenuCloseTimer.current = setTimeout(() => setMegaMenuOpen(false), 120);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'glass-effect border-b border-brand-border py-4 shadow-sm' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="font-poppins text-2xl tracking-tighter text-brand-dark flex items-center gap-1 font-extrabold">
            STYLIE<span className="w-2.5 h-2.5 bg-brand-orange rounded-full inline-block"></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="font-inter text-sm font-medium tracking-wide text-brand-dark relative py-1 hover:text-brand-orange transition-colors group"
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-orange transform origin-left transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </Link>
              );
            })}

            {/* Collections with Mega Menu */}
            <div className="relative" onMouseEnter={openMegaMenu} onMouseLeave={closeMegaMenu}>
              <button
                className={`font-inter text-sm font-medium tracking-wide text-brand-dark relative py-1 hover:text-brand-orange transition-colors flex items-center gap-1 ${
                  megaMenuOpen ? 'text-brand-orange' : ''
                }`}
              >
                Collections
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-orange transform origin-left transition-transform duration-300 ${megaMenuOpen ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>

              <AnimatePresence>
                {megaMenuOpen && (
                  <>
                    <div className="absolute top-full left-0 h-4 w-full z-50" />
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.16 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[680px] bg-brand-white border border-brand-border/60 rounded-[24px] shadow-2xl p-8 grid grid-cols-3 gap-8 z-50"
                    >
                      {visibleMegaMenu.map(([group, items]) => (
                        <div key={group}>
                          <p className="font-inter text-[10px] font-bold text-brand-orange tracking-widest uppercase mb-4">{group}</p>
                          <div className="flex flex-col gap-2">
                            {items.map((item) => (
                              <Link
                                key={item}
                                href={`/shop?category=${encodeURIComponent(item.toLowerCase())}`}
                                onClick={() => setMegaMenuOpen(false)}
                                className="font-inter text-xs text-brand-muted hover:text-brand-orange hover:translate-x-1 transition-all duration-150 flex items-center gap-1 group/item"
                              >
                                <span className="w-1 h-1 rounded-full bg-brand-border group-hover/item:bg-brand-orange transition-colors flex-shrink-0" />
                                {item}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search Trigger */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-1 text-brand-dark hover:text-brand-orange transition-colors relative group"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Profile */}
            <Link 
              href="/profile" 
              className="p-1 text-brand-dark hover:text-brand-orange transition-colors relative group"
              aria-label="Profile Page"
            >
              <User className="w-5 h-5" />
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Wishlist Icon */}
            <button 
              onClick={() => setWishlistOpen(true)}
              className="p-1 text-brand-dark hover:text-brand-orange transition-colors relative group"
              aria-label="Open Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-orange text-brand-white text-[10px] font-bold rounded-full flex items-center justify-center font-montserrat">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button 
              onClick={() => setCartOpen(true)}
              className="p-1 text-brand-dark hover:text-brand-orange transition-colors relative group"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-orange text-brand-white text-[10px] font-bold rounded-full flex items-center justify-center font-montserrat">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="flex md:hidden items-center gap-4">
            <button 
              onClick={() => setCartOpen(true)}
              className="p-1 text-brand-dark relative"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-brand-orange text-brand-white text-[10px] font-bold rounded-full flex items-center justify-center font-montserrat">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="p-1 text-brand-dark"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </nav>

      {/* -------------------- DRAWERS & OVERLAYS -------------------- */}
      <AnimatePresence>
        
        {/* 1. Instant Search Overlay */}
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/50 backdrop-blur-md z-50 flex flex-col justify-start"
          >
            <motion.div 
              initial={{ translateY: -30 }}
              animate={{ translateY: 0 }}
              exit={{ translateY: -30 }}
              className="bg-brand-white border-b border-brand-border py-10 px-6 w-full"
            >
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-poppins text-lg font-bold tracking-tight">SEARCH</h3>
                  <button 
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="p-2 border border-brand-border rounded-full hover:bg-brand-gray transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input 
                    type="text" 
                    placeholder="Search premium collections, items..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-brand-beige text-brand-dark placeholder-brand-muted border-none rounded-2xl py-5 px-6 pl-14 text-lg font-inter focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all"
                  />
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-brand-muted" />
                </form>

                {/* Instant Suggestions */}
                {searchQuery.trim() !== '' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="font-inter text-xs text-brand-muted font-bold tracking-wider mb-3">MATCHING ITEMS</h4>
                      {filteredProducts.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {filteredProducts.map((p) => (
                            <Link 
                              key={p.id} 
                              href={`/product/${p.id}`}
                              className="flex items-center gap-4 p-2 rounded-xl hover:bg-brand-beige transition-colors"
                            >
                              <img src={p.images[0]} alt={p.title} className="w-12 h-15 object-cover rounded-lg" />
                              <div>
                                <p className="font-inter font-semibold text-sm text-brand-dark">{p.title}</p>
                                <p className="font-montserrat text-xs text-brand-orange font-semibold">{formatINR(p.price)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="font-inter text-sm text-brand-muted">No products found matching "{searchQuery}"</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-inter text-xs text-brand-muted font-bold tracking-wider mb-3">QUICK CATEGORIES</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Women', 'GenZ', 'Accessories', 'Kids'].map((cat) => (
                          <Link
                            key={cat}
                            href={`/shop?category=${cat.toLowerCase()}`}
                            className="px-4 py-2 border border-brand-border rounded-xl text-sm font-medium hover:bg-brand-orange hover:text-brand-white hover:border-brand-orange transition-all"
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Popular searches suggestions when search is empty */}
                {searchQuery.trim() === '' && (
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                      <h4 className="font-inter text-xs text-brand-muted font-bold tracking-wider mb-3">POPULAR SEARCHES</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Overcoat', 'Satin Dress', 'Cashmere', 'Trench', 'Sunglasses'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchQuery(term)}
                            className="px-4 py-2 bg-brand-beige rounded-xl text-xs font-semibold hover:bg-brand-gray transition-colors flex items-center gap-1.5"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-brand-orange" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 2. Cart Drawer */}
        {cartOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-50 flex justify-end"
          >
            {/* Drawer Panel */}
            <motion.div 
              initial={{ translateX: '100%' }}
              animate={{ translateX: 0 }}
              exit={{ translateX: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="bg-brand-white w-full max-w-md h-full flex flex-col shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-brand-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-orange" />
                  <h3 className="font-poppins text-lg font-bold">YOUR CART ({cartItemCount})</h3>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="p-2 border border-brand-border rounded-full hover:bg-brand-gray transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4 no-scrollbar">
                {cart.length > 0 ? (
                  cart.map((item) => {
                    const price = item.product.price * (1 - item.product.discount / 100);
                    return (
                      <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`} className="flex gap-4 border-b border-brand-border/40 pb-4 last:border-b-0">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.title} 
                          className="w-20 h-24 object-cover rounded-xl bg-brand-beige"
                        />
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <Link 
                                href={`/product/${item.product.id}`}
                                className="font-inter font-bold text-sm text-brand-dark hover:text-brand-orange transition-colors"
                              >
                                {item.product.title}
                              </Link>
                              <button 
                                onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor.hex)}
                                className="text-brand-muted hover:text-brand-orange transition-colors p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="font-inter text-xs text-brand-muted mt-0.5">
                              Size: <span className="font-semibold text-brand-dark">{item.selectedSize}</span> | Color: <span className="font-semibold text-brand-dark">{item.selectedColor.name}</span>
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-brand-border rounded-lg bg-brand-white">
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity - 1)}
                                className="p-1 px-2 text-brand-muted hover:text-brand-dark transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-montserrat font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity + 1)}
                                className="p-1 px-2 text-brand-muted hover:text-brand-dark transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              {item.product.discount > 0 && (
                                <p className="font-montserrat text-xs text-brand-muted line-through">{formatINR(item.product.price * item.quantity)}</p>
                              )}
                              <p className="font-montserrat text-sm text-brand-dark font-semibold">{formatINR(price * item.quantity)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-beige flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-brand-muted" />
                    </div>
                    <div>
                      <h4 className="font-poppins font-bold text-md">Your cart is empty</h4>
                      <p className="font-inter text-xs text-brand-muted mt-1 max-w-xs">Explore our latest luxury drops and fill your cart with style.</p>
                    </div>
                    <button 
                      onClick={() => { setCartOpen(false); router.push('/shop'); }}
                      className="px-6 py-2.5 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors mt-2"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Calculations */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-brand-border bg-brand-beige">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between text-xs text-brand-muted">
                      <span>Subtotal</span>
                      <span className="font-montserrat font-semibold">{formatINR(subtotal)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-xs text-brand-orange">
                        <span>Coupon Savings ({appliedCoupon.code})</span>
                        <span className="font-montserrat font-semibold">-{formatINR(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-brand-dark font-bold border-t border-brand-border/40 pt-2">
                      <span>Total (Est.)</span>
                      <span className="font-montserrat text-md text-brand-orange">{formatINR(finalPrice)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setCartOpen(false); router.push('/checkout'); }}
                    className="w-full bg-brand-dark text-brand-white py-4 rounded-2xl font-inter text-sm font-medium hover:bg-brand-orange transition-all flex items-center justify-center gap-2 group"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}

        {/* 3. Wishlist Drawer */}
        {wishlistOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-50 flex justify-end"
          >
            <motion.div 
              initial={{ translateX: '100%' }}
              animate={{ translateX: 0 }}
              exit={{ translateX: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="bg-brand-white w-full max-w-md h-full flex flex-col shadow-2xl relative"
            >
              <div className="p-6 border-b border-brand-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-brand-orange fill-brand-orange" />
                  <h3 className="font-poppins text-lg font-bold">YOUR WISHLIST ({wishlist.length})</h3>
                </div>
                <button 
                  onClick={() => setWishlistOpen(false)}
                  className="p-2 border border-brand-border rounded-full hover:bg-brand-gray transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4 no-scrollbar">
                {wishlist.length > 0 ? (
                  products.filter((p) => wishlist.includes(p.id)).map((p) => {
                    const price = p.price * (1 - p.discount / 100);
                    return (
                      <div key={p.id} className="flex gap-4 border-b border-brand-border/40 pb-4 last:border-b-0">
                        <img 
                          src={p.images[0]} 
                          alt={p.title} 
                          className="w-18 h-22 object-cover rounded-xl bg-brand-beige"
                        />
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <Link 
                                href={`/product/${p.id}`}
                                className="font-inter font-bold text-sm text-brand-dark hover:text-brand-orange transition-colors"
                              >
                                {p.title}
                              </Link>
                              <button 
                                onClick={() => toggleWishlist(p.id)}
                                className="text-brand-orange hover:text-brand-muted transition-colors p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="font-inter text-xs text-brand-muted">{p.brand}</p>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="font-montserrat text-sm text-brand-dark font-semibold">{formatINR(price)}</span>
                            
                            <button
                              onClick={() => {
                                addToCart(p, p.sizes[0], p.colors[0]);
                                toggleWishlist(p.id);
                              }}
                              className="px-3 py-1.5 bg-brand-dark text-brand-white text-[11px] font-semibold rounded-lg hover:bg-brand-orange transition-colors"
                            >
                              Move to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-beige flex items-center justify-center">
                      <Heart className="w-6 h-6 text-brand-muted" />
                    </div>
                    <div>
                      <h4 className="font-poppins font-bold text-md">Your wishlist is empty</h4>
                      <p className="font-inter text-xs text-brand-muted mt-1 max-w-xs">Save items you love here to shop them later.</p>
                    </div>
                    <button 
                      onClick={() => { setWishlistOpen(false); router.push('/shop'); }}
                      className="px-6 py-2.5 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors mt-2"
                    >
                      Start Browsing
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 4. Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/50 backdrop-blur-md z-50 flex flex-col justify-start"
          >
            <motion.div 
              initial={{ translateY: '-100%' }}
              animate={{ translateY: 0 }}
              exit={{ translateY: '-100%' }}
              className="bg-brand-white w-full py-10 px-6 flex flex-col gap-6 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <Link href="/" className="font-poppins text-2xl tracking-tighter text-brand-dark font-extrabold">
                  STYLIE<span className="w-2.5 h-2.5 bg-brand-orange rounded-full inline-block"></span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 border border-brand-border rounded-full hover:bg-brand-gray transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex flex-col gap-2 border-t border-b border-brand-border/40 py-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-bold font-poppins text-brand-dark hover:text-brand-orange transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Collections accordion */}
                <button
                  onClick={() => setMobileCollectionsOpen(v => !v)}
                  className="flex items-center justify-between text-xl font-bold font-poppins text-brand-dark hover:text-brand-orange transition-colors w-full text-left"
                >
                  Collections
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileCollectionsOpen ? 'rotate-180 text-brand-orange' : ''}`} />
                </button>

                {mobileCollectionsOpen && (
                  <div className="pl-4 flex flex-col gap-5 pb-2">
                    {visibleMegaMenu.map(([group, items]) => (
                      <div key={group}>
                        <p className="font-inter text-[9px] font-bold text-brand-orange tracking-widest uppercase mb-2">{group}</p>
                        <div className="flex flex-wrap gap-2">
                          {items.map((item) => (
                            <Link
                              key={item}
                              href={`/shop?category=${encodeURIComponent(item.toLowerCase())}`}
                              onClick={() => { setMobileMenuOpen(false); setMobileCollectionsOpen(false); }}
                              className="px-3 py-1.5 bg-brand-beige rounded-xl text-[11px] font-semibold text-brand-dark hover:bg-brand-orange hover:text-brand-white transition-all"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }}
                  className="w-full flex items-center justify-between p-4 bg-brand-beige rounded-2xl font-inter font-bold text-sm"
                >
                  Search Products
                  <Search className="w-5 h-5 text-brand-orange" />
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col gap-2 p-4 border border-brand-border rounded-2xl items-center font-inter font-semibold text-xs"
                  >
                    <User className="w-5 h-5 text-brand-dark" />
                    Profile
                  </Link>
                  
                  <button 
                    onClick={() => { setMobileMenuOpen(false); setWishlistOpen(true); }}
                    className="flex flex-col gap-2 p-4 border border-brand-border rounded-2xl items-center font-inter font-semibold text-xs relative"
                  >
                    <Heart className="w-5 h-5 text-brand-orange fill-brand-orange" />
                    Wishlist
                    {wishlist.length > 0 && (
                      <span className="absolute top-2 right-6 bg-brand-orange text-brand-white rounded-full w-4 h-4 flex items-center justify-center font-montserrat text-[9px] font-bold">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}
