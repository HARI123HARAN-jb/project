import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIChatbot from '@/components/AIChatbot';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/store/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sai Elite India | Robotics & AI Machinery',
  description: 'Premium AI Machinery and Industrial Robotics for the Indian Market.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <AIChatbot />
          <Toaster position="top-center" />
        </LanguageProvider>
      </body>
    </html>
  );
}
