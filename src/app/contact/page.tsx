
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
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
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
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Get in <span className="text-gradient-primary">Touch</span></h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have a question about a custom project or need a bulk quote? Our team is here to help you create the perfect award.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">Phone & WhatsApp</p>
                      <p className="text-muted-foreground">{BUSINESS_INFO.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">Email Us</p>
                      <p className="text-muted-foreground">{BUSINESS_INFO.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">Our Location</p>
                      <p className="text-muted-foreground">{BUSINESS_INFO.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">Working Hours</p>
                      <p className="text-muted-foreground">Mon - Sat: 9:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                <p className="font-bold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  Chat on WhatsApp
                </p>
                <p className="text-sm text-muted-foreground">Get instant answers for quick inquiries via WhatsApp.</p>
                <Button 
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl"
                  onClick={() => window.open(`https://wa.me/${BUSINESS_INFO.whatsapp.replace('+', '')}`, '_blank')}
                >
                  Start Conversation
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-white/5 bg-white/5 rounded-3xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" required className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required className="h-12 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Custom Trophy Inquiry" required className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Tell us more about what you need..." required className="min-h-[150px] rounded-xl resize-none" />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90">
                      {loading ? "Sending..." : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
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
