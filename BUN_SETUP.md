# Configuração Bun

Este projeto foi configurado para usar **apenas o Bun** como package manager e runtime.

## Instalação do Bun

Se você ainda não tem o Bun instalado:

```bash
curl -fsSL https://bun.sh/install | bash
```

Ou no Windows (PowerShell):

```powershell
powershell -c "iwr bun.sh/install.ps1 | iex"
```

## Configuração do Ambiente

### Windows (Bash)

Execute o script de configuração:

```bash
./setup-bun.sh
```

### Windows (Command Prompt)

Execute o script de configuração:

```cmd
setup-bun.bat
```

## Comandos Disponíveis

- `bun install` - Instalar dependências
- `bun run dev` - Executar servidor de desenvolvimento
- `bun run build` - Gerar build de produção
- `bun run preview` - Visualizar build de produção
- `bun run lint` - Executar linter

## Arquivos de Configuração

- `bunfig.toml` - Configurações específicas do Bun
- `bun.lockb` - Arquivo de lock das dependências (equivalente ao package-lock.json)

## Vantagens do Bun

- ⚡ **Mais rápido**: Até 29x mais rápido que npm para instalar pacotes
- 🏃 **Runtime JavaScript**: Pode executar código JavaScript/TypeScript diretamente
- 📦 **Bundler integrado**: Possui bundler nativo
- 🔧 **Compatível**: 100% compatível com Node.js e npm packages
- 💾 **Menor uso de disco**: Usa hard links para economizar espaço

## Migração Concluída

✅ Removido `package-lock.json`  
✅ Atualizado `.gitignore` para Bun  
✅ Atualizado `README.md` com instruções do Bun  
✅ Configurado `bunfig.toml`  
✅ Instaladas dependências com `bun install`  
✅ Scripts do `package.json` adaptados para Bun  
✅ Servidor de desenvolvimento funcionando  

## Estrutura de Arquivos Bun

```text
.bun/                 # Diretório de cache do Bun (ignorado pelo git)
bun.lockb             # Arquivo de lock das dependências
bunfig.toml           # Configurações do Bun
setup-bun.sh          # Script de configuração para Bash
setup-bun.bat         # Script de configuração para Windows
```
