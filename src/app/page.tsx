
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { ShopSection } from '@/components/home/ShopSection';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, Shield, Truck, Award } from 'lucide-react';

export default function Home() {
  const stats = [
    { 
      icon: <Award className="w-8 h-8 text-primary" />, 
      title: "QUALITÉ PREMIUM", 
      desc: "أفضل المواد وحرفية الخبراء في كل قطعة ننتجها." 
    },
    { 
      icon: <Truck className="w-8 h-8 text-primary" />, 
      title: "LIVRAISON RAPIDE", 
      desc: "شحن موثوق وسريع لجميع المدن المغربية بآمان." 
    },
    { 
      icon: <Shield className="w-8 h-8 text-primary" />, 
      title: "PAIEMENT SÉCURISÉ", 
      desc: "معاملات آمنة تماماً لضمان راحة بالك عند الشراء." 
    },
    { 
      icon: <Star className="w-8 h-8 text-primary" />, 
      title: "MARQUE DE CONFIANCE", 
      desc: "الخيار الأول في أكادير للجوائز والهدايا الفاخرة." 
    }
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ShopSection />

      {/* Why Choose Us - Centered Stats */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 p-8 rounded-[2.5rem] bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 group hover:border-primary/30">
                <div className="p-4 rounded-3xl bg-primary/10 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-xl font-bold font-sans uppercase tracking-tighter text-center w-full">{stat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed text-center w-full">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary/5" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Ready to Create Something <span className="text-gradient-primary animate-text-glow italic">Unique?</span>
            </h2>
            <p className="text-xl text-muted-foreground">سواء كان ذلك لحدث شركة، أو حفل زفاف، أو ذكرى شخصية، نساعدك في صياغة أجمل الكلمات.</p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/#shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full h-16 px-10 text-lg font-bold btn-glow">
                  تصفح المتجر
                </Button>
              </Link>
              <Link href="/personalization-ai">
                <Button size="lg" variant="outline" className="rounded-full h-16 px-10 text-lg font-bold border-primary text-primary hover:bg-primary hover:text-white">
                  المساعد الذكي
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
