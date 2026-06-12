
"use client"

import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function CategoryShowcase() {
  return (
    <section id="categories" className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-lg">
              Discover our wide range of curated collections for every occasion.
            </p>
          </div>
          <Link href="/#shop" className="text-primary font-medium hover:underline hidden sm:flex items-center">
            View All Categories <ArrowUpRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, index) => {
            const img = PlaceHolderImages.find(i => i.id === cat.imageId);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-[400px] overflow-hidden rounded-3xl"
              >
                {img && (
                  <Image
                    src={img.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={img.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                  <Link 
                    href="/#shop"
                    className="inline-flex items-center text-primary-foreground font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                  >
                    Browse Collection <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
