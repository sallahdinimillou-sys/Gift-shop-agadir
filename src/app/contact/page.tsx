
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
    // Simulate API call
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
              هل لديك استفسار عن منتج معين أو تحتاج إلى عرض سعر لمجموعة من الجوائز؟ فريقنا هنا لمساعدتك في اختيار الهدية المثالية.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8 text-right">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">معلومات التواصل</h3>
                <div className="space-y-6">
                  <div className="flex flex-row-reverse items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">الهاتف والواتساب</p>
                      <p className="text-muted-foreground" dir="ltr">{BUSINESS_INFO.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">البريد الإلكتروني</p>
                      <p className="text-muted-foreground">{BUSINESS_INFO.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">موقعنا</p>
                      <p className="text-muted-foreground">{BUSINESS_INFO.address}</p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">ساعات العمل</p>
                      <p className="text-muted-foreground">الإثنين - السبت: 9:00 صباحاً - 7:00 مساءً</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                <p className="font-bold flex flex-row-reverse items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  دردش معنا على واتساب
                </p>
                <p className="text-sm text-muted-foreground">احصل على إجابات فورية لاستفساراتك السريعة عبر الواتساب.</p>
                <Button 
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl"
                  onClick={() => window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}`, '_blank')}
                >
                  ابدأ المحادثة الآن
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-white/5 bg-white/5 rounded-3xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-6 text-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل</Label>
                        <Input id="name" placeholder="الاسم هنا..." required className="h-12 rounded-xl text-right" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input id="email" type="email" placeholder="example@mail.com" required className="h-12 rounded-xl text-right" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">الموضوع</Label>
                      <Input id="subject" placeholder="استفسار عن طلب..." required className="h-12 rounded-xl text-right" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">الرسالة</Label>
                      <Textarea id="message" placeholder="أخبرنا كيف يمكننا مساعدتك..." required className="min-h-[150px] rounded-xl resize-none text-right" />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 btn-glow">
                      {loading ? "جاري الإرسال..." : (
                        <>
                          <Send className="w-5 h-5 ml-2" />
                          إرسال الرسالة
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
