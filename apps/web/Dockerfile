# ==========================================
# Estágio 1: Builder (A Oficina)
# ==========================================
# Usamos uma imagem Node.js completa para ter as ferramentas de build
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala o pnpm (nossa ferramenta favorita)
# corepack vem com Node moderno e permite ativar pnpm sem npm install -g
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. Copia apenas arquivos de dependência primeiro
# Isso é para aproveitar o cache do Docker. Se você não mudou dependências,
# ele pula a instalação na próxima vez (super rápido!)
COPY package.json pnpm-lock.yaml ./

# 2. Instala as dependências
RUN pnpm install --frozen-lockfile

# 3. Copia o resto do código fonte
COPY . .

# 4. Cria o build de produção (gera a pasta dist/)
RUN pnpm build

# ==========================================
# Estágio 2: Runner (A Sala de Estar)
# ==========================================
# Agora usamos Nginx, um servidor web super leve e rápido
FROM nginx:alpine

# Copia APENAS a pasta dist/ do estágio anterior (builder)
# Jogamos fora todo o node_modules pesado!
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia nossa configuração customizada do Nginx (vamos criar a seguir)
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 (padrão web)
EXPOSE 80

# Comando para iniciar o servidor
CMD ["nginx", "-g", "daemon off;"]
