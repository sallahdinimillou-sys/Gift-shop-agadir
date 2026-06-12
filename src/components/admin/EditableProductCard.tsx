
"use client"

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useStorage } from '@/firebase';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, X, Image as ImageIcon, Loader2, Save, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface EditableProductCardProps {
  product: Product;
}

export function EditableProductCard({ product }: EditableProductCardProps) {
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: product.title || '',
    price: product.price || 0,
    description: product.description || '',
    imageUrl: product.images?.[0] || '',
  });

  useEffect(() => {
    if (!isEditing) {
      setFormData({
        title: product.title || '',
        price: product.price || 0,
        description: product.description || '',
        imageUrl: product.images?.[0] || '',
      });
    }
  }, [product, isEditing]);

  const handleSave = () => {
    if (!firestore) return;
    setIsSaving(true);
    
    const docRef = doc(firestore, 'products', product.id);
    const slug = formData.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    const updatedData = {
      title: formData.title,
      price: Number(formData.price),
      description: formData.description,
      slug: slug || product.slug,
      updatedAt: serverTimestamp(),
    };

    updateDoc(docRef, updatedData)
      .then(() => {
        setIsEditing(false);
        setIsSaving(false);
        toast({ title: "تم الحفظ", description: "تم تحديث بيانات المنتج في Firestore بنجاح." });
      })
      .catch(async (error) => {
        setIsSaving(false);
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updatedData
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage || !firestore) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `products/${product.id}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
      
      const docRef = doc(firestore, 'products', product.id);
      updateDoc(docRef, {
        images: [downloadURL],
        updatedAt: serverTimestamp(),
      }).catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { images: [downloadURL] }
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      toast({ title: "تم الرفع", description: "تم تحديث الصورة وحفظ الرابط بنجاح." });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "خطأ في الرفع", description: "تأكد من إعدادات Firebase Storage.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    if (!firestore || !confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟")) return;
    setIsDeleting(true);
    
    const docRef = doc(firestore, 'products', product.id);
    deleteDoc(docRef)
      .then(() => {
        setIsDeleting(false);
        toast({ title: "تم الحذف", description: "تمت إزالة المنتج من Firestore." });
      })
      .catch(async (error) => {
        setIsDeleting(false);
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete'
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleCancel = () => {
    setFormData({
      title: product.title || '',
      price: product.price || 0,
      description: product.description || '',
      imageUrl: product.images?.[0] || '',
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      <Card className={cn(
        "overflow-hidden group border-white/5 bg-card/50 backdrop-blur-sm rounded-[2rem] transition-all duration-300",
        isEditing ? "ring-2 ring-primary shadow-2xl scale-[1.02] z-10" : "hover:border-white/10"
      )}>
        <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer group/img">
          {isEditing ? (
            <div 
              className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center p-6 space-y-4"
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="text-white text-xs font-bold">جاري الرفع...</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-primary mb-2" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest text-center">اضغط لتغيير الصورة</span>
                </>
              )}
            </div>
          ) : (
            <div 
              className="absolute inset-0 z-20 opacity-0 group-hover/img:opacity-100 bg-black/40 transition-opacity flex items-center justify-center"
              onClick={() => setIsEditing(true)}
            >
              <div className="bg-white text-black p-3 rounded-full flex items-center gap-2 font-bold text-xs">
                <ImageIcon className="w-4 h-4" /> تعديل
              </div>
            </div>
          )}
          
          <img
            src={formData.imageUrl || 'https://placehold.co/800x800?text=No+Image'}
            alt={formData.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x800?text=Invalid+Image'; }}
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.featured && <Badge className="bg-primary border-none font-bold">مميز</Badge>}
            {product.bestSeller && <Badge className="bg-accent border-none text-black font-bold">الأكثر مبيعاً</Badge>}
          </div>

          <AnimatePresence>
            {!isEditing && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                disabled={isDeleting}
                className="absolute top-4 right-4 z-30 bg-destructive/80 hover:bg-destructive text-white p-2 rounded-xl backdrop-blur-sm transition-colors"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">بيانات المنتج</p>
            {isEditing ? (
              <Input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="text-lg font-bold bg-white/5 border-white/10 rounded-xl mt-1 h-10"
                autoFocus
              />
            ) : (
              <h3 
                className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1 cursor-text"
                onClick={() => setIsEditing(true)}
              >
                {formData.title}
              </h3>
            )}
          </div>

          <div className="min-h-[60px]">
            {isEditing ? (
              <Textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="text-sm bg-white/5 border-white/10 rounded-xl resize-none min-h-[100px]"
                placeholder="وصف المنتج..."
              />
            ) : (
              <p 
                className="text-sm text-muted-foreground line-clamp-3 leading-relaxed cursor-text"
                onClick={() => setIsEditing(true)}
              >
                {formData.description}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">MAD</span>
                  <Input 
                    type="number"
                    value={formData.price || ''}
                    onChange={e => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      setFormData({...formData, price: val});
                    }}
                    className="w-24 h-9 bg-white/5 border-white/10 rounded-lg text-sm font-bold"
                    placeholder="الثمن"
                  />
                </div>
              ) : (
                <span 
                  className="text-xl font-bold text-gradient-primary cursor-text"
                  onClick={() => setIsEditing(true)}
                >
                  {formData.price > 0 ? `${formData.price.toFixed(2)} MAD` : "حدد الثمن"}
                </span>
              )}
            </div>

            <AnimatePresence>
              {isEditing ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex gap-2"
                >
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={handleCancel}
                    className="h-9 w-9 rounded-full hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-full h-9 px-4 bg-primary hover:bg-primary/90 font-bold"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" /> حفظ</>}
                  </Button>
                </motion.div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="rounded-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  اضغط للتعديل
                </Button>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
