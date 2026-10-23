FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package manifests
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/

# Install dependencies
RUN npm ci

# Copy source
COPY apps/server ./apps/server

# Build TypeScript
WORKDIR /app/apps/server
RUN npx prisma generate
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY apps/server/package*.json ./apps/server/

RUN npm ci --omit=dev

COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma
COPY --from=builder /app/apps/server/public ./apps/server/public

WORKDIR /app/apps/server
EXPOSE 4000

CMD ["node", "dist/index.js"]
