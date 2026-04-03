import Link from 'next/link';
import { Book, Play, Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-[#050B14] text-[#8B9BB4] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      <div className="container py-12 md:py-16 relative z-10 max-w-lg mx-auto md:max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:justify-between space-y-12 md:space-y-0">
          
          <div className="md:w-1/3">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-xl">🇮🇳</span>
              <span className="inline-block font-black text-xl tracking-widest text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] uppercase">Sai India Elite</span>
            </div>
            
            <p className="text-sm font-medium leading-relaxed mb-6">
              India's #1 platform for enterprise robotics, AI devices & industrial machinery. GST invoiced, UPI secured, pan-India delivered.
            </p>

            <div className="text-xs space-y-1 font-mono text-[#586A86] mb-8">
              <p>GSTIN: 33AABCS1234K1Z5 <span className="mx-2">•</span> CIN: <br className="hidden md:block"/>U72900TN2024PTC000001</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="h-10 w-10 bg-[#0B1526] border border-[#1E293B] rounded-lg flex items-center justify-center hover:bg-[#1E293B] hover:text-white transition">
                <span className="font-bold text-sm">X</span>
              </button>
              <button className="h-10 w-10 bg-[#0B1526] border border-[#1E293B] rounded-lg flex items-center justify-center hover:bg-[#1E293B] hover:text-white transition">
                <span className="font-bold text-sm">in</span>
              </button>
              <button className="h-10 w-10 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-lg flex items-center justify-center hover:bg-[#00E5FF]/20 transition relative text-[#00E5FF]">
                <Book size={16} />
              </button>
              <button className="h-10 w-10 bg-[#0B1526] border border-[#1E293B] rounded-lg flex items-center justify-center hover:bg-[#1E293B] hover:text-white transition">
                <Play size={16} />
              </button>
              <button className="h-10 w-10 bg-[#0B1526] border border-[#1E293B] rounded-lg flex items-center justify-center hover:bg-[#1E293B] hover:text-white transition">
                <Camera size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:w-2/3 md:justify-items-end md:pl-16">
            <div className="w-full">
              <h3 className="mb-6 text-sm font-bold tracking-[0.2em] text-[#00E5FF] uppercase">Platform</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/products" className="hover:text-white transition">Products</Link></li>
                <li><Link href="/compare" className="hover:text-white transition">Compare</Link></li>
                <li><Link href="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
                <li><Link href="/orders" className="hover:text-white transition">My Orders</Link></li>
              </ul>
            </div>

            <div className="w-full">
              <h3 className="mb-6 text-sm font-bold tracking-[0.2em] text-[#00E5FF] uppercase">Company</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              </ul>
            </div>

            <div className="w-full">
              <h3 className="mb-6 text-sm font-bold tracking-[0.2em] text-[#00E5FF] uppercase">Support</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li><Link href="/track" className="hover:text-white transition">Track Order</Link></li>
                <li><Link href="/gst" className="hover:text-white transition">GST Invoices</Link></li>
                <li><Link href="/returns" className="hover:text-white transition">Return Policy</Link></li>
                <li><Link href="/sla" className="hover:text-white transition">Enterprise SLA</Link></li>
              </ul>
            </div>
          </div>

        </div>
        
        <div className="mt-12 md:mt-16 space-y-3 text-sm font-medium w-full md:w-1/3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">📞</span>
              <a href="tel:+919445505875" className="hover:text-white tracking-wide">+91 9445505875</a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#00E5FF] bg-[#00E5FF]/10 p-1 mt-1 rounded text-[10px]">E</span>
              <a href="mailto:anand@saieliteindia.com" className="hover:text-white tracking-wide">anand@saieliteindia.com</a>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-red-500">📍</span>
              <span className="tracking-wide">Chennai - 600056</span>
            </div>
        </div>

        <div className="mt-12 border-t border-[#1E293B] pt-8 flex flex-col md:flex-row md:justify-between items-start gap-6 text-xs text-[#586A86]">
          <p>© 2025 Sai Elite India Industries Pvt Ltd · Chennai, Tamil Nadu</p>
          <div className="flex flex-wrap gap-4 font-medium md:gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/gst-policy" className="hover:text-white transition">GST Policy</Link>
            <Link href="/refund" className="hover:text-white transition">Refund Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
