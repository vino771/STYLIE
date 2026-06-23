"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  discount: number; // percentage
  images: string[]; // at least 2 images for hover swap
  category: 'women' | 'kids' | 'genz' | 'accessories';
  collectionCategory?: string;
  sizes: string[];
  colors: ColorOption[];
  rating: number;
  reviewsCount: number;
  stock: number;
  description: string;
  details: string[];
  isNew: boolean;
  isTrending: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: ColorOption;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  addressLine: string;
  isDefault: boolean;
  // Legacy fields kept for backwards compatibility
  street?: string;
  zipCode?: string;
  country?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: Address;
  shippingMethod: string;
  paymentMethod: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  addresses: Address[];
}

// All available collection categories for admin visibility control
export const ALL_COLLECTIONS: string[] = [
  'Kurta Set', 'Kurtas', 'Tops', 'Dresses', 'Co-Ord Sets', 'Bottoms',
  'Jumpsuits', 'Shirts', 'Kaftans', 'Night Suit', 'Nighty', 'Dupatta',
  'Bags', 'Jewellery', 'Belts', 'Watches', 'Hair Accessories',
  'Trending', 'New Arrivals', 'Best Sellers', 'Wedding Edit', 'Office Edit',
  'Women', 'Kids', 'GenZ', 'Accessories'
];

interface StylieContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  profile: UserProfile;
  orders: Order[];
  appliedCoupon: Coupon | null;
  coupons: Coupon[];
  recentlyViewed: string[]; // Product IDs
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  formatINR: (value: number) => string;
  addToCart: (product: Product, size: string, color: ColorOption, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, colorHex: string) => void;
  updateCartQuantity: (productId: string, size: string, colorHex: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  placeOrder: (address: Address, shippingMethod: string, paymentMethod: string) => Order;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  editAddress: (id: string, updates: Partial<Address>) => void;
  removeAddress: (addressId: string) => void;
  addRecentlyViewed: (productId: string) => void;
  isCustomerAuthenticated: boolean;
  loginCustomer: (email: string, password: string) => boolean;
  logoutCustomer: () => void;
  
  // Admin Operations
  adminAddProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'isTrending'>) => void;
  adminUpdateProduct: (product: Product) => void;
  adminEditProduct: (id: string, updates: Partial<Product>) => void;
  adminDeleteProduct: (productId: string) => void;

  // Collection Visibility
  enabledCollections: string[];
  updateEnabledCollections: (collections: string[]) => void;
}

const StylieContext = createContext<StylieContextType | undefined>(undefined);

