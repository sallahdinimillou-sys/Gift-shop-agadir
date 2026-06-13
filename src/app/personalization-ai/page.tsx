
"use client"

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RemovedPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter">هذه الصفحة <span className="text-gradient-primary">لم تعد متاحة</span></h1>
        <p className="text-muted-foreground text-lg max-w-md">تمت إزالة صفحة المساعد الذكي من الموقع. يمكنك تصفح مجموعتنا الفاخرة من الكؤوس والجوائز عبر المتجر.</p>
        <Link href="/">
          <Button variant="outline" className="rounded-full px-8 h-12 border-primary text-primary hover:bg-primary hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
      <Footer />
    </main>
  );
}
