import { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  productCount: number;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  logo: string;
  website: string;
  category: string;
  categorySlug: string;
  categoryId?: string; // Firebase reference
  
  // Ratings and stats
  rating: number;
  reviewCount: number;
  userCount: string;
  foundedYear: string;
  location: string;
  
  // Features and pricing
  features: string[];
  pricing: PricingPlan[];
  
  // Additional info
  isUnicorn?: boolean;
  isFeatured: boolean;
  tags: string[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Reviews
  reviews?: Review[];
  
  // Alternatives
  alternatives?: string[]; // Product IDs
  
  // Firebase timestamps
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface PricingPlan {
  id?: string;
  productId?: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface Review {
  id: string;
  productId?: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  createdAt?: Timestamp;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}
