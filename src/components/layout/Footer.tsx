
import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10 text-left">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-bold text-gradient-primary animate-text-glow tracking-tighter uppercase inline-block">
              Gift Shop Agadir
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Your premier luxury gift destination in Agadir. Specializing in awards, trophies, and unforgettable personalized keepsakes.
            </p>
            <div className="flex justify-start space-x-4 rtl:space-x-reverse">
              <a href={BUSINESS_INFO.social.facebook} target="_blank" className="p-2 bg-white/5 hover:bg-primary/20 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={BUSINESS_INFO.social.instagram} target="_blank" className="p-2 bg-white/5 hover:bg-primary/20 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Our Story</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">Shipping & FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Policies</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">Return Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Store Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-muted-foreground rtl:space-x-reverse">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Agadir, Morocco <br/> (Near Main Square)</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground rtl:space-x-reverse">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>{BUSINESS_INFO.phone}</span>
              </li>
              <li className="flex items-center space-x-3 text-muted-foreground rtl:space-x-reverse">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>{BUSINESS_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground space-y-4 md:space-y-0 text-left">
          <p>© {new Date().getFullYear()} Gift Shop Agadir. All Rights Reserved.</p>
          <p>Designed for Excellence.</p>
        </div>
      </div>
    </footer>
  );
}
