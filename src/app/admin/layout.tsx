
"use client"

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Package, Tag, ShoppingCart, MessageSquare, Settings, LogOut, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return <>{children}</>;

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Overview', href: '/admin' },
    { icon: <Package />, label: 'Products', href: '/admin/products' },
    { icon: <Tag />, label: 'Categories', href: '/admin/categories' },
    { icon: <ShoppingCart />, label: 'Orders', href: '/admin/orders' },
    { icon: <MessageSquare />, label: 'Inquiries', href: '/admin/inquiries' },
    { icon: <ImageIcon />, label: 'Media Library', href: '/admin/media' },
    { icon: <Settings />, label: 'Site CMS', href: '/admin/cms' },
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
                  onClick={() => router.push('/admin/login')}
                  className="h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="bg-background flex flex-col">
          <header className="h-16 border-b border-white/5 flex items-center px-8 justify-between glass sticky top-0 z-20">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">Administrator</p>
                  <p className="text-xs text-muted-foreground">giftshopagadir@gmail.com</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/20">
                 A
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
