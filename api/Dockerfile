# Build stage
FROM node:21-alpine AS builder

WORKDIR /app

COPY api/package*.json ./
RUN npm install --force

COPY api/src ./src
COPY api/tsconfig.json ./
COPY api/tsconfig.build.json ./
COPY api/nest-cli.json ./

RUN npm run build

# Production stage
FROM node:21-alpine

WORKDIR /app

COPY api/package*.json ./
RUN npm install --force --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
