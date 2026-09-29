# Stage 1: Build Frontend
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:2-alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/caddy

# Copy custom Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443
