/**
 * Script de migração para unificar produtos nacionais e estrangeiros
 * 
 * Este script:
 * 1. Lê produtos das collections separadas (products e foreign_products)
 * 2. Converte para a nova estrutura unificada
 * 3. Salva na collection 'products' unificada
 * 4. Remove as collections antigas (opcional)
 */

import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
  doc as docRef,
  query,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, ProductLocation, CompanyInfo, PricingInfo } from '../types';

interface LegacyProduct {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  slug?: string;
  logo?: string;
  pricingModel?: string;
  substitutes?: string[];
  cons?: string[];
  features?: string[];
  pros?: string[];
  rating?: number;
  screenshots?: string[];
  tags?: string[];
  website?: string;
  isFeatured?: boolean;
  downloads?: number;
  createdAt?: Date;
  updatedAt?: Date;
  // Campos do productService atual
  shortDescription?: string;
  userCount?: string;
  foundedYear?: string;
  location?: string; // String antiga
  pricing?: unknown; // Estrutura antiga
  categorySlug?: string;
  categoryId?: string;
  isUnicorn?: boolean;
  isActive?: boolean;
  alternatives?: string[];
  metaTitle?: string;
  metaDescription?: string;
  views?: number;
}

class UnifiedStructureMigration {
  
  async migrate() {
    console.log('🚀 Iniciando migração para estrutura unificada...');
    
    try {
      // 1. Buscar produtos das collections antigas
      const nationalProducts = await this.getLegacyProducts('products');
      const foreignProducts = await this.getLegacyProducts('foreign_products');
      
      console.log(`📊 Encontrados ${nationalProducts.length} produtos nacionais e ${foreignProducts.length} produtos estrangeiros`);
      
      // 2. Converter para nova estrutura
      const convertedNational = nationalProducts.map(p => this.convertToNewStructure(p, true));
      const convertedForeign = foreignProducts.map(p => this.convertToNewStructure(p, false));
      
      const allProducts = [...convertedNational, ...convertedForeign];
      
      console.log(`✅ Convertidos ${allProducts.length} produtos para nova estrutura`);
      
      // 3. Salvar na collection unificada
      await this.saveUnifiedProducts(allProducts);
      
      console.log('🎉 Migração concluída com sucesso!');
      
      // 4. Relatório final
      this.generateReport(nationalProducts.length, foreignProducts.length, allProducts.length);
      
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      throw error;
    }
  }
  
  private async getLegacyProducts(collectionName: string): Promise<LegacyProduct[]> {
    try {
      console.log(`📖 Lendo produtos de ${collectionName}...`);
      const snapshot = await getDocs(collection(db, collectionName));
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LegacyProduct[];
    } catch (error) {
      console.warn(`⚠️ Erro ao ler ${collectionName}:`, error);
      return [];
    }
  }
  
  private convertToNewStructure(legacy: LegacyProduct, isBrazilian: boolean): Omit<Product, 'id'> {
    // Converter localização
    const location: ProductLocation = {
      country: isBrazilian ? 'Brasil' : this.extractCountryFromLocation(legacy.location),
      countryCode: isBrazilian ? 'BR' : this.extractCountryCode(legacy.location),
      state: legacy.location && isBrazilian ? this.extractState(legacy.location) : undefined,
      city: legacy.location && isBrazilian ? this.extractCity(legacy.location) : undefined,
      flag: isBrazilian ? '🇧🇷' : '🌍'
    };
    
    // Converter informações da empresa
    const companyInfo: CompanyInfo = {
      name: legacy.name,
      foundedYear: legacy.foundedYear ? parseInt(legacy.foundedYear) : undefined,
      headquarters: location.country,
      size: this.inferCompanySize(legacy),
      website: legacy.website
    };
    
    // Converter preços
    const pricing: PricingInfo = {
      type: this.convertPricingType(legacy),
      startingPrice: legacy.price,
      currency: isBrazilian ? 'BRL' : 'USD',
      description: legacy.pricingModel || this.generatePricingDescription(legacy)
    };
    
    return {
      name: legacy.name,
      slug: legacy.slug || this.generateSlug(legacy.name),
      description: legacy.description || '',
      shortDescription: legacy.shortDescription || this.generateShortDescription(legacy.description),
      logo: legacy.logo || '',
      website: legacy.website || '',
      category: legacy.category || 'outros',
      categorySlug: legacy.categorySlug || legacy.category || 'outros',
      categoryId: legacy.categoryId || 'default-category-id',
      location,
      companyInfo,
      pricing,
      features: legacy.features || [],
      tags: legacy.tags || [],
      screenshots: legacy.screenshots || [],
      isActive: legacy.isActive !== false, // Default true
      isFeatured: legacy.isFeatured || false,
      isUnicorn: legacy.isUnicorn || false,
      metaTitle: legacy.metaTitle,
      metaDescription: legacy.metaDescription,
      alternatives: legacy.alternatives || legacy.substitutes || [],
      views: legacy.views || legacy.downloads || 0,
      userCount: legacy.userCount,
      createdAt: legacy.createdAt ? Timestamp.fromDate(legacy.createdAt) : Timestamp.now(),
      updatedAt: legacy.updatedAt ? Timestamp.fromDate(legacy.updatedAt) : Timestamp.now()
    };
  }
  
