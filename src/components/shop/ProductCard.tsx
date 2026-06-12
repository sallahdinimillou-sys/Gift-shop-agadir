
"use client"

import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group border-white/5 bg-card/50 backdrop-blur-sm rounded-3xl">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && (
              <Badge className="bg-primary hover:bg-primary border-none text-white">Featured</Badge>
            )}
            {product.bestSeller && (
              <Badge className="bg-accent hover:bg-accent border-none text-navy-black">Best Seller</Badge>
            )}
          </div>
          
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href={`/product/${product.slug}`}>
              <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 bg-white text-navy-black">
                <Eye className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 bg-primary text-white border-none">
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Category Name</p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient-primary">{product.price.toFixed(2)} MAD</span>
              {product.comparePrice && (
                <span className="text-sm text-muted-foreground line-through">{product.comparePrice.toFixed(2)} MAD</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
