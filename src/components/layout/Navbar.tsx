"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'المتجر', href: '/#shop' },
    { name: 'حولنا', href: '/about' },
    { name: 'اتصل بنا', href: '/contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#C8006E]/30 shadow-2xl",
      "glass-navbar py-4 px-6 md:px-12"
    )}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <span className="text-xl md:text-2xl font-black text-gradient-primary animate-text-glow uppercase tracking-tighter">
            Gift Shop Agadir
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-bold text-white/90 hover:text-primary transition-all hover:scale-110 tracking-wide"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/#shop">
            <Button variant="ghost" size="icon" className="hidden sm:flex text-white hover:text-primary hover:bg-white/10 rounded-full">
              <Search className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative group text-white hover:text-primary hover:bg-white/10 rounded-full transition-transform active:scale-95 shadow-none">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-[#1a1a3e] animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/admin/login" className="hidden sm:block">
            <Button variant="outline" size="sm" className="border-[#C8006E] text-white hover:bg-[#C8006E] hover:text-white rounded-full px-6 py-2 transition-all btn-glow-white">
              <User className="w-4 h-4 mr-2" />
              الإدارة
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 bg-[#1a1a3e]/98 backdrop-blur-2xl z-[60] p-8 flex flex-col space-y-10 pt-32 animate-in slide-in-from-top duration-300 text-right">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-8 left-8 text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-10 h-10" />
          </Button>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-bold text-white hover:text-primary transition-colors border-b border-white/10 pb-6"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-6 space-y-6">
            <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
               <Button className="w-full bg-[#C8006E] hover:bg-[#C8006E]/90 h-16 rounded-2xl text-xl font-bold shadow-lg shadow-[#C8006E]/20 btn-glow-primary">
                 لوحة التحكم
               </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}