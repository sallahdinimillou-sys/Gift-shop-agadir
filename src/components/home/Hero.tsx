
"use client"

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export function Hero() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-main');

  const openWhatsApp = () => {
    const message = encodeURIComponent("مرحباً Gift Shop Agadir! أنا مهتم بتشكيلتكم الفاخرة.");
    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <section className="relative min-h-[50vh] w-full flex items-start pt-12 pb-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {heroImg && (
          <Image
            src={heroImg.imageUrl}
            alt={heroImg.description}
            fill
            className="object-cover opacity-60"
            priority
            data-ai-hint={heroImg.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 md:px-12 z-10 mt-20">
        <div className="max-w-5xl mr-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tighter text-left uppercase">
              Celebrating <br /> 
              <span className="text-gradient-primary animate-text-glow">Every Victory</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium pt-2 text-right">
              الوجهة الأولى في أكادير للكؤوس والجوائز الفاخرة والهدايا المخصصة الراقية. صُنعت بشغف، وقُدمت بتميز.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-start">
              <Link href="/#shop">
                <Button size="lg" className="rounded-full h-16 px-12 text-lg font-black btn-glow">
                  تصفح المتجر
                  <ArrowLeft className="mr-3 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                onClick={openWhatsApp}
                className="rounded-full h-16 px-12 text-lg font-black border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shadow-green-500/20 flex items-center justify-start"
                style={{ direction: 'ltr' }}
              >
                <MessageCircle className="mr-3 w-5 h-5" />
                اطلب عبر الواتساب
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
