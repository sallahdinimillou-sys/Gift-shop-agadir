import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Gift Shop Agadir | Trophées de Luxe & Cadeaux Personnalisés',
  description: 'La destination phare pour les trophées, les récompenses et les cadeaux personnalisés à Agadir, Maroc.',
  openGraph: {
    title: 'Gift Shop Agadir',
    description: 'Luxury Trophies & Personalized Gifts in Agadir.',
    images: ['https://picsum.photos/seed/gift-hero/1200/630'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;900&family=Poppins:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-arabic antialiased selection:bg-primary selection:text-white">
        <FirebaseClientProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}