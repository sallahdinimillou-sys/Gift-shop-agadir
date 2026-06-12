
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
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Crafting Excellence in <span className="text-gradient-primary">Agadir</span></h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              For over a decade, Gift Shop Agadir has been the premier destination for those who seek to honor achievement and celebrate life's milestones with elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10">
              <Image 
                src="https://picsum.photos/seed/about-story/1000/1000" 
                alt="Our workshop" 
                fill 
                className="object-cover"
                data-ai-hint="luxury workshop craft"
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Founded with a vision to bring high-quality personalization to the heart of Morocco, our shop started as a small atelier dedicated to fine engraving. Today, we've grown into a full-service gift and award center serving corporate giants, sports federations, and individuals across the country.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that every victory, no matter how small, deserves a symbol of recognition that lasts a lifetime. That's why we meticulously source the finest crystals, metals, and woods for our products.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-primary">10+</h4>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Years Experience</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-primary">5k+</h4>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Awards Delivered</p>
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
            <h2 className="text-3xl md:text-4xl font-bold">What Drives Us</h2>
            <p className="text-muted-foreground">Our core values define every interaction and every product we create.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Award className="w-10 h-10 text-primary" />, 
                title: "Quality First", 
                desc: "We never compromise on the materials or the precision of our craftsmanship." 
              },
              { 
                icon: <Heart className="w-10 h-10 text-primary" />, 
                title: "Customer Focus", 
                desc: "Your satisfaction is our ultimate goal. We work closely with you to realize your vision." 
              },
              { 
                icon: <Shield className="w-10 h-10 text-primary" />, 
                title: "Integrity", 
                desc: "We stand by our promises, ensuring timely delivery and transparent pricing." 
              }
            ].map((v, i) => (
              <div key={i} className="bg-background p-10 rounded-3xl border border-white/5 space-y-6">
                {v.icon}
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
