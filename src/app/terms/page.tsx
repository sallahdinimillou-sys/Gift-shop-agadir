
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, FileText, Scale, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary/5" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-right">
          <div className="max-w-3xl mr-0 ml-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              شروط <span className="text-gradient-primary animate-text-glow">الخدمة</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              يرجى قراءة هذه الشروط بعناية قبل استخدام خدمات متجرنا.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mr-0 ml-auto space-y-12 text-right">
            
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl space-y-8">
              
              <div className="space-y-4">
                <div className="flex items-center justify-end gap-3 text-primary">
                  <h2 className="text-2xl font-bold">1. مقدمة</h2>
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  باستخدامك لموقع "Gift Shop Agadir"، فإنك توافق على الالتزام بشروط الخدمة هذه. نحن نقدم مجموعة من الكؤوس، الجوائز، والمواد الدعائية الفاخرة لعملائنا في أكادير والمغرب.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-end gap-3 text-primary">
                  <h2 className="text-2xl font-bold">2. الطلبات والدفع</h2>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  تتم معالجة الطلبات عبر الموقع، ويتم تأكيدها نهائياً من خلال التواصل عبر الواتساب. نحن نحتفظ بالحق في رفض أي طلب في حال عدم توفر المخزون أو وجود أخطاء في التسعير.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-end gap-3 text-primary">
                  <h2 className="text-2xl font-bold">3. الشحن والتسليم</h2>
                  <Scale className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  نحن نلتزم بتوصيل منتجاتنا بجودة عالية وسرعة فائقة لجميع المدن المغربية. يتم تحديد مصاريف الشحن بوضوح عند كل منتج، وتضاف للإجمالي النهائي في سلة التسوق.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-end gap-3 text-primary">
                  <h2 className="text-2xl font-bold">4. الملكية الفكرية</h2>
                  <HelpCircle className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  جميع المحتويات الموجودة على هذا الموقع، بما في ذلك الشعارات، التصاميم، والنصوص، هي ملك خاص لمتجر "Gift Shop Agadir" ولا يجوز استخدامها دون إذن مسبق.
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
