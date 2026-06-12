
"use client"

import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, Clock, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { BUSINESS_INFO } from '@/lib/constants';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();
  
  const product = MOCK_PRODUCTS.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found.</p>
        <Link href="/shop" className="text-primary underline ml-2">Back to Shop</Link>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted border border-white/5">
              <Image 
                src={product.images[0]} 
                alt={product.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-white/5 cursor-pointer hover:border-primary transition-colors">
                  <Image 
                    src={`https://picsum.photos/seed/thumb-${i}/300/300`} 
                    alt="Thumbnail" 
                    fill 
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex gap-2">
                {product.featured && <Badge className="bg-primary hover:bg-primary">Featured</Badge>}
                <Badge variant="outline" className="border-white/20">{product.categoryId.replace('-', ' ')}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{product.title}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gradient-primary">{product.price.toFixed(2)} MAD</span>
                {product.comparePrice && (
                  <span className="text-xl text-muted-foreground line-through">{product.comparePrice.toFixed(2)} MAD</span>
                )}
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary/10 h-14 rounded-xl text-lg font-bold"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  size="lg" 
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba59] h-14 rounded-xl text-lg font-bold text-white"
                  onClick={handleBuyNowWhatsApp}
                >
                  <MessageCircle className="w-5 h-5 mr-2 fill-current" />
                  Buy via WhatsApp
                </Button>
                <Button size="lg" variant="ghost" className="h-14 w-14 rounded-xl border border-white/10 shrink-0 hidden sm:flex">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Share this product
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Quality Guaranteed</p>
                  <p className="text-xs text-muted-foreground">Certified materials only</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Express Delivery</p>
                  <p className="text-xs text-muted-foreground">Across Morocco</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Quick Production</p>
                  <p className="text-xs text-muted-foreground">Ready in 2-3 business days</p>
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
