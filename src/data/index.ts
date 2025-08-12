import { Category, Product, CategoryWithProducts } from "@/types";

export const categories: Category[] = [
  {
    id: "desenvolvimento",
    slug: "desenvolvimento",
    title: "Desenvolvimento",
    description: "IDEs, ferramentas de código e plataformas de desenvolvimento",
    icon: "💻",
    color: "bg-primary/10 text-primary",
    productCount: 25,
    featured: true,
    metaTitle: "Ferramentas de Desenvolvimento Brasileiras | Alternativas BR",
    metaDescription: "Descubra as melhores ferramentas de desenvolvimento criadas no Brasil: IDEs, editores, frameworks e bibliotecas nacionais."
  },
  {
    id: "marketing",
    slug: "marketing",
    title: "Marketing Digital",
    description: "Automação, email marketing e gestão de campanhas",
    icon: "📈",
    color: "bg-primary-glow/20 text-primary",
    productCount: 32,
    featured: true,
    metaTitle: "Marketing Digital Brasileiro | Alternativas BR",
    metaDescription: "Conheça as melhores ferramentas de marketing digital brasileiras: automação, email marketing, CRM e analytics nacionais."
  },
  {
    id: "design",
    slug: "design",
    title: "Design & UX",
    description: "Ferramentas de design, prototipagem e experiência do usuário",
    icon: "🎨",
    color: "bg-accent/30 text-primary",
    productCount: 18,
    featured: false
  },
  {
    id: "produtividade",
    slug: "produtividade", 
    title: "Produtividade",
    description: "Gestão de projetos, comunicação e colaboração",
    icon: "⚡",
    color: "bg-accent/20 text-primary",
    productCount: 28,
    featured: false
  },
  {
    id: "fintech",
    slug: "fintech",
    title: "Fintech",
    description: "Pagamentos, gestão financeira e banking digital",
    icon: "💳",
    color: "bg-primary/15 text-primary", 
    productCount: 21,
    featured: false
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    title: "E-commerce",
    description: "Plataformas de venda online e gestão de loja virtual",
    icon: "🛒",
    color: "bg-accent/25 text-primary",
    productCount: 15,
    featured: false
  }
];

