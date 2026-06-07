# icmoscow-admin

Vue 3 admin portal for the IC Moscow project management system. Manages Projects, Donations, Expenses, Timeline, Photos, and Activities via the `icmoscow-api` backend.

## Stack

- Vue 3.5 + TypeScript 6 (strict)
- Vite 8 + Tailwind CSS v4
- vue-router v5
- Remix Icons

## Prerequisites

- Node.js 22+
- `icmoscow-api` running locally or deployed

## Local Development

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL=http://localhost:8080
npm run dev
```

Open `http://localhost:5173` — the login page requires credentials configured in `icmoscow-api`.

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

## Lint

```bash
npm run lint
npm run lint:fix
```

## Deployment (GitHub Pages)

1. In the repo settings → **Pages**, set source to **GitHub Actions**
2. Add a repository secret `VITE_API_BASE_URL` with the deployed API URL (e.g. `https://api.icmoscow.com`)
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically

SPA routing on GitHub Pages is handled by `public/404.html` (encodes the path) and a script in `index.html` (decodes it on load).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL of the `icmoscow-api` backend (no trailing slash) |
