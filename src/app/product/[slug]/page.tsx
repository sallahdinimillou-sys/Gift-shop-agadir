
"use client"

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, Clock, MessageCircle, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { BUSINESS_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  
  const product = MOCK_PRODUCTS.find(p => p.slug === slug);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Product not found.</h2>
        <Link href="/#shop">
          <Button variant="outline" className="rounded-full">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const handleBuyNowWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello Gift Shop Agadir!\n\nI'm interested in ordering the *${product.title}*.\n\n*Price:* ${product.price.toFixed(2)} MAD\n\nIs this product currently available?`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#shop" className="hover:text-primary transition-colors">Collection</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-white/5 shadow-2xl">
                <Image 
                  src={product.images[activeImageIndex]} 
                  alt={product.title} 
                  fill 
                  className="object-cover animate-in fade-in duration-500"
                  priority
                />
              </div>
              
              {product.images.length > 1 && (
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
                      <Image 
                        src={img} 
                        alt={`${product.title} view ${i + 1}`} 
                        fill 
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col h-full py-2">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {product.featured && <Badge className="bg-primary hover:bg-primary font-bold">FEATURED</Badge>}
                  {product.bestSeller && <Badge className="bg-accent text-navy-black hover:bg-accent font-bold">BEST SELLER</Badge>}
                  <Badge variant="outline" className="border-white/20 backdrop-blur-sm uppercase tracking-wider text-[10px]">
                    {product.categoryId.replace('-', ' ')}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-baseline gap-4 pt-2">
                  <span className="text-4xl font-bold text-gradient-primary">
                    {product.price.toFixed(2)} MAD
                  </span>
                  {product.comparePrice && (
                    <span className="text-2xl text-muted-foreground line-through decoration-primary/40">
                      {product.comparePrice.toFixed(2)} MAD
                    </span>
                  )}
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-12 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary/10 h-16 rounded-2xl text-lg font-bold transition-all hover:scale-[1.02]"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Add to Cart
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 bg-[#25D366] hover:bg-[#20ba59] h-16 rounded-2xl text-lg font-bold text-white shadow-xl shadow-green-500/20 transition-all hover:scale-[1.02]"
                    onClick={handleBuyNowWhatsApp}
                  >
                    <MessageCircle className="w-5 h-5 mr-3 fill-current" />
                    Buy via WhatsApp
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-6 pt-4">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>Add to Wishlist</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share Details</span>
                  </button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 mt-12 border-t border-white/5">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <ShieldCheck className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-bold">Quality Guaranteed</p>
                    <p className="text-xs text-muted-foreground">Certified luxury materials only</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Truck className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-bold">Express Delivery</p>
                    <p className="text-xs text-muted-foreground">Fast shipping across Morocco</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Clock className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-bold">Quick Production</p>
                    <p className="text-xs text-muted-foreground">Ready in 2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <MessageCircle className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-bold">Support 24/7</p>
                    <p className="text-xs text-muted-foreground">Get help instantly on WhatsApp</p>
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
