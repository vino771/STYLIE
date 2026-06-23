"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, Ticket, Check, ShieldAlert } from 'lucide-react';
import { useStylie } from '@/context/StylieContext';

export default function Cart() {
  const router = useRouter();
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    formatINR
  } = useStylie();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'Standard' | 'Express'>('Standard');

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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

  // Shipping logic: free Standard if subtotal > ₹15,000, else ₹800. Express is always ₹1,200.
  const shippingCost = shippingMethod === 'Express' ? 1200 : subtotal > 15000 ? 0 : 800;
  const taxEst = (subtotal - discountAmount) * 0.08; // 8% GST
  const finalPrice = Math.max(0, subtotal - discountAmount + shippingCost + taxEst);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim() !== '') {
      const success = applyCoupon(couponCode.trim());
      if (success) {
        setCouponSuccess(true);
        setCouponError(false);
        setCouponCode('');
        setTimeout(() => setCouponSuccess(false), 3000);
      } else {
        setCouponError(true);
        setCouponSuccess(false);
        setTimeout(() => setCouponError(false), 3000);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      
      {/* Page Header */}
      <div className="mb-10 text-center md:text-left">
        <span className="text-[10px] text-brand-orange font-bold tracking-widest uppercase font-inter">SHOPPING BAG</span>
        <h1 className="font-poppins text-4xl md:text-5xl font-extrabold tracking-tight mt-1 text-brand-dark">Review Your Order</h1>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* LEFT: Items List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-brand-white border border-brand-border/40 rounded-[28px] p-6 flex flex-col gap-6 shadow-sm">
              {cart.map((item) => {
                const discountedUnitPrice = item.product.price * (1 - item.product.discount / 100);
                return (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`}
                    className="flex flex-col sm:flex-row gap-6 border-b border-brand-border/40 pb-6 last:border-b-0 last:pb-0"
                  >
                    {/* Item Image */}
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.title} 
                      className="w-24 h-30 sm:w-28 sm:h-35 object-cover rounded-2xl bg-brand-beige"
                    />

                    {/* Item Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] text-brand-muted uppercase font-inter tracking-wider font-bold">{item.product.brand}</span>
                            <h3 className="font-poppins font-bold text-sm text-brand-dark mt-0.5 hover:text-brand-orange transition-colors">
                              <Link href={`/product/${item.product.id}`}>{item.product.title}</Link>
                            </h3>
                            <p className="font-inter text-xs text-brand-muted mt-1">
                              Size: <span className="font-semibold text-brand-dark">{item.selectedSize}</span> | Color: <span className="font-semibold text-brand-dark">{item.selectedColor.name}</span>
                            </p>
                          </div>
                          
                          {/* Unit Pricing */}
                          <div className="text-right">
                            {item.product.discount > 0 ? (
                              <>
                                <span className="font-montserrat text-sm font-semibold text-brand-orange">{formatINR(discountedUnitPrice)}</span>
                                <span className="font-montserrat text-xs text-brand-muted line-through block">{formatINR(item.product.price)}</span>
                              </>
                            ) : (
                              <span className="font-montserrat text-sm font-semibold text-brand-dark">{formatINR(item.product.price)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity adjustment & Remove */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-brand-border rounded-xl bg-brand-white">
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity - 1)}
                            className="p-2 px-3 text-brand-muted hover:text-brand-dark transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-montserrat font-bold text-brand-dark">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity + 1)}
                            className="p-2 px-3 text-brand-muted hover:text-brand-dark transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Total pricing & delete */}
                        <div className="flex items-center gap-4">
                          <span className="font-montserrat text-md font-bold text-brand-dark">
                            {formatINR(discountedUnitPrice * item.quantity)}
                          </span>
                          
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor.hex)}
                            className="p-2 border border-brand-border rounded-xl text-brand-muted hover:text-brand-orange hover:border-brand-orange transition-all"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Back button */}
            <Link 
              href="/shop"
              className="font-inter text-xs font-semibold text-brand-dark hover:text-brand-orange transition-colors self-start flex items-center gap-1.5"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="flex flex-col gap-6">
            
            {/* Coupon Application Card */}
            <div className="bg-brand-white border border-brand-border/40 rounded-[24px] p-6 shadow-sm">
              <h3 className="font-poppins font-bold text-xs text-brand-dark mb-4 flex items-center gap-2 tracking-wide uppercase">
                <Ticket className="w-4 h-4 text-brand-orange" />
                Promo / Coupon Code
              </h3>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div>
                    <span className="font-inter text-xs font-bold text-emerald-800 uppercase block">{appliedCoupon.code}</span>
                    <span className="font-inter text-[10px] text-emerald-700">{appliedCoupon.description}</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-[10px] text-brand-orange font-bold uppercase hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code (e.g. STYLIE10)" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow bg-brand-beige border-none rounded-xl px-3 py-2.5 text-xs font-inter focus:outline-none focus:ring-1 focus:ring-brand-orange uppercase"
                  />
                  <button 
                    type="submit" 
                    className="px-4 py-2.5 bg-brand-dark text-brand-white rounded-xl text-xs font-semibold hover:bg-brand-orange transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Status messages */}
              {couponSuccess && (
                <p className="text-[10px] text-emerald-600 font-inter font-semibold mt-2 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Coupon code successfully applied!
                </p>
              )}
              {couponError && (
                <p className="text-[10px] text-brand-orange font-inter font-semibold mt-2 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Invalid promo code. Try STYLIE10!
                </p>
              )}
            </div>

            {/* Calculations Summary Card */}
            <div className="bg-brand-beige border border-brand-border/40 rounded-[28px] p-6 shadow-sm">
              <h3 className="font-poppins font-bold text-sm text-brand-dark mb-6 tracking-tight">ORDER SUMMARY</h3>
              
              <div className="flex flex-col gap-4 border-b border-brand-border/40 pb-5 mb-5 font-inter text-xs text-brand-muted">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-montserrat font-semibold text-brand-dark">{formatINR(subtotal)}</span>
                </div>

                {/* Coupon discount */}
                {appliedCoupon && (
                  <div className="flex justify-between text-brand-orange">
                    <span>Promo Discount ({appliedCoupon.code})</span>
                    <span className="font-montserrat font-semibold">-{formatINR(discountAmount)}</span>
                  </div>
                )}

                {/* Shipping Method Selector */}
                <div className="flex flex-col gap-2 pt-2 border-t border-brand-border/20">
                  <span className="font-bold text-brand-dark">Shipping Option</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShippingMethod('Standard')}
                      className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-all text-center ${
                        shippingMethod === 'Standard'
                          ? 'bg-brand-dark text-brand-white border-brand-dark'
                          : 'bg-brand-white text-brand-dark border-brand-border hover:bg-brand-beige'
                      }`}
                    >
                      Standard {subtotal > 15000 ? '(Free)' : '(₹800)'}
                    </button>
                    <button
                      onClick={() => setShippingMethod('Express')}
                      className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-all text-center ${
                        shippingMethod === 'Express'
                          ? 'bg-brand-dark text-brand-white border-brand-dark'
                          : 'bg-brand-white text-brand-dark border-brand-border hover:bg-brand-beige'
                      }`}
                    >
                      Express (₹1,200)
                    </button>
                  </div>
                </div>

                {/* Shipping cost */}
                <div className="flex justify-between pt-2">
                  <span>Shipping Cost</span>
                  <span className="font-montserrat font-semibold text-brand-dark">
                    {shippingCost === 0 ? 'FREE' : formatINR(shippingCost)}
                  </span>
                </div>

                {/* Estimated GST */}
                <div className="flex justify-between">
                  <span>Estimated GST (8%)</span>
                  <span className="font-montserrat font-semibold text-brand-dark">{formatINR(taxEst)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-poppins font-bold text-sm text-brand-dark">Estimated Total</span>
                <span className="font-montserrat text-xl font-bold text-brand-orange">{formatINR(finalPrice)}</span>
              </div>

              {/* Proceed */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-brand-dark text-brand-white py-4 rounded-2xl font-inter text-sm font-medium hover:bg-brand-orange transition-all flex items-center justify-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="font-inter text-[10px] text-brand-muted text-center mt-4">
                Secure SSL Payment. Express carbon-neutral delivery. Free returns within 30 days.
              </p>
            </div>

          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="max-w-md mx-auto text-center py-20 flex flex-col items-center justify-center gap-6 bg-brand-beige border border-brand-border/40 rounded-[32px] p-8 shadow-sm">
          <div className="w-16 h-16 bg-brand-white border border-brand-border/40 rounded-full flex items-center justify-center text-brand-muted">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-poppins text-lg font-bold text-brand-dark">Your bag is empty</h2>
            <p className="font-inter text-xs text-brand-muted mt-2 max-w-xs leading-relaxed">
              Explore the STYLIE collection to find premium minimalist garments. Fill your bag with style!
            </p>
          </div>
          <Link 
            href="/shop" 
            className="px-8 py-3.5 bg-brand-dark hover:bg-brand-orange text-brand-white rounded-xl text-xs font-semibold transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      )}

    </div>
  );
}
