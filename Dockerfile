FROM node:22-bookworm-slim AS builder

# OpenSSL for prisma.
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
COPY backend/main/package*.json ./backend/main/
COPY shared/package*.json ./shared/

RUN npm ci

COPY backend/main/prisma ./backend/main/prisma/
RUN npx prisma generate --schema=./backend/main/prisma/schema.prisma

# Копируем СОВЕРШЕННО ВЕСЬ исходный код (включая shared и backend)
COPY . .

RUN npm run build --workspace=backend/main

RUN npm prune --production

FROM node:22-bookworm-slim AS runner

# OPENSSL
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Production mode for NODEJS
ENV NODE_ENV=production

# copying only stuff that we need
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/backend/main/package*.json ./backend/main/
COPY --from=builder /app/backend/main/dist ./backend/main/dist
COPY --from=builder /app/backend/main/prisma ./backend/main/prisma

# Open port 3001
EXPOSE 3001

# Run JS-build
CMD ["npm", "run", "start", "--workspace=backend/main"]