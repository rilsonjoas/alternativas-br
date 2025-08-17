# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o **Alternativas BR**! Este guia fornece diretrizes para garantir que as contribuições sejam consistentes e de alta qualidade.

## 📋 Tipos de Contribuição

### 🐛 Reportar Bugs
- Use o template de issue para bugs
- Inclua passos para reproduzir o problema
- Adicione screenshots quando relevante
- Especifique seu ambiente (OS, browser, versão)

### 💡 Sugerir Funcionalidades
- Use o template de issue para feature requests
- Explique o problema que a funcionalidade resolve
- Descreva a solução proposta
- Considere alternativas

### 📝 Melhorar Documentação
- Correções de texto e gramática
- Esclarecimentos de instruções
- Adição de exemplos
- Tradução de conteúdo

### 💻 Contribuir com Código
- Novas funcionalidades
- Correção de bugs
- Otimizações de performance
- Melhorias de UX/UI

## 🚀 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USERNAME/alternativas-br.git
cd alternativas-br

# Adicione o repositório original como upstream
git remote add upstream https://github.com/rilsonjoas/alternativas-br.git
```

### 2. Configure o Ambiente

```bash
# Instale dependências
npm install

# Execute o projeto
npm run dev
```

### 3. Crie uma Branch

```bash
# Crie uma branch descritiva
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug
# ou
git checkout -b docs/atualizacao-readme
```

### 4. Desenvolva e Teste

```bash
# Faça suas alterações
# Execute os testes
npm run lint

# Teste a aplicação
npm run dev
npm run build
```

### 5. Commit e Push

```bash
# Adicione os arquivos modificados
git add .

# Commit seguindo conventional commits
git commit -m "feat: adiciona sistema de busca avançada"
# ou
git commit -m "fix: corrige layout responsivo no mobile"
# ou
git commit -m "docs: atualiza guia de instalação"

# Push para seu fork
git push origin feature/nova-funcionalidade
```

### 6. Abra um Pull Request

- Vá para o GitHub e abra um Pull Request
- Use o template fornecido
- Descreva suas alterações claramente
- Referencie issues relacionadas (#123)
- Aguarde o review

## 📝 Padrões de Código

### Conventional Commits

Use o padrão de conventional commits:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação, ponto e vírgula, etc
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Atualizações de build, dependências

### TypeScript e React

- Use TypeScript strict mode
- Componentes funcionais com hooks
- Props tipadas com interfaces
- ESLint configuration do projeto

### Estilização

- Use Tailwind CSS classes
- Siga o design system do shadcn/ui
- Mantenha responsividade (mobile-first)
- Use variáveis CSS customizadas

### Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/           # Componentes base
│   ├── layout/       # Layout components
│   └── sections/     # Seções específicas
├── pages/            # Páginas da aplicação
├── hooks/            # Custom hooks
├── lib/              # Utilitários
└── types/            # Definições de tipos
```

## 🧪 Testes

### Antes de Submeter

```bash
# Verificar lint
npm run lint

# Build de produção
npm run build

# Testar preview
npm run preview
```

### Testes Manuais

- Teste em diferentes tamanhos de tela
- Verifique acessibilidade básica
- Teste navegação entre páginas
- Valide formulários (quando aplicável)

## 📊 Review Process

### O que Esperamos

1. **Código limpo e bem documentado**
2. **Funcionalidade testada**
3. **Design consistente**
4. **Performance otimizada**
5. **Acessibilidade considerada**

### Timeline

- Reviews são feitos em até 48h (dias úteis)
- Feedback construtivo será fornecido
- Mudanças podem ser solicitadas
- Merge após aprovação

## 🆘 Precisa de Ajuda?

### Onde Buscar Ajuda

- **GitHub Issues**: Para dúvidas técnicas
- **GitHub Discussions**: Para discussões gerais
- **Email**: aalternativabr@gmail.com

### Primeiras Contribuições

Procure por issues com as labels:
- `good first issue`: Ideal para iniciantes
- `help wanted`: Precisamos de ajuda
- `documentation`: Melhorias na documentação

## 🏆 Reconhecimento

Contribuidores serão:
- Listados no arquivo CONTRIBUTORS.md
- Mencionados nas release notes
- Creditados nas funcionalidades desenvolvidas

## 📜 Código de Conduta

Este projeto segue o [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em seguir suas diretrizes.

### Comportamento Esperado

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Demonstre empatia com outros membros

---

**Obrigado por contribuir com o ecossistema tecnológico brasileiro! 🇧🇷**
