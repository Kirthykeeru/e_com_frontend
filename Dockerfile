# Optional: only needed for container-only static hosting (VPS, Cloud Run, Fly.io, etc.)
# Render/Netlify/Vercel/Cloudflare Pages build and serve this app directly without Docker.

FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Set these to your deployed backend's URL at build time, e.g.:
#   docker build --build-arg VITE_API_BASE_URL=https://api.example.com/api \
#                 --build-arg VITE_SOCKET_URL=https://api.example.com .
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
