"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
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
    { name: 'Notre Collection', href: '/#shop' },
    { name: 'À Propos', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "glass-navbar py-3 border-b border-primary/20 shadow-2xl" : "bg-transparent py-6"
    )}>
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between flex-row-reverse">
        
        {/* Logo - Always on the LEFT relative to the viewer even in RTL */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-black text-gradient-primary animate-text-glow uppercase tracking-tighter">
              Gift Shop Agadir
            </span>
          </Link>
        </div>

        {/* Desktop Nav - Middle */}
        <div className="hidden lg:flex items-center space-x-10 space-x-reverse mx-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-base font-bold text-white/90 hover:text-primary transition-all hover:scale-105"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons/Admin - Right relative to the viewer */}
        <div className="flex items-center gap-4 flex-row-reverse">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-white hover:text-primary rounded-full shadow-none active:scale-95">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/admin/login" className="hidden sm:block">
            <Button variant="outline" size="sm" className="rounded-full px-6 border-primary/50 text-white hover:bg-primary">
              <User className="w-4 h-4 ml-2" />
              الإدارة
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-white shadow-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 bg-background/98 backdrop-blur-2xl z-[60] p-8 flex flex-col space-y-8 pt-24 animate-in slide-in-from-top duration-300 text-right">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-8 left-8 text-white shadow-none"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-10 h-10" />
          </Button>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-white hover:text-primary transition-colors border-b border-white/10 pb-4"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
             <Button className="w-full h-14 rounded-2xl bg-primary text-xl font-bold">
               لوحة التحكم
             </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
