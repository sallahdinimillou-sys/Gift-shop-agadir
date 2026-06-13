import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10 text-left">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-left">
          <div className="space-y-6 text-left">
            <Link href="/" className="text-2xl font-bold text-gradient-primary animate-text-glow tracking-tighter uppercase inline-block">
              Gift Shop Agadir
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs text-left">
              Your premier luxury gift destination in Agadir. Specializing in awards, trophies, and unforgettable personalized keepsakes.
            </p>
            <div className="flex justify-start gap-4">
              <a href={BUSINESS_INFO.social.facebook} target="_blank" className="p-2 bg-white/5 hover:bg-primary/20 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={BUSINESS_INFO.social.instagram} target="_blank" className="p-2 bg-white/5 hover:bg-primary/20 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="text-left">
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-left">
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Our Story</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">Shipping & FAQ</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-lg font-bold mb-6">Policies</h4>
            <ul className="space-y-4 text-left">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">Return Policy</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-lg font-bold mb-6">Store Info</h4>
            <ul className="space-y-4 text-left">
              <li className="flex flex-row-reverse items-center justify-start gap-2 text-muted-foreground">
                <span className="text-left leading-tight">Agadir, Morocco (Near Main Square)</span>
                <MapPin className="w-5 h-5 text-primary shrink-0" />
              </li>
              <li className="flex flex-row-reverse items-center justify-start gap-2 text-muted-foreground">
                <span className="text-left">{BUSINESS_INFO.phone}</span>
                <Phone className="w-5 h-5 text-primary shrink-0" />
              </li>
              <li className="flex flex-row-reverse items-center justify-start gap-2 text-muted-foreground">
                <span className="text-left">{BUSINESS_INFO.email}</span>
                <Mail className="w-5 h-5 text-primary shrink-0" />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground space-y-4 md:space-y-0 text-left w-full">
          <p className="text-left w-full md:w-auto">© {new Date().getFullYear()} Gift Shop Agadir. All Rights Reserved.</p>
          <p className="text-left w-full md:w-auto">Designed for Excellence.</p>
        </div>
      </div>
    </footer>
  );
}