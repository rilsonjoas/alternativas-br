# Scripts de Atualização - AlternativasBR

Este diretório contém scripts para atualizar e completar os dados dos produtos no banco de dados Firebase.

## 🚀 Script Principal

### `runAllUpdates.js` - SCRIPT MASTER
```bash
node src/scripts/runAllUpdates.js
```
**Executa TODAS as atualizações em sequência:**
- ✅ Adiciona 36 novos produtos brasileiros
- ✅ Atualiza produtos existentes com alternativas
- ✅ Completa dados faltantes (websites, recursos, preços)
- ✅ Adiciona anos de fundação

## 📋 Scripts Individuais

### 1. `addNewProducts.js` - Novos Produtos
```bash
node src/scripts/addNewProducts.js
```
Adiciona 36 novos produtos brasileiros com dados completos:
- Ploomes, Lahar, Ramper, mLabs (CRM/Marketing)
- Asaas, Nibo (Financeiro)
- Nuvemshop, Loja Integrada, Tray (E-commerce)
- E muito mais...

### 2. `updateExistingProductsWithAlternatives.js` - Alternativas
```bash
node src/scripts/updateExistingProductsWithAlternatives.js
```
Atualiza os 25 produtos existentes com informações de "alternativa a":
- RD Station → HubSpot, Marketo, Mailchimp
- Pipefy → Jira, Asana, Trello, Monday.com
- VTEX → Adobe Commerce, Salesforce Commerce Cloud
- E todos os outros...

### 3. `completeAllProductData.js` - Dados Completos
```bash
node src/scripts/completeAllProductData.js
```
Completa TODOS os dados faltantes de todos os produtos:
- **Websites:** URLs oficiais
- **Recursos:** Features e funcionalidades
- **Preços:** Informações de preço completas
- **Alternativas:** Produtos internacionais que substitui
- **Anos de fundação:** Datas de fundação das empresas
- **Descrições:** Descrições curtas e completas

### 4. `updateAllProductData.js` - Anos de Fundação
```bash
node src/scripts/updateAllProductData.js
```
Atualiza especificamente os anos de fundação (1983-2019).

### 5. Scripts de Verificação

#### `verifyProductSlugs.js` - Verificar Slugs
```bash
node src/scripts/verifyProductSlugs.js
```
Verifica se os slugs dos produtos estão corretos.

#### `updateFoundingYears.js` - Anos de Fundação
```bash
node src/scripts/updateFoundingYears.js
```
Atualiza apenas os anos de fundação.

## 📊 Dados Incluídos

### Produtos Novos (36)
- **CRM:** Ploomes, Lahar, Ramper, mLabs
- **Financeiro:** Asaas, Nibo
- **E-commerce:** Nuvemshop, Loja Integrada, Tray
- **Produtividade:** Runrun.it, Operand
- **Atendimento:** Movidesk, Zenvia
- **RH:** Gupy, Sólides, Pontomais
- **Jurídico:** Jusbrasil, Aurum
- **Pagamentos:** Pagar.me, Iugu
- **Bancos Digitais:** Nubank, PicPay
- **E mais 15 produtos...

### Dados Completos Para Cada Produto
```javascript
{
  name: "Nome do Produto",
  website: "https://website.com",
  foundedYear: 2023,
  headquarters: "Cidade, Estado",
  userCount: "1.000.000+",
  shortDescription: "Descrição curta",
  features: ["Recurso 1", "Recurso 2", "Recurso 3"],
  pricing: {
    type: "freemium",
    currency: "BRL", 
    description: "Plano gratuito com limitações",
    plans: [
      { name: "Gratuito", price: "R$ 0", description: "Funcionalidades básicas" },
      { name: "Pro", price: "R$ 50/mês", description: "Recursos avançados" }
    ]
  },
  alternativeTo: ["Produto Internacional 1", "Produto Internacional 2"]
}
```

## 🎯 Resultado Final

Após executar os scripts, todos os produtos terão:
- ✅ **Website oficial**
- ✅ **Ano de fundação** 
- ✅ **Recursos/features listados**
- ✅ **Informações de preço completas**
- ✅ **Alternativas internacionais mapeadas**
- ✅ **Descrições completas**
- ✅ **Dados da empresa**

## 🔧 Dashboard Melhorado

O dashboard admin agora mostra:
- **Coluna "Status":** Indica quais produtos estão completos/incompletos
- **Coluna "Alternativa a":** Mostra produtos internacionais
- **Campos obrigatórios:** Marcados com * no formulário
- **Seção de preços:** Formulário completo para preços
- **Validação visual:** Alertas para campos faltando

## ⚠️ Importante

- Certifique-se de ter o arquivo `serviceAccountKey.json` configurado
- Execute em ambiente de desenvolvimento primeiro
- Faça backup do banco antes de executar em produção
- Os scripts verificam produtos existentes para evitar duplicatas

## 🎊 Resultado

Sua base de dados ficará 100% completa com:
- **61+ produtos brasileiros** (25 existentes + 36 novos)
- **Dados completamente preenchidos**
- **Interface administrativa melhorada**
- **Experiência do usuário aprimorada**