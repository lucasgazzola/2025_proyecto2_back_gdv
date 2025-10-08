# ---------- Stage 1: Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Instalo utilidades mínimas necesarias para Prisma
RUN apk add --no-cache openssl libc6-compat bash

# Copio archivos de dependencias primero (mejor cache de Docker)
COPY package*.json ./
COPY prisma ./prisma

# Instalo todas las dependencias (incluyendo dev para compilar y prisma)
RUN npm ci

# Regenero Prisma Client para alpine (musl)
RUN npx prisma generate

# Copio el resto del código
COPY . .

# Compilo TypeScript (opcional, si usás TS)
RUN npm run build


# ---------- Stage 2: Runtime ----------
FROM node:22-alpine AS runner

WORKDIR /app

# Instalo dependencias mínimas para Prisma en runtime
RUN apk add --no-cache openssl libc6-compat

# Copio package.json y lock para instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copio Prisma Client y engines generados en build
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma

# Copio build y schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Ejecuta migraciones antes de levantar la app
CMD npx prisma migrate deploy && node dist/src/server.js
