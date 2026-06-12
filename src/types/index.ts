
export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  categoryId: string;
  images: string[];
  stockStatus: 'in-stock' | 'out-of-stock' | 'on-backorder';
  featured: boolean;
  bestSeller: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
};

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  productId?: string;
  status: 'new' | 'responded' | 'closed';
  createdAt: string;
};
