# Alternativas BR 🇧🇷

## 🌟 Principais Funcionalidades

- 📊 **Catálogo Curado**: Produtos brasileiros organizados em categorias
- 🔍 **Sistema de Busca**: Encontre alternativas por categoria ou funcionalidade
- 🎯 **Recomendações Inteligentes**: Sugestões de produtos relacionados
- 🛠️ **Painel Administrativo**: Gerenciamento de produtos e categorias (acesso restrito ao admin)

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (apenas para admin)
- **Deployment**: Vercel / Netlify

## ⚙️ Instalação e Execução

```bash
# 1. Clone o repositório

cd alternativas-br

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Firebase

# 4. Execute o servidor de desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```text
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base do design system
│   ├── layout/         # Header, Footer, Layout
│   ├── sections/       # Seções específicas da página
├── pages/              # Páginas da aplicação
│   ├── admin/          # Painel administrativo
│   ├── categorias/     # Páginas de categorias
│   └── produtos/       # Páginas de produtos
├── hooks/              # Custom hooks
├── lib/                # Utilitários e helpers
│   ├── services/       # Firebase services
│   ├── firebase.ts     # Firebase config
│   └── utils.ts        # Utilitários gerais
├── types/              # Definições TypeScript
└── assets/             # Imagens e recursos estáticos
```

## 🛠️ Painel Administrativo

- Dashboard para administradores
- Gerenciamento de produtos e categorias

## 🤝 Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: nova feature'`)
4. **Push** para a branch (`git push origin feature/NovaFeature`)
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <strong>Feito com ❤️ para fortalecer a tecnologia brasileira 🇧🇷</strong>
</div>
