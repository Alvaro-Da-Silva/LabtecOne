FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build


FROM node:20-alpine AS runner
ENV NODE_ENV=production

WORKDIR /app

RUN addgroup --system --gid 1001 nextjs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/build/standalone ./standalone
COPY --from=builder /app/build/static ./public/_next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "standalone/server.js"]