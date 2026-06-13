
"use client"

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Package, LogOut, Loader2, ArrowLeft, User as UserIcon, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// البريد الإلكتروني الوحيد المخول بالدخول
const AUTHORIZED_ADMIN_EMAIL = 'sallahdinimillou@gmail.com';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      const authorized = !!(user && user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase());
      setIsAuthorized(authorized);

      const isLoginPage = pathname === '/admin/login';
      
      if (!user && !isLoginPage) {
        // إذا لم يكن مسجلاً، وجهه لصفحة الدخول
        router.push('/admin/login');
      } else if (user && !authorized && !isLoginPage) {
        // إذا كان مسجلاً ببريد غير مصرح به، اطرده فوراً
        toast({
          variant: "destructive",
          title: "دخول غير مصرح",
          description: "هذا الحساب لا يملك صلاحيات الإدارة."
        });
        if (auth) {
          signOut(auth).then(() => router.push('/admin/login'));
        }
      }
    }
  }, [user, isLoading, pathname, router, toast, auth]);

  // صفحة الدخول لا تحتاج للقالب الجانبي
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // حالة التحميل أو التحقق
  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن مصرحاً، لا تظهر شيئاً (سيقوم useEffect بالتحويل)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6 text-center">
        <div className="space-y-4">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">غير مصرح لك بالدخول</h2>
          <Button onClick={() => auth && signOut(auth).then(() => router.push('/admin/login'))}>
            تسجيل الخروج والعودة
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/admin/login');
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full" dir="rtl">
        <Sidebar className="border-r border-white/5" side="right">
          <SidebarHeader className="p-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gradient-primary uppercase tracking-tighter">
                لوحة التحكم
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-4">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === '/admin'}
                  className="h-11 rounded-xl transition-all text-right flex-row-reverse"
                >
                  <Link href="/admin">
                    <Package className="w-4 h-4" />
                    <span>إدارة المنتجات</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors text-right flex-row-reverse"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="bg-background flex flex-col">
          <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between glass sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-muted-foreground hover:text-primary rounded-full">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة للموقع
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-left">
                 <p className="text-xs font-bold text-muted-foreground uppercase">المسؤول</p>
                 <p className="text-sm font-bold truncate max-w-[150px]">{user?.email}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/20">
                 {user?.email?.[0].toUpperCase() || <UserIcon className="w-5 h-5" />}
               </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
