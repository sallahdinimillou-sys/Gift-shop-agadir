
"use client"

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-main');

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
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-14 text-lg rounded-full">
                  Explore Shop
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 px-8 h-14 text-lg rounded-full">
                  Contact Us
                </Button>
              </Link>
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
