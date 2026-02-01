# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies needed for Prisma
RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Generate Prisma client and compile TypeScript
RUN npx prisma generate
RUN npm run build

# Final stage
FROM node:20-slim

WORKDIR /app

# Ensure openssl is available for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy only production dependencies and built assets
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Healthcheck to ensure the container is healthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Execute using standard node from the compiled dist
CMD ["npm", "start"]
