
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, Eye, Lock, FileJson } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary/5" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-right">
          <div className="max-w-3xl mr-0 ml-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              سياسة <span className="text-gradient-primary animate-text-glow">الخصوصية</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية في متجرنا.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mr-0 ml-auto space-y-12 text-right">
            
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl space-y-10">
              
              <div className="space-y-4">
                <div className="flex items-center justify-end gap-3 text-primary">
                  <h2 className="text-2xl font-bold">1. المعلومات التي نجمعها</h2>
                  <Eye className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  نحن نجمع فقط المعلومات الضرورية لمعالجة طلباتك، مثل الاسم ورقم الهاتف للتواصل عبر الواتساب، لضمان تقديم أفضل خدمة لك.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-end gap-3 text-primary">
                  <h2 className="text-2xl font-bold">2. كيف نستخدم بياناتك</h2>
                  <Shield className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  تُستخدم بياناتك فقط لأغراض إتمام الطلبات، الشحن، والتواصل المباشر معك بخصوص استفساراتك حول منتجاتنا الفاخرة.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-end gap-3 text-primary">
                  <h2 className="text-2xl font-bold">3. حماية البيانات</h2>
                  <Lock className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  نحن نتخذ كافة الإجراءات التقنية اللازمة لحماية معلوماتك من الوصول غير المصرح به، ونضمن لك سرية تامة في التعامل.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-end gap-3 text-primary">
                  <h2 className="text-2xl font-bold">4. ملفات تعريف الارتباط</h2>
                  <FileJson className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  نستخدم ملفات تعريف الارتباط البسيطة لتحسين تجربتك في تصفح المتجر وحفظ منتجاتك المفضلة في سلة التسوق.
                </p>
              </div>

            </div>

            <div className="text-center md:text-right pt-8 border-t border-white/5">
              <p className="text-sm text-muted-foreground italic">
                آخر تحديث: {new Date().toLocaleDateString('ar-MA')}
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