// Initial Mock Products (Transitioned to Indian Rupee pricing)
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Longline Wool Overcoat',
    brand: 'STYLIE Atelier',
    price: 29999,
    discount: 10,
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80'
    ],
    category: 'women',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Black', hex: '#121818' }
    ],
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    description: 'A classic cold-weather staple, tailored from a premium heavyweight wool blend. Offers a structural silhouette with clean minimalist lines, notch lapels, and double-breasted button closures.',
    details: [
      '70% Virgin Wool, 30% Cashmere-feel Nylon',
      'Fully lined with premium satin lining',
      'Front welt pockets and interior chest pockets',
      'Dry clean only',
      'Imported'
    ],
    isNew: true,
    isTrending: true
  },
  {
    id: 'p2',
    title: 'Minimalist Satin Slip Dress',
    brand: 'STYLIE Atelier',
    price: 12999,
    discount: 0,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80'
    ],
    category: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Onyx', hex: '#121818' },
      { name: 'Pearl Beige', hex: '#EFEEE6' },
      { name: 'PDQ Orange', hex: '#FF5A1F' }
    ],
    rating: 4.9,
    reviewsCount: 88,
    stock: 22,
    description: 'Cut from fluid, high-shine satin, this slip dress cascades beautifully along the body. Featuring an elegant cowl neck, delicate adjustable spaghetti straps, and a subtle side slit for movement.',
    details: [
      '100% Premium Eco-Satin Silk',
      'Delicate adjustable criss-cross straps',
      'Mid-calf length',
      'Hand wash or dry clean',
      'Concealed side zipper'
    ],
    isNew: true,
    isTrending: true
  },
  {
    id: 'p3',
    title: 'Premium Cashmere Sweater',
    brand: 'STYLIE Essentials',
    price: 18999,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'
    ],
    category: 'women',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal', hex: '#DEE1E1' },
      { name: 'Navy', hex: '#1A2930' }
    ],
    rating: 4.7,
    reviewsCount: 62,
    stock: 8,
    description: 'Woven from 100% pure Grade-A Mongolian cashmere. Exceptionally soft, lightweight yet highly insulating. Tailored in a modern, relaxed fit with ribbed knit collar, cuffs, and hem.',
    details: [
      '100% Grade-A Cashmere',
      '12-gauge knit structure',
      'Classic crewneck collar',
      'Hand wash flat dry',
      'Responsibly sourced yarn'
    ],
    isNew: false,
    isTrending: true
  },
  {
    id: 'p4',
    title: 'Structured Trench Coat',
    brand: 'STYLIE Atelier',
    price: 24999,
    discount: 0,
    images: [
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80'
    ],
    category: 'women',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Sand Beige', hex: '#D2B48C' },
      { name: 'Sage Gray', hex: '#909494' }
    ],
    rating: 4.6,
    reviewsCount: 45,
    stock: 12,
    description: 'A timeless double-breasted trench crafted from water-resistant cotton gabardine. Detailed with storm flaps, epaulets, adjustable buckle wrist straps, and a removable waist belt for a defined silhouette.',
    details: [
      '100% Water-Resistant Cotton Gabardine',
      'Signature horn-effect buttons',
      'Fully lined with moisture-wicking fabric',
      'Belt with D-ring detailing',
      'Dry clean'
    ],
    isNew: false,
    isTrending: false
  },
  {
    id: 'p5',
    title: 'Retro Varsity Bomber',
    brand: 'STYLIE GenZ',
    price: 14999,
    discount: 20,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80'
    ],
    category: 'genz',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Green & White', hex: '#2E5A44' },
      { name: 'PDQ Orange & Dark', hex: '#FF5A1F' }
    ],
    rating: 4.9,
    reviewsCount: 198,
    stock: 30,
    description: 'An oversized, heritage-inspired varsity jacket. Blends thick wool felt bodice with vegan leather sleeves. Highlighted with retro patch detailing, snap button closures, and striped rib knit trim.',
    details: [
      'Bodice: 60% Wool, 40% Polyester; Sleeves: 100% Polyurethane Vegan Leather',
      'Heavyweight quilted interior lining',
      'Embroidered chest and sleeve badges',
      'Unisex oversized fit'
    ],
    isNew: true,
    isTrending: true
  },
  {
    id: 'p6',
    title: 'Acetate D-Frame Sunglasses',
    brand: 'STYLIE Accs',
    price: 6999,
    discount: 5,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80'
    ],
    category: 'accessories',
    sizes: ['One Size'],
    colors: [
      { name: 'Tortoise', hex: '#8B5A2B' },
      { name: 'Onyx Black', hex: '#121818' }
    ],
    rating: 4.5,
    reviewsCount: 37,
    stock: 50,
    description: 'Modern angular sunglasses sculpted from premium bio-acetate. Offers full UVA/UVB protection with scratch-resistant polarized lenses. Finished with heavy-duty seven-barrel hinges.',
    details: [
      '100% Biodegradable Italian Bio-Acetate',
      'Polarized Category 3 lenses',
      'Engraved logo core wire detailing inside temples',
      'Includes premium faux leather protective case and cloth'
    ],
    isNew: false,
    isTrending: true
  },
  {
    id: 'p7',
    title: 'Vegan Leather Tote Bag',
    brand: 'STYLIE Accs',
    price: 11999,
    discount: 0,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'
    ],
    category: 'accessories',
    sizes: ['One Size'],
    colors: [
      { name: 'Camel Tan', hex: '#C19A6B' },
      { name: 'Off-White', hex: '#F7F7F7' }
    ],
    rating: 4.7,
    reviewsCount: 54,
    stock: 18,
    description: 'A structural, minimal tote designed for everyday essentials. Handcrafted from ultra-durable premium vegan leather with a magnetic snap button main closure, structured top handles, and an adjustable shoulder strap.',
    details: [
      'Premium microfiber vegan leather (scratch-proof)',
      'Internal zippered separator pocket and slot holders',
      'Reinforced bottom panel with brass protective feet',
      'Fits up to a 14-inch MacBook'
    ],
    isNew: true,
    isTrending: false
  },
  {
    id: 'p8',
    title: 'Cotton Utility Parka',
    brand: 'STYLIE Kids',
    price: 8999,
    discount: 10,
    images: [
      'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=800&q=80',
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80'
    ],
    category: 'kids',
    sizes: ['4Y', '6Y', '8Y', '10Y'],
    colors: [
      { name: 'Army Olive', hex: '#556B2F' },
      { name: 'Rust Orange', hex: '#D2691E' }
    ],
    rating: 4.8,
    reviewsCount: 29,
    stock: 15,
    description: 'An ultra-functional, comfortable kids utility parka. Made from windproof heavy cotton canvas with a light warm padding, zipper and button dual closure, and a cozy fleece-lined hood.',
    details: [
      '100% Heavy Cotton Canvas exterior',
      'Recycled polyester thermal insulating sheet fill',
      'Drawcord adjustable waist and storm cuffs',
      'Machine washable'
    ],
    isNew: true,
    isTrending: false
  }
];

