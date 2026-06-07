# icmoscow-admin

Admin portal for the Islamic Center of Moscow — manages Projects, Donations, Expenses, Timeline, Photos, and Activities stored in Google Sheets.

**Live:** https://admin.icmoscow.com

---

## Stack

- Vue 3.5 + TypeScript (strict)
- Vite 8 + Tailwind CSS v4
- vue-router v5
- Native Fetch API — no Axios
- Deployed to GitHub Pages via GitHub Actions

## Local Development

```powershell
npm install
npm run dev
```

Create a `.env` file (see `.env.example`):

```
VITE_API_BASE_URL=http://localhost:8080
```

## Build

```powershell
npm run build
```

The `VITE_API_BASE_URL` environment variable must be set at build time — it is baked into the static output.

## Deployment

Push to `master` — GitHub Actions builds and deploys to GitHub Pages automatically.

**Required GitHub repository variable** (Settings → Secrets and variables → Actions → Variables):

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://icmoscow-api-production.up.railway.app` |

Must be set as a **repository variable** (not an environment variable) so the `build` job can read it.

## Backend

The admin portal talks to [`icmoscow-api`](https://github.com/hmdghoul/icmoscow-api) — a private Go Gin REST API deployed on Railway.
