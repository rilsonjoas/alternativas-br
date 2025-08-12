// Script para migrar dados do sistema local para Firebase
// Execute: npm run migrate

import { categoryService } from '@/lib/services/categoryService';
import { productService } from '@/lib/services/productService';
import { categories, products } from '@/data';

async function migrateCategories() {
  console.log('🔄 Migrando categorias...');
  
  try {
    for (const category of categories) {
      const { id, productCount, ...categoryData } = category;
      
      const categoryId = await categoryService.create({
        ...categoryData,
        productCount: 0 // Será atualizado depois
      });
      
      console.log(`✅ Categoria criada: ${category.title} (ID: ${categoryId})`);
    }
    
    console.log('✅ Todas as categorias migradas!');
  } catch (error) {
    console.error('❌ Erro ao migrar categorias:', error);
  }
}

async function migrateProducts() {
  console.log('🔄 Migrando produtos...');
  
  try {
    // Buscar categorias criadas para mapear IDs
    const firebaseCategories = await categoryService.getAll();
    const categoryMap = new Map(
      firebaseCategories.map(cat => [cat.slug, cat.id])
    );
    
    for (const product of products) {
      const { id, category, pricing, reviews, ...productData } = product;
      
      const categoryId = categoryMap.get(product.categorySlug);
      if (!categoryId) {
        console.warn(`⚠️ Categoria não encontrada para ${product.name}: ${product.categorySlug}`);
        continue;
      }
      
      const productId = await productService.create({
        ...productData,
        category: product.category,
        categoryId,
        pricing: product.pricing || [],
        reviews: product.reviews || []
      });
      
      console.log(`✅ Produto criado: ${product.name} (ID: ${productId})`);
    }
    
    console.log('✅ Todos os produtos migrados!');
  } catch (error) {
    console.error('❌ Erro ao migrar produtos:', error);
  }
}

async function updateCategoryProductCounts() {
  console.log('🔄 Atualizando contadores de produtos...');
  
  try {
    const firebaseCategories = await categoryService.getAll();
    
    for (const category of firebaseCategories) {
      const categoryProducts = await productService.getByCategory(category.slug);
      
      await categoryService.update(category.id, {
        productCount: categoryProducts.length
      });
      
      console.log(`✅ ${category.title}: ${categoryProducts.length} produtos`);
    }
    
    console.log('✅ Contadores atualizados!');
  } catch (error) {
    console.error('❌ Erro ao atualizar contadores:', error);
  }
}

async function migrateAll() {
  console.log('🚀 Iniciando migração completa para Firebase...\n');
  
  await migrateCategories();
  console.log('');
  
  await migrateProducts();
  console.log('');
  
  await updateCategoryProductCounts();
  console.log('');
  
  console.log('🎉 Migração concluída!');
  console.log('');
  console.log('📋 Próximos passos:');
  console.log('1. Configure as variáveis de ambiente do Firebase');
  console.log('2. Atualize os componentes para usar os hooks do Firebase');
  console.log('3. Teste as páginas para verificar se os dados aparecem');
}

// Executar migração se este arquivo for executado diretamente
if (import.meta.main) {
  migrateAll().catch(console.error);
}

export { migrateAll, migrateCategories, migrateProducts };
