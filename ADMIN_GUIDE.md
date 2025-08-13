# Guia de Administração - Alternativas BR

## 1. Como se tornar administrador

### Opção 1: Script via Console do Navegador

1. **Faça login** na aplicação normalmente
2. **Abra o console** do navegador (F12 → Console)
3. **Execute o seguinte código**:

```javascript
// Primeiro, vamos buscar seu user ID
import { auth } from './src/lib/firebase';
console.log('Seu User ID:', auth.currentUser?.uid);

// Depois, use esse ID para se promover
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase';

async function promoteToAdmin(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: 'admin' });
    console.log('✅ Promovido a administrador!');
    window.location.reload(); // Recarrega a página
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Execute com seu User ID
promoteToAdmin('SEU_USER_ID_AQUI');
```

### Opção 2: Direto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Vá para o projeto `alternativas-br`
3. Firestore Database → `users` collection
4. Encontre seu documento de usuário
5. Edite o campo `role` para `'admin'`
6. Salve as alterações

### Opção 3: Via Script Node.js (Para desenvolvimento)

Crie um arquivo `promote-admin.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Suas configurações Firebase aqui
const firebaseConfig = {
  // ... config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function promoteUser(userId) {
  try {
    await updateDoc(doc(db, 'users', userId), { role: 'admin' });
    console.log('✅ Usuário promovido a admin!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Execute: node promote-admin.js
promoteUser('USER_ID_AQUI');
```

## 2. Funcionalidades do Painel Admin

### Dashboard Principal (`/admin`)
- **Estatísticas gerais**: Produtos, categorias, usuários, avaliações
- **Ações rápidas**: Links para principais funcionalidades
- **Analytics**: Visão geral de métricas da plataforma

### Gerenciar Categorias (`/admin/categorias`)
- ✅ **Criar** novas categorias
- ✅ **Editar** categorias existentes
- ✅ **Ativar/Desativar** categorias
- ✅ **Deletar** categorias (apenas se não tiver produtos)
- ✅ **Gerar slugs** automaticamente
- ✅ **Configurar SEO** (meta title, description)
- ✅ **Adicionar ícones** e cores personalizadas

### Gerenciar Produtos (`/admin/produtos`)
- ✅ **Criar** novos produtos
- ✅ **Editar** produtos existentes
- ✅ **Ativar/Desativar** produtos
- ✅ **Destacar** produtos
- ✅ **Deletar** produtos
- ✅ **Filtrar** por categoria, status
- ✅ **Buscar** produtos por nome/descrição
- ✅ **Visualizar** estatísticas de cada produto

### Adicionar/Editar Produto (`/admin/produtos/novo` | `/admin/produtos/:id/editar`)
- ✅ **Informações básicas**: Nome, descrição, website, logo
- ✅ **Categorização**: Selecionar categoria
- ✅ **Funcionalidades**: Lista de features do produto
- ✅ **Tags**: Palavras-chave para SEO e busca
- ✅ **Preços**: Modelo de negócio (free, freemium, paid, enterprise)
- ✅ **Empresa**: Informações da empresa desenvolvedora
- ✅ **Configurações**: Status ativo/inativo, destaque

## 3. Estrutura de Dados

### Usuários (Collection: `users`)
```typescript
{
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'moderator' | 'admin'; // ← Importante!
  createdAt: Timestamp;
  // ... outros campos
}
```

### Categorias (Collection: `categories`)
```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  productCount: number;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Produtos (Collection: `products`)
```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  website: string;
  logo: string;
  category: string;
  categoryId: string;
  features: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  views: number;
  pricing: {
    type: 'free' | 'freemium' | 'paid' | 'enterprise';
    startingPrice?: number;
    currency: string;
    description: string;
  };
  companyInfo: {
    name: string;
    foundedYear?: number;
    headquarters: string;
    website?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 4. Permissões e Segurança

### Roles de Usuário
- **`user`**: Usuário normal (pode avaliar produtos)
- **`moderator`**: Moderador (pode moderar avaliações)
- **`admin`**: Administrador (acesso completo ao painel admin)

### Proteção de Rotas
- Todas as rotas `/admin/*` são protegidas
- Verificação automática do role `admin`
- Redirecionamento para home se não autorizado

### Validações
- ✅ Slugs únicos para categorias e produtos
- ✅ Não deletar categorias com produtos
- ✅ Validação de campos obrigatórios
- ✅ Tratamento de erros Firebase
- ✅ Feedback visual (toasts) para todas as ações

## 5. Próximas Funcionalidades Admin

### Recém Implementado
- ✅ **Sistema de Tags Avançado**: Tags categorizadas com ícones e tooltips
- ✅ **Filtros Avançados**: Filtros por origem, sustentabilidade, conformidade
- ✅ **Comparação Visual**: Comparação lado a lado com especificações técnicas
- ✅ **Página Explorar**: Interface inspirada em European Alternatives
- ✅ **Moderar Avaliações**: Aprovar/reprovar reviews
- ✅ **Gerenciar Usuários**: Promover/rebaixar usuários
- ✅ **Analytics Avançado**: Gráficos e métricas detalhadas
- ✅ **Configurações Sistema**: SEO global, integrações

### Em Desenvolvimento
- 🔄 **Importar/Exportar**: Dados em massa
- 🔄 **Sistema de Badges**: Certificações e selos de qualidade
- 🔄 **Métricas de Impacto**: Jobs criados, diversidade, impacto social
- 🔄 **API Pública**: Endpoints para integrações

### Planejado
- 🔲 **Logs de Auditoria**: Histórico de ações admin
- 🔲 **Backup Automático**: Backup periódico dos dados
- 🔲 **Notificações**: Sistema de alertas admin
- 🔲 **API Admin**: Endpoints para automação

## 6. Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Servidor desenvolvimento
npm run build        # Build de produção
npm run lint         # Verificar código
```

### Firebase
```bash
# Se você tiver Firebase CLI instalado
firebase login
firebase use alternativas-br
firebase firestore:export backup/
```

### Debugging
```javascript
// Console do navegador - Ver dados atuais
console.log('Usuário atual:', JSON.stringify(user, null, 2));
console.log('Role:', user?.role);

// Verificar conexão Firebase
import { db } from './src/lib/firebase';
console.log('Firebase DB:', db);
```

---

## 🚨 IMPORTANTE

1. **Backup**: Sempre faça backup antes de mudanças importantes
2. **Testes**: Teste funcionalidades em ambiente de desenvolvimento
3. **Permissões**: Seja cuidadoso ao promover usuários a admin
4. **Dados**: Não delete categorias ou produtos sem confirmar

---

Feito com ❤️ para fortalecer a tecnologia brasileira 🇧🇷
