"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/store/LanguageContext";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  
  const categoryQuery = searchParams.get("category") || "All Categories";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    categoryQuery === "ai" ? "AI Machinery" : categoryQuery
  );

  // Sync state if URL changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat === "ai") setSelectedCategory("AI Machinery");
    else if (cat) setSelectedCategory(cat);
    else setSelectedCategory("All Categories");
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to connect to backend server');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{t('prod_page_title')}</h1>
          <p className="text-muted-foreground">{t('prod_page_subtitle')}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <select 
            value={selectedCategory}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCategory(val);
              if (val === "All Categories") router.push('/products');
              else if (val === "AI Machinery") router.push('/products?category=ai');
              else router.push(`/products?category=${val.toLowerCase()}`);
            }}
            className="bg-card border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="All Categories">{t('prod_filter_all')}</option>
            <option value="Robotics">{t('prod_filter_robotics')}</option>
            <option value="AI Machinery">{t('prod_filter_ai')}</option>
          </select>
          <select className="bg-card border border-input rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none">
            <option>{t('prod_sort_low')}</option>
            <option>{t('prod_sort_high')}</option>
            <option>{t('prod_sort_rating')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl h-[400px] animate-pulse border border-border"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 border border-border rounded-2xl text-muted-foreground max-w-2xl mx-auto">
          <p className="text-lg">{t('prod_empty_1')}</p>
          <p className="text-sm mt-2">{t('prod_empty_2')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products
            .filter((p: any) => selectedCategory === "All Categories" || p.category === selectedCategory || (selectedCategory === "AI Machinery" && p.category?.toLowerCase().includes("ai")))
            .map((product: { _id: string, name: string, category: string, price: number, image: string, rating: number, numReviews: number }) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
