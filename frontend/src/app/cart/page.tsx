"use client";

import { useStore } from "@/store/useStore";
import { Trash2, ArrowRight, ShieldCheck, ShoppingCart } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, user, clearCart } = useStore();
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('You must be logged in to checkout');
      return;
    }
    
    setLoading(true);
    try {
      // 1. Create order on backend which interacts with Razorpay 
      const amount = totalPrice * 1.18; // Includes GST
      const { data: order } = await api.post('/payments/create-order', { amount });
      
      const options = {
        key: 'your_razorpay_key_id', // Would be process.env.NEXT_PUBLIC_RAZORPAY_KEY or injected
        amount: order.amount,
        currency: order.currency,
        name: "Sai Elite India",
        description: "Industrial Robotics Transaction",
        order_id: order.id,
        handler: async function (response: any) {
          // 2. Verify payment on backend
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id 
            });
            toast.success('Payment Successful! Processing your machines.');
            clearCart();
          } catch(err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error processing checkout. Is API running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any industrial robotics to your cart yet.</p>
          <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-11 px-8 font-medium transition-colors hover:bg-primary/90">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product} className="flex flex-col sm:flex-row gap-6 bg-card border border-border p-4 rounded-2xl relative">
                <div className="h-24 w-24 sm:h-32 sm:w-32 bg-muted/50 rounded-xl flex-shrink-0 flex items-center justify-center">
                   <span className="text-xs text-muted-foreground">Product</span>
                </div>
                <div className="flex flex-col flex-1 py-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold line-clamp-2 pr-8">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.product)}
                      className="text-muted-foreground hover:text-destructive transition-colors absolute top-4 right-4 sm:relative sm:top-0 sm:right-0"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">Quantity: {item.qty}</div>
                  <div className="mt-auto font-bold text-xl">₹{item.price.toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-card border border-border p-6 rounded-2xl h-fit sticky top-24">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cart.reduce((a,c) => a+c.qty, 0)} items)</span>
                <span className="font-medium">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="font-medium">₹{(totalPrice * 0.18).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-500">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>₹{(totalPrice * 1.18).toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-semibold rounded-xl px-4 py-4 hover:bg-primary/90 transition-all flex items-center justify-center mb-4 disabled:opacity-50"
            >
              {loading ? 'Processing...' : <><span className="mr-2">Proceed to Razorpay Checkout</span><ArrowRight size={18} /></>}
            </button>
            
            <div className="flex items-center justify-center text-xs text-muted-foreground gap-2 mt-4">
              <ShieldCheck size={14} className="text-green-500" /> Secure payment powered by Razorpay
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
