
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import { Award, Heart, Shield, Users } from 'lucide-react';

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
              صناعة التميز في <span className="text-gradient-primary animate-text-glow">أكادير</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              لأكثر من عقد من الزمان، كان "Gift Shop Agadir" الوجهة الأولى لأولئك الذين يسعون لتكريم الإنجازات والاحتفال بمحطات الحياة بلمسة من الأناقة والرفاهية.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src="https://picsum.photos/seed/about-story/1000/1000" 
                alt="ورشة العمل الخاصة بنا" 
                fill 
                className="object-cover"
                data-ai-hint="luxury workshop craft"
              />
            </div>
            <div className="space-y-8 text-right">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">قصتنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  تأسس متجرنا برؤية تهدف إلى تقديم أعلى مستويات التخصيص في قلب مدينة أكادير، وبدأنا كورشة عمل صغيرة مخصصة للنقش الدقيق. اليوم، كبرنا لنصبح مركزاً متكاملاً للهدايا والجوائز الفاخرة، نخدم كبرى الشركات، والاتحادات الرياضية، والأفراد في جميع أنحاء المغرب.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  نحن نؤمن بأن كل فوز، مهما كان صغيراً، يستحق رمزاً للتكريم يدوم مدى الحياة. ولهذا السبب، نقوم باختيار أفضل أنواع الكريستال، والمعادن، والأخشاب لصناعة منتجاتنا بكل دقة وعناية.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-primary animate-text-glow">+10</h4>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">سنوات من الخبرة</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-primary animate-text-glow">+5000</h4>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">جائزة تم تسليمها</p>
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
            <h2 className="text-3xl md:text-4xl font-bold">ما يدفعنا للتميز</h2>
            <p className="text-muted-foreground">قيمنا الجوهرية هي التي ترسم ملامح كل منتج نصنعه وكل تفاعل نقوم به.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Award className="w-10 h-10 text-primary" />, 
                title: "الجودة أولاً", 
                desc: "نحن لا نتهاون أبداً في جودة المواد أو دقة الحرفية اليدوية في منتجاتنا." 
              },
              { 
                icon: <Heart className="w-10 h-10 text-primary" />, 
                title: "التركيز على العميل", 
                desc: "رضاكم هو هدفنا الأسمى. نحن نعمل معكم عن كثب لتحويل رؤيتكم إلى واقع ملموس." 
              },
              { 
                icon: <Shield className="w-10 h-10 text-primary" />, 
                title: "النزاهة", 
                desc: "نلتزم بوعودنا، ونضمن التسليم في الوقت المحدد والشفافية التامة في التعامل." 
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
