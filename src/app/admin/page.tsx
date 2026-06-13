
"use client"

import { useState, useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Loader2, PackageSearch, PackagePlus } from 'lucide-react';
import { Product } from '@/types';
import { EditableProductCard } from '@/components/admin/EditableProductCard';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [addingCount, setAddingCount] = useState(0);

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: products, loading } = useCollection<Product>(productsQuery);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleAddNewProduct = async () => {
    if (!firestore) return;
    
    setAddingCount(prev => prev + 1);

    const colRef = collection(firestore, 'products');
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    
    const newProduct = {
      title: 'منتج جديد قيد التجهيز',
      description: '',
      price: 0,
      shippingPrice: 0,
      images: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      slug: `new-product-${Date.now()}-${randomSuffix}`,
      categoryId: 'trophies',
      stockStatus: 'in-stock',
      featured: false,
      bestSeller: false,
      published: false
    };

    try {
      await addDoc(colRef, newProduct);
      toast({
        title: "✅ تم إنشاء المسودة",
        description: "يمكنك الآن تعديل البيانات وإضافة الصور من الأسفل."
      });
    } catch (error: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: colRef.path,
        operation: 'create',
        requestResourceData: newProduct
      }));
    } finally {
      setAddingCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="p-8 space-y-10 min-h-screen bg-background/50 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-gradient-primary">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-2">إدارة المخزون وتحديث الصور والأسعار بشكل دائم وآمن.</p>
        </div>
        <Button 
          onClick={handleAddNewProduct} 
          className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-3"
          disabled={addingCount > 0}
        >
          {addingCount > 0 ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              <span>جاري الإضافة...</span>
            </>
          ) : (
            <>
              <Plus className="w-6 h-6" />
              <span>إضافة منتج جديد</span>
            </>
          )}
        </Button>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="ابحث في المخزون..." 
          className="pr-12 h-14 bg-white/5 rounded-2xl border-white/10 text-lg focus:ring-primary focus:border-primary text-right"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && products?.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">جاري جلب البيانات من السحابة...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 mx-auto max-w-4xl">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <PackageSearch className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">لا يوجد نتائج</h3>
            <p className="text-muted-foreground">لم نجد أي منتجات تطابق بحثك أو أن المخزون فارغ.</p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full border-primary text-primary hover:bg-primary hover:text-white px-8 h-12"
            onClick={handleAddNewProduct}
          >
            <PackagePlus className="w-5 h-5 ml-2" />
            إضافة منتج الآن
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
          {filteredProducts.map((product) => (
            <EditableProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
