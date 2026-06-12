
"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, ShoppingCart, MessageSquare, TrendingUp, DollarSign, Users } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Revenue", value: "45,231.89 MAD", icon: <DollarSign className="text-primary" />, trend: "+20.1% from last month" },
    { label: "Total Orders", value: "142", icon: <ShoppingCart className="text-primary" />, trend: "+12.5% from last month" },
    { label: "Total Products", value: "84", icon: <Package className="text-primary" />, trend: "4 new this week" },
    { label: "New Inquiries", value: "12", icon: <MessageSquare className="text-primary" />, trend: "Requires attention" }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Real-time performance of Gift Shop Agadir.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-white/5 bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <div>
                      <p className="font-medium">Customer {i}</p>
                      <p className="text-xs text-muted-foreground">2 items • 1,200 MAD</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 font-medium">Processing</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">Custom Crystal Award Inquiry</p>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">"I would like to know if you can engrave a specific logo on the large trophy..."</p>
                  <div className="flex gap-2">
                     <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 font-medium">Pending</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
