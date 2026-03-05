# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY app/package*.json ./
RUN npm install --force

COPY app . .

RUN npm run build

# Production stage
FROM nginx:alpine

COPY app/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/pokedex-app/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
