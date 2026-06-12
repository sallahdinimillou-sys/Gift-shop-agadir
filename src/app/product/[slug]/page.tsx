
"use client"

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, Clock, MessageCircle, ChevronLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { BUSINESS_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  const firestore = useFirestore();
  
  const productQuery = useMemo(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, 'products'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);

  const { data: products, loading } = useCollection<Product>(productQuery);
  const product = products?.[0];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-background">
        <h2 className="text-2xl font-bold">المنتج غير موجود.</h2>
        <Link href="/#shop">
          <Button variant="outline" className="rounded-full">
            <ChevronLeft className="w-4 h-4 mr-2" />
            العودة للمتجر
          </Button>
        </Link>
      </div>
    );
  }

  const handleBuyNowWhatsApp = () => {
    const message = encodeURIComponent(
      `مرحباً Gift Shop Agadir!\n\nأرغب في طلب هذا المنتج: *${product.title}*.\n\n*الثمن:* ${product.price.toFixed(2)} MAD\n\nهل هذا المنتج متوفر حالياً؟`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link href="/#shop" className="hover:text-primary transition-colors">المجموعة</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-white/5 shadow-2xl">
                <img 
                  src={product.images?.[activeImageIndex] || 'https://placehold.co/800x800?text=No+Image'} 
                  alt={product.title} 
                  className="w-full h-full object-cover animate-in fade-in duration-500"
                />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                  {product.images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImageIndex(i)}
                      className={cn(
                        "relative aspect-square rounded-2xl overflow-hidden bg-card border-2 transition-all duration-300",
                        activeImageIndex === i ? "border-primary ring-2 ring-primary/20" : "border-white/5 hover:border-white/20"
                      )}
                    >
                      <img 
                        src={img} 
                        alt={`${product.title} view ${i + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col h-full py-2">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {product.featured && <Badge className="bg-primary hover:bg-primary font-bold">مميز</Badge>}
                  {product.bestSeller && <Badge className="bg-accent text-black hover:bg-accent font-bold">الأكثر مبيعاً</Badge>}
                  <Badge variant="outline" className="border-white/20 backdrop-blur-sm uppercase tracking-wider text-[10px]">
                    {product.categoryId?.replace('-', ' ')}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-baseline gap-4 pt-2">
                  <span className="text-4xl font-bold text-gradient-primary">
                    {product.price.toFixed(2)} MAD
                  </span>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary/10 h-16 rounded-2xl text-lg font-bold transition-all hover:scale-[1.02]"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    أضف للسلة
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba59] h-16 rounded-2xl text-lg font-bold text-white shadow-xl shadow-green-500/20 transition-all hover:scale-[1.02]"
                    onClick={handleBuyNowWhatsApp}
                  >
                    <MessageCircle className="w-5 h-5 mr-3 fill-current" />
                    اطلب عبر الواتساب
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 mt-12 border-t border-white/5">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <ShieldCheck className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-bold">جودة مضمونة</p>
                    <p className="text-xs text-muted-foreground">مواد فاخرة معتمدة فقط</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Truck className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-bold">توصيل سريع</p>
                    <p className="text-xs text-muted-foreground">شحن سريع لجميع مدن المغرب</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
