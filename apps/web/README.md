# AlternativasBR 🇧🇷

![CI](https://github.com/rilsonjoas/alternativas-br/actions/workflows/ci.yml/badge.svg)

> **Descubra o melhor da tecnologia brasileira.** O AlternativasBR é uma plataforma dedicada a mapear, curar e promover soluções tecnológicas brasileiras de alta qualidade, oferecendo alternativas nacionais robustas para ferramentas internacionais consagradas.

---

## 🎯 Nossa Missão

Nossa missão é fortalecer o ecossistema tecnológico do Brasil. Acreditamos que a tecnologia nacional é capaz de competir em nível global, e queremos facilitar o acesso dessas soluções às empresas e desenvolvedores brasileiros. Ao escolher uma alternativa brasileira, você apoia a economia local, conta com suporte em português e garante conformidade com a legislação nacional (como a LGPD).

## 🌟 Principais Funcionalidades

- 📊 **Catálogo Curado**: Uma biblioteca organizada de softwares, frameworks e serviços desenvolvidos no Brasil.
- 🔄 **Alternativas Diretas**: Encontre facilmente qual ferramenta brasileira substitui aquele software internacional que você já conhece.
- ❤️ **Sistema de Curtidas**: Vote nos seus produtos favoritos e ajude a comunidade a descobrir as melhores soluções.
- 🔍 **Busca Inteligente**: Filtre por categoria, tag ou nome para encontrar exatamente o que você precisa.
- 📱 **Interface Premium**: Design moderno, rápido e totalmente responsivo para uma experiência impecável em qualquer dispositivo.
- 🛠️ **Painel Administrativo**: Gestão completa de produtos, métricas de engajamento e curadoria de conteúdo.

## 🚀 Tecnologias de Ponta

O projeto utiliza o que há de mais moderno no desenvolvimento web para garantir performance e escalabilidade:

- **Core**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) para código sólido e manutenível.
- **Build**: [Vite](https://vitejs.dev/) para um desenvolvimento veloz.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) para uma UI consistente e elegante.
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Auth) para dados em tempo real e segurança.
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) para gerenciamento de estado assíncrono.

## ⚙️ Instalação e Execução

Para rodar o projeto localmente:

```bash
# 1. Clone o repositório
git clone https://github.com/rilsonjoas/alternativas-br.git
cd alternativas-br

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Adicione suas chaves do Firebase em .env.local

# 4. Inicie o modo desenvolvimento
npm run dev
```

## 📁 Estrutura do Projeto

```text
src/
├── components/          # Componentes reutilizáveis e Design System
├── hooks/              # Lógica compartilhada e integração com Firebase
├── pages/              # Páginas da aplicação (Admin, Produtos, Categorias)
├── lib/                # Configurações de serviços e utilitários
├── types/              # Definições rígidas de TypeScript
└── assets/             # Recursos visuais estáticos
```

## 🤝 Como Contribuir

A tecnologia brasileira se fortalece através da comunidade. Se você conhece um produto nacional incrível que ainda não está aqui, ou quer melhorar nosso código:

1. Leia o nosso [Guia de Contribuição](CONTRIBUTING.md).
2. Explore as [Issues](https://github.com/rilsonjoas/alternativas-br/issues) abertas.
3. Envie sua sugestão ou correção através de um Pull Request.

---

## 📄 Licença

Este projeto é open-source e está sob a licença **MIT**. Sinta-se à vontade para usar, modificar e distribuir.

---

<div align="center">
  <p><strong>Feito com ❤️ por brasileiros para fortalecer a tecnologia brasileira 🇧🇷</strong></p>
  <p>
    <a href="https://alternativasbr.com.br">Site Oficial</a> • 
    <a href="mailto:aalternativabr@gmail.com">Contato</a>
  </p>
</div>
