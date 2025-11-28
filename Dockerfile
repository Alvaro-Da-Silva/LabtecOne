# Etapa 1: imagem do Node.js
FROM node:20-alpine AS base
WORKDIR /app

# Etapa 2: Instalação de dependências
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Etapa 3: Build do projeto
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Etapa 4: Rodando o projeto
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nextjs \
    && adduser --system --uid 1001 nextjs
USER nextjs
WORKDIR /app

COPY --from=builder /app/build/standalone ./
COPY --from=builder /app/build/static ./public/_next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]