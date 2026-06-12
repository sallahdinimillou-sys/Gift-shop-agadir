
"use client"

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

const WhatsAppIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    width="20" 
    height="20" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
    className="mr-2"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function Hero() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-main');

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello Gift Shop Agadir! I'm interested in your luxury collection.");
    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        {heroImg && (
          <Image
            src={heroImg.imageUrl}
            alt={heroImg.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImg.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-semibold tracking-widest uppercase mb-4 block">
              Exclusive Luxury Collection
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 tracking-tighter">
              Celebrating <br /> 
              <span className="text-gradient-primary">Every Victory</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Agadir's premier destination for high-end trophies, awards, and personalized luxury gifts. Crafted with passion, delivered with excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-14 text-lg rounded-full shadow-lg">
                  Explore Shop
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                onClick={openWhatsApp}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-8 h-14 text-lg rounded-full animate-whatsapp-glow transition-transform hover:scale-105"
              >
                <WhatsAppIcon />
                Chat on WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tropical accent decal */}
      <div className="absolute bottom-10 right-10 opacity-20 hidden lg:block">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0C100 0 110 50 150 70C190 90 200 100 200 100C200 100 150 110 130 150C110 190 100 200 100 200C100 200 90 150 50 130C10 110 0 100 0 100C0 100 50 90 70 50C90 10 100 0 100 0Z" fill="url(#paint0_linear)" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D81E5B" />
              <stop offset="1" stopColor="#FACC15" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
