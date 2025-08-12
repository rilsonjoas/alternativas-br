# Alternativas BR 🇧🇷

> Descubra as melhores alternativas brasileiras de software e serviços tecnológicos

Uma plataforma curada para descobrir softwares e serviços nacionais que rivalizam com as melhores ferramentas internacionais. Nosso objetivo é fortalecer o ecossistema tecnológico brasileiro, conectando usuários com soluções desenvolvidas no país.

## 🎯 Visão Geral

**Alternativas BR** é uma plataforma web que centraliza e categoriza produtos tecnológicos brasileiros, oferecendo uma alternativa nacional para ferramentas e serviços populares do mercado global. A plataforma permite descobrir, avaliar e comparar soluções desenvolvidas no Brasil.

### 🌟 Principais Funcionalidades

- 📊 **Catálogo Curado**: Mais de 200 produtos brasileiros organizados em 15 categorias
- 🔍 **Sistema de Busca**: Encontre alternativas por categoria, funcionalidade ou popularidade
- ⭐ **Rankings**: Produtos mais populares e bem avaliados da comunidade
- 📝 **Avaliações**: Sistema de reviews e comentários da comunidade
- ➕ **Contribuição**: Usuários podem adicionar novos produtos e sugestões

## 🚀 Tecnologias

Este projeto utiliza tecnologias modernas para garantir performance e escalabilidade:

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **Database**: Firebase Firestore
- **Package Manager**: NPM
- **Deployment**: Vercel / Netlify

## 📋 Pré-requisitos

