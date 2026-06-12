
"use client"

import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  priority?: boolean;
}

export function ProductCard({ product, onViewDetails, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  
  // استخدام صورة بديلة إذا لم تكن هناك صور للمنتج
  const mainImage = product.images?.[0] || 'https://placehold.co/600x600?text=قريباً+بالمتجر';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="overflow-hidden group border-white/5 bg-card/50 backdrop-blur-sm rounded-3xl cursor-pointer" 
        onClick={() => onViewDetails(product)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={mainImage}
            alt={product.title || "منتج"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.featured && (
              <Badge className="bg-primary hover:bg-primary border-none text-white font-bold uppercase text-[10px]">مميز</Badge>
            )}
            {product.bestSeller && (
              <Badge className="bg-accent hover:bg-accent border-none text-black font-bold uppercase text-[10px]">الأكثر مبيعاً</Badge>
            )}
          </div>
          
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full h-12 w-12 bg-white text-black hover:bg-white/90 shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
            >
              <Eye className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full h-12 w-12 bg-primary text-white border-none hover:bg-primary/90 shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">GIFT SHOP AGADIR</p>
            {(!product.images || product.images.length === 0) && (
              <Badge variant="outline" className="text-[8px] h-4 border-white/10 text-muted-foreground flex gap-1 items-center px-1">
                <ImageIcon className="w-2 h-2" /> بدون صورة
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{product.title || "منتج جديد"}</h3>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient-primary">
                {product.price > 0 ? `${product.price.toFixed(2)} MAD` : "اتصل للثمن"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
