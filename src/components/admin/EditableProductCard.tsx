
"use client"

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, X, Image as ImageIcon, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EditableProductCardProps {
  product: Product;
}

export function EditableProductCard({ product }: EditableProductCardProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Local edit state
  const [formData, setFormData] = useState({
    title: product.title,
    price: product.price,
    description: product.description,
    imageUrl: product.images?.[0] || '',
  });

  // Sync with prop changes (from external Firestore updates)
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        title: product.title,
        price: product.price,
        description: product.description,
        imageUrl: product.images?.[0] || '',
      });
    }
  }, [product, isEditing]);

  const handleSave = async () => {
    if (!firestore) return;
    setIsSaving(true);
    try {
      const docRef = doc(firestore, 'products', product.id);
      await updateDoc(docRef, {
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        images: [formData.imageUrl],
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
      toast({ title: "تم الحفظ", description: "تم تحديث المنتج بنجاح." });
    } catch (error) {
      console.error("Save error:", error);
      toast({ title: "خطأ", description: "فشل في حفظ التغييرات.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!firestore || !confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج؟")) return;
    setIsDeleting(true);
    try {
      const docRef = doc(firestore, 'products', product.id);
      await deleteDoc(docRef);
      toast({ title: "تم الحذف", description: "تمت إزالة المنتج من المتجر." });
    } catch (error) {
      console.error("Delete error:", error);
      toast({ title: "خطأ", description: "فشل في حذف المنتج.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: product.title,
      price: product.price,
      description: product.description,
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
      <Card className={cn(
        "overflow-hidden group border-white/5 bg-card/50 backdrop-blur-sm rounded-[2rem] transition-all duration-300",
        isEditing ? "ring-2 ring-primary shadow-2xl scale-[1.02] z-10" : "hover:border-white/10"
      )}>
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer group/img">
          {isEditing ? (
            <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center p-6 space-y-4">
              <ImageIcon className="w-8 h-8 text-primary mb-2" />
              <Label className="text-white text-xs font-bold uppercase tracking-widest">رابط الصورة</Label>
              <Input 
                value={formData.imageUrl}
                onChange={e => {
                  setFormData({...formData, imageUrl: e.target.value});
                }}
                className="bg-black/40 border-white/20 text-white rounded-xl h-10 text-sm"
                placeholder="https://images.unsplash.com/..."
              />
              <p className="text-[10px] text-white/40 italic">تحديث تلقائي للمعاينة</p>
            </div>
          ) : (
            <div 
              className="absolute inset-0 z-20 opacity-0 group-hover/img:opacity-100 bg-black/40 transition-opacity flex items-center justify-center"
              onClick={() => setIsEditing(true)}
            >
              <div className="bg-white text-black p-3 rounded-full flex items-center gap-2 font-bold text-xs">
                <ImageIcon className="w-4 h-4" /> تعديل الصورة
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

        {/* Content Section */}
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">بيانات المنتج</p>
            
            {/* Title */}
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

          {/* Description */}
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

          {/* Price & Actions */}
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
                    placeholder="0.00"
                  />
                </div>
              ) : (
                <span 
                  className="text-xl font-bold text-gradient-primary cursor-text"
                  onClick={() => setIsEditing(true)}
                >
                  {formData.price.toFixed(2)} MAD
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

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={cn("block text-sm font-medium", className)}>{children}</label>;
}
