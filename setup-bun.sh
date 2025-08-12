#!/bin/bash

echo "Configurando ambiente Bun para o projeto..."

# Definir variáveis de ambiente do Bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

echo "Ambiente configurado!"
echo ""
echo "Comandos disponíveis:"
echo "  bun install     - Instalar dependências"
echo "  bun run dev     - Executar servidor de desenvolvimento"
echo "  bun run build   - Gerar build de produção"
echo "  bun run preview - Visualizar build de produção"
echo "  bun run lint    - Executar linter"
echo ""

# Adicionar ao .bashrc para persistir
if ! grep -q "BUN_INSTALL" ~/.bashrc; then
    echo "# Bun" >> ~/.bashrc
    echo "export BUN_INSTALL=\"\$HOME/.bun\"" >> ~/.bashrc
    echo "export PATH=\"\$BUN_INSTALL/bin:\$PATH\"" >> ~/.bashrc
    echo "Configuração adicionada ao ~/.bashrc"
fi
