# 🔥 Firebase Setup - Alternativas BR

## 📋 **Checklist de Configuração**

### ✅ **1. Configurar Projeto Firebase**

1. **Acesse:** https://console.firebase.google.com
2. **Crie um projeto:**
   - Nome: `alternativas-br`
   - Analytics: Opcional
3. **Configure Firestore:**
   - Modo: "Test mode" (por enquanto)
   - Região: `nam5 (us-central)` ou mais próxima

### ✅ **2. Configurar Web App**

1. **No Firebase Console:**
   - Clique no ícone `</>` (Web)
   - Nome: `alternativas-br-web`
   - **NÃO** habilitar hosting ainda

2. **Copie as configurações** que aparecerem e cole no arquivo `.env.local`:

```bash
VITE_FIREBASE_API_KEY=sua-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcd1234
```

### ✅ **3. Migrar Dados Existentes**

```bash
# Execute o script de migração
npm run migrate
```

### ✅ **4. Testar Aplicação**

```bash
# Iniciar servidor de desenvolvimento
npm run dev
```

## 🚀 **Componentes Atualizados para Firebase**

### **Hooks Disponíveis:**

```typescript
// Categorias
const { data: categories, isLoading } = useCategories();
const { data: category } = useCategoryBySlug('desenvolvimento');
const { data: featuredCategories } = useFeaturedCategories();

// Produtos
const { data: products } = useProducts();
const { data: product } = useProductBySlug('hotmart');
const { data: categoryProducts } = useProductsByCategory('desenvolvimento');
const { data: featuredProducts } = useFeaturedProducts(4);
const { data: unicorns } = useUnicornProducts();
const { data: related } = useRelatedProducts('desenvolvimento', 'product-id', 3);

// Busca
const { data: searchResults } = useProductSearch('gestão');

// Página completa (categoria + produtos)
const { category, products, isLoading } = useCategoryPage('desenvolvimento');
```

### **Componentes Atualizados:**

- ✅ `FeaturedAlternatives.tsx` - Usa Firebase com fallback local
- 🔄 `Categories.tsx` - Próximo a atualizar
- 🔄 `CategoryTemplate.tsx` - Próximo a atualizar
- 🔄 `ProductTemplate.tsx` - Próximo a atualizar

## 🔧 **Scripts Disponíveis**

```bash
# Migrar dados para Firebase
npm run migrate

# Executar aplicação
npm run dev

# Build para produção
npm run build
```

## 🚨 **Regras de Segurança Firestore**

Para produção, configure estas regras no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Categorias - leitura pública
    match /categories/{document} {
      allow read: if true;
      allow write: if false; // Apenas admin
    }
    
    // Produtos - leitura pública
    match /products/{document} {
      allow read: if true;
      allow write: if false; // Apenas admin
    }
    
    // Reviews - leitura pública, escrita autenticada
    match /reviews/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📊 **Estrutura do Banco**

```
📁 categories/
  📄 categoria-id-1
    - title: string
    - slug: string
    - description: string
    - icon: string
    - color: string
    - featured: boolean
    - productCount: number
    - createdAt: timestamp
    - updatedAt: timestamp

📁 products/
  📄 produto-id-1
    - name: string
    - slug: string
    - categoryId: string (reference)
    - categorySlug: string
    - shortDescription: string
    - description: string
    - logo: string
    - website: string
    - rating: number
    - reviewCount: number
    - userCount: string
    - foundedYear: string
    - location: string
    - features: array
    - pricing: array
    - tags: array
    - isUnicorn: boolean
    - isFeatured: boolean
    - createdAt: timestamp
    - updatedAt: timestamp
```

## 🛡️ **Melhores Práticas**

1. **Cache Local:** Os hooks já implementam cache com React Query
2. **Fallback:** Componentes têm fallback para dados locais
3. **Loading States:** Todos os hooks retornam `isLoading`
4. **Error Handling:** Tratamento de erro em todos os serviços
5. **TypeScript:** Tipagem completa para todos os dados

## 🔄 **Próximos Passos**

1. **Configurar Firebase** com suas credenciais
2. **Executar migração** dos dados
3. **Atualizar componentes** restantes para usar Firebase
4. **Implementar admin panel** para gerenciar conteúdo
5. **Configurar regras de segurança** para produção
6. **Deploy** usando Firebase Hosting (opcional)

## 🐛 **Troubleshooting**

### Erro de CORS
- Verifique se o domínio está autorizado no Firebase Console
- Para desenvolvimento local, use `localhost:8080`

### Dados não aparecem
- Verifique as variáveis de ambiente no `.env.local`
- Execute o script de migração
- Veja o console do navegador para erros

### Build falha
- Certifique-se que todas as variáveis estão definidas
- Use `VITE_` como prefixo nas variáveis de ambiente

---

🎉 **Firebase configurado com sucesso!** Agora você tem um banco de dados real e escalável para o Alternativas BR!
