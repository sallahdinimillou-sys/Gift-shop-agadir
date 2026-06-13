
"use client"

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { BUSINESS_INFO } from '@/lib/constants';

export default function CartPage() {
  const { items, cartTotal, removeFromCart, updateQuantity } = useCart();
  
  const shipping = items.length > 0 ? 50.00 : 0;
  const total = cartTotal + shipping;

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    const itemsList = items
      .map((item) => `- ${item.title} (العدد: ${item.quantity}) - ${item.price * item.quantity} درهم`)
      .join('\n');
    
    const message = encodeURIComponent(
      `مرحباً Gift Shop Agadir!\n\nأود تقديم طلب للمنتجات التالية:\n\n${itemsList}\n\n*المجموع الفرعي:* ${cartTotal.toFixed(2)} درهم\n*مصاريف الشحن:* ${shipping.toFixed(2)} درهم\n*الإجمالي:* ${total.toFixed(2)} درهم\n\nيرجى تأكيد الطلب وإبلاغي بالخطوات التالية للدفع والتسليم.`
    );

    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 gap-6 text-center md:text-right">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">سلة <span className="text-gradient-primary">التسوق</span></h1>
            <Link href="/#shop">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary group">
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                متابعة التسوق
              </Button>
            </Link>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex flex-col sm:flex-row gap-6 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 items-center transition-all hover:bg-white/10 group">
                    <div className="relative w-28 h-28 rounded-3xl overflow-hidden bg-muted shrink-0 border border-white/10 shadow-lg">
                      <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-right">
                      <h3 className="font-bold text-xl">{item.title}</h3>
                      <p className="text-primary font-bold text-lg">{item.price.toFixed(2)} درهم</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-background/50 rounded-2xl p-1.5 border border-white/10 backdrop-blur-md">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl hover:bg-primary/20 hover:text-primary transition-colors"
                          onClick={() => updateQuantity(item.productId, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-6 text-center text-lg font-bold">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl hover:bg-primary/20 hover:text-primary transition-colors"
                          onClick={() => updateQuantity(item.productId, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl w-12 h-12"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-50" />
                  <h3 className="text-2xl font-bold text-right">ملخص الطلب</h3>
                  
                  <div className="space-y-4 text-right">
                    <div className="flex justify-between items-center flex-row-reverse">
                      <span className="text-muted-foreground">المجموع الفرعي</span>
                      <span className="font-bold">{cartTotal.toFixed(2)} درهم</span>
                    </div>
                    <div className="flex justify-between items-center flex-row-reverse">
                      <span className="text-muted-foreground">مصاريف الشحن</span>
                      <span className="font-bold">{shipping.toFixed(2)} درهم</span>
                    </div>
                    <div className="border-t border-white/10 pt-6 flex justify-between items-center flex-row-reverse">
                      <span className="text-xl font-bold">الإجمالي</span>
                      <span className="text-2xl font-black text-gradient-primary animate-text-glow">{total.toFixed(2)} درهم</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button 
                      onClick={handleWhatsAppCheckout}
                      className="w-full h-16 rounded-2xl text-lg font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-green-500/20 transition-all active:scale-95 animate-whatsapp-glow flex items-center justify-center gap-3"
                    >
                      <MessageCircle className="w-6 h-6 fill-current" />
                      طلب عبر الواتساب
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                      عند الضغط، سيتم توجيهك للواتساب لتأكيد طلبك وترتيب الدفع والتسليم مباشرة مع فريقنا.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center space-y-8 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto rotate-12 border border-primary/20">
                <ShoppingBag className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-bold">سلة التسوق فارغة</h2>
                <p className="text-muted-foreground text-lg">يبدو أنك لم تضف أي هدايا أو جوائز إلى سلتك بعد.</p>
              </div>
              <Link href="/#shop">
                <Button size="lg" className="rounded-full bg-primary h-16 px-12 text-lg font-bold btn-glow">
                  تصفح مجموعتنا الفاخرة
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
