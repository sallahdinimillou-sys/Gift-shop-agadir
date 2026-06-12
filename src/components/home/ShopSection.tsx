
"use client"

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/shop/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { CATEGORIES, BUSINESS_INFO } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SlidersHorizontal, ShoppingCart, MessageCircle, X, ShieldCheck, Truck, Clock } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

export function ShopSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    // Split search query into lowercase keywords, removing empty strings
    const keywords = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

    return MOCK_PRODUCTS.filter(product => {
      const title = product.title.toLowerCase();
      
      // Match if EVERY keyword entered is present anywhere in the title
      const matchesSearch = keywords.every(keyword => title.includes(keyword));
      
      const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleBuyNowWhatsApp = (product: Product) => {
    const message = encodeURIComponent(
      `Hello Gift Shop Agadir!\n\nI'm interested in ordering the *${product.title}*.\n\n*Price:* ${product.price.toFixed(2)} MAD\n\nIs this product currently available?`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };

  return (
    <section id="shop" className="py-24 container mx-auto px-4 md:px-8 scroll-mt-20">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Our <span className="text-gradient-primary">Collection</span></h2>
            <p className="text-muted-foreground max-w-lg">Discover high-end trophies, awards, and personalized gifts crafted for your special moments.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Showing {filteredProducts.length} results
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title (e.g. 'Crystal Award')..." 
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

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={openProductModal}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-xl text-muted-foreground">No products found matching your keywords.</p>
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

      {/* Product Details Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-white/10 rounded-[2rem] shadow-2xl">
          {selectedProduct && (
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto">
              {/* Image Section */}
              <div className="lg:w-1/2 bg-card p-6 flex flex-col gap-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-background border border-white/5">
                  <Image 
                    src={selectedProduct.images[activeImageIndex]} 
                    alt={selectedProduct.title} 
                    fill 
                    className="object-cover animate-in fade-in duration-500"
                  />
                </div>
                {selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedProduct.images.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveImageIndex(i)}
                        className={cn(
                          "relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all",
                          activeImageIndex === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-8 lg:p-12 space-y-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.featured && <Badge className="bg-primary font-bold">FEATURED</Badge>}
                    <Badge variant="outline" className="border-white/20 uppercase tracking-widest text-[10px]">
                      {selectedProduct.categoryId.replace('-', ' ')}
                    </Badge>
                  </div>
                  <DialogTitle className="text-3xl lg:text-4xl font-bold tracking-tighter leading-tight">
                    {selectedProduct.title}
                  </DialogTitle>
                  <div className="text-3xl font-bold text-gradient-primary">
                    {selectedProduct.price.toFixed(2)} MAD
                  </div>
                  <DialogDescription className="text-muted-foreground text-lg leading-relaxed line-clamp-4">
                    {selectedProduct.description}
                  </DialogDescription>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      className="flex-1 h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 transition-transform active:scale-95"
                      onClick={() => addToCart(selectedProduct)}
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      Add to Cart
                    </Button>
                    <Button 
                      className="flex-1 h-14 rounded-xl text-lg font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-green-500/20 transition-transform active:scale-95"
                      onClick={() => handleBuyNowWhatsApp(selectedProduct)}
                    >
                      <MessageCircle className="w-5 h-5 mr-3 fill-current" />
                      Order Now
                    </Button>
                  </div>

                  {/* Quick Perks */}
                  <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5">
                    <div className="flex flex-col items-center text-center gap-1">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Quality</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Delivery</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
