"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useLanguage } from "@/store/LanguageContext";
import { ShoppingCart, User, Menu, Search, Bot, Globe, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, cart } = useStore();
  const { locale, setLocale, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle clicking outside the search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch initial recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await api.get('/products');
        // Just grab the top 2 highest rated for recommendations
        const sorted = data.sort((a: any, b: any) => b.rating - a.rating).slice(0, 2);
        setRecommendations(sorted);
      } catch (err) {
        // fail silently for recommendations setup
      }
    };
    fetchRecommendations();
  }, []);

  // Debounced Search Action
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await api.get(`/products?keyword=${searchQuery}`);
        setSearchResults(data);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl">🇮🇳</span>
            <span className="inline-block font-black text-xl tracking-widest text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] uppercase">Sai India Elite</span>
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
               {t('nav_home')}
            </Link>
            <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
              {t('nav_products')}
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-sm font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-md transition-colors hover:bg-primary/20">
                Admin Dashboard
              </Link>
            )}
            <Link href="/products?category=ai" className="text-sm font-medium transition-colors hover:text-primary">
              {t('nav_ai_machinery')}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          {/* Enhanced Custom Language Selector (Desktop) */}
          <div className="relative hidden lg:block">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 bg-secondary/30 border border-primary/30 hover:border-primary transition-all px-4 py-2 rounded-full shadow-sm cursor-pointer"
            >
              <Globe size={16} className="text-primary" />
              <span className="text-xs font-bold text-foreground">{t('nav_language')}</span>
              <div className="text-xs font-extrabold text-primary ml-2 bg-primary/10 px-2 py-0.5 rounded-md">
                {locale.toUpperCase()}
              </div>
            </button>
            
            {isLangOpen && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 pb-1 animate-in fade-in slide-in-from-top-2">
                <button onClick={() => { setLocale('en'); setIsLangOpen(false); }} className={`px-4 py-3 text-sm text-left hover:bg-muted transition-colors border-b border-border/50 ${locale === 'en' ? 'font-bold text-primary bg-primary/5' : 'text-foreground'}`}>English (ENG)</button>
                <button onClick={() => { setLocale('hi'); setIsLangOpen(false); }} className={`px-4 py-3 text-sm text-left hover:bg-muted transition-colors border-b border-border/50 ${locale === 'hi' ? 'font-bold text-primary bg-primary/5' : 'text-foreground'}`}>हिन्दी (HIN)</button>
                <button onClick={() => { setLocale('ta'); setIsLangOpen(false); }} className={`px-4 py-3 text-sm text-left hover:bg-muted transition-colors ${locale === 'ta' ? 'font-bold text-primary bg-primary/5' : 'text-foreground'}`}>தமிழ் (TAM)</button>
              </div>
            )}
          </div>

          {/* Intelligent Search Bar */}
          <div className="hidden md:flex items-center relative" ref={searchRef}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder={t('nav_search_placeholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9 sm:w-[320px]"
            />
            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-3 w-[450px] bg-card border border-border rounded-xl shadow-2xl flex z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {/* Search Results */}
                <div className="flex-1 border-r border-border p-3 max-h-[350px] overflow-y-auto">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <Search size={14} className="text-primary" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Results</span>
                    {isSearching && <Loader2 size={12} className="animate-spin text-primary ml-auto" />}
                  </div>
                  
                  {!searchQuery.trim() ? (
                    <div className="text-sm text-muted-foreground p-4 text-center">Type a keyword to explore... (e.g., Robots)</div>
                  ) : searchResults.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {searchResults.map((item: any) => (
                        <button 
                          key={item._id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            router.push(`/products/${item._id}`);
                          }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                        >
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded shadow-sm" />
                          <div>
                            <div className="text-sm font-semibold leading-tight line-clamp-1">{item.name}</div>
                            <div className="text-xs text-primary font-mono mt-0.5">₹{item.price.toLocaleString('en-IN')}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                     <div className="text-sm text-muted-foreground p-4 text-center">No machinery found matching your query.</div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="w-[180px] bg-muted/30 p-3 hidden sm:block">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Best Sellers</span>
                  <div className="flex flex-col gap-3">
                    {recommendations.map((item: any) => (
                      <button 
                        key={item._id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(`/products/${item._id}`);
                        }}
                        className="group flex flex-col text-left gap-1 transition-all"
                      >
                         <div className="w-full aspect-square rounded-md overflow-hidden border border-border mb-1">
                           <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                         </div>
                         <div className="text-xs font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">{item.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Link href="/cart" className="relative p-2 hover:bg-accent rounded-full transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/profile" className="p-2 hover:bg-accent rounded-full transition-colors">
                <User className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-all shadow-sm">
              {t('nav_login')}
            </Link>
          )}

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 flex flex-col gap-4 bg-background">
          {/* Mobile Language Selector */}
          <div className="flex flex-col gap-2 bg-secondary/10 border border-border p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={16} className="text-primary" />
              <span className="text-sm font-bold text-muted-foreground">{t('nav_language')}</span>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => { setLocale('en'); setIsMenuOpen(false); }} className={`px-4 py-2 text-sm text-left rounded-lg transition-colors ${locale === 'en' ? 'font-bold text-primary bg-primary/10' : 'text-foreground hover:bg-muted'}`}>English (ENG)</button>
              <button onClick={() => { setLocale('hi'); setIsMenuOpen(false); }} className={`px-4 py-2 text-sm text-left rounded-lg transition-colors ${locale === 'hi' ? 'font-bold text-primary bg-primary/10' : 'text-foreground hover:bg-muted'}`}>हिन्दी (HIN)</button>
              <button onClick={() => { setLocale('ta'); setIsMenuOpen(false); }} className={`px-4 py-2 text-sm text-left rounded-lg transition-colors ${locale === 'ta' ? 'font-bold text-primary bg-primary/10' : 'text-foreground hover:bg-muted'}`}>தமிழ் (TAM)</button>
            </div>
          </div>
          
          <Link href="/" className="text-sm font-medium">{t('nav_home')}</Link>
          <Link href="/products" className="text-sm font-medium">{t('nav_products')}</Link>
          {user?.role === 'admin' && (
            <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-primary bg-primary/10 px-3 py-2 rounded">
              Admin Dashboard
            </Link>
          )}
          <Link href="/products?category=ai" className="text-sm font-medium">{t('nav_ai_machinery')}</Link>
          {!user ? (
            <Link href="/login" className="text-sm font-medium text-primary">{t('nav_login')}</Link>
          ) : (
            <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium">Profile</Link>
          )}
        </div>
      )}
    </nav>
  );
}
