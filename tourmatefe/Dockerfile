# ---- Base Stage ----
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies Stage ----
FROM base AS deps
RUN npm install

# ---- Build Stage ----
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine AS runner
WORKDIR /app

# Chỉ copy cần thiết để chạy app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "dev"]
