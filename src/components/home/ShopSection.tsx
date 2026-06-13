
"use client"

import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/shop/ProductCard';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { CATEGORIES, BUSINESS_INFO } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ShoppingCart, MessageCircle, ShieldCheck, Truck, Clock } from 'lucide-react';
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

const CACHE_KEY = 'gift_shop_products_cache';

export function ShopSection() {
  const firestore = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cachedData, setCachedData] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      try {
        setCachedData(JSON.parse(saved));
      } catch (e) {
        console.error("Error reading cache", e);
      }
    }
  }, []);

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: products, loading } = useCollection<Product>(productsQuery);

  useEffect(() => {
    if (products && products.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(products));
      setCachedData(products);
    }
  }, [products]);

  const displayData = products || cachedData || [];

  const filteredProducts = useMemo(() => {
    return displayData.filter(product => {
      const isPublished = product.published === true;
      const hasImage = product.images && product.images.length > 0;
      
      if (!isPublished || !hasImage) return false;

      const title = product.title?.toLowerCase() || '';
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, displayData]);

  const handleBuyNowWhatsApp = (product: Product) => {
    const message = encodeURIComponent(
      `مرحباً Gift Shop Agadir!\n\nأرغب في الاستفسار عن منتج: *${product.title}*.\n\n*الثمن:* ${product.price.toFixed(2)} MAD\n\nهل المنتج متوفر حالياً؟`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };

  const isEmpty = !loading && displayData.length === 0;

  return (
    <section id="shop" className="py-16 md:py-24 container mx-auto px-4 md:px-8 scroll-mt-20">
      <div className="flex flex-col space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-right">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
              مجموعتنا <span className="text-gradient-primary">الفاخرة</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              اكتشف أرقى التذكارات والهدايا المخصصة التي صُنعت لتخليد لحظاتكم الخاصة بكل حب وإتقان.
            </p>
          </div>
          
          {filteredProducts.length > 0 && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-bold text-white/90">
                {loading ? "جاري التحديث..." : `${filteredProducts.length} منتج متوفر`}
              </span>
            </div>
          )}
        </div>

        {/* Filters and Search - Hidden if no products are available to keep UI clean */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row-reverse gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/10 backdrop-blur-xl">
            <div className="relative flex-1 group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="ابحث عن هديتك المثالية..." 
                className="pr-12 h-14 bg-background/50 rounded-2xl border-white/5 focus:border-primary transition-all text-right text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-14 rounded-2xl border-white/5 bg-background/50 hover:bg-primary/10 hover:text-primary px-8 text-lg font-medium">
                  <Filter className="w-5 h-5 ml-2" />
                  {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'تصفية حسب الفئة'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-2xl border-white/10 bg-card/95 backdrop-blur-2xl">
                <DropdownMenuItem onClick={() => setSelectedCategory(null)} className="rounded-xl text-right p-3">جميع الفئات</DropdownMenuItem>
                {CATEGORIES.map(cat => (
                  <DropdownMenuItem key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="rounded-xl text-right p-3">
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Products Grid or Simple Message */}
        {loading && displayData.length === 0 ? (
          <div className="py-32 flex items-center justify-center">
            <p className="text-xl md:text-2xl font-medium text-muted-foreground animate-pulse">لا توجد منتجات حالياً</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={openProductModal}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          <div className="py-32 flex items-center justify-center">
            <p className="text-xl md:text-2xl font-medium text-muted-foreground">لا توجد منتجات حالياً</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-white/10 rounded-[2.5rem] shadow-2xl">
          {selectedProduct && (
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto">
              {/* Image Column */}
              <div className="lg:w-1/2 bg-card p-8 flex flex-col gap-6">
                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-background border border-white/5 shadow-inner">
                  <Image 
                    src={selectedProduct.images?.[activeImageIndex] || ''} 
                    alt={selectedProduct.title} 
                    fill
                    className="object-cover animate-in fade-in zoom-in duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
                    {selectedProduct.images.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveImageIndex(i)}
                        className={cn(
                          "relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all",
                          activeImageIndex === i ? "border-primary scale-110 shadow-lg" : "border-transparent opacity-40 hover:opacity-100"
                        )}
                      >
                        <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Column */}
              <div className="lg:w-1/2 p-8 lg:p-14 space-y-10 flex flex-col justify-center">
                <div className="space-y-6 text-right">
                  <div className="flex flex-wrap gap-2 justify-end">
                    {selectedProduct.featured && <Badge className="bg-primary px-4 py-1 rounded-full font-bold">منتج حصري</Badge>}
                    <Badge variant="outline" className="border-white/20 bg-white/5 backdrop-blur-md px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold">
                      {selectedProduct.categoryId?.replace('-', ' ') || 'عام'}
                    </Badge>
                  </div>
                  <DialogTitle className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight text-right">
                    {selectedProduct.title}
                  </DialogTitle>
                  <div className="text-4xl font-black text-gradient-primary text-right">
                    {selectedProduct.price > 0 ? `${selectedProduct.price.toFixed(2)} MAD` : "اتصل للاستفسار"}
                  </div>
                  <DialogDescription className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap text-right">
                    {selectedProduct.description}
                  </DialogDescription>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row-reverse gap-4">
                    <Button 
                      className="flex-1 h-16 rounded-2xl text-xl font-bold bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20"
                      onClick={() => addToCart(selectedProduct)}
                    >
                      <ShoppingCart className="w-6 h-6 ml-3" />
                      أضف للسلة
                    </Button>
                    <Button 
                      className="flex-1 h-16 rounded-2xl text-xl font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-95"
                      onClick={() => handleBuyNowWhatsApp(selectedProduct)}
                    >
                      <MessageCircle className="w-6 h-6 ml-3 fill-current" />
                      اطلب الآن
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                    <div className="flex flex-col items-center text-center gap-2 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">أصلي 100%</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                        <Truck className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">توصيل سريع</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2 group">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">دعم فني</span>
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
