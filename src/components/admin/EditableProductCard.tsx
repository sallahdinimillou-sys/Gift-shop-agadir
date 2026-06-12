
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
import { Check, Trash2, X, Image as ImageIcon, Loader2, Save, UploadCloud, AlertCircle } from 'lucide-react';
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
        toast({ title: "تم الحفظ", description: "تم تحديث بيانات المنتج بنجاح." });
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

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: "الملف كبير جداً", 
        description: "يرجى اختيار صورة بحجم أقل من 5 ميجابايت لضمان سرعة التحميل.", 
        variant: "destructive" 
      });
      return;
    }

    setIsUploading(true);

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), 30000)
    );

    try {
      const storageRef = ref(storage, `products/${product.id}/${Date.now()}_${file.name}`);
      
      // Race the upload against the timeout
      const uploadPromise = uploadBytes(storageRef, file);
      const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
      
      const docRef = doc(firestore, 'products', product.id);
      
      // Update Firestore without awaiting (optimistic UI)
      const updateData = {
        images: [downloadURL],
        updatedAt: serverTimestamp(),
      };

      updateDoc(docRef, updateData)
        .then(() => {
          toast({ title: "تم الرفع", description: "تم تحديث الصورة بنجاح." });
        })
        .catch(async (err) => {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: updateData
          });
          errorEmitter.emit('permission-error', permissionError);
        });

    } catch (error: any) {
      console.error("Upload error:", error);
      let message = "حدث خطأ غير متوقع أثناء الرفع. يرجى تكرار المحاولة.";
      
      if (error.message === "TIMEOUT") {
        message = "استغرق الرفع وقتاً طويلاً جداً (أكثر من 30 ثانية). يرجى التحقق من اتصالك بالإنترنت.";
      } else if (error.code === 'storage/unauthorized') {
        message = "ليس لديك صلاحية لرفع الملفات. تأكد من تسجيل الدخول كمسؤول.";
      } else if (error.code === 'storage/retry-limit-exceeded') {
        message = "تم تجاوز حد محاولات الرفع. تحقق من استقرار الشبكة.";
      }

      toast({ 
        title: "فشل الرفع", 
        description: message, 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = () => {
    if (!firestore || !confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟")) return;
    setIsDeleting(true);
    
    const docRef = doc(firestore, 'products', product.id);
    deleteDoc(docRef)
      .then(() => {
        setIsDeleting(false);
        toast({ title: "تم الحذف", description: "تمت إزالة المنتج بنجاح." });
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
        "overflow-hidden group border-white/5 bg-card/50 backdrop-blur-sm rounded-[2.5rem] transition-all duration-300",
        isEditing ? "ring-2 ring-primary shadow-2xl scale-[1.02] z-10" : "hover:border-white/10"
      )}>
        <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer group/img">
          {isEditing ? (
            <div 
              className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center p-6 space-y-4"
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <span className="text-white text-sm font-bold animate-pulse">جاري الرفع...</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-primary mb-2" />
                  <span className="text-white text-xs font-bold uppercase tracking-[0.2em] text-center">اضغط لتغيير الصورة</span>
                </>
              )}
            </div>
          ) : (
            <div 
              className="absolute inset-0 z-20 opacity-0 group-hover/img:opacity-100 bg-black/40 transition-opacity flex items-center justify-center"
              onClick={() => setIsEditing(true)}
            >
              <div className="glass text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-xs">
                <ImageIcon className="w-4 h-4" /> تعديل البيانات
              </div>
            </div>
          )}
          
          <img
            src={formData.imageUrl || 'https://placehold.co/800x800?text=No+Image'}
            alt={formData.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              !isEditing && "group-hover:scale-110"
            )}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x800?text=Invalid+Image'; }}
          />
          
          <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
            {product.featured && <Badge className="bg-primary border-none font-bold px-3 py-1">مميز</Badge>}
            {product.bestSeller && <Badge className="bg-accent border-none text-black font-bold px-3 py-1">الأكثر مبيعاً</Badge>}
          </div>

          <AnimatePresence>
            {!isEditing && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                disabled={isDeleting}
                className="absolute top-5 right-5 z-30 bg-destructive/90 hover:bg-destructive text-white p-2.5 rounded-2xl backdrop-blur-md transition-all active:scale-90"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <CardContent className="p-7 space-y-5">
          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em] ml-1">اسم المنتج</p>
            {isEditing ? (
              <Input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="text-lg font-bold bg-white/5 border-white/10 rounded-2xl h-12 focus:ring-primary focus:border-primary"
                autoFocus
              />
            ) : (
              <h3 
                className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1 cursor-text"
                onClick={() => setIsEditing(true)}
              >
                {formData.title || "بدون عنوان"}
              </h3>
            )}
          </div>

          <div className="min-h-[80px] space-y-1.5">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em] ml-1">الوصف</p>
            {isEditing ? (
              <Textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="text-sm bg-white/5 border-white/10 rounded-2xl resize-none min-h-[120px] focus:ring-primary focus:border-primary"
                placeholder="أدخل وصف المنتج هنا..."
              />
            ) : (
              <p 
                className="text-sm text-muted-foreground line-clamp-3 leading-relaxed cursor-text"
                onClick={() => setIsEditing(true)}
              >
                {formData.description || "لا يوجد وصف لهذا المنتج حالياً."}
              </p>
            )}
          </div>

          <div className="pt-5 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.3em]">الثمن</p>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={formData.price || ''}
                    onChange={e => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      setFormData({...formData, price: val});
                    }}
                    className="w-28 h-10 bg-white/5 border-white/10 rounded-xl text-sm font-bold focus:ring-primary focus:border-primary"
                    placeholder="السعر"
                  />
                  <span className="text-primary font-bold text-xs">MAD</span>
                </div>
              ) : (
                <span 
                  className="text-2xl font-bold text-gradient-primary cursor-text"
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
                    className="h-10 w-10 rounded-2xl hover:bg-white/10"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-2xl h-10 px-5 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> حفظ</>}
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
