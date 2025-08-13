// Tipos para sistema de tags avançado
import { Product } from './index';

export interface TagCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
}

export interface ProductTag {
  id: string;
  label: string;
  category: TagCategory;
  value?: string; // Para tags com valores (ex: "Fundada em 2020")
  color?: string;
  icon?: string;
  isVerified?: boolean; // Tag verificada pela equipe
}

export interface ProductLocation {
  country: string;
  state?: string;
  city?: string;
  countryCode: string; // BR, US, etc.
  flag?: string; // URL da bandeira ou emoji
}

export interface ProductCertification {
  id: string;
  name: string;
  issuer: string;
  validUntil?: Date;
  verificationUrl?: string;
  icon?: string;
  description?: string;
}

// Categorias de tags predefinidas
export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: 'origin',
    name: 'Origem',
    color: 'bg-green-100 text-green-800',
    icon: '🌍',
    description: 'País/região de origem da empresa'
  },
  {
    id: 'sustainability',
    name: 'Sustentabilidade',
    color: 'bg-emerald-100 text-emerald-800',
    icon: '🌱',
    description: 'Práticas sustentáveis e ambientais'
  },
  {
    id: 'business-model',
    name: 'Modelo de Negócio',
    color: 'bg-blue-100 text-blue-800',
    icon: '💼',
    description: 'Como a empresa opera e gera receita'
  },
  {
    id: 'technology',
    name: 'Tecnologia',
    color: 'bg-purple-100 text-purple-800',
    icon: '⚡',
    description: 'Stack tecnológico e arquitetura'
  },
  {
    id: 'compliance',
    name: 'Conformidade',
    color: 'bg-orange-100 text-orange-800',
    icon: '🛡️',
    description: 'Certificações e regulamentações'
  },
  {
    id: 'size',
    name: 'Tamanho',
    color: 'bg-gray-100 text-gray-800',
    icon: '📊',
    description: 'Porte da empresa'
  },
  {
    id: 'integration',
    name: 'Integrações',
    color: 'bg-cyan-100 text-cyan-800',
    icon: '🔗',
    description: 'Integrações e APIs disponíveis'
  },
  {
    id: 'support',
    name: 'Suporte',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '🎧',
    description: 'Qualidade e disponibilidade do suporte'
  }
];

// Tags específicas para produtos brasileiros
export const BRAZILIAN_TAGS: ProductTag[] = [
  // Origem
  {
    id: 'made-in-brazil',
    label: '🇧🇷 Feito no Brasil',
    category: TAG_CATEGORIES[0],
    color: 'bg-green-100 text-green-800',
    isVerified: true
  },
  {
    id: 'brazilian-owned',
    label: 'Capital 100% Nacional',
    category: TAG_CATEGORIES[0],
    color: 'bg-blue-100 text-blue-800',
    isVerified: true
  },
  
  // Sustentabilidade
  {
    id: 'carbon-neutral',
    label: '🌱 Carbono Neutro',
    category: TAG_CATEGORIES[1],
    color: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'green-energy',
    label: '⚡ Energia Renovável',
    category: TAG_CATEGORIES[1],
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'b-corp',
    label: '🏆 Empresa B Corp',
    category: TAG_CATEGORIES[1],
    color: 'bg-emerald-100 text-emerald-800'
  },
  
  // Conformidade
  {
    id: 'lgpd-compliant',
    label: '🛡️ Conforme LGPD',
    category: TAG_CATEGORIES[4],
    color: 'bg-orange-100 text-orange-800',
    isVerified: true
  },
  {
    id: 'pci-compliant',
    label: '💳 Certificado PCI',
    category: TAG_CATEGORIES[4],
    color: 'bg-red-100 text-red-800'
  },
  {
    id: 'iso-certified',
    label: '📋 ISO 27001',
    category: TAG_CATEGORIES[4],
    color: 'bg-gray-100 text-gray-800'
  },
  
  // Modelo de negócio
  {
    id: 'open-source',
    label: '🔓 Código Aberto',
    category: TAG_CATEGORIES[2],
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'freemium',
    label: '🆓 Freemium',
    category: TAG_CATEGORIES[2],
    color: 'bg-blue-100 text-blue-800'
  },
  
  // Tecnologia
  {
    id: 'api-first',
    label: '🔗 API-First',
    category: TAG_CATEGORIES[3],
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'mobile-first',
    label: '📱 Mobile-First',
    category: TAG_CATEGORIES[3],
    color: 'bg-indigo-100 text-indigo-800'
  },
  
  // Suporte
  {
    id: 'portuguese-support',
    label: '🇧🇷 Suporte em Português',
    category: TAG_CATEGORIES[7],
    color: 'bg-yellow-100 text-yellow-800',
    isVerified: true
  },
  {
    id: 'local-support',
    label: '📞 Suporte Local',
    category: TAG_CATEGORIES[7],
    color: 'bg-yellow-100 text-yellow-800'
  }
];

// Interface atualizada do produto
export interface ExtendedProduct extends Omit<Product, 'location' | 'tags'> {
  tags: ProductTag[];
  location: ProductLocation;
  certifications: ProductCertification[];
  sustainabilityScore?: number;
  lastUpdated?: Date;
  
  // Campos adicionais para comparação
  companyInfo?: {
    name?: string;
    foundedYear?: number;
    headquarters?: string;
    size?: string;
    employees?: number;
    revenue?: string;
    funding?: string;
    investors?: string[];
  };
  socialImpact?: {
    jobsCreated?: number;
    communityPrograms?: string[];
    diversityMetrics?: {
      womenInLeadership?: number;
      diversityScore?: number;
    };
  };
  technicalSpecs?: {
    uptime?: number;
    dataResidency?: string;
    encryptionLevel?: string;
    apiAvailability?: number;
  };
}
