
"use client"

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Package, Tag, ShoppingCart, MessageSquare, Settings, LogOut, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
      const authorized = user && user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
      setIsAuthorized(!!authorized);

      const isLoginPage = pathname === '/admin/login';
      
      if (!user && !isLoginPage) {
        router.push('/admin/login');
      } else if (user && !authorized && !isLoginPage) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "This account does not have administrative privileges."
        });
        if (auth) {
          signOut(auth).then(() => router.push('/admin/login'));
        }
      }
    }
  }, [user, isLoading, pathname, router, toast, auth]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/admin/login');
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Overview', href: '/admin' },
    { icon: <Package className="w-4 h-4" />, label: 'Products', href: '/admin/products' },
    { icon: <Tag className="w-4 h-4" />, label: 'Categories', href: '/admin/categories' },
    { icon: <ShoppingCart className="w-4 h-4" />, label: 'Orders', href: '/admin/orders' },
    { icon: <MessageSquare className="w-4 h-4" />, label: 'Inquiries', href: '/admin/inquiries' },
    { icon: <Settings className="w-4 h-4" />, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar className="border-r border-white/5">
          <SidebarHeader className="p-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gradient-primary uppercase tracking-tighter">
                GS Agadir
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    className="h-11 rounded-xl"
                  >
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
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
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Site
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user?.displayName || 'Administrator'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/20">
                 {user?.email?.[0].toUpperCase()}
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
