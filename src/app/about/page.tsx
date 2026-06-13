
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import { Award, Heart, Shield, Trophy } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary/5" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-right">
          <div className="max-w-3xl mr-0 ml-auto space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
              تميزنا في قلب <span className="text-gradient-primary animate-text-glow">أكادير</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              وجهتكم الأولى للاحتفال بالإنجازات وتقديم الهدايا التي تترك أثراً طيباً في القلوب بلمسة من الرقي والبساطة.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-background border-y border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src="https://picsum.photos/seed/gift-shop-story/1000/1000" 
                alt="متجرنا" 
                fill 
                className="object-cover"
                data-ai-hint="gift shop interior"
              />
            </div>
            <div className="space-y-8 text-right">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">قصتنا</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    بدأت رحلتنا في "Gift Shop Agadir" بفكرة بسيطة: تحويل لحظات التكريم والمناسبات الخاصة إلى ذكريات ملموسة تدوم للأبد. نحن نؤمن أن كل نجاح، مهما كان بسيطاً، يستحق رمزاً يليق به.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    انطلقنا من قلب مدينة أكادير بشغف كبير لتوفير مجموعة متنوعة من الكؤوس، الميداليات، والهدايا المخصصة التي تجمع بين جودة التصنيع وجمال التفاصيل. هدفنا دائماً هو مساعدة عملائنا في التعبير عن تقديرهم ومشاعرهم من خلال قطع فريدة تحمل بصمتهم الخاصة.
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    سواء كنتم تبحثون عن درع تكريمي لحدث رياضي، أو هدية بسيطة وأنيقة لمناسبة شخصية، فإننا نضع خبرتنا في النقش والتصميم بين أيديكم لضمان تقديم الأفضل دائماً.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-primary animate-text-glow">+10</h4>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">سنوات من العطاء</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-primary animate-text-glow">+2000</h4>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">عميل سعيد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">لماذا تختارنا؟</h2>
            <p className="text-muted-foreground">نلتزم بمعايير تجعل من كل قطعة ننتجها عملاً فنياً فريداً.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Trophy className="w-10 h-10 text-primary" />, 
                title: "تنوع الخيارات", 
                desc: "نوفر تشكيلة واسعة من الكؤوس والهدايا التي تناسب كافة الأذواق والميزانيات." 
              },
              { 
                icon: <Heart className="w-10 h-10 text-primary" />, 
                title: "لمسة شخصية", 
                desc: "نهتم بأدق التفاصيل في التخصيص والنقش لنجعل هديتكم استثنائية." 
              },
              { 
                icon: <Shield className="w-10 h-10 text-primary" />, 
                title: "المصداقية", 
                desc: "نضمن جودة المواد وسرعة التنفيذ والتسليم في المواعيد المحددة." 
              }
            ].map((v, i) => (
              <div key={i} className="bg-background p-10 rounded-[2.5rem] border border-white/5 space-y-6 text-center hover:bg-white/5 transition-all duration-300 group">
                <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-bold">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
