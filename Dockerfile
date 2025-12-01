# Etapa 1: imagem do Node.js
FROM node:20-alpine AS base
WORKDIR /app

# Etapa 2: variáveis de ambiente
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_KEYCLOAK_URL
ARG NEXT_PUBLIC_KEYCLOAK_REALM
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ARG NEXT_PUBLIC_BASE_URL

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_KEYCLOAK_URL=${NEXT_PUBLIC_KEYCLOAK_URL}
ENV NEXT_PUBLIC_KEYCLOAK_REALM=${NEXT_PUBLIC_KEYCLOAK_REALM}
ENV NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=${NEXT_PUBLIC_KEYCLOAK_CLIENT_ID}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}

# Etapa 3: instalação de dependências
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Etapa 4: build do projeto
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Etapa 5: rodando o projeto
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nextjs \
    && adduser --system --uid 1001 nextjs
USER nextjs
WORKDIR /app

COPY --from=builder /app/build/standalone ./
COPY --from=builder /app/build/static ./static
COPY --from=builder /app/public ./public


EXPOSE 3000
CMD ["node", "server.js"]