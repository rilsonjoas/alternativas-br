import { Timestamp } from 'firebase/firestore';

export interface ProductLocation {
  country: string;
  state?: string;
  city?: string;
  flag?: string;
}

export interface CompanyInfo {
  foundedYear?: number;
  headquarters?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  employees?: number;
  website?: string;
}

export interface PricingInfo {
  type: 'free' | 'freemium' | 'paid' | 'enterprise';
  startingPrice?: number;
  currency: string;
  description: string;
  plans?: PricingPlan[];
}

export interface PricingPlan {
  id?: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  location: ProductLocation;
  companyInfo: CompanyInfo;
  pricing: PricingInfo;
  features: string[];
  tags: string[];
  screenshots?: string[];
  isFeatured: boolean;
  isUnicorn?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  alternatives?: string[];
  alternativeTo?: string[];
  views?: number;
  upvotes?: number;
  userCount?: string;
  affiliateUrl?: string;
  socialLinks?: SocialLinks;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ProductFormData {
  name: string;
  description: string;
  website: string;
  logo: string;
  location: ProductLocation;
  companyInfo: CompanyInfo;
  pricing: PricingInfo;
  features: string[];
  tags: string[];
  screenshots?: string[];
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  alternativeTo?: string[];
  socialLinks?: SocialLinks;
  affiliateUrl?: string;
}

export interface ToolSuggestion {
  id?: string;
  name: string;
  description: string;
  website?: string;
  category: string;
  pricing: string;
  alternativeTo?: string;
  contactEmail?: string;
  observations?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
}
