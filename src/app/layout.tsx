
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Gift Shop Agadir | Luxury Trophies & Personalized Gifts',
  description: 'The premier destination for trophies, awards, and personalized gifts in Agadir, Morocco. Celebrating your special moments with luxury and elegance.',
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-white">
        <FirebaseClientProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