  private async saveUnifiedProducts(products: Omit<Product, 'id'>[]): Promise<void> {
    console.log('💾 Salvando produtos na collection unificada...');
    
    const batch = writeBatch(db);
    const unifiedCollection = collection(db, 'products_unified'); // Nova collection
    
    for (const product of products) {
      const newDocRef = docRef(unifiedCollection);
      batch.set(newDocRef, product);
    }
    
    await batch.commit();
    console.log(`✅ Salvos ${products.length} produtos na collection unificada`);
  }
  
  private extractCountryFromLocation(location?: string): string {
    if (!location) return 'Desconhecido';
    
    // Tentar extrair país da string de localização
    const parts = location.split(',').map(p => p.trim());
    return parts[parts.length - 1] || 'Desconhecido';
  }
  
  private extractCountryCode(location?: string): string {
    if (!location) return 'XX';
    
    const countryMappings: Record<string, string> = {
      'Estados Unidos': 'US',
      'United States': 'US',
      'USA': 'US',
      'Reino Unido': 'GB',
      'United Kingdom': 'GB',
      'UK': 'GB',
      'Canadá': 'CA',
      'Canada': 'CA',
      'Alemanha': 'DE',
      'Germany': 'DE',
      'França': 'FR',
      'France': 'FR',
      'Austrália': 'AU',
      'Australia': 'AU',
      'Holanda': 'NL',
      'Netherlands': 'NL',
      'Espanha': 'ES',
      'Spain': 'ES',
      'Itália': 'IT',
      'Italy': 'IT'
    };
    
    const country = this.extractCountryFromLocation(location);
    return countryMappings[country] || 'XX';
  }
  
  private extractState(location?: string): string | undefined {
    if (!location || !location.includes(',')) return undefined;
    
    const parts = location.split(',').map(p => p.trim());
    return parts.length >= 2 ? parts[parts.length - 2] : undefined;
  }
  
  private extractCity(location?: string): string | undefined {
    if (!location || !location.includes(',')) return undefined;
    
    const parts = location.split(',').map(p => p.trim());
    return parts.length >= 3 ? parts[0] : undefined;
  }
  
  private inferCompanySize(legacy: LegacyProduct): CompanyInfo['size'] {
    // Inferir tamanho baseado em indicadores
    if (legacy.downloads && legacy.downloads > 1000000) return 'large';
    if (legacy.isUnicorn) return 'large';
    if (legacy.foundedYear && parseInt(legacy.foundedYear) < 2010) return 'medium';
    return 'startup';
  }
  
  private convertPricingType(legacy: LegacyProduct): PricingInfo['type'] {
    if (legacy.price === 0 || legacy.pricingModel?.toLowerCase().includes('free')) return 'free';
    if (legacy.pricingModel?.toLowerCase().includes('freemium')) return 'freemium';
    if (legacy.pricingModel?.toLowerCase().includes('enterprise')) return 'enterprise';
    if (legacy.price && legacy.price > 0) return 'paid';
    return 'free';
  }
  
  private generatePricingDescription(legacy: LegacyProduct): string {
    if (legacy.price === 0) return 'Produto gratuito';
    if (legacy.price && legacy.price > 0) return `A partir de ${legacy.price}`;
    return 'Consulte o site para preços';
  }
  
  private generateShortDescription(description?: string): string {
    if (!description) return '';
    return description.length > 150 ? description.substring(0, 147) + '...' : description;
  }
  
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  
  private generateReport(nationalCount: number, foreignCount: number, totalMigrated: number): void {
    console.log('\n📋 RELATÓRIO DE MIGRAÇÃO');
    console.log('========================');
    console.log(`🇧🇷 Produtos brasileiros: ${nationalCount}`);
    console.log(`🌍 Produtos estrangeiros: ${foreignCount}`);
    console.log(`📦 Total migrado: ${totalMigrated}`);
    console.log(`✅ Taxa de sucesso: ${((totalMigrated / (nationalCount + foreignCount)) * 100).toFixed(1)}%`);
    console.log('\n🎯 Próximos passos:');
    console.log('1. Verificar dados migrados na collection "products_unified"');
    console.log('2. Testar aplicação com nova estrutura');
    console.log('3. Renomear "products_unified" para "products" quando confirmado');
    console.log('4. Remover collections antigas ("products" e "foreign_products")');
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  const migration = new UnifiedStructureMigration();
  migration.migrate().catch(console.error);
}

export { UnifiedStructureMigration };