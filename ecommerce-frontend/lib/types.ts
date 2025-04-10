export interface Product {
  gender: string;
  imageData: string;
  photos: boolean;
  _id: string;
  name: string;
  price: number;
  description: string;
  createdAt: string;
  image?: string;
  category?: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    username: string;
  };
}