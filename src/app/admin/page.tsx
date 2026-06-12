
"use client"

import { useState, useMemo } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Loader2, PackageSearch } from 'lucide-react';
import { Product } from '@/types';
import { EditableProductCard } from '@/components/admin/EditableProductCard';

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

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
    setIsAdding(true);
    try {
      const colRef = collection(firestore, 'products');
      const newProduct = {
        title: 'New Product Title',
        description: 'Click here to add a description...',
        price: 0,
        images: ['https://picsum.photos/seed/new/800/800'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        slug: `new-product-${Date.now()}`,
        categoryId: 'general',
        stockStatus: 'in-stock',
        featured: false,
        bestSeller: false
      };
      await addDoc(colRef, newProduct);
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-8 space-y-10 min-h-screen bg-background/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-gradient-primary">Storefront Editor</h1>
          <p className="text-muted-foreground mt-2">Click on any element in the cards below to edit your products in real-time.</p>
        </div>
        <Button 
          onClick={handleAddNewProduct} 
          disabled={isAdding}
          className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-95"
        >
          {isAdding ? <Loader2 className="animate-spin mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
          Add New Product
        </Button>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search your inventory..." 
          className="pl-12 h-14 bg-white/5 rounded-2xl border-white/10 text-lg focus:ring-primary focus:border-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Syncing with Firestore...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-32 text-center space-y-4 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <PackageSearch className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">No products found</h3>
            <p className="text-muted-foreground">Start by adding a new product or adjust your search.</p>
          </div>
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
