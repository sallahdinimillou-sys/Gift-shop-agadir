
"use client"

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Trash2, Image as ImageIcon, Loader2, Save, UploadCloud, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Progress } from '@/components/ui/progress';

interface EditableProductCardProps {
  product: Product;
}

const CLOUDINARY_CLOUD_NAME = "drpt9ibut";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export function EditableProductCard({ product }: EditableProductCardProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const [formData, setFormData] = useState({
    title: product.title || '',
    price: product.price === 0 ? '' : product.price.toString(),
    shippingPrice: product.shippingPrice === 0 ? '' : product.shippingPrice?.toString() || '',
    description: product.description || '',
    imageUrl: product.images?.[0] || '',
  });

  useEffect(() => {
    if (!isEditing) {
      setFormData({
        title: product.title || '',
        price: product.price === 0 ? '' : product.price.toString(),
        shippingPrice: product.shippingPrice === 0 ? '' : product.shippingPrice?.toString() || '',
        description: product.description || '',
        imageUrl: product.images?.[0] || '',
      });
    }
  }, [product, isEditing]);

  const handleSave = async () => {
    if (!firestore) return;
    
    setIsSaving(true);
    const docRef = doc(firestore, 'products', product.id);
    const slug = formData.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    // التأكد من حفظ جميع البيانات بما في ذلك الصورة المنشورة
    const updatedData = {
      title: formData.title,
      price: formData.price === '' ? 0 : Number(formData.price),
      shippingPrice: formData.shippingPrice === '' ? 0 : Number(formData.shippingPrice),
      description: formData.description,
      slug: slug || product.slug,
      published: true, 
      images: formData.imageUrl ? [formData.imageUrl] : product.images,
      updatedAt: serverTimestamp(),
    };

    try {
      await updateDoc(docRef, updatedData);
      setIsEditing(false);
      setIsSaving(false);
      toast({ 
        title: "✅ تم الحفظ في السحابة", 
        description: "المنتج متاح الآن على جميع الأجهزة." 
      });
    } catch (error: any) {
      setIsSaving(false);
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: updatedData
      });
      errorEmitter.emit('permission-error', permissionError);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !firestore) return;

    setIsUploading(true);
    setUploadProgress(0);

    const cloudData = new FormData();
    cloudData.append("file", file);
    cloudData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const downloadURL = response.secure_url;
        
        setFormData(prev => ({ ...prev, imageUrl: downloadURL }));
        
        // تحديث رابط الصورة فوراً في Firestore لضمان عدم ضياعه
        const docRef = doc(firestore, 'products', product.id);
        const updateData = {
          images: [downloadURL],
          updatedAt: serverTimestamp(),
        };

        try {
          await updateDoc(docRef, updateData);
          toast({ title: "✅ تم تحديث الصورة في السحابة" });
        } catch (err: any) {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: updateData
          }));
        }
        
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        toast({ title: "❌ فشل الرفع", variant: "destructive" });
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    xhr.send(cloudData);
  };

  const handleDelete = async () => {
    if (!firestore || !confirm('هل أنت متأكد من حذف هذا المنتج نهائياً من جميع الأجهزة؟')) return;
    
    setIsDeleting(true);
    const docRef = doc(firestore, 'products', product.id);
    
    try {
      await deleteDoc(docRef);
      toast({ title: "🗑️ تم الحذف من السحابة" });
    } catch (error: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      }));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div layout className="relative">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      <Card className={cn(
        "overflow-hidden group border-white/5 bg-card/50 backdrop-blur-sm rounded-[2.5rem] transition-all duration-300",
        isEditing ? "ring-2 ring-primary shadow-2xl z-10" : "hover:border-white/10"
      )}>
        <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer group/img">
          {isEditing ? (
            <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center p-6 space-y-4" onClick={() => !isUploading && fileInputRef.current?.click()}>
              {isUploading ? (
                <div className="flex flex-col items-center gap-4 w-full px-8">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <Progress value={uploadProgress} className="h-1" />
                </div>
              ) : (
                <>
                  <UploadCloud className="w-12 h-12 text-primary" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest text-center">تغيير الصورة</span>
                </>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 z-20 opacity-0 group-hover/img:opacity-100 bg-black/40 transition-opacity flex items-center justify-center" onClick={() => setIsEditing(true)}>
              <div className="glass text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-xs">
                <ImageIcon className="w-4 h-4" /> تعديل البيانات
              </div>
            </div>
          )}
          
          <img
            src={formData.imageUrl || 'https://placehold.co/800x800?text=No+Image'}
            alt={formData.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {!product.published && (
            <div className="absolute top-5 left-5 z-30">
              <Badge variant="secondary" className="bg-yellow-500 text-black font-bold">مسودة</Badge>
            </div>
          )}
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(); }} 
            className="absolute top-5 right-5 z-30 bg-destructive text-white p-2.5 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          </button>
        </div>

        <CardContent className="p-7 space-y-4">
          <Input 
            disabled={!isEditing}
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className={cn("text-lg font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-right", !isEditing && "cursor-default")}
            placeholder="اسم المنتج"
          />
          <Textarea 
            disabled={!isEditing}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className={cn("text-sm bg-transparent border-none p-0 h-auto resize-none min-h-[60px] focus-visible:ring-0 text-right", !isEditing && "cursor-default")}
            placeholder="وصف المنتج"
          />
          
          <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Input 
                  type="number"
                  disabled={!isEditing}
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-20 h-8 bg-transparent border-none p-0 focus-visible:ring-0 font-bold text-xl"
                  placeholder="0"
                />
                <span className="text-primary font-bold">MAD</span>
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">الثمن</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Input 
                  type="number"
                  disabled={!isEditing}
                  value={formData.shippingPrice}
                  onChange={e => setFormData({...formData, shippingPrice: e.target.value})}
                  className="w-20 h-8 bg-transparent border-none p-0 focus-visible:ring-0 font-bold text-lg text-accent"
                  placeholder="0"
                />
                <span className="text-accent font-bold">MAD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">الشحن</span>
                <Truck className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>

            {isEditing && (
              <Button size="sm" onClick={handleSave} className="w-full rounded-xl bg-primary font-bold mt-2" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                تحديث وحفظ في السحابة
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
