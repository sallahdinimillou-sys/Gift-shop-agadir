"use client"

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Search, Package, Image as ImageIcon, Loader2, Check, X } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: products, loading } = useCollection<Product>(productsQuery);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: 'trophies',
    featured: false,
    bestSeller: false
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => 
      p.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      categoryId: 'trophies',
      featured: false,
      bestSeller: false
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.images?.[0] || '',
      categoryId: product.categoryId,
      featured: product.featured || false,
      bestSeller: product.bestSeller || false
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    setIsSubmitting(true);
    const productData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      images: [formData.imageUrl],
      categoryId: formData.categoryId,
      featured: formData.featured,
      bestSeller: formData.bestSeller,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingProduct) {
        const docRef = doc(firestore, 'products', editingProduct.id);
        updateDoc(docRef, productData).catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: productData
          });
          errorEmitter.emit('permission-error', permissionError);
        });
        toast({ title: "تم التحديث", description: "تم حفظ التغييرات بنجاح." });
      } else {
        const colRef = collection(firestore, 'products');
        const slug = formData.title.toLowerCase().replace(/\s+/g, '-');
        const newProduct = {
          ...productData,
          createdAt: serverTimestamp(),
          slug,
          stockStatus: 'in-stock',
        };
        addDoc(colRef, newProduct).catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: colRef.path,
            operation: 'create',
            requestResourceData: newProduct
          });
          errorEmitter.emit('permission-error', permissionError);
        });
        toast({ title: "تمت الإضافة", description: "المنتج الجديد متاح الآن في المتجر." });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      // Errors are handled by the global listener
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج؟")) return;

    const docRef = doc(firestore, 'products', id);
    deleteDoc(docRef).catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      });
      errorEmitter.emit('permission-error', permissionError);
    });
    toast({ title: "تم الحذف", description: "تمت إزالة المنتج من القاعدة." });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إدارة المنتجات</h1>
          <p className="text-muted-foreground">تحكم في محتوى متجرك، الصور، والأسعار.</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90">
          <Plus className="w-5 h-5 mr-2" />
          إضافة منتج جديد
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="البحث عن منتج بالاسم..." 
            className="pl-10 h-11 bg-background/50 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 overflow-hidden bg-card/30">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow>
              <TableHead className="w-[100px]">الصورة</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>مميز/الأكثر مبيعاً</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  لا توجد منتجات حالياً. ابدأ بإضافة أول منتج لك.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell className="capitalize">{product.categoryId?.replace('-', ' ')}</TableCell>
                  <TableCell>{product.price?.toFixed(2)} MAD</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {product.featured && <Check className="w-4 h-4 text-primary" title="Featured" />}
                      {product.bestSeller && <Check className="w-4 h-4 text-accent" title="Best Seller" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(product)} className="hover:text-primary rounded-full">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="hover:text-destructive rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">اسم المنتج</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">السعر (MAD)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01"
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  required
                  className="rounded-xl h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">الفئة</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(val) => setFormData({...formData, categoryId: val})}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="اختر فئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-6 pt-8">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input 
                    type="checkbox" 
                    checked={formData.featured} 
                    onChange={e => setFormData({...formData, featured: e.target.checked})}
                    className="w-4 h-4 accent-primary"
                   />
                   <span className="text-sm">منتج مميز</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input 
                    type="checkbox" 
                    checked={formData.bestSeller} 
                    onChange={e => setFormData({...formData, bestSeller: e.target.checked})}
                    className="w-4 h-4 accent-accent"
                   />
                   <span className="text-sm">الأكثر مبيعاً</span>
                 </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">رابط الصورة (URL)</Label>
              <div className="flex gap-4 items-center">
                <Input 
                  id="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="rounded-xl h-12 flex-1"
                />
                {formData.imageUrl && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
                className="rounded-xl min-h-[120px] resize-none"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                إلغاء
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 px-8 h-12 rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : editingProduct ? 'حفظ التغييرات' : 'إضافة المنتج'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
