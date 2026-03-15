# ─────────────────────────────────────────────
# Stage 1 – base: shared Node.js image
# ─────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# Install openssl for Prisma binary compatibility on Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# ─────────────────────────────────────────────
# Stage 2 – development
# Mounts source via volume; uses ts-node-dev
# ─────────────────────────────────────────────
FROM base AS development

ENV NODE_ENV=development

RUN npm ci

# Generate Prisma client
RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]

# ─────────────────────────────────────────────
# Stage 3 – builder: compile TypeScript
# ─────────────────────────────────────────────
FROM base AS builder

ENV NODE_ENV=production

# Install all deps (including devDeps needed for tsc)
RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

# ─────────────────────────────────────────────
# Stage 4 – production: lean runtime image
# ─────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Only copy production dependencies manifest, then install
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev

# Regenerate Prisma client for this image
RUN npx prisma generate

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 4000

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
