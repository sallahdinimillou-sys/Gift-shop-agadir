
import { Product } from "@/types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Crystal Excellence Award',
    slug: 'crystal-excellence-award',
    description: 'A premium hand-cut crystal award designed to honor outstanding achievement. This elegant piece features a faceted edge that catches the light beautifully, making it a perfect centerpiece for any corporate ceremony.',
    shortDescription: 'Premium hand-cut crystal award for top performers.',
    price: 450.00,
    categoryId: 'trophies',
    images: ['https://picsum.photos/seed/p1/600/600'],
    stockStatus: 'in-stock',
    featured: true,
    bestSeller: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Golden Victor Trophy',
    slug: 'golden-victor-trophy',
    description: 'Our classic gold-plated Victor trophy is a symbol of triumph. Standing at 12 inches tall, it features a weighted marble base and can be fully personalized with high-precision engraving.',
    shortDescription: 'Classic gold-plated trophy for sports and corporate events.',
    price: 850.00,
    categoryId: 'trophies',
    images: ['https://picsum.photos/seed/p2/600/600'],
    stockStatus: 'in-stock',
    featured: true,
    bestSeller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Personalized Luxury Watch',
    slug: 'personalized-watch',
    description: 'A timeless timepiece that tells more than just the time. This luxury silver watch offers a spacious back surface for custom engravings, making it an ideal gift for anniversaries or retirement.',
    shortDescription: 'Luxury silver watch with custom engraving options.',
    price: 1200.00,
    categoryId: 'personalized-gifts',
    images: ['https://picsum.photos/seed/p3/600/600'],
    stockStatus: 'in-stock',
    featured: false,
    bestSeller: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Silver Distinction Medal',
    slug: 'silver-distinction-medal',
    description: 'Recognize merit with this artisan silver medal. It comes with a premium velvet ribbon available in multiple colors and a dedicated case for presentation.',
    shortDescription: 'High-quality silver medal with custom ribbon colors.',
    price: 120.00,
    categoryId: 'medals',
    images: ['https://picsum.photos/seed/p4/600/600'],
    stockStatus: 'in-stock',
    featured: false,
    bestSeller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
