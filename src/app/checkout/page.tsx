"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, CreditCard, Truck, MapPin, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Edit, Trash2, Plus, AlertCircle, X } from 'lucide-react';
import { useStylie, Address, Order } from '@/context/StylieContext';

export default function Checkout() {
  const router = useRouter();
  const { 
    cart, 
    profile, 
    appliedCoupon, 
    placeOrder, 
    clearCart,
    formatINR,
    isCustomerAuthenticated,
    addAddress,
    editAddress,
    removeAddress
  } = useStylie();

  const [checkingAuth, setCheckingAuth] = useState(true);

  // Authenticate user on client
  useEffect(() => {
    const isAuth = localStorage.getItem('stylie_customer_auth') === 'true';
    if (!isAuth) {
      router.replace('/login?redirect=/checkout');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  // Redirect if cart is empty and order not placed
  useEffect(() => {
    if (!checkingAuth && cart.length === 0 && step < 5) {
      router.push('/cart');
    }
  }, [cart, checkingAuth]);

  // Steps: 1 = Address, 2 = Shipping, 3 = Payment, 4 = Summary, 5 = Success
  const [step, setStep] = useState(1);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Address Manager States
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address Form States
  const [formFullName, setFormFullName] = useState('');
  const [formAddressLine, setFormAddressLine] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formError, setFormError] = useState('');

  // Initial selection
  useEffect(() => {
    if (profile?.addresses?.length > 0) {
      const def = profile.addresses.find(a => a.isDefault) || profile.addresses[0];
      if (def) setSelectedAddressId(def.id);
    }
  }, [profile]);

  const [shippingMethod, setShippingMethod] = useState('Standard');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD is the ONLY payment mode

  // Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Math Calculations
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

  const shippingCost = shippingMethod === 'Express' ? 1200 : subtotal > 15000 ? 0 : 800;
  const taxEst = (subtotal - discountAmount) * 0.08;
  const codFee = 100; // COD Handling Fee
  const finalPrice = Math.max(0, subtotal - discountAmount + shippingCost + taxEst + codFee);

  const handleNextStep = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formFullName.trim() || !formAddressLine.trim() || !formCity.trim() || !formState.trim() || !formPincode.trim() || !formPhone.trim()) {
      setFormError('Please fill in all address fields.');
      return;
    }

    if (editingAddressId) {
      editAddress(editingAddressId, {
        fullName: formFullName,
        addressLine: formAddressLine,
        street: formAddressLine,
        city: formCity,
        state: formState,
        pincode: formPincode,
        zipCode: formPincode,
        phone: formPhone
      });
    } else {
      addAddress({
        fullName: formFullName,
        addressLine: formAddressLine,
        street: formAddressLine,
        city: formCity,
        state: formState,
        pincode: formPincode,
        zipCode: formPincode,
        phone: formPhone,
        country: 'India',
        isDefault: profile.addresses.length === 0
      });
    }

    // Reset Form
    setFormFullName('');
    setFormAddressLine('');
    setFormCity('');
    setFormState('');
    setFormPincode('');
    setFormPhone('');
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleEditClick = (addr: Address) => {
    setEditingAddressId(addr.id);
    setFormFullName(addr.fullName);
    setFormAddressLine(addr.addressLine || addr.street || '');
    setFormCity(addr.city);
    setFormState(addr.state);
    setFormPincode(addr.pincode || addr.zipCode || '');
    setFormPhone(addr.phone);
    setShowAddressForm(true);
  };

  const handlePlaceOrderSubmit = () => {
    const selectedAddress = profile.addresses.find(a => a.id === selectedAddressId) || profile.addresses[0];
    if (!selectedAddress) return;

    const newOrder = placeOrder(selectedAddress, shippingMethod, 'COD');
    setPlacedOrder(newOrder);
    setStep(5);
    setShowConfirmModal(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-orange/30 border-t-brand-orange animate-spin" />
      </div>
    );
  }

  const stepsLabel = [
    { num: 1, label: 'Address', icon: MapPin },
    { num: 2, label: 'Shipping', icon: Truck },
    { num: 3, label: 'Payment', icon: CreditCard },
    { num: 4, label: 'Summary', icon: Sparkles }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      
      {/* -------------------- STEP INDICATOR -------------------- */}
      {step < 5 && (
        <div className="max-w-xl mx-auto mb-16">
          <div className="flex justify-between items-center relative">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-brand-border/40 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-brand-orange -translate-y-1/2 z-0 transition-all duration-300" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {stepsLabel.map((s) => {
              const Icon = s.icon;
              const isCompleted = step > s.num;
              const isActive = step === s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-montserrat text-xs font-bold transition-all ${
                    isCompleted 
                      ? 'bg-brand-orange text-brand-white border-brand-orange shadow-md' 
                      : isActive 
                        ? 'bg-brand-dark text-brand-white border-brand-dark ring-4 ring-brand-gray shadow-sm' 
                        : 'bg-brand-white text-brand-muted border-brand-border'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-[10px] font-inter font-bold tracking-wider uppercase transition-colors ${
                    isActive || isCompleted ? 'text-brand-dark' : 'text-brand-muted'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------- STEPS CONTENT -------------------- */}
      {step < 5 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT: Step Forms */}
          <div className="lg:col-span-2">
            
            {/* STEP 1: Address Details & Management */}
            {step === 1 && (
              <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-brand-border/20 pb-4">
                  <h2 className="font-poppins font-bold text-md text-brand-dark uppercase tracking-tight">Delivery Address</h2>
                  {!showAddressForm && (
                    <button 
                      onClick={() => {
                        setEditingAddressId(null);
                        setFormFullName('');
                        setFormAddressLine('');
                        setFormCity('');
                        setFormState('');
                        setFormPincode('');
                        setFormPhone('');
                        setShowAddressForm(true);
                      }}
                      className="text-xs text-brand-orange font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add New Address
                    </button>
                  )}
                </div>

                {/* Inline Address Creation/Edit Form */}
                {showAddressForm ? (
                  <form onSubmit={handleSaveAddress} className="bg-brand-beige/40 border border-brand-border/30 rounded-2xl p-5 flex flex-col gap-4 animate-fade-in">
                    <div className="flex justify-between items-center border-b border-brand-border/20 pb-2">
                      <h3 className="font-poppins font-bold text-xs text-brand-dark uppercase">
                        {editingAddressId ? 'Edit Address' : 'New Address Details'}
                      </h3>
                      <button 
                        type="button" 
                        onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }}
                        className="text-brand-muted hover:text-brand-dark"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">Full Name</label>
                        <input 
                          type="text" 
                          value={formFullName}
                          onChange={e => setFormFullName(e.target.value)}
                          placeholder="Receiver name"
                          required
                          className="bg-brand-white border border-brand-border/40 rounded-xl px-4.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">Phone Number</label>
                        <input 
                          type="text" 
                          value={formPhone}
                          onChange={e => setFormPhone(e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          required
                          className="bg-brand-white border border-brand-border/40 rounded-xl px-4.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        />
                      </div>
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">Address Line</label>
                        <input 
                          type="text" 
                          value={formAddressLine}
                          onChange={e => setFormAddressLine(e.target.value)}
                          placeholder="House No, Apartment, Street name"
                          required
                          className="bg-brand-white border border-brand-border/40 rounded-xl px-4.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">City</label>
                        <input 
                          type="text" 
                          value={formCity}
                          onChange={e => setFormCity(e.target.value)}
                          placeholder="City"
                          required
                          className="bg-brand-white border border-brand-border/40 rounded-xl px-4.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">State</label>
                        <input 
                          type="text" 
                          value={formState}
                          onChange={e => setFormState(e.target.value)}
                          placeholder="State"
                          required
                          className="bg-brand-white border border-brand-border/40 rounded-xl px-4.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-inter text-[9px] font-bold text-brand-muted uppercase">Pincode</label>
                        <input 
                          type="text" 
                          value={formPincode}
                          onChange={e => setFormPincode(e.target.value)}
                          placeholder="110001"
                          required
                          className="bg-brand-white border border-brand-border/40 rounded-xl px-4.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        />
                      </div>
                    </div>

                    {formError && (
                      <div className="flex items-center gap-1.5 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[10px] font-bold font-inter">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {formError}
                      </div>
                    )}

                    <div className="flex gap-3 justify-end pt-2 border-t border-brand-border/20">
                      <button 
                        type="button" 
                        onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }}
                        className="px-4 py-2 border border-brand-border rounded-xl text-xs font-bold hover:bg-brand-white"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2 bg-brand-dark text-brand-white rounded-xl text-xs font-bold hover:bg-brand-orange transition-colors"
                      >
                        {editingAddressId ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                ) : null}

                {/* List of Saved Addresses */}
                <div className="flex flex-col gap-3">
                  {profile.addresses.length === 0 ? (
                    <div className="text-center py-8 bg-brand-beige/25 border border-dashed border-brand-border/60 rounded-2xl text-xs text-brand-muted">
                      No addresses saved yet. Click "Add New Address" to save your shipping details.
                    </div>
                  ) : (
                    profile.addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div 
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4.5 border rounded-2xl transition-all cursor-pointer flex justify-between items-start gap-4 ${
                            isSelected 
                              ? 'border-brand-orange bg-brand-beige/40 shadow-sm ring-1 ring-brand-orange' 
                              : 'border-brand-border/50 bg-brand-white hover:bg-brand-beige/10'
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-grow min-w-0">
                            <input 
                              type="radio" 
                              name="selected_address" 
                              checked={isSelected}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="w-4 h-4 mt-0.5 text-brand-orange focus:ring-brand-orange accent-brand-orange"
                            />
                            <div className="font-inter text-xs text-brand-muted leading-relaxed">
                              <span className="font-bold text-brand-dark block text-xs mb-0.5">{addr.fullName} {addr.isDefault && <span className="text-[9px] text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded font-bold ml-1.5 uppercase">Default</span>}</span>
                              <p className="truncate">{addr.addressLine || addr.street}</p>
                              <p>{addr.city}, {addr.state} {addr.pincode || addr.zipCode}</p>
                              <p className="font-semibold text-brand-dark mt-1 text-[11px]">Phone: {addr.phone}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                            <button 
                              onClick={() => handleEditClick(addr)}
                              className="p-1.5 hover:bg-brand-beige rounded-lg text-brand-muted hover:text-brand-dark transition-colors"
                              title="Edit address"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => removeAddress(addr.id)}
                              className="p-1.5 hover:bg-brand-beige rounded-lg text-brand-muted hover:text-red-500 transition-colors"
                              title="Delete address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex gap-4 border-t border-brand-border/20 pt-6 mt-2">
                  <button
                    onClick={handleNextStep}
                    disabled={!selectedAddressId}
                    className="flex-grow py-4 bg-brand-dark text-brand-white rounded-2xl font-inter text-xs font-semibold hover:bg-brand-orange transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:hover:bg-brand-dark cursor-pointer shadow-md"
                  >
                    Continue to Shipping
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Shipping Methods */}
            {step === 2 && (
              <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
                <h2 className="font-poppins font-bold text-md text-brand-dark uppercase tracking-tight border-b border-brand-border/20 pb-4">
                  Select Shipping Mode
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Standard Shipping */}
                  <label 
                    onClick={() => setShippingMethod('Standard')}
                    className={`p-5 rounded-2xl border flex justify-between items-center cursor-pointer transition-all ${
                      shippingMethod === 'Standard' 
                        ? 'border-brand-orange bg-brand-beige/50' 
                        : 'border-brand-border/50 hover:bg-brand-beige'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="shipping" 
                        checked={shippingMethod === 'Standard'}
                        onChange={() => setShippingMethod('Standard')}
                        className="w-4 h-4 text-brand-orange focus:ring-brand-orange accent-brand-orange"
                      />
                      <div>
                        <span className="font-inter text-xs font-bold text-brand-dark block">Standard Courier</span>
                        <span className="font-inter text-[10px] text-brand-muted">Delivery in 3-5 business days. Carbon-neutral.</span>
                      </div>
                    </div>
                    <span className="font-montserrat text-xs font-bold text-brand-dark">
                      {subtotal > 15000 ? 'FREE' : '₹800'}
                    </span>
                  </label>

                  {/* Express Shipping */}
                  <label 
                    onClick={() => setShippingMethod('Express')}
                    className={`p-5 rounded-2xl border flex justify-between items-center cursor-pointer transition-all ${
                      shippingMethod === 'Express' 
                        ? 'border-brand-orange bg-brand-beige/50' 
                        : 'border-brand-border/50 hover:bg-brand-beige'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="shipping" 
                        checked={shippingMethod === 'Express'}
                        onChange={() => setShippingMethod('Express')}
                        className="w-4 h-4 text-brand-orange focus:ring-brand-orange accent-brand-orange"
                      />
                      <div>
                        <span className="font-inter text-xs font-bold text-brand-dark block">Express Premium Courier</span>
                        <span className="font-inter text-[10px] text-brand-muted">Guaranteed delivery in 1-2 business days. Express sorting.</span>
                      </div>
                    </div>
                    <span className="font-montserrat text-xs font-bold text-brand-dark">₹1,200</span>
                  </label>
                </div>

                <div className="flex gap-4 border-t border-brand-border/20 pt-6 mt-2">
                  <button 
                    onClick={handlePrevStep}
                    className="px-6 py-4 border border-brand-border rounded-2xl font-inter text-xs font-semibold hover:bg-brand-beige text-brand-dark transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-grow py-4 bg-brand-dark text-brand-white rounded-2xl font-inter text-xs font-semibold hover:bg-brand-orange transition-colors flex items-center justify-center gap-1.5"
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Options (COD Only) */}
            {step === 3 && (
              <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
                <h2 className="font-poppins font-bold text-md text-brand-dark uppercase tracking-tight border-b border-brand-border/20 pb-4">
                  Select Payment Method
                </h2>

                <div className="bg-brand-beige border border-brand-border/20 rounded-2xl p-6 text-center">
                  <Truck className="w-8 h-8 text-brand-orange mx-auto mb-3" />
                  <p className="font-poppins font-bold text-xs text-brand-dark uppercase tracking-wider">Cash On Delivery (COD)</p>
                  <p className="font-inter text-xs text-brand-muted mt-2 max-w-md mx-auto leading-relaxed">
                    Pay with cash upon delivery. An additional fee of <span className="font-semibold text-brand-dark">₹100</span> applies for COD collection handling (included in order breakdown).
                  </p>
                  <p className="text-[10px] text-brand-muted mt-3">No other payment gateways are currently active.</p>
                </div>

                <div className="flex gap-4 border-t border-brand-border/20 pt-6 mt-2">
                  <button 
                    onClick={handlePrevStep}
                    className="px-6 py-4 border border-brand-border rounded-2xl font-inter text-xs font-semibold hover:bg-brand-beige text-brand-dark transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-grow py-4 bg-brand-dark text-brand-white rounded-2xl font-inter text-xs font-semibold hover:bg-brand-orange transition-colors flex items-center justify-center gap-1.5"
                  >
                    Review Order Summary
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review Summary */}
            {step === 4 && (() => {
              const selectedAddress = profile.addresses.find(a => a.id === selectedAddressId) || profile.addresses[0];
              return (
                <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
                  <h2 className="font-poppins font-bold text-md text-brand-dark uppercase tracking-tight border-b border-brand-border/20 pb-4">
                    Final Review Summary
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter text-xs text-brand-muted">
                    
                    {/* Delivery address review */}
                    <div className="border border-brand-border/40 rounded-2xl p-4 bg-brand-beige/30">
                      <span className="font-bold text-brand-dark block mb-2 uppercase text-[10px]">DELIVERY ADDRESS</span>
                      {selectedAddress ? (
                        <>
                          <p className="font-bold text-brand-dark text-xs">{selectedAddress.fullName}</p>
                          <p>{selectedAddress.addressLine || selectedAddress.street}</p>
                          <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode || selectedAddress.zipCode}</p>
                          <p className="mt-1 font-semibold text-brand-dark">Phone: {selectedAddress.phone}</p>
                        </>
                      ) : (
                        <p className="text-red-500">No address selected.</p>
                      )}
                    </div>

                    {/* Shipping & Payment summary */}
                    <div className="flex flex-col gap-3">
                      <div className="border border-brand-border/40 rounded-2xl p-4 bg-brand-beige/30 flex-grow">
                        <span className="font-bold text-brand-dark block mb-1 uppercase text-[10px]">SHIPPING OPTION</span>
                        <p className="font-bold text-brand-dark">{shippingMethod} Courier</p>
                        <p className="mt-0.5">Est. Delivery in {shippingMethod === 'Express' ? '1-2 Days' : '3-5 Days'}</p>
                      </div>

                      <div className="border border-brand-border/40 rounded-2xl p-4 bg-brand-beige/30 flex-grow">
                        <span className="font-bold text-brand-dark block mb-1 uppercase text-[10px]">PAYMENT OPTION</span>
                        <p className="font-bold text-brand-dark">Cash On Delivery (COD)</p>
                        <p className="mt-0.5 text-[10px]">Collection handle fee: ₹100</p>
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-4 border-t border-brand-border/20 pt-6 mt-2">
                    <button 
                      onClick={handlePrevStep}
                      className="px-6 py-4 border border-brand-border rounded-2xl font-inter text-xs font-semibold hover:bg-brand-beige text-brand-dark transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      className="flex-grow py-4 bg-brand-orange text-brand-white rounded-2xl font-inter text-xs font-semibold hover:bg-brand-dark transition-colors flex items-center justify-center gap-1.5 shadow-md hover:scale-102 active:scale-98"
                    >
                      Place Order — {formatINR(finalPrice)}
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* RIGHT COLUMN: Cart Summary Preview (Only on steps 1-4) */}
          <div className="bg-brand-beige border border-brand-border/40 rounded-[28px] p-6 shadow-sm font-inter text-xs">
            <h3 className="font-poppins font-bold text-sm text-brand-dark mb-4 tracking-tight">CART PREVIEW</h3>
            
            {/* Scrollable list of items */}
            <div className="max-h-56 overflow-y-auto no-scrollbar flex flex-col gap-3 border-b border-brand-border/40 pb-4 mb-4">
              {cart.map((item) => {
                const price = item.product.price * (1 - item.product.discount / 100);
                return (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`} className="flex gap-3">
                    <img src={item.product.images[0]} alt="" className="w-12 h-15 object-cover rounded-xl bg-brand-white border border-brand-border/20" />
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-brand-dark truncate">{item.product.title}</p>
                      <p className="text-[10px] text-brand-muted mt-0.5">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                    </div>
                    <span className="font-montserrat font-semibold text-brand-dark">{formatINR(price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-2.5 text-brand-muted border-b border-brand-border/40 pb-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-montserrat font-semibold text-brand-dark">{formatINR(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-brand-orange">
                  <span>Coupon Discount</span>
                  <span className="font-montserrat font-semibold">-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod})</span>
                <span className="font-montserrat font-semibold text-brand-dark">
                  {shippingCost === 0 ? 'FREE' : formatINR(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Est. GST (8%)</span>
                <span className="font-montserrat font-semibold text-brand-dark">{formatINR(taxEst)}</span>
              </div>
              <div className="flex justify-between">
                <span>COD handling fee</span>
                <span className="font-montserrat font-semibold text-brand-dark">{formatINR(100)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline font-bold text-brand-dark">
              <span className="font-poppins text-xs uppercase">Total Cost</span>
              <span className="font-montserrat text-lg text-brand-orange">{formatINR(finalPrice)}</span>
            </div>
          </div>

        </div>
      ) : (
        /* STEP 5: Success Confirmation Page */
        <div className="max-w-xl mx-auto text-center bg-brand-white border border-brand-border/40 rounded-[32px] p-8 md:p-12 flex flex-col items-center justify-center gap-6 shadow-xl animate-fade-in">
          
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <div>
            <span className="text-[10px] text-brand-orange font-bold tracking-widest uppercase font-inter">ORDER CONFIRMED</span>
            <h2 className="font-poppins text-2xl font-bold text-brand-dark mt-1">Thank you for your order!</h2>
            <p className="font-inter text-xs text-brand-muted mt-2 max-w-sm mx-auto leading-relaxed">
              Your premium garment order has been processed. We have sent a receipt with tracking details to <span className="font-semibold text-brand-dark">{profile?.email || 'your registered email'}</span>.
            </p>
          </div>

          {/* Receipt detail box */}
          {placedOrder && (
            <div className="w-full bg-brand-beige border border-brand-border/30 rounded-2xl p-5 text-left flex flex-col gap-2 font-inter text-xs text-brand-muted">
              <div className="flex justify-between border-b border-brand-border/40 pb-2">
                <span>Order ID</span>
                <span className="font-bold text-brand-dark">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-semibold text-brand-dark">{placedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Address</span>
                <span className="font-semibold text-brand-dark text-right truncate max-w-[200px]">{placedOrder.address.street}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode</span>
                <span className="font-semibold text-brand-dark">{placedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-brand-border/40 pt-2 font-bold text-brand-dark">
                <span>Total Paid</span>
                <span className="font-montserrat text-sm text-brand-orange">{formatINR(placedOrder.total)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
            <Link 
              href="/profile" 
              className="flex-grow py-3.5 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors text-center"
            >
              Track Order In Profile
            </Link>
            <Link 
              href="/shop" 
              className="px-6 py-3.5 border border-brand-border rounded-xl text-xs font-semibold hover:bg-brand-beige text-brand-dark transition-colors text-center"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      )}

      {/* -------------------- COD CONFIRMATION MODAL -------------------- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-white border border-brand-border/40 rounded-[28px] max-w-sm w-full p-8 shadow-2xl animate-fade-in flex flex-col gap-6 text-center">
            <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center text-amber-500 mx-auto shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-poppins font-extrabold text-md text-brand-dark tracking-tight">Confirm Cash On Delivery Order?</h3>
              <p className="font-inter text-xs text-brand-muted mt-2 leading-relaxed">
                Are you sure you want to place the COD order? Any cancellations must be done within 2 hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-grow py-3 border border-brand-border rounded-xl text-xs font-semibold hover:bg-brand-beige text-brand-dark transition-colors"
              >
                Cancel
              </button>
              <button
                id="checkout-confirm-cod-btn"
                onClick={handlePlaceOrderSubmit}
                className="flex-grow py-3 bg-brand-orange text-brand-white rounded-xl text-xs font-bold hover:bg-brand-dark transition-all shadow-md"
              >
                Yes, Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
