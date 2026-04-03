import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuildX AI | Platform",
  description: "Real-time AI-powered multi-vendor marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-black text-white min-h-screen flex flex-col`}>
        <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-xl font-bold tracking-tight">
              Build<span className="text-blue-500">X</span> AI
            </div>
            <div className="flex gap-4">
              <a href="/customer" className="text-sm font-medium hover:text-blue-400 transition-colors">Customer Portal</a>
              <a href="/vendor" className="text-sm font-medium hover:text-violet-400 transition-colors">Vendor Portal</a>
            </div>
          </div>
        </nav>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
