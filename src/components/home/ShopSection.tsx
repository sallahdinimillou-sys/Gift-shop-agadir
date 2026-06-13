
"use client"

import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '@/components/shop/ProductCard';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { CATEGORIES, BUSINESS_INFO } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SlidersHorizontal, ShoppingCart, MessageCircle, ShieldCheck, Truck, Clock, Loader2, PackageOpen } from 'lucide-react';
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
import { ProductSkeleton } from '@/components/shop/ProductSkeleton';

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
    const keywords = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

    return displayData.filter(product => {
      const isPublished = product.published === true;
      const hasImage = product.images && product.images.length > 0;
      
      if (!isPublished || !hasImage) return false;

      const title = product.title?.toLowerCase() || '';
      const matchesSearch = keywords.length === 0 || keywords.every(keyword => title.includes(keyword));
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

  // الحالة الفارغة: لا يوجد منتجات في قاعدة البيانات ولا يوجد كاش
  const isEmpty = !loading && displayData.length === 0;
  // حالة لا توجد نتائج للبحث: توجد منتجات ولكن الفلتر أخفاها
  const noResults = !loading && displayData.length > 0 && filteredProducts.length === 0;

  return (
    <section id="shop" className="py-12 md:py-24 container mx-auto px-4 md:px-8 scroll-mt-20 min-h-[400px]">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2 text-right md:text-right w-full md:w-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-none">مجموعتنا <span className="text-gradient-primary">الفاخرة</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto md:mr-0">اكتشف أرقى التذكارات والهدايا المخصصة التي صُنعت لتخليد لحظاتكم الخاصة.</p>
          </div>
          {!isEmpty && (
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground font-medium bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> جاري التحديث...</span>
              ) : (
                `عرض ${filteredProducts.length} منتج`
              )}
            </div>
          )}
        </div>

        {!isEmpty && (
          <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="ابحث عن هديتك المثالية..." 
                className="pl-10 h-11 bg-background/50 rounded-xl border-white/10 focus:border-primary transition-all text-right pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-11 rounded-xl border-white/10 hover:bg-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'الفئات'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl border-white/10 bg-card/90 backdrop-blur-xl">
                  <DropdownMenuItem onClick={() => setSelectedCategory(null)} className="rounded-lg text-right">جميع الفئات</DropdownMenuItem>
                  {CATEGORIES.map(cat => (
                    <DropdownMenuItem key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="rounded-lg text-right">
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {loading && displayData.length === 0 ? (
          <ProductSkeleton />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <PackageOpen className="w-10 h-10 text-primary/60" />
            </div>
            <div className="space-y-2 max-w-sm px-4">
              <h3 className="text-2xl font-bold">
                {isEmpty ? "المتجر فارغ حالياً" : "لا توجد نتائج لمطابقة بحثك"}
              </h3>
              <p className="text-muted-foreground">
                {isEmpty 
                  ? "نحن بصدد تجهيز منتجاتنا الفاخرة لكم. ترقبوا الإطلاق قريباً!" 
                  : "جرب تغيير كلمات البحث أو اختر فئة مختلفة للعثور على ما تبحث عنه."}
              </p>
            </div>
            {(searchQuery || selectedCategory) && !isEmpty && (
              <Button 
                variant="outline" 
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-white px-8"
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              >
                مسح جميع الفلاتر
              </Button>
            )}
          </div>
        )}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-white/10 rounded-[2rem] shadow-2xl">
          {selectedProduct && (
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto">
              <div className="lg:w-1/2 bg-card p-6 flex flex-col gap-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-background border border-white/5">
                  <Image 
                    src={selectedProduct.images?.[activeImageIndex] || ''} 
                    alt={selectedProduct.title} 
                    fill
                    className="object-cover animate-in fade-in duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {selectedProduct.images && selectedProduct.images.length > 1 && (
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
                        <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:w-1/2 p-8 lg:p-12 space-y-8 flex flex-col justify-center">
                <div className="space-y-4 text-right">
                  <div className="flex flex-wrap gap-2 justify-end">
                    {selectedProduct.featured && <Badge className="bg-primary font-bold">منتج مميز</Badge>}
                    <Badge variant="outline" className="border-white/20 uppercase tracking-widest text-[10px]">
                      {selectedProduct.categoryId?.replace('-', ' ') || 'عام'}
                    </Badge>
                  </div>
                  <DialogTitle className="text-3xl lg:text-4xl font-bold tracking-tighter leading-tight text-right">
                    {selectedProduct.title}
                  </DialogTitle>
                  <div className="text-3xl font-bold text-gradient-primary text-right">
                    {selectedProduct.price > 0 ? `${selectedProduct.price.toFixed(2)} MAD` : "اتصل للاستفسار"}
                  </div>
                  <DialogDescription className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap text-right">
                    {selectedProduct.description}
                  </DialogDescription>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row-reverse gap-4">
                    <Button 
                      className="flex-1 h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 transition-transform active:scale-95"
                      onClick={() => addToCart(selectedProduct)}
                    >
                      <ShoppingCart className="w-5 h-5 ml-3" />
                      أضف للسلة
                    </Button>
                    <Button 
                      className="flex-1 h-14 rounded-xl text-lg font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-green-500/20 transition-transform active:scale-95"
                      onClick={() => handleBuyNowWhatsApp(selectedProduct)}
                    >
                      <MessageCircle className="w-5 h-5 ml-3 fill-current" />
                      اطلب الآن
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5">
                    <div className="flex flex-col items-center text-center gap-1">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">جودة</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">توصيل</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">دعم</span>
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
