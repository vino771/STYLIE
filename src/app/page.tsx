"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { useStylie } from '@/context/StylieContext';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const router = useRouter();
  const { products, formatINR } = useStylie();
  
  // Refs for GSAP animations
  const floatingCardRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const bgVisualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Text slide-up animation
    if (heroTextRef.current) {
      const elements = heroTextRef.current.children;
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15,
          ease: "power3.out" 
        }
      );
    }

    // 2. Slow floating motion for right visual card (yoyo and repeat infinitely)
    if (floatingCardRef.current) {
      gsap.fromTo(
        floatingCardRef.current,
        { y: 15 },
        {
          y: -15,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        }
      );
    }

    // 3. Slow rotating ring in background
    if (bgVisualRef.current) {
      gsap.to(bgVisualRef.current, {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: "linear"
      });
    }
  }, []);

  // Filter products for Trending collection
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 4);

  const categories = [
    { 
      name: 'WOMEN', 
      image: '/images/img2.jpg',
      description: 'Fluid silks, satin slip dresses, and structured outerwear.',
      link: '/shop?category=women'
    },
    { 
      name: 'KIDS', 
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80',
      description: 'Insulated parkas and heavy canvas utility sets.',
      link: '/shop?category=kids'
    },
    { 
      name: 'GENZ', 
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
      description: 'Oversized varsity drops and street capsule edits.',
      link: '/shop?category=genz'
    },
    { 
      name: 'ACCESSORIES', 
      image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80',
      description: 'Angular bio-acetate shades and structured bags.',
      link: '/shop?category=accessories'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* -------------------- SECTION 1: HERO -------------------- */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-brand-white">
        
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
          <div 
            ref={bgVisualRef}
            className="w-[500px] h-[500px] rounded-full border border-dashed border-brand-border/60 flex items-center justify-center"
          >
            <div className="w-[380px] h-[380px] rounded-full border border-dashed border-brand-border/40" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          
          {/* Hero Left Content */}
          <div ref={heroTextRef} className="flex flex-col gap-6 text-center lg:text-left">
            <span className="text-xs text-brand-orange font-bold tracking-widest uppercase font-inter">
              CAPSULE ATELIER 2026
            </span>
            <h1 className="font-poppins text-7xl md:text-8xl tracking-tight text-brand-dark font-extrabold leading-tight">
              STYLIE
            </h1>
            <p className="font-poppins text-3xl md:text-4xl text-brand-orange font-extrabold tracking-tight mt-[-10px]">
              Wear Confidence.
            </p>
            <p className="font-inter text-md text-brand-muted max-w-lg leading-relaxed mx-auto lg:mx-0">
              Discover fashion that feels premium, comfortable, and made for everyone. Curated wardrobe essentials tailored with minimalist geometry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <Link 
                href="/shop" 
                className="px-8 py-4 bg-brand-dark text-brand-white font-inter text-sm font-semibold rounded-2xl hover:bg-brand-orange transition-all flex items-center justify-center gap-2 group shadow-sm"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#collections" 
                className="px-8 py-4 border border-brand-border bg-transparent text-brand-dark font-inter text-sm font-semibold rounded-2xl hover:bg-brand-beige transition-colors flex items-center justify-center"
              >
                Explore Collections
              </a>
            </div>
          </div>

          {/* Hero Right Visual (Slow floating simulation) */}
          <div className="flex justify-center items-center relative h-[450px] md:h-[500px]">
            {/* Background Blob Card */}
            <div className="absolute w-[300px] h-[380px] bg-brand-beige rounded-[40px] transform rotate-3 scale-95 opacity-60" />
            
            {/* Main Animated Card */}
            <div 
              ref={floatingCardRef} 
              className="relative w-[300px] h-[385px] bg-brand-white border border-brand-border/60 rounded-[32px] overflow-hidden shadow-xl"
            >
              {/* Luxury Frame overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent z-10 flex flex-col justify-end p-6 text-brand-white">
                <span className="text-[10px] tracking-wider uppercase font-inter text-brand-orange font-bold">ATELIER DROP</span>
                <h3 className="font-poppins text-lg font-bold">Premium Silk Knitwear</h3>
                <p className="font-montserrat text-xs font-semibold text-brand-white/80 mt-1">{formatINR(1899)}</p>
              </div>
              {/* Premium image acting as looping slow motion video */}
              <img 
                src="/images/img1.jpg"
                alt="High-fashion premium silk sweater model"
                className="w-full h-full object-cover scale-105"
              />
            </div>
          </div>

        </div>
      </section>

      {/* -------------------- SECTION 2: EDITORIAL FEATURED COLLECTIONS -------------------- */}
      <section id="collections" className="py-20 px-6 bg-brand-white border-t border-brand-border/40 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <div>
              <span className="text-[10px] text-brand-orange font-bold tracking-widest uppercase font-inter">CATEGORIES</span>
              <h2 className="font-poppins text-3xl md:text-4xl text-brand-dark font-extrabold tracking-tight mt-1">
                Featured Editorial
              </h2>
            </div>
            <p className="font-inter text-xs text-brand-muted max-w-xs leading-relaxed">
              Curated items partitioned into minimalist editorial capsules. Pick your drop to begin.
            </p>
          </div>

          {/* Grid Layout: 2 Columns & Row spans */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Women: Large 6-col span */}
            <div className="md:col-span-6 h-[420px] rounded-[24px] overflow-hidden relative group cursor-pointer border border-brand-border/20 shadow-sm">
              <img 
                src={categories[0].image} 
                alt={categories[0].name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent flex flex-col justify-end p-8 text-brand-white">
                <h3 className="font-poppins text-xl font-bold tracking-tight mb-2">{categories[0].name}</h3>
                <p className="font-inter text-xs text-brand-white/80 max-w-xs mb-4">{categories[0].description}</p>
                <Link 
                  href={categories[0].link}
                  className="font-inter text-xs font-semibold text-brand-orange flex items-center gap-1.5 hover:underline"
                >
                  Explore Capsule <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Kids: 2-col span */}
            <div className="md:col-span-2 h-[350px] rounded-[24px] overflow-hidden relative group cursor-pointer border border-brand-border/20 shadow-sm">
              <img 
                src={categories[1].image} 
                alt={categories[1].name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent flex flex-col justify-end p-6 text-brand-white">
                <h3 className="font-poppins text-lg font-bold tracking-tight mb-1">{categories[1].name}</h3>
                <p className="font-inter text-[11px] text-brand-white/80 mb-3">{categories[1].description}</p>
                <Link 
                  href={categories[1].link}
                  className="font-inter text-xs font-semibold text-brand-orange flex items-center gap-1 hover:underline"
                >
                  Shop Kids <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* GenZ: 2-col span */}
            <div className="md:col-span-2 h-[350px] rounded-[24px] overflow-hidden relative group cursor-pointer border border-brand-border/20 shadow-sm">
              <img 
                src={categories[2].image} 
                alt={categories[2].name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent flex flex-col justify-end p-6 text-brand-white">
                <h3 className="font-poppins text-lg font-bold tracking-tight mb-1">{categories[2].name}</h3>
                <p className="font-inter text-[11px] text-brand-white/80 mb-3">{categories[2].description}</p>
                <Link 
                  href={categories[2].link}
                  className="font-inter text-xs font-semibold text-brand-orange flex items-center gap-1 hover:underline"
                >
                  Shop GenZ <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Accessories: 2-col span */}
            <div className="md:col-span-2 h-[350px] rounded-[24px] overflow-hidden relative group cursor-pointer border border-brand-border/20 shadow-sm">
              <img 
                src={categories[3].image} 
                alt={categories[3].name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent flex flex-col justify-end p-6 text-brand-white">
                <h3 className="font-poppins text-lg font-bold tracking-tight mb-1">{categories[3].name}</h3>
                <p className="font-inter text-[11px] text-brand-white/80 mb-3">{categories[3].description}</p>
                <Link 
                  href={categories[3].link}
                  className="font-inter text-xs font-semibold text-brand-orange flex items-center gap-1 hover:underline"
                >
                  Shop Accs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------- SECTION 3: TRENDING DROPS -------------------- */}
      <section className="py-20 px-6 bg-brand-white">
        <div className="max-w-7xl mx-auto animate-fade-in">
          
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-12 gap-4">
            <div>
              <span className="text-[10px] text-brand-orange font-bold tracking-widest uppercase font-inter">WHAT IS HOT</span>
              <h2 className="font-poppins text-3xl md:text-4xl text-brand-dark font-extrabold tracking-tight mt-1">
                Trending Right Now
              </h2>
            </div>
            <Link 
              href="/shop"
              className="font-inter text-xs font-semibold text-brand-dark hover:text-brand-orange transition-colors flex items-center gap-1.5"
            >
              View All Products <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
            </Link>
          </div>

          {/* Grid Layout of products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

        </div>
      </section>

      {/* -------------------- SECTION 4: BRAND TRUST VALUES -------------------- */}
      <section className="py-20 px-6 bg-brand-beige border-t border-b border-brand-border/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          <div className="flex flex-col gap-3 items-center md:items-start">
            <div className="w-12 h-12 bg-brand-white border border-brand-border/40 rounded-full flex items-center justify-center text-brand-orange">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-poppins text-md font-bold tracking-tight text-brand-dark mt-2">Certified Premium</h3>
            <p className="font-inter text-xs text-brand-muted leading-relaxed max-w-xs">
              Every drop is tailored with organic fabrics, Italian bio-acetate, and grade-A cashmere, sourced ethically with certificates of origin.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-center md:items-start">
            <div className="w-12 h-12 bg-brand-white border border-brand-border/40 rounded-full flex items-center justify-center text-brand-orange">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-poppins text-md font-bold tracking-tight text-brand-dark mt-2">Eco-Conscious Shipping</h3>
            <p className="font-inter text-xs text-brand-muted leading-relaxed max-w-xs">
              Enjoy carbon-neutral delivery on all orders. Free shipping on orders exceeding {formatINR(15000)}.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-center md:items-start">
            <div className="w-12 h-12 bg-brand-white border border-brand-border/40 rounded-full flex items-center justify-center text-brand-orange">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-poppins text-md font-bold tracking-tight text-brand-dark mt-2">Seamless Exchanges</h3>
            <p className="font-inter text-xs text-brand-muted leading-relaxed max-w-xs">
              Incorrect size choice? No worries. We provide a complimentary 30-day pickup return envelope with pre-printed shipping labels.
            </p>
          </div>

        </div>
      </section>

      {/* -------------------- SECTION 5: FINAL CTA PREVIEW -------------------- */}
      <section className="py-24 px-6 text-center bg-brand-white">
        <div className="max-w-2xl mx-auto flex flex-col gap-6 items-center">
          <span className="text-[10px] text-brand-orange font-bold tracking-widest uppercase font-inter">THE STYLIE WAY</span>
          <h2 className="font-poppins text-4xl md:text-5xl text-brand-dark font-extrabold tracking-tight">
            Elevate Your Everyday
          </h2>
          <p className="font-inter text-xs text-brand-muted leading-relaxed max-w-lg">
            Invest in clothing that endures. Simple silhouettes, high-end sewing construction, and a color palette that easily layers. Discover your signature look.
          </p>
          <button 
            onClick={() => router.push('/shop')}
            className="px-8 py-4 bg-brand-dark text-brand-white rounded-2xl text-xs font-semibold hover:bg-brand-orange transition-all flex items-center gap-2 group mt-2"
          >
            Explore the Collection
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

    </div>
  );
}
