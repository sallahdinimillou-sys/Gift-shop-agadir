
"use client"

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CartPage() {
  // Simple local state for demonstration since we don't have a global state manager yet
  const [items, setItems] = useState([
    {
      id: '1',
      title: 'Crystal Excellence Award',
      price: 450.00,
      quantity: 1,
      image: 'https://picsum.photos/seed/p1/200/200'
    }
  ]);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 50.00;
  const total = subtotal + shipping;

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-8">
            <h1 className="text-4xl font-bold tracking-tighter">Your <span className="text-gradient-primary">Cart</span></h1>
            <Link href="/shop">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 items-center">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-muted shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-primary font-bold">{item.price.toFixed(2)} MAD</p>
                    </div>
                    <div className="flex items-center gap-3 bg-background rounded-full p-1 border border-white/10">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-6">
                  <h3 className="text-xl font-bold">Order Summary</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{subtotal.toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">{shipping.toFixed(2)} MAD</span>
                    </div>
                    <div className="border-t border-white/5 pt-4 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-gradient-primary">{total.toFixed(2)} MAD</span>
                    </div>
                  </div>
                  <Button className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90">
                    Proceed to Checkout
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground">
                    Secure payment processed via local payment gateways.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center space-y-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
              </div>
              <Link href="/shop">
                <Button size="lg" className="rounded-full bg-primary h-12 px-8">
                  Browse Collection
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
