
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { ShopSection } from '@/components/home/ShopSection';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, Shield, Truck, Award } from 'lucide-react';

export default function Home() {
  const stats = [
    { icon: <Award className="w-8 h-8 text-primary" />, title: "Premium Quality", desc: "Finest materials and expert craftsmanship." },
    { icon: <Truck className="w-8 h-8 text-primary" />, title: "Fast Delivery", desc: "Reliable shipping across Morocco." },
    { icon: <Shield className="w-8 h-8 text-primary" />, title: "Secure Payment", desc: "Safe transactions for peace of mind." },
    { icon: <Star className="w-8 h-8 text-primary" />, title: "Trusted Brand", desc: "Agadir's choice for award solutions." }
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <CategoryShowcase />
      <ShopSection />

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                {stat.icon}
                <h3 className="text-xl font-bold">{stat.title}</h3>
                <p className="text-muted-foreground">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary/10" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Ready to Create Something <span className="text-gradient-primary">Unique?</span></h2>
            <p className="text-xl text-muted-foreground">Whether it's for a corporate event, a wedding, or a personal milestone, our AI-powered personalization tool helps you find the perfect words.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full h-14 px-8 text-lg">Shop Custom Gifts</Button>
              </Link>
              <Link href="/personalization-ai">
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-primary text-primary hover:bg-primary hover:text-white">Try AI Assistant</Button>
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
