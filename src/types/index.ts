import { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  slug: string;
  name: string; // Mudança de title para name para consistência
  title?: string; // Mantido para compatibilidade
  description: string;
  icon: string;
  color: string;
  productCount: number;
  featured?: boolean;
  isActive?: boolean; // Para controle de status admin
  tags?: string[];
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
  
  // Basic stats
  userCount: string;
  foundedYear: string;
  location: string;
  
  // Features and pricing
  features: string[];
  pricing: PricingPlan[];
  
  // Additional info
  isUnicorn?: boolean;
  isFeatured: boolean;
  isActive?: boolean; // Para controle de status admin
  tags: string[];
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  // Alternatives
  alternatives?: string[]; // Product IDs
  
  // Admin info
  views?: number;
  averageRating?: number;
  reviewCount?: number;
  
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

export interface CategoryWithProducts extends Category {
  products: Product[];
}
