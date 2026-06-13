
"use client"

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { BUSINESS_INFO } from '@/lib/constants';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // محاكاة إرسال الطلب
    setTimeout(() => {
      toast({
        title: "تم إرسال الرسالة!",
        description: "سنتواصل معك في أقرب وقت ممكن.",
      });
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">تواصل <span className="text-gradient-primary">معنا</span></h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              هل لديك استفسار عن منتج معين أو ترغب في معرفة المزيد عن تشكيلتنا؟ فريقنا هنا لمساعدتك في اختيار الهدية أو الجائزة المثالية.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* معلومات التواصل */}
            <div className="space-y-8 text-right">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">معلومات التواصل</h3>
                <div className="space-y-6">
                  {/* الأيقونات في أقصى اليمين والنص بجانبها */}
                  <div className="flex items-start gap-4 justify-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 order-last shadow-inner border border-primary/20">
                      <Phone className="text-primary w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">الهاتف والواتساب</p>
                      <p className="text-muted-foreground" dir="ltr">{BUSINESS_INFO.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 justify-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 order-last shadow-inner border border-primary/20">
                      <Mail className="text-primary w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">البريد الإلكتروني</p>
                      <p className="text-muted-foreground">{BUSINESS_INFO.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 justify-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 order-last shadow-inner border border-primary/20">
                      <MapPin className="text-primary w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">موقعنا</p>
                      <p className="text-muted-foreground">{BUSINESS_INFO.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 justify-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 order-last shadow-inner border border-primary/20">
                      <Clock className="text-primary w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">ساعات العمل</p>
                      <p className="text-muted-foreground">الإثنين - السبت: 9:00 صباحاً - 7:00 مساءً</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 backdrop-blur-xl">
                <p className="font-bold flex items-center justify-end gap-2 text-[#25D366]">
                  دردش معنا على واتساب
                  <MessageCircle className="w-5 h-5 fill-current" />
                </p>
                <p className="text-sm text-muted-foreground">احصل على إجابات فورية لاستفساراتك حول المنتجات المتاحة في المتجر.</p>
                <Button 
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl h-12 font-bold shadow-lg shadow-green-500/10 transition-all active:scale-95"
                  onClick={() => window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}`, '_blank')}
                >
                  ابدأ المحادثة الآن
                </Button>
              </div>
            </div>

            {/* نموذج التواصل */}
            <div className="lg:col-span-2">
              <Card className="border-white/10 bg-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl">
                <CardContent className="p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-6 text-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">الاسم الكامل</Label>
                        <Input id="name" placeholder="أدخل اسمك هنا..." required className="h-12 rounded-xl text-right bg-white/5 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">البريد الإلكتروني</Label>
                        <Input id="email" type="email" placeholder="example@mail.com" required className="h-12 rounded-xl text-right bg-white/5 border-white/10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">الموضوع</Label>
                      <Input id="subject" placeholder="استفسار عن توفر منتج..." required className="h-12 rounded-xl text-right bg-white/5 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-1">الرسالة</Label>
                      <Textarea id="message" placeholder="أخبرنا كيف يمكننا مساعدتك..." required className="min-h-[150px] rounded-xl resize-none text-right bg-white/5 border-white/10" />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 btn-glow">
                      {loading ? "جاري الإرسال..." : (
                        <>
                          إرسال الرسالة
                          <Send className="w-5 h-5 mr-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