const INITIAL_COUPONS: Coupon[] = [
  { code: 'STYLIE10', discountType: 'percentage', value: 10, description: '10% off your entire order' },
  { code: 'PDQ20', discountType: 'percentage', value: 20, description: '20% off for special events' },
  { code: 'FREESHIP', discountType: 'fixed', value: 1000, description: 'Free shipping discount (₹1,000 value)' }
];

const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr1',
    fullName: 'Alex Vance',
    addressLine: '742 Luxury Avenue, Apt 4B',
    street: '742 Luxury Avenue, Apt 4B',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    zipCode: '110001',
    country: 'India',
    phone: '+91 98765 43210',
    isDefault: true
  }
];

export const StylieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState(false);
  const [enabledCollections, setEnabledCollections] = useState<string[]>(ALL_COLLECTIONS);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Vance',
    email: 'alex.vance@atelier-stylie.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80',
    addresses: MOCK_ADDRESSES
  });

  // Load state from localStorage on mount (client-side only)
  useEffect(() => {
    const savedCart = localStorage.getItem('stylie_cart');
    const savedWishlist = localStorage.getItem('stylie_wishlist');
    const savedOrders = localStorage.getItem('stylie_orders');
    const savedProfile = localStorage.getItem('stylie_profile');
    const savedProducts = localStorage.getItem('stylie_products');
    const savedAdmin = localStorage.getItem('stylie_is_admin') === 'true';
    const savedCustomerAuth = localStorage.getItem('stylie_customer_auth') === 'true';
    const savedCollections = localStorage.getItem('stylie_collections');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    setIsAdminAuthenticated(savedAdmin);
    setIsCustomerAuthenticated(savedCustomerAuth);
    if (savedCollections) {
      try {
        const parsed = JSON.parse(savedCollections);
        if (Array.isArray(parsed.collections)) {
          setEnabledCollections(parsed.collections);
        }
      } catch { /* use defaults */ }
    }
  }, []);

  // Save states to localStorage when modified
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const ADMIN_EMAIL = 'admin@stylie.com';
  const ADMIN_PASSWORD = 'Admin@1234';

  const loginAdmin = (email: string, password: string): boolean => {
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('stylie_is_admin', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('stylie_is_admin');
  };

  const loginCustomer = (email: string, password: string): boolean => {
    if (email.includes('@') && password.length >= 6) {
      setIsCustomerAuthenticated(true);
      localStorage.setItem('stylie_customer_auth', 'true');
      const newProfile = { ...profile, email };
      setProfile(newProfile);
      saveToStorage('stylie_profile', newProfile);
      return true;
    }
    return false;
  };

  const logoutCustomer = () => {
    setIsCustomerAuthenticated(false);
    localStorage.removeItem('stylie_customer_auth');
  };

  const formatINR = (value: number): string => {
    return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
  };

  const addToCart = (product: Product, size: string, color: ColorOption, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.hex === color.hex
      );

      let newCart;
      if (existingItemIndex > -1) {
        newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
      } else {
        newCart = [...prevCart, { product, selectedSize: size, selectedColor: color, quantity }];
      }
      saveToStorage('stylie_cart', newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId: string, size: string, colorHex: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.hex === colorHex
          )
      );
      saveToStorage('stylie_cart', newCart);
      return newCart;
    });
  };

  const updateCartQuantity = (productId: string, size: string, colorHex: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, colorHex);
      return;
    }
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === size &&
          item.selectedColor.hex === colorHex
        ) {
          return { ...item, quantity };
        }
        return item;
      });
      saveToStorage('stylie_cart', newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('stylie_cart');
  };

  const addToWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) return prev;
      const newWishlist = [...prev, productId];
      saveToStorage('stylie_wishlist', newWishlist);
      return newWishlist;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.filter((id) => id !== productId);
      saveToStorage('stylie_wishlist', newWishlist);
      return newWishlist;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      saveToStorage('stylie_wishlist', newWishlist);
      return newWishlist;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const applyCoupon = (code: string): boolean => {
    const coupon = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const placeOrder = (address: Address, shippingMethod: string, paymentMethod: string): Order => {
    const subtotal = cart.reduce((acc, item) => {
      const price = item.product.price * (1 - item.product.discount / 100);
      return acc + price * item.quantity;
    }, 0);

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = subtotal * (appliedCoupon.value / 100);
      } else {
        discount = appliedCoupon.value;
      }
    }

    // INR shipping limits
    const shipping = shippingMethod === 'Express' ? 1000 : subtotal > 15000 ? 0 : 500;
    const total = Math.max(0, subtotal - discount + shipping);

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal,
      discount,
      shipping,
      total,
      address,
      shippingMethod,
      paymentMethod,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Processing'
    };

    setOrders((prev) => {
      const newOrders = [newOrder, ...prev];
      saveToStorage('stylie_orders', newOrders);
      return newOrders;
    });

    clearCart();
    setAppliedCoupon(null);
    return newOrder;
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => {
      const newProfile = { ...prev, ...data };
      saveToStorage('stylie_profile', newProfile);
      return newProfile;
    });
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    setProfile((prev) => {
      const newAddress: Address = {
        ...address,
        id: `addr-${Math.random().toString(36).substr(2, 9)}`,
        isDefault: address.isDefault || prev.addresses.length === 0
      };

      let updatedAddresses = [...prev.addresses];
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
      }
      updatedAddresses.push(newAddress);

      const newProfile = { ...prev, addresses: updatedAddresses };
      saveToStorage('stylie_profile', newProfile);
      return newProfile;
    });
  };

  const editAddress = (id: string, updates: Partial<Address>) => {
    setProfile((prev) => {
      const updatedAddresses = prev.addresses.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates };
          // Keep legacy fields in sync if addressLine or pincode are updated
          if (updates.addressLine) updated.street = updates.addressLine;
          if (updates.pincode) updated.zipCode = updates.pincode;
          return updated;
        }
        return a;
      });
      let finalAddresses = updatedAddresses;
      if (updates.isDefault) {
        finalAddresses = updatedAddresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));
      }
      const newProfile = { ...prev, addresses: finalAddresses };
      saveToStorage('stylie_profile', newProfile);
      return newProfile;
    });
  };

  const removeAddress = (addressId: string) => {
    setProfile((prev) => {
      const updatedAddresses = prev.addresses.filter((a) => a.id !== addressId);
      if (updatedAddresses.length > 0 && !updatedAddresses.some((a) => a.isDefault)) {
        updatedAddresses[0].isDefault = true;
      }
      const newProfile = { ...prev, addresses: updatedAddresses };
      saveToStorage('stylie_profile', newProfile);
      return newProfile;
    });
  };

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const newRecents = [productId, ...filtered].slice(0, 4);
      return newRecents;
    });
  };

  // ADMIN OPERATIONS
  const adminAddProduct = (newProd: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'isTrending'>) => {
    setProducts((prev) => {
      const newProduct: Product = {
        ...newProd,
        id: `p-${Math.random().toString(36).substr(2, 9)}`,
        rating: 5.0,
        reviewsCount: 0,
        isTrending: false
      };
      const updated = [newProduct, ...prev];
      saveToStorage('stylie_products', updated);
      return updated;
    });
  };

  const adminUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === updatedProd.id ? updatedProd : p));
      saveToStorage('stylie_products', updated);
      return updated;
    });
  };

  const adminEditProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveToStorage('stylie_products', updated);
      return updated;
    });
  };

  const adminDeleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      saveToStorage('stylie_products', updated);
      return updated;
    });
  };

  const updateEnabledCollections = (collections: string[]) => {
    setEnabledCollections(collections);
    saveToStorage('stylie_collections', { collections });
  };

  return (
    <StylieContext.Provider
      value={{
        products,
        cart,
        wishlist,
        profile,
        orders,
        appliedCoupon,
        coupons: INITIAL_COUPONS,
        recentlyViewed,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        formatINR,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        placeOrder,
        updateProfile,
        addAddress,
        editAddress,
        removeAddress,
        addRecentlyViewed,
        isCustomerAuthenticated,
        loginCustomer,
        logoutCustomer,
        adminAddProduct,
        adminUpdateProduct,
        adminEditProduct,
        adminDeleteProduct,
        enabledCollections,
        updateEnabledCollections
      }}
    >
      {children}
    </StylieContext.Provider>
  );
};

export const useStylie = () => {
  const context = useContext(StylieContext);
  if (context === undefined) {
    throw new Error('useStylie must be used within a StylieProvider');
  }
  return context;
};
