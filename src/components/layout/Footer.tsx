
import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10 text-left">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-left">
          <div className="space-y-6 text-left">
            <Link href="/" className="text-2xl font-bold text-gradient-primary animate-text-glow tracking-tighter uppercase inline-block">
              Gift Shop Agadir
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs text-left">
              وجهتكم الأولى في أكادير للكؤوس والجوائز والهدايا الفاخرة المختارة بعناية لتناسب أرقى الأذواق.
            </p>
            <div className="flex justify-start gap-4">
              <a href={BUSINESS_INFO.social.facebook} target="_blank" className="p-2 bg-white/5 hover:bg-primary/20 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={BUSINESS_INFO.social.instagram} target="_blank" className="p-2 bg-white/5 hover:bg-primary/20 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="text-left">
            {/* تم حذف العنوان "روابط سريعة" بناءً على طلب المستخدم */}
            <ul className="space-y-4 text-left pt-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">قصتنا</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-lg font-bold mb-6">السياسات</h4>
            <ul className="space-y-4 text-left">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">شروط الخدمة</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-lg font-bold mb-6">معلومات المتجر</h4>
            <ul className="space-y-4 text-left">
              <li className="flex flex-row-reverse items-center justify-start gap-2 text-muted-foreground">
                <span className="text-left leading-tight">أكادير، المغرب</span>
                <MapPin className="w-5 h-5 text-primary shrink-0" />
              </li>
              <li className="flex flex-row-reverse items-center justify-start gap-2 text-muted-foreground">
                <span className="text-left" dir="ltr">{BUSINESS_INFO.phone}</span>
                <Phone className="w-5 h-5 text-primary shrink-0" />
              </li>
              <li className="flex flex-row-reverse items-center justify-start gap-2 text-muted-foreground">
                <span className="text-left">{BUSINESS_INFO.email}</span>
                <Mail className="w-5 h-5 text-primary shrink-0" />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground space-y-4 md:space-y-0 text-left w-full">
          <p className="text-left w-full md:w-auto">© {new Date().getFullYear()} Gift Shop Agadir. جميع الحقوق محفوظة.</p>
          <p className="text-left w-full md:w-auto">صُمم من أجل التميز.</p>
        </div>
      </div>
    </footer>
  );
}
