import { Product } from '@/types';

/**
 * Utilitários para trabalhar com produtos
 */

// Verifica se é um produto brasileiro
export function isBrazilianProduct(product: Product): boolean {
  return product.location?.countryCode === 'BR';
}

// Obter flag do país
export function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    'BR': '🇧🇷',
    'US': '🇺🇸', 
    'GB': '🇬🇧',
    'CA': '🇨🇦',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'AU': '🇦🇺',
    'NL': '🇳🇱',
    'ES': '🇪🇸',
    'IT': '🇮🇹',
    'JP': '🇯🇵',
    'KR': '🇰🇷',
    'CN': '🇨🇳',
    'IN': '🇮🇳',
    'SG': '🇸🇬'
  };
  
  return flags[countryCode] || '🌍';
}

// Formatar preço
export function formatPrice(pricing: Product['pricing']): string {
  if (!pricing) return 'Grátis';
  
  switch (pricing.type) {
    case 'free':
      return 'Grátis';
    case 'freemium':
      return 'Freemium';
    case 'paid':
      if (pricing.startingPrice) {
        return `A partir de ${pricing.currency} ${pricing.startingPrice}`;
      }
      return 'Pago';
    case 'enterprise':
      return 'Enterprise';
    default:
      return pricing.description || 'N/A';
  }
}

// Formatar tamanho da empresa
export function formatCompanySize(size?: string): string {
  const sizes: Record<string, string> = {
    'startup': 'Startup',
    'small': 'Pequena',
    'medium': 'Média',
    'large': 'Grande',
    'enterprise': 'Enterprise'
  };
  
  return sizes[size || ''] || size || 'N/A';
}

// Obter nome da empresa
export function getCompanyName(product: Product): string {
  return product.companyInfo?.name || product.name;
}

// Obter ano de fundação formatado
export function getFoundedYear(product: Product): string {
  const year = product.companyInfo?.foundedYear;
  return year ? year.toString() : 'N/A';
}

// Verificar se tem logo válida
export function hasValidLogo(logo?: string): boolean {
  if (!logo) return false;
  return logo.startsWith('http') || logo.length <= 4; // URL ou emoji
}

// Obter localização formatada
export function getFormattedLocation(product: Product): string {
  const location = product.location;
  if (!location) return 'N/A';
  
  const parts = [location.city, location.state, location.country].filter(Boolean);
  return parts.join(', ');
}

// Verificar se é unicórnio brasileiro
export function isBrazilianUnicorn(product: Product): boolean {
  return isBrazilianProduct(product) && !!product.isUnicorn;
}

// Obter badges do produto
export function getProductBadges(product: Product): Array<{
  label: string;
  color: string;
  icon?: string;
}> {
  const badges = [];
  
  if (isBrazilianProduct(product)) {
    badges.push({
      label: 'Brasileiro',
      color: 'bg-green-100 text-green-800',
      icon: '🇧🇷'
    });
  }
  
  if (product.isUnicorn) {
    badges.push({
      label: 'Unicórnio',
      color: 'bg-purple-100 text-purple-800',
      icon: '🦄'
    });
  }
  
  if (product.isFeatured) {
    badges.push({
      label: 'Destaque',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '⭐'
    });
  }
  
  if (product.pricing?.type === 'free') {
    badges.push({
      label: 'Grátis',
      color: 'bg-blue-100 text-blue-800',
      icon: '🆓'
    });
  }
  
  return badges;
}

// Validar dados obrigatórios do produto
export function validateProductData(product: Partial<Product>): string[] {
  const errors = [];
  
  if (!product.name?.trim()) {
    errors.push('Nome é obrigatório');
  }
  
  if (!product.description?.trim()) {
    errors.push('Descrição é obrigatória');
  }
  
  if (!product.website?.trim()) {
    errors.push('Website é obrigatório');
  }
  
  if (!product.categoryId?.trim()) {
    errors.push('Categoria é obrigatória');
  }
  
  if (!product.location?.country?.trim()) {
    errors.push('País é obrigatório');
  }
  
  if (!product.location?.countryCode?.trim()) {
    errors.push('Código do país é obrigatório');
  }
  
  return errors;
}

// Gerar slug a partir do nome
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplos
    .slice(0, 50); // Limita tamanho
}