"use client";

import Link from 'next/link';
import { useLanguage } from '@/store/LanguageContext';
import { ArrowRight, Bot, Cpu, Factory, Globe, Heart, PenTool, Play, Search, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();

  // Category state
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Promo state
  const [promo, setPromo] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fetch products & settings dynamically
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, settingsRes] = await Promise.all([
          api.get('/products'),
          api.get('/settings').catch(() => ({ data: null }))
        ]);
        setProducts(prodRes.data);
        if (settingsRes.data && settingsRes.data.isActive) {
          setPromo(settingsRes.data);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Countdown logical engine
  useEffect(() => {
    if (!promo || !promo.offerEndDate) return;
    
    const targetDate = new Date(promo.offerEndDate).getTime();
    
    const calculateTimeLeft = () => {
      const difference = targetDate - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // calculate immediately
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [promo]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  const categories = [
    { id: "all", label: "All", icon: <Globe size={16} /> },
    { id: "robotics", label: "Robotics", icon: <Bot size={16} /> },
    { id: "ai", label: "AI Devices", icon: <Cpu size={16} /> },
    { id: "machinery", label: "Machinery", icon: <Factory size={16} /> },
    { id: "tools", label: "Tools", icon: <Wrench size={16} /> },
  ];

  // For the UI matching, if API fails or is empty, we show fake ones
  const displayProducts = products.length > 0 ? products : [
    { _id: '1', name: 'ATLAS Pro-X Humanoid', category: 'robotics', price: 1250000, image: 'https://images.unsplash.com/photo-1485637701894-09ad422f6de6?auto=format&fit=crop&q=80', isHot: true, discount: 7 },
    { _id: '2', name: 'NeuroCore Quantum AI', category: 'ai', price: 450000, image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80' },
    { _id: '3', name: 'Heavy-Duty CNC Router', category: 'machinery', price: 850000, image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80', isHot: true, discount: 15 }
  ];

  const filteredProducts = activeCategory === 'all' 
      ? displayProducts 
      : displayProducts.filter((p: any) => p.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex flex-col min-h-screen bg-[#060B19] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Faint grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="container relative flex flex-col items-start px-6 lg:px-8">
          
          <div className="inline-flex items-center space-x-2 text-[#00E5FF] tracking-[0.2em] text-[10px] md:text-sm font-bold uppercase mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)]"></span>
            <span>India's Premier Robotics & AI Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.1] mb-6">
            Deploy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7B61FF] to-[#BD00FF]">Intelligence</span> <br />
            Of Tomorrow
          </h1>
          
          <p className="text-[#8B9BB4] text-lg md:text-xl max-w-2xl leading-relaxed mb-10 font-medium">
            Premium robotics, breakthrough AI devices & industrial machinery — with UPI payments, GST invoicing, and pan-India delivery. Engineered for Bharat.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="#catalog" className="inline-flex items-center justify-center font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] bg-gradient-to-r from-[#00E5FF] to-[#0073FF] text-white hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
               🚀 Explore Catalog
            </Link>
            <button className="inline-flex items-center justify-center font-bold px-8 py-4 rounded-xl transition-all border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/10">
               <Play size={18} className="mr-2" /> Watch Demo
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-20 w-full">
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#00E5FF] mb-1">4,200+</div>
              <div className="text-[10px] md:text-xs font-bold tracking-widest text-[#586A86] uppercase">Units Deployed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#00E5FF] mb-1">98%</div>
              <div className="text-[10px] md:text-xs font-bold tracking-widest text-[#586A86] uppercase">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#00E5FF] mb-1">28+</div>
              <div className="text-[10px] md:text-xs font-bold tracking-widest text-[#586A86] uppercase">States Served</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#00E5FF] mb-1">₹2,000Cr+</div>
              <div className="text-[10px] md:text-xs font-bold tracking-widest text-[#586A86] uppercase">Commerce Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Ribbon */}
      <section className="border-y border-[#1E293B] bg-[#0A101D]">
        <div className="container px-6 py-4 flex flex-wrap items-center justify-between text-[#8B9BB4] text-xs font-bold tracking-wider uppercase">
           <div className="flex items-center gap-2">
             <ShieldCheck size={16} /> 3-Year Warranty
           </div>
           <div className="hidden sm:block text-[#1E293B]">|</div>
           <div className="flex items-center gap-2">
             <Bot size={16} /> 24/7 Support
           </div>
        </div>
      </section>

      {/* Promo Cards */}
      <section className="py-10 pb-6">
        <div className={`container px-6 grid grid-cols-1 ${promo ? 'lg:grid-cols-2' : ''} gap-6`}>
          
          {/* Made for India Card */}
          <div className="bg-[#0B1526] border border-[#1E293B] rounded-3xl p-6 relative overflow-hidden group hover:border-[#F97316]/30 transition-colors">
            <div className="flex items-start gap-4 z-10 relative">
               <div className="w-10 h-10 rounded-lg bg-white/5 flex flex-shrink-0 items-center justify-center text-xl shadow-inner border border-white/10">🇮🇳</div>
               <div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    <span className="text-[#F97316]">Made for India.</span> GST-compliant invoices, UPI-first payments, WhatsApp order updates in Tamil, Hindi & English.
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-4 text-[10px] font-bold">
                    <span className="bg-[#7B61FF]/10 text-[#7B61FF] px-3 py-1.5 rounded-full border border-[#7B61FF]/20">UPI</span>
                    <span className="bg-[#22C55E]/10 text-[#22C55E] px-3 py-1.5 rounded-full border border-[#22C55E]/20">GST Invoice</span>
                    <span className="bg-[#EAB308]/10 text-[#EAB308] px-3 py-1.5 rounded-full border border-[#EAB308]/20">COD</span>
                    <span className="bg-[#F97316]/10 text-[#F97316] px-3 py-1.5 rounded-full border border-[#F97316]/20">Make in India</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Dynamic Sale Card */}
          {promo && (
            <div className="bg-[#1F1010] border border-[#F97316]/20 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col sm:flex-row gap-6 relative z-10 h-full">
                <div className="flex gap-4">
                  <div className="w-10 h-10 text-2xl flex items-center justify-center shrink-0">🔥</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#F97316] leading-snug">
                      {promo.offerTitle}<br/><span className="text-white">— {promo.offerDescription}</span>
                    </h3>
                    <div className="mt-4 text-xs font-medium text-[#8B9BB4]">
                      Use code <span className="bg-[#F97316]/20 text-[#F97316] px-2 py-0.5 rounded ml-1 border border-[#F97316]/30 font-bold tracking-widest uppercase">{promo.offerCode}</span>
                    </div>
                    <div className="mt-1 text-xs text-[#8B9BB4]">Offer ends in:</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 sm:ml-auto mt-4 sm:mt-0 xl:flex-nowrap">
                   {timeLeft.days > 0 && (
                     <>
                        <div className="flex flex-col items-center">
                          <div className="bg-[#0B1526] border border-[#1E293B] text-[#00E5FF] font-mono text-xl font-black rounded-lg w-10 h-10 flex items-center justify-center shadow-inner">{formatTime(timeLeft.days)}</div>
                          <div className="text-[8px] tracking-widest text-[#586A86] uppercase mt-1">DYS</div>
                        </div>
                        <div className="text-[#00E5FF] font-black">:</div>
                      </>
                   )}
                   <div className="flex flex-col items-center">
                     <div className="bg-[#0B1526] border border-[#1E293B] text-[#00E5FF] font-mono text-xl md:text-2xl font-black rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-inner">{formatTime(timeLeft.hours)}</div>
                     <div className="text-[8px] tracking-widest text-[#586A86] uppercase mt-1">HRS</div>
                   </div>
                   <div className="text-[#00E5FF] font-black">:</div>
                   <div className="flex flex-col items-center">
                     <div className="bg-[#0B1526] border border-[#1E293B] text-[#00E5FF] font-mono text-xl md:text-2xl font-black rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-inner">{formatTime(timeLeft.minutes)}</div>
                     <div className="text-[8px] tracking-widest text-[#586A86] uppercase mt-1">MIN</div>
                   </div>
                   <div className="text-[#00E5FF] font-black">:</div>
                   <div className="flex flex-col items-center">
                     <div className="bg-[#0B1526] border border-[#1E293B] text-[#00E5FF] font-mono text-xl md:text-2xl font-black rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-inner">{formatTime(timeLeft.seconds)}</div>
                     <div className="text-[8px] tracking-widest text-[#586A86] uppercase mt-1">SEC</div>
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="catalog" className="py-12 bg-[#060B19]">
        <div className="container px-6">
          
          <div className="flex items-center gap-4 mb-4">
             <div className="h-0.5 w-6 bg-[#00E5FF]"></div>
             <h2 className="text-[#00E5FF] uppercase tracking-[0.2em] text-xs font-bold">Product Lines</h2>
          </div>
          <h3 className="text-3xl font-black tracking-tight mb-8">Browse by Category</h3>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide mb-6 edge-mask">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all border
                  ${activeCategory === cat.id 
                    ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                    : 'border-[#1E293B] bg-[#0B1526] hover:bg-[#1E293B] text-[#8B9BB4]'
                  }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4">
             <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#586A86]" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by name, brand, category..." 
                 className="w-full bg-[#0B1526] border border-[#1E293B] rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00E5FF]/50 text-white placeholder:text-[#586A86]"
               />
             </div>
             <div className="relative min-w-[160px]">
               <select className="w-full appearance-none bg-[#0B1526] border border-[#1E293B] rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00E5FF]/50 text-[#8B9BB4]">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
               </select>
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EAB308]">⭐</span>
             </div>
          </div>

          {/* Product Grid */}
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-[#0B1526] border border-[#1E293B] h-[350px] rounded-3xl"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => (
                <div key={product._id} className="bg-[#0B1526] border border-[#1E293B] rounded-[2rem] p-4 relative group hover:border-[#00E5FF]/40 transition-colors">
                  
                  {/* Image & Badges */}
                  <div className="relative aspect-square bg-[#111A2C] rounded-[1.5rem] mb-4 overflow-hidden flex items-center justify-center p-6 cursor-pointer" onClick={() => router.push(`/products/${product._id}`)}>
                    {product.isHot && (
                      <span className="absolute top-4 left-4 bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#F43F5E] text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded">HOT</span>
                    )}
                    <button className="absolute top-4 right-4 h-8 w-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white hover:text-red-500 hover:bg-black/60 transition z-10">
                      <Heart size={14} />
                    </button>
                    {product.discount && (
                      <span className="absolute bottom-4 right-4 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold px-2 py-1 rounded">-{product.discount}%</span>
                    )}

                    {/* Image handling - show fallback icon if invalid */}
                    <div className="w-full h-full relative z-0 flex items-center justify-center">
                       <img src={product.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80'} alt={product.name} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                       <Bot size={64} className="text-[#1E293B] hidden" />
                    </div>

                    {/* Quick View Overlay (Hover) */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-white font-bold flex items-center gap-2">🔍 Quick View</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-2 pb-2">
                    <div className="text-[10px] text-[#586A86] uppercase tracking-widest font-bold mb-1">{product.category}</div>
                    <Link href={`/products/${product._id}`}>
                      <h4 className="font-bold text-white text-lg leading-tight mb-3 hover:text-[#00E5FF] transition-colors line-clamp-1">{product.name}</h4>
                    </Link>
                    
                    <div className="flex items-center justify-between">
                       <div className="text-xl font-black text-[#00E5FF] font-mono">
                         ₹{product.price.toLocaleString('en-IN')}
                       </div>
                       <button className="h-10 w-10 bg-[#00E5FF] text-black rounded-xl flex items-center justify-center hover:bg-white transition hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                         <Search size={16} /> {/* Should be cart icon based on standard use case, I'll use Wrench here or standard add icon */}
                       </button>
                    </div>
                  </div>

                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-[#586A86]">
                   <p>No products found in this category.</p>
                </div>
              )}
            </div>
          )}
          
        </div>
      </section>

      {/* Global CSS Overrides specifically for this dark theme if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .edge-mask {
            mask-image: linear-gradient(to right, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, black 90%, transparent);
        }
      `}} />

    </div>
  );
}
