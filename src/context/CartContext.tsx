
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  shippingTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [pendingToast, setPendingToast] = useState<{ title: string; description: string } | null>(null);
  const { toast } = useToast();

  // معالجة التنبيهات في useEffect لتجنب خطأ التحديث أثناء التصيير
  // هذا يضمن أن toast() يتم استدعاؤه بعد اكتمال تحديث الحالة والتصيير
  useEffect(() => {
    if (pendingToast) {
      toast(pendingToast);
      setPendingToast(null);
    }
  }, [pendingToast, toast]);

  // تحميل السلة من localStorage عند البدء
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e);
        }
      }
    }
  }, []);

  // حفظ السلة في localStorage عند التغيير
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (product: Product) => {
    // نحدد ما إذا كان المنتج موجوداً مسبقاً قبل تحديث الحالة لإعداد التنبيه المناسب
    const existingItem = items.find((item) => item.productId === product.id);

    if (existingItem) {
      setPendingToast({
        title: "تمت إضافة قطعة أخرى!",
        description: `تمت زيادة كمية ${product.title} في سلتك.`,
      });
      setItems((prev) =>
        prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setPendingToast({
        title: "تمت الإضافة للسلة",
        description: `تمت إضافة ${product.title} إلى سلتك بنجاح.`,
      });
      setItems((prev) => [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          shippingPrice: product.shippingPrice || 0,
          quantity: 1,
          image: product.images?.[0] || '',
        },
      ]);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingTotal = items.reduce((acc, item) => acc + (item.shippingPrice * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        shippingTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
