"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import api from "@/lib/axios";
import { Star, ShoppingCart, Truck, Shield } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useStore();
  const [product, setProduct] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: prodData } = await api.get(`/products/${id}`);
        setProduct(prodData);
        
        // Fetch AI recommendations
        const { data: recData } = await api.get(`/products/${id}/recommendations`);
        setRecommendations(recData);
      } catch (err: any) {
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="container py-20 text-center animate-pulse">Loading Asset Details...</div>;
  if (!product) return <div className="container py-20 text-center text-destructive">Product Not Found!</div>;

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Product Image Stage */}
        <div className="bg-muted/30 border border-border rounded-3xl p-8 flex items-center justify-center aspect-square shadow-inner">
           <img src={product.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80'} alt={product.name} className="object-cover rounded-xl shadow-2xl mix-blend-overlay max-h-[80%]" />
        </div>

        {/* Product Details Specs */}
        <div className="flex flex-col">
          <span className="text-secondary font-bold uppercase tracking-[0.2em] mb-3 text-sm">{product.category}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 text-sm">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < Math.round(product.rating) ? "fill-current" : "text-muted"} />
              ))}
            </div>
            <span className="text-muted-foreground font-medium">({product.numReviews} Certified Reviews)</span>
          </div>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary pl-4">{product.description}</p>
          
          <div className="text-4xl font-bold tracking-tight mb-8 font-mono">
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <button 
            onClick={() => {
              addToCart({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                qty: 1
              });
              toast.success(`${product.name} added to cart!`);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-4 px-8 rounded-full font-bold transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-1 flex items-center justify-center gap-3 w-full md:w-auto"
          >
            <ShoppingCart size={22} /> Pre-Order Machinery
          </button>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-3">
              <Truck className="text-blue-500" />
              <div className="text-sm font-medium">Insured Transport<br/><span className="text-muted-foreground font-normal">via Delhivery</span></div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="text-green-500" />
              <div className="text-sm font-medium">3 Year Warranty<br/><span className="text-muted-foreground font-normal">On AI Modules</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="border-t border-border pt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/20 p-2 rounded-lg text-primary shadow-glow">
              <Star size={24} className="animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">AI Recommended Hardware</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(rec => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
