#!/bin/bash

# Script de diagnóstico para problemas de reviews
# Execute este arquivo para identificar problemas

echo "🔍 DIAGNÓSTICO - SISTEMA DE AVALIAÇÕES"
echo "======================================"

echo ""
echo "1. 🔥 Testando Firebase..."
cd "c:/Users/rguedes/Documents/GitHub/alternativas-br"

# Verificar se o servidor está rodando
echo "Verificando servidor local..."
curl -s http://localhost:3001 > /dev/null && echo "✅ Servidor rodando" || echo "❌ Servidor não está rodando"

# Verificar variáveis de ambiente
echo ""
echo "2. 🔧 Verificando configurações..."
if [ -f ".env.local" ]; then
    echo "✅ Arquivo .env.local existe"
    echo "📋 Variáveis configuradas:"
    grep "VITE_FIREBASE" .env.local | head -3
else
    echo "❌ Arquivo .env.local não encontrado"
fi

echo ""
echo "3. 📦 Verificando estrutura do projeto..."
[ -d "src/lib/services" ] && echo "✅ Pasta services existe" || echo "❌ Pasta services não encontrada"
[ -f "src/lib/services/reviewService.ts" ] && echo "✅ reviewService.ts existe" || echo "❌ reviewService.ts não encontrado"
[ -f "src/contexts/AuthContext.tsx" ] && echo "✅ AuthContext existe" || echo "❌ AuthContext não encontrado"

echo ""
echo "4. 🎯 Próximos passos recomendados:"
echo "   - Abra http://localhost:3001/produto/hotmart"
echo "   - Vá na aba 'Avaliações'"
echo "   - Clique em 'Firebase' no componente de debug"
echo "   - Verifique o console do navegador (F12)"
echo "   - Se houver erros, compartilhe os logs"

echo ""
echo "5. 📝 Para testar manualmente:"
echo "   - Faça login na aplicação"
echo "   - Vá para a página do Hotmart"
echo "   - Tente escrever uma avaliação"
echo "   - Use o botão 'Service' no debug para verificar"