- **Node.js** 18+ - [Download](https://nodejs.org/)
- **NPM** (incluído com Node.js)
- **Git**

## ⚙️ Instalação e Execução

### 🔧 Configuração Local

```bash
# 1. Clone o repositório
git clone https://github.com/rilsonjoas/alternativas-br.git
cd alternativas-br

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Firebase

# 4. Execute o servidor de desenvolvimento
npm run dev
```

### 📜 Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento (localhost:8080)
npm run build      # Build de produção
npm run preview    # Preview do build de produção
npm run lint       # Verificação de código com ESLint
npm run migrate    # Migrar dados para Firebase
```

## 🗺️ Roadmap de Desenvolvimento

### 📱 Fase 1: MVP - Interface e Navegação
**Status: 🟢 Concluído**

- [x] Interface responsiva com design system
- [x] Páginas principais (Home, Categorias, Sobre)
- [x] Sistema de roteamento
- [x] Componentes base (Header, Footer, Cards)

### 🗄️ Fase 2: Backend e Dados
**Status: � Concluído**

- [x] **Banco de Dados**
  - [x] Firebase Firestore configurado
  - [x] Modelagem de dados (produtos, categorias)
  - [x] Migração de dados mock para Firebase

- [x] **Integração Firebase**
  - [x] Services layer para CRUD operations
  - [x] React Query hooks para cache e estado
  - [x] Sistema híbrido com fallback para dados locais

### 🔄 Fase 2.1: Completar Integração Firebase
**Status: 🟡 Em Desenvolvimento**

- [ ] **Componentes Restantes**
  - [ ] Atualizar `Categories.tsx` para usar Firebase
  - [ ] Atualizar páginas de categoria individual
  - [ ] Atualizar páginas de produto individual
  - [ ] Sistema de busca com Firebase

- [ ] **Otimizações**
  - [ ] Loading states e error handling
  - [ ] Cache optimization
  - [ ] Performance monitoring

### 👤 Fase 3: Sistema de Usuários
**Status: 🔴 Planejado**

- [ ] **Autenticação**
  - [ ] Firebase Authentication
  - [ ] Login/registro de usuários
  - [ ] Autenticação via GitHub/Google
  - [ ] Perfis de usuário

- [ ] **Permissões**
  - [ ] Sistema de roles (admin, moderador, usuário)
  - [ ] Moderação de conteúdo
  - [ ] Dashboard administrativo

### ⭐ Fase 4: Sistema de Avaliações
**Status: 🔴 Planejado**

- [ ] **Reviews e Ratings**
  - [ ] Sistema de avaliações (1-5 estrelas)
  - [ ] Comentários e reviews detalhados
  - [ ] Likes/dislikes em reviews

- [ ] **Rankings e Métricas**
  - [ ] Algoritmo de ranking por popularidade
  - [ ] Métricas de engagement
  - [ ] Trending products

### 🔍 Fase 5: Busca e Descoberta
**Status: 🔴 Planejado**

- [ ] **Sistema de Busca Avançado**
  - [ ] Busca full-text no Firestore
  - [ ] Filtros avançados (preço, categoria, rating)
  - [ ] Sugestões e autocompletar

- [ ] **Recomendações**
  - [ ] Sistema de recomendações
  - [ ] "Produtos relacionados"
  - [ ] Comparação lado a lado

### 📊 Fase 6: Analytics e Otimização
**Status: 🔴 Planejado**

- [ ] **Analytics**
  - [ ] Google Analytics / Plausible
  - [ ] Firebase Analytics
  - [ ] Métricas de uso interno
  - [ ] Dashboard de estatísticas

- [ ] **SEO e Performance**
  - [ ] Otimização SEO
  - [ ] Meta tags dinâmicas
  - [ ] Sitemap automático
  - [ ] Performance optimization

### 🌟 Fase 7: Funcionalidades Avançadas
**Status: 🔴 Futuro**

- [ ] **API Pública**
  - [ ] API REST documentada
  - [ ] Rate limiting
  - [ ] Chaves de API

- [ ] **Integrações**
  - [ ] Widget para embedding
  - [ ] Integração com redes sociais
  - [ ] Newsletter e notificações

## 🎨 Design System

O projeto utiliza um design system customizado baseado em:

- **Paleta de Cores**: Tons de azul e verde representando o Brasil
- **Tipografia**: Font stack otimizada para legibilidade
- **Componentes**: shadcn/ui com customizações temáticas
- **Responsividade**: Mobile-first design

## 🎯 Próximas Etapas - Fase 2.1

### **Em Desenvolvimento Agora:**

1. **Completar Integração Firebase** �
   - ✅ Firebase Firestore configurado e funcionando
   - ✅ Dados migrados (6 categorias, 6 produtos)
   - ✅ Componente `FeaturedAlternatives.tsx` atualizado
   - 🔄 Próximo: Atualizar `Categories.tsx` para usar Firebase
   - 🔄 Próximo: Atualizar páginas de categoria e produto

2. **Melhorar UX** ⚡
   - 🔄 Loading states mais elegantes
   - 🔄 Error handling robusto
   - 🔄 Cache optimization com React Query

3. **Sistema de Busca** 🔍
   - 🔄 Implementar busca no Firebase
   - 🔄 Filtros por categoria
   - 🔄 Autocomplete de produtos

### **Como Acompanhar o Progresso:**

- 📊 **Firebase Console**: [Ver dados em tempo real](https://console.firebase.google.com/project/alternativas-br/firestore)
- 🖥️ **Local**: `npm run dev` → `http://localhost:3000`
- 📁 **Estrutura**: Ver `src/lib/services/` para lógica Firebase

### **Para Desenvolvedores:**

```bash
# Configurar projeto
npm install
cp .env.example .env.local  # Configure suas credenciais Firebase
npm run migrate            # Migrar dados para Firebase
npm run dev               # Rodar localmente

# Próximos PRs esperados:
# 1. feat: update Categories component to use Firebase
# 2. feat: add search functionality with Firebase
# 3. feat: improve loading states and error handling
```

## �📁 Estrutura do Projeto

```text
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base do design system
│   ├── layout/         # Header, Footer, Layout
│   └── sections/       # Seções específicas da página
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── lib/                # Utilitários e helpers
│   ├── services/       # 🔥 Firebase services (categoryService, productService)
│   ├── firebase.ts     # 🔥 Firebase config e inicialização
│   └── utils.ts        # Utilitários gerais
└── assets/             # Imagens e recursos estáticos
```

## 🤝 Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: amazing feature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 📝 Diretrizes de Contribuição

- Siga os padrões de código existentes
- Inclua testes quando aplicável
- Documente novas funcionalidades
- Use conventional commits

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔗 Links Úteis

- **Demo**: [alternativas-br.vercel.app](https://alternativas-br.vercel.app) (em breve)
- **Documentação**: [Ver FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/rilsonjoas/alternativas-br/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rilsonjoas/alternativas-br/discussions)

## 📞 Contato

- **Mantenedor**: [rilsonjoas](https://github.com/rilsonjoas)
- **Email**: [criar email de contato]
- **Website**: [alternativas-br.com.br] (em breve)

---

<div align="center">
  <strong>Feito com ❤️ para fortalecer a tecnologia brasileira 🇧🇷</strong>
</div>
