import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  numReviews: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1
    });
  };

  return (
    <Link href={`/products/${product._id}`} className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-muted/20 p-6 flex items-center justify-center">
        {/* Placeholder for dynamic image */}
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary rounded-xl flex items-center justify-center text-muted-foreground shadow-inner">
          <span className="text-sm font-medium">Product Image</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">{product.category}</div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-4 text-sm text-muted-foreground">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-current" : "text-muted"} />
            ))}
          </div>
          <span>({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
          <button 
            onClick={handleAddToCart}
            className="h-10 w-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
