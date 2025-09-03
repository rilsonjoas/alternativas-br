import { Timestamp } from 'firebase/firestore';
import { ReactNode } from 'react';

// Localização estruturada
export interface ProductLocation {
  country: string;
  state?: string;
  city?: string;
  flag?: string; // Emoji ou URL da bandeira
}

// Informações da empresa
export interface CompanyInfo {
  foundedYear?: number;
  headquarters?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  employees?: number;
  website?: string;
}

// Preços unificados
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

// Links sociais
export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
}

// Interface unificada de produto (nacional e estrangeiro)
export interface Product {
  foundedYear: ReactNode;
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  
  // Localização (determina se é nacional ou estrangeiro)
  location: ProductLocation;
  
  // Informações da empresa
  companyInfo: CompanyInfo;
  
  // Preços
  pricing: PricingInfo;
  
  // Características
  features: string[];
  tags: string[];
  screenshots?: string[];
  
  // Status
  isFeatured: boolean;
  isUnicorn?: boolean;
  
  // Metadados
  metaTitle?: string;
  metaDescription?: string;
  
  // Relacionamentos
  alternatives?: string[]; // Product IDs
  alternativeTo?: string[]; // Para produtos estrangeiros, lista de IDs que eles são alternativa
  
  // Métricas
  views?: number;
  userCount?: string;
  
  // Social
  socialLinks?: SocialLinks;
  
  // Auditoria
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Dados para formulários (usado no admin)
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
}
