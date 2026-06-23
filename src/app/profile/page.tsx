"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Ticket, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Camera, 
  Check, 
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useStylie, Address, Order } from '@/context/StylieContext';

type TabType = 'orders' | 'profile' | 'wishlist' | 'addresses' | 'coupons' | 'settings';

export default function Profile() {
  const {
    profile,
    orders,
    products,
    wishlist,
    coupons,
    updateProfile,
    addAddress,
    removeAddress,
    toggleWishlist,
    addToCart
  } = useStylie();

  // Active sub-section tab
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Editing profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);

  // Address adding form state
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrPhone, setAddrPhone] = useState('');

  // Expand orders tracking state
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  // Clipboard copy feedback state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Settings Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [orderSMS, setOrderSMS] = useState(true);
  const [weeklyAtelier, setWeeklyAtelier] = useState(false);

  // Handle avatar upload and convert to base64
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateProfile({ avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: editName, email: editEmail });
    setIsEditingProfile(false);
  };

  // Submit new address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      fullName: addrName,
      addressLine: addrStreet,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      pincode: addrZip,
      zipCode: addrZip,
      country: 'United States',
      phone: addrPhone,
      isDefault: false
    });
    // Reset fields
    setAddrName('');
    setAddrStreet('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
    setAddrPhone('');
    setShowAddAddressForm(false);
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => 
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const sidebarLinks = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: `Order History (${orders.length})`, icon: ShoppingBag },
    { id: 'wishlist', label: `My Wishlist (${wishlist.length})`, icon: Heart },
    { id: 'addresses', label: 'Address Book', icon: MapPin },
    { id: 'coupons', label: 'Coupons & Offers', icon: Ticket },
    { id: 'settings', label: 'Account Settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      
      {/* Profile Header */}
      <div className="mb-10 text-center md:text-left">
        <span className="text-[10px] text-brand-orange font-bold tracking-widest uppercase font-inter">ATELIER MEMBER</span>
        <h1 className="font-poppins text-4xl md:text-5xl font-extrabold tracking-tight mt-1 text-brand-dark">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT COLUMN: Sidebar Navigation */}
        <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 flex flex-col gap-6 shadow-sm">
          
          {/* User profile brief card */}
          <div className="flex items-center gap-4 border-b border-brand-border/30 pb-5">
            <div className="relative group">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-12 h-12 rounded-full object-cover border border-brand-border"
              />
              <label className="absolute inset-0 bg-brand-dark/40 rounded-full flex items-center justify-center text-brand-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  className="hidden" 
                />
              </label>
            </div>
            <div>
              <p className="font-inter font-bold text-sm text-brand-dark leading-tight">{profile.name}</p>
              <p className="font-inter text-[10px] text-brand-muted mt-0.5">{profile.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all text-left ${
                    isActive
                      ? 'bg-brand-dark text-brand-white shadow-sm'
                      : 'text-brand-dark hover:bg-brand-beige'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-orange' : 'text-brand-muted'}`} />
                  {link.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Active Section panels */}
        <div className="lg:col-span-3 min-h-[400px]">
          
          {/* TAB 1: Profile View / Edit Settings */}
          {activeTab === 'profile' && (
            <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm animate-fade-in">
              <div className="flex justify-between items-baseline border-b border-brand-border/20 pb-4">
                <h2 className="font-poppins font-bold text-md text-brand-dark uppercase tracking-tight">Atelier Profile Information</h2>
                {!isEditingProfile && (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="text-xs text-brand-orange font-bold flex items-center gap-1 hover:underline"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-[10px] font-bold text-brand-muted uppercase">Full Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-brand-beige border-none rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange text-brand-dark"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-[10px] font-bold text-brand-muted uppercase">Email Address</label>
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="bg-brand-beige border-none rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange text-brand-dark"
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsEditingProfile(false)}
                      className="px-5 py-3 border border-brand-border rounded-xl text-xs font-semibold hover:bg-brand-beige text-brand-dark transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter text-xs text-brand-dark">
                  <div className="bg-brand-beige/30 p-4 rounded-2xl border border-brand-border/20">
                    <span className="text-[10px] text-brand-muted font-bold block uppercase mb-1">Full Name</span>
                    <span className="font-semibold">{profile.name}</span>
                  </div>
                  <div className="bg-brand-beige/30 p-4 rounded-2xl border border-brand-border/20">
                    <span className="text-[10px] text-brand-muted font-bold block uppercase mb-1">Email Address</span>
                    <span className="font-semibold">{profile.email}</span>
                  </div>
                  <div className="bg-brand-beige/30 p-4 rounded-2xl border border-brand-border/20">
                    <span className="text-[10px] text-brand-muted font-bold block uppercase mb-1">Atelier Membership Status</span>
                    <span className="font-semibold text-brand-orange flex items-center gap-1">
                      👑 Premium Member
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Orders List with expandable receipt drawer */}
          {activeTab === 'orders' && (
            <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm animate-fade-in">
              <h2 className="font-poppins font-bold text-md text-brand-dark uppercase tracking-tight border-b border-brand-border/20 pb-4">
                Your Order History ({orders.length})
              </h2>

              {orders.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {orders.map((ord) => {
                    const isExpanded = expandedOrders.includes(ord.id);
                    return (
                      <div key={ord.id} className="border border-brand-border rounded-2xl overflow-hidden bg-brand-beige/10">
                        {/* Summary Header */}
                        <div 
                          onClick={() => toggleOrderExpand(ord.id)}
                          className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-brand-beige/30 transition-colors"
                        >
                          <div>
                            <span className="font-inter text-xs font-bold text-brand-dark block">{ord.id}</span>
                            <span className="font-inter text-[10px] text-brand-muted">{ord.date}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 font-inter text-xs">
                            <span className="font-montserrat font-bold text-brand-orange">${ord.total.toFixed(2)}</span>
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg uppercase text-[9px]">
                              {ord.status}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-brand-muted" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
                          </div>
                        </div>

                        {/* Collapsible Details */}
                        {isExpanded && (
                          <div className="p-5 bg-brand-beige/20 border-t border-brand-border/40 flex flex-col gap-4 font-inter text-xs text-brand-muted">
                            
                            {/* Products summary list */}
                            <div className="flex flex-col gap-3">
                              {ord.items.map((item, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                  <img src={item.product.images[0]} alt="" className="w-10 h-12 object-cover rounded-lg bg-brand-beige" />
                                  <div className="flex-grow min-w-0">
                                    <p className="font-bold text-brand-dark text-xs truncate">{item.product.title}</p>
                                    <p className="text-[10px]">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                                  </div>
                                  <span className="font-montserrat font-semibold text-brand-dark">${(item.product.price * (1 - item.product.discount/100) * item.quantity).toFixed(0)}</span>
                                </div>
                              ))}
                            </div>

                            {/* Shipping address info */}
                            <div className="border-t border-brand-border/30 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <span className="font-bold text-brand-dark block mb-1 text-[10px] uppercase">Shipping Address</span>
                                <p className="font-semibold text-brand-dark">{ord.address.fullName}</p>
                                <p>{ord.address.street}</p>
                                <p>{ord.address.city}, {ord.address.state} {ord.address.zipCode}</p>
                              </div>
                              <div>
                                <span className="font-bold text-brand-dark block mb-1 text-[10px] uppercase">Payment & Delivery</span>
                                <p>Method: <span className="font-semibold text-brand-dark">{ord.shippingMethod}</span></p>
                                <p>Payment: <span className="font-semibold text-brand-dark">{ord.paymentMethod}</span></p>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center gap-4 bg-brand-beige/20 rounded-2xl border border-brand-border/30">
                  <span className="font-poppins text-xs font-bold text-brand-dark">No orders found</span>
                  <p className="font-inter text-xs text-brand-muted max-w-xs leading-relaxed">
                    You haven't made any purchases yet. Head back to the shop to find luxury drops.
                  </p>
                  <Link href="/shop" className="px-5 py-2 bg-brand-dark text-brand-white rounded-lg text-xs font-semibold hover:bg-brand-orange transition-colors">
                    Explore Shop
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Wishlist Grid */}
          {activeTab === 'wishlist' && (
            <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm animate-fade-in">
              <h2 className="font-poppins font-bold text-md text-brand-dark uppercase tracking-tight border-b border-brand-border/20 pb-4">
                My Saved Wishlist ({wishlist.length})
              </h2>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {products
                    .filter((p) => wishlist.includes(p.id))
                    .map((p) => {
                      const discountedPrice = p.price * (1 - p.discount / 100);
                      return (
                        <div key={p.id} className="border border-brand-border/40 rounded-2xl overflow-hidden bg-brand-white flex flex-col justify-between p-4 h-full shadow-sm">
                          <div>
                            <div className="relative aspect-[4/5] bg-brand-beige rounded-xl overflow-hidden mb-3">
                              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[9px] text-brand-muted font-bold block uppercase">{p.brand}</span>
                            <Link href={`/product/${p.id}`} className="font-inter font-bold text-xs text-brand-dark hover:text-brand-orange transition-colors line-clamp-1 mt-0.5">
                              {p.title}
                            </Link>
                            <span className="font-montserrat text-xs font-semibold text-brand-orange mt-1 block">${discountedPrice.toFixed(0)}</span>
                          </div>
                          
                          <div className="flex gap-2 mt-4 pt-3 border-t border-brand-border/20">
                            <button
                              onClick={() => {
                                addToCart(p, p.sizes[0], p.colors[0], 1);
                                toggleWishlist(p.id);
                              }}
                              className="flex-grow py-2 bg-brand-dark text-brand-white rounded-lg text-[10px] font-semibold hover:bg-brand-orange transition-colors"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => toggleWishlist(p.id)}
                              className="p-2 border border-brand-border rounded-lg text-brand-muted hover:text-brand-orange hover:border-brand-orange transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center gap-4 bg-brand-beige/20 rounded-2xl border border-brand-border/30">
                  <span className="font-poppins text-xs font-bold text-brand-dark">Your wishlist is empty</span>
                  <p className="font-inter text-xs text-brand-muted max-w-xs leading-relaxed">
                    Explore products and bookmark garments you love.
                  </p>
                  <Link href="/shop" className="px-5 py-2 bg-brand-dark text-brand-white rounded-lg text-xs font-semibold hover:bg-brand-orange transition-colors">
                    Explore Shop
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Address Book */}
          {activeTab === 'addresses' && (
            <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm animate-fade-in">
              <div className="flex justify-between items-baseline border-b border-brand-border/20 pb-4">
                <h2 className="font-poppins font-bold text-md text-brand-dark uppercase tracking-tight">Your Addresses</h2>
                <button
                  onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                  className="text-xs text-brand-orange font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              </div>

              {/* Add Address Form Drawer */}
              {showAddAddressForm && (
                <form onSubmit={handleSaveAddress} className="bg-brand-beige border border-brand-border/40 rounded-2xl p-5 flex flex-col gap-4 animate-fade-in">
                  <span className="font-poppins font-bold text-xs text-brand-dark block uppercase tracking-wider mb-2">ADD NEW ADDRESS</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={addrName} 
                        onChange={(e) => setAddrName(e.target.value)} 
                        className="bg-white border border-brand-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">Phone Number</label>
                      <input 
                        type="text" 
                        required 
                        value={addrPhone} 
                        onChange={(e) => setAddrPhone(e.target.value)} 
                        className="bg-white border border-brand-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">Street Address</label>
                      <input 
                        type="text" 
                        required 
                        value={addrStreet} 
                        onChange={(e) => setAddrStreet(e.target.value)} 
                        className="bg-white border border-brand-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">City</label>
                      <input 
                        type="text" 
                        required 
                        value={addrCity} 
                        onChange={(e) => setAddrCity(e.target.value)} 
                        className="bg-white border border-brand-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">State</label>
                        <input 
                          type="text" 
                          required 
                          value={addrState} 
                          onChange={(e) => setAddrState(e.target.value)} 
                          className="bg-white border border-brand-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">ZIP Code</label>
                        <input 
                          type="text" 
                          required 
                          value={addrZip} 
                          onChange={(e) => setAddrZip(e.target.value)} 
                          className="bg-white border border-brand-border rounded-lg px-3 py-2 text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end mt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddAddressForm(false)} 
                      className="px-4 py-2 border border-brand-border rounded-lg text-xs font-semibold hover:bg-brand-white"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-brand-dark text-brand-white rounded-lg text-xs font-semibold hover:bg-brand-orange"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address card grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.addresses.map((addr) => (
                  <div key={addr.id} className="border border-brand-border/60 rounded-2xl p-5 bg-brand-beige/20 font-inter text-xs text-brand-muted flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="font-bold text-brand-dark text-sm">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-brand-dark text-brand-white text-[8px] font-bold rounded uppercase">
                            Default
                          </span>
                        )}
                      </div>
                      <p>{addr.street}</p>
                      <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className="mt-1 font-semibold text-brand-dark">Phone: {addr.phone}</p>
                    </div>

                    <div className="border-t border-brand-border/30 pt-3 mt-4 flex justify-end">
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="text-brand-muted hover:text-brand-orange transition-colors flex items-center gap-1 font-semibold text-[10px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Coupons & Codes */}
          {activeTab === 'coupons' && (
            <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm animate-fade-in">
              <h2 className="font-poppins font-bold text-md text-brand-dark uppercase tracking-tight border-b border-brand-border/20 pb-4">
                Atelier Coupons & Offers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div key={c.code} className="border border-dashed border-brand-border rounded-2xl p-5 bg-brand-beige/10 flex justify-between items-center relative overflow-hidden">
                    {/* Circle cuts for ticket look */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-brand-white border-r border-brand-border -translate-y-1/2" />
                    <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-brand-white border-l border-brand-border -translate-y-1/2" />
                    
                    <div className="pl-4">
                      <span className="font-poppins text-lg font-bold text-brand-orange block tracking-tight">{c.code}</span>
                      <span className="font-inter text-xs text-brand-dark font-semibold mt-0.5 block">{c.description}</span>
                      <span className="font-inter text-[9px] text-brand-muted mt-1 block">Valid until December 31, 2026.</span>
                    </div>

                    {/* Copy action */}
                    <button
                      onClick={() => handleCopyCoupon(c.code)}
                      className={`px-3 py-2 border rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        copiedCode === c.code 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-brand-white text-brand-dark border-brand-border hover:bg-brand-beige'
                      }`}
                    >
                      {copiedCode === c.code ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Settings panel */}
          {activeTab === 'settings' && (
            <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm animate-fade-in">
              <h2 className="font-poppins font-bold text-md text-brand-dark uppercase tracking-tight border-b border-brand-border/20 pb-4">
                Atelier Communications Settings
              </h2>

              <div className="flex flex-col gap-4 font-inter text-xs text-brand-dark">
                <label className="flex items-center gap-3 p-4 bg-brand-beige/20 border border-brand-border/20 rounded-2xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-orange border-brand-border focus:ring-brand-orange cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold block">Email Notifications</span>
                    <span className="text-[10px] text-brand-muted">Receive order status receipts and updates via email.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-brand-beige/20 border border-brand-border/20 rounded-2xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={orderSMS}
                    onChange={(e) => setOrderSMS(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-orange border-brand-border focus:ring-brand-orange cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold block">SMS Updates</span>
                    <span className="text-[10px] text-brand-muted">Receive direct SMS courier link tracking alerts.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-brand-beige/20 border border-brand-border/20 rounded-2xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={weeklyAtelier}
                    onChange={(e) => setWeeklyAtelier(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-orange border-brand-border focus:ring-brand-orange cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold block">Weekly Atelier Newsletter</span>
                    <span className="text-[10px] text-brand-muted">Early invitations to seasonal catalog drops.</span>
                  </div>
                </label>
              </div>

              {/* Password change panel */}
              <div className="border-t border-brand-border/40 pt-6 mt-2">
                <h3 className="font-poppins font-bold text-xs text-brand-dark uppercase tracking-wider mb-4">Change Account Password</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-brand-beige border-none rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-brand-beige border-none rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Password successfully updated (Mock)')}
                  className="mt-4 px-5 py-3 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
