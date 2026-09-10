# Electric Shop — Frontend

React + Vite frontend (Material UI) for the Electric Shop ecommerce platform, organized by
feature (`auth`, `products`, `cart`, `orders`, `admin`, `layout`).

Backend repo: https://github.com/Kirthykeeru/e_com_backend

## Run locally
```bash
npm install
copy .env.example .env
npm run dev
```
Set `VITE_API_BASE_URL` / `VITE_SOCKET_URL` in `.env` to point at a running backend
(defaults assume it's on `http://localhost:4000`).

## Docker
Not required for the Render deploy below — Render builds this natively from `npm run build`.
Useful when targeting container-only static hosting (VPS, Cloud Run, Fly.io):
```bash
docker build -t electric-shop-web \
  --build-arg VITE_API_BASE_URL=https://your-backend-url/api \
  --build-arg VITE_SOCKET_URL=https://your-backend-url .
docker run -p 8080:80 electric-shop-web
```

## Deploying (free hosting)
Uses [Render](https://render.com) free static site hosting (no sleep, unlike the backend).

1. In Render: **New > Static Site** pointing at this repo, or **New > Blueprint** to use the
   included `render.yaml`.
2. Build command `npm install && npm run build`, publish directory `dist`.
3. Set `VITE_API_BASE_URL` / `VITE_SOCKET_URL` env vars to your deployed backend's real URL
   (see the [backend repo](https://github.com/Kirthykeeru/e_com_backend)), then redeploy if you
   change them after the first build (Vite env vars are baked in at build time).
4. The SPA rewrite rule (`/* -> /index.html`) is already set in `render.yaml` so client-side
   routes work on refresh/direct link.

## Notes
- Buyer users can browse active products, add to cart, checkout, and view order history.
- Admin users get a dashboard for user management, price overrides, product CRUD, order
  visibility, real-time new-order notifications, and an audit log.