export const products: Product[] = [
  {
    id: "hotmart",
    slug: "hotmart",
    name: "Hotmart",
    description: "A maior plataforma brasileira para criação, hospedagem e venda de produtos digitais. Conecta produtores e afiliados em um ecossistema completo de educação online.",
    shortDescription: "Plataforma brasileira líder em produtos digitais e marketing de afiliados",
    logo: "🔥",
    website: "https://hotmart.com",
    category: "Marketing Digital",
    categorySlug: "marketing",
    rating: 4.5,
    reviewCount: 15000,
    userCount: "500K+",
    foundedYear: "2011",
    location: "Belo Horizonte, BR",
    features: [
      "Criação de produtos digitais",
      "Sistema de afiliados robusto",
      "Pagamentos integrados", 
      "Analytics avançado",
      "Suporte em português",
      "Certificados digitais",
      "Área de membros",
      "Webinários integrados"
    ],
    pricing: [
      {
        name: "Starter",
        price: "Gratuito",
        description: "Para começar a vender",
        features: ["Produtos ilimitados", "Checkout próprio", "Suporte básico"]
      },
      {
        name: "Pro",
        price: "R$ 49/mês", 
        description: "Para quem quer escalar",
        features: ["Tudo do Starter", "Analytics avançado", "Suporte prioritário", "Integrações"],
        highlighted: true
      },
      {
        name: "Premium",
        price: "R$ 149/mês",
        description: "Para grandes operações", 
        features: ["Tudo do Pro", "White label", "API completa", "Account manager"]
      }
    ],
    isUnicorn: true,
    isFeatured: true,
    tags: ["Unicórnio", "Produtos Digitais", "Afiliados", "E-learning"],
    alternatives: ["eduzz", "monetizze"],
    reviews: [
      {
        id: "1",
        author: "João Silva",
        role: "Produtor",
        rating: 5,
        comment: "Excelente plataforma! Interface brasileira e suporte em português facilitaram muito minha operação.",
        date: "2024-01-15"
      },
      {
        id: "2", 
        author: "Maria Santos",
        role: "Afiliada",
        rating: 4,
        comment: "Ótima para afiliados. Sistema de comissões transparente e pagamentos em dia.",
        date: "2024-01-10"
      }
    ]
  },
  {
    id: "bling",
    slug: "bling",
    name: "Bling ERP",
    description: "Sistema brasileiro completo para gestão de empresas. Controle de estoque, emissão de notas fiscais, gestão financeira e muito mais em uma plataforma nacional.",
    shortDescription: "Sistema brasileiro de gestão empresarial (ERP) para pequenas e médias empresas",
    logo: "📊", 
    website: "https://bling.com.br",
    category: "Gestão Empresarial",
    categorySlug: "produtividade",
    rating: 4.6,
    reviewCount: 8000,
    userCount: "150K+",
    foundedYear: "2009",
    location: "São Paulo, BR",
    features: [
      "Controle de estoque",
      "Emissão de notas fiscais",
      "Gestão financeira", 
      "CRM integrado",
      "Relatórios gerenciais",
      "Integração com marketplaces",
      "App mobile",
      "Backup automático"
    ],
    pricing: [
      {
        name: "Básico",
        price: "R$ 29/mês",
        description: "Para micro empresas",
        features: ["1 usuário", "NFe ilimitadas", "Controle básico", "Suporte chat"]
      },
      {
        name: "Essencial",
        price: "R$ 59/mês",
        description: "Para pequenas empresas", 
        features: ["3 usuários", "Tudo do Básico", "CRM", "Relatórios", "Integrações"],
        highlighted: true
      },
      {
        name: "Premium", 
        price: "R$ 149/mês",
        description: "Para médias empresas",
        features: ["10 usuários", "Tudo do Essencial", "API", "Suporte phone", "Customizações"]
      }
    ],
    isFeatured: true,
    tags: ["ERP", "NFe", "Estoque", "Financeiro"],
    alternatives: ["omie", "contaazul"],
    reviews: [
      {
        id: "3",
        author: "Carlos Mendes", 
        role: "Loja de Roupas",
        rating: 5,
        comment: "Revolucionou nossa gestão! Interface simples e todas as funcionalidades que precisamos para o dia a dia.",
        date: "2024-01-12"
      },
      {
        id: "4",
        author: "Ana Costa",
        role: "E-commerce", 
        rating: 5,
        comment: "Excelente para quem vende online. Integração perfeita com Mercado Livre e outros marketplaces.",
        date: "2024-01-08"
      }
    ]
  },
  {
    id: "rd-station",
    slug: "rd-station",
    name: "RD Station",
    description: "Plataforma de automação de marketing e vendas feita no Brasil",
    shortDescription: "Automação de marketing digital brasileira",
    logo: "🚀",
    website: "https://rdstation.com",
    category: "Marketing Digital",
    categorySlug: "marketing",
    rating: 4.7,
    reviewCount: 5000,
    userCount: "25K+",
    foundedYear: "2011", 
    location: "Florianópolis, BR",
    features: [
      "Email marketing",
      "Landing pages",
      "Lead scoring",
      "Automação de marketing",
      "CRM integrado",
      "Relatórios avançados"
    ],
    pricing: [
      {
        name: "Light",
        price: "R$ 69/mês",
        description: "Para começar",
        features: ["500 contatos", "Email marketing", "Landing pages"]
      },
      {
        name: "Pro",
        price: "R$ 189/mês", 
        description: "Para crescer",
        features: ["2500 contatos", "Tudo do Light", "Automação", "Lead scoring"],
        highlighted: true
      }
    ],
    isFeatured: true,
    tags: ["Automação", "Email Marketing", "CRM", "Lead Generation"],
    alternatives: ["leadlovers", "mailchimp-br"]
  }
];

// Função para buscar categoria por slug
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(cat => cat.slug === slug);
};

// Função para buscar produto por slug  
export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

// Função para buscar produtos por categoria
export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter(product => product.categorySlug === categorySlug);
};

// Função para buscar categoria com produtos
export const getCategoryWithProducts = (slug: string): CategoryWithProducts | undefined => {
  const category = getCategoryBySlug(slug);
  if (!category) return undefined;
  
  const categoryProducts = getProductsByCategory(slug);
  
  return {
    ...category,
    products: categoryProducts
  };
};

// Função para buscar produtos relacionados/alternativos
export const getRelatedProducts = (productId: string): Product[] => {
  const product = products.find(p => p.id === productId);
  if (!product?.alternatives) return [];
  
  return products.filter(p => product.alternatives?.includes(p.id));
};
