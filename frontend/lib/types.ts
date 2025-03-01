export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount: number;
  category: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount?: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
}

export interface Order {
  id: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: {
    name: string;
    price: number;
    quantity: number;
    image: string;
    color: string;
    size: string;
  }[];
  total: number;
  trackingNumber?: string;
}

export interface Testimonial {
  name: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
}