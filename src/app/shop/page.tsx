
"use client"

import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Product } from '@/types';

export default function ShopPage() {
  const firestore = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: products, loading } = useCollection<Product>(productsQuery);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product => {
      // شروط الظهور: منشور ويحتوي على صورة
      const isPublished = product.published === true;
      const hasImage = product.images && product.images.length > 0;
      if (!isPublished || !hasImage) return false;

      const title = product.title?.toLowerCase() || '';
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, products]);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-4 md:px-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Our <span className="text-gradient-primary">Collection</span></h1>
              <p className="text-muted-foreground max-w-lg">Discover high-end trophies, awards, and personalized gifts crafted for your special moments.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {loading ? "Loading..." : `Showing ${filteredProducts.length} results`}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 h-11 bg-background/50 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-11 rounded-xl border-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'Categories'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setSelectedCategory(null)}>All Categories</DropdownMenuItem>
                  {CATEGORIES.map(cat => (
                    <DropdownMenuItem key={cat.id} onClick={() => setSelectedCategory(cat.id)}>
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="h-11 rounded-xl border-white/10">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={() => {}} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
              <Button 
                variant="link" 
                className="text-primary mt-2"
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
