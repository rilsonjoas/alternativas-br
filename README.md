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
- **Package Manager**: Bun
- **Deployment**: Vercel / Netlify

## 📋 Pré-requisitos

- **Bun** (recomendado) - [Guia de instalação](https://bun.sh/docs/installation)
- **Node.js** 18+ (alternativo)
- **Git**

## ⚙️ Instalação e Execução

### 🔧 Configuração Local

```bash
# 1. Clone o repositório
git clone https://github.com/rilsonjoas/alternativas-br.git
cd alternativas-br

# 2. Configure o ambiente Bun (Windows)
./setup-bun.bat
# ou para Linux/macOS
./setup-bun.sh

# 3. Instale as dependências
bun install

# 4. Execute o servidor de desenvolvimento
bun run dev
```

### 📜 Scripts Disponíveis

```bash
bun run dev        # Servidor de desenvolvimento (localhost:8080)
bun run build      # Build de produção
bun run preview    # Preview do build de produção
bun run lint       # Verificação de código com ESLint
```

## 🗺️ Roadmap de Desenvolvimento

### 📱 Fase 1: MVP - Interface e Navegação
**Status: 🟢 Concluído**

- [x] Interface responsiva com design system
- [x] Páginas principais (Home, Categorias, Sobre)
- [x] Sistema de roteamento
- [x] Componentes base (Header, Footer, Cards)

### 🗄️ Fase 2: Backend e Dados
**Status: 🟡 Em Desenvolvimento**

- [ ] **Banco de Dados**
  - [ ] Modelagem de dados (produtos, categorias, avaliações)
  - [ ] Setup do banco de dados (Supabase/PostgreSQL)
  - [ ] Migrations e seeds iniciais

- [ ] **API Backend**
  - [ ] Endpoints para CRUD de produtos
  - [ ] Sistema de categorias
  - [ ] API de busca e filtros

### 👤 Fase 3: Sistema de Usuários
**Status: 🔴 Planejado**

- [ ] **Autenticação**
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
  - [ ] Busca full-text
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

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base do design system
│   ├── layout/         # Header, Footer, Layout
│   └── sections/       # Seções específicas da página
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── lib/                # Utilitários e helpers
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
- **Documentação**: [Ver BUN_SETUP.md](BUN_SETUP.md)
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
