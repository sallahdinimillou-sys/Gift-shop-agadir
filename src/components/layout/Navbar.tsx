"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

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
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/#shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#C8006E] shadow-lg sticky",
      "glass-navbar py-3 px-4 md:px-8"
    )}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-lg">
            <Image 
              src="/logo.png" 
              alt="Gift Shop Agadir Logo" 
              fill 
              className="object-contain transition-transform group-hover:scale-105"
              priority
            />
          </div>
          <span className="text-xl md:text-2xl font-bold text-gradient-primary uppercase tracking-tighter hidden sm:block">
            Gift Shop Agadir
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-semibold text-white/90 hover:text-primary transition-all hover:scale-105"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/#shop">
            <Button variant="ghost" size="icon" className="hidden sm:flex text-white hover:text-primary hover:bg-white/10 rounded-full">
              <Search className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative group bg-[#C8006E] hover:bg-[#C8006E]/90 text-white rounded-full shadow-md transition-transform active:scale-95">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-black ring-2 ring-[#1a1a3e] animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/admin/login" className="hidden sm:block">
            <Button variant="outline" size="sm" className="border-[#C8006E] text-white hover:bg-[#C8006E] hover:text-white rounded-full px-5 transition-all">
              <User className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-0 bg-[#1a1a3e]/98 backdrop-blur-xl z-[60] p-8 flex flex-col space-y-8 pt-24 animate-in slide-in-from-top duration-300">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-6 right-6 text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-10 h-10" />
          </Button>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-bold text-white hover:text-primary transition-colors border-b border-white/10 pb-4"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 space-y-4">
            <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
               <Button className="w-full bg-[#C8006E] hover:bg-[#C8006E]/90 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-[#C8006E]/20">
                 Admin Dashboard
               </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
