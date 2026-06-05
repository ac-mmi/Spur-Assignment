# Render Backend Deployment Guide

Deploy the Express API to [Render](https://render.com) and connect it to the Vercel frontend.

---

## Deployment Checklist

| Setting | Value |
|---|---|
| **Service Type** | Web Service |
| **Root Directory** | `.` (repository root) |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build && npx prisma migrate deploy` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/health` |

### Environment Variables

| Variable | Required | Example | Notes |
|---|---|---|---|
| `NODE_ENV` | Yes | `production` | Enables production CORS |
| `DATABASE_URL` | Yes | `file:./prisma/prod.db` | SQLite path (see notes below) |
| `LLM_PROVIDER` | Yes | `groq` | Use `groq` on Render (free hosted API; Ollama unavailable) |
| `GROQ_API_KEY` | Yes | `gsk_...` | Required when `LLM_PROVIDER=groq` — get at [console.groq.com](https://console.groq.com) |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | Groq model name |
| `GROQ_TIMEOUT_MS` | No | `30000` | Request timeout in ms |
| `OPENAI_API_KEY` | If `openai` | `sk-...` | Required only when `LLM_PROVIDER=openai` |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | Defaults to `gpt-4o-mini` |
| `OPENAI_TIMEOUT_MS` | No | `30000` | Request timeout in ms |
| `FRONTEND_URL` | Yes | `https://your-app.vercel.app` | Vercel frontend URL for CORS |
| `PORT` | No | — | Render sets this automatically |

> `PORT` is injected by Render. Do not hardcode it.

---

## Step-by-Step: Deploy to Render

### 1. Push code to GitHub

Ensure the latest backend changes are on GitHub.

### 2. Create a Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect repository: `ac-mmi/Spur-Assignment`
4. Configure:

| Field | Value |
|---|---|
| Name | `spur-assignment-api` (or your choice) |
| Region | Closest to your users |
| Branch | `main` |
| Root Directory | *(leave empty)* |
| Runtime | `Node` |
| Build Command | `npm install && npm run build && npx prisma migrate deploy` |
| Start Command | `npm start` |

### 3. Set environment variables

In **Environment** → **Add Environment Variable**:

```env
NODE_ENV=production
DATABASE_URL=file:./prisma/prod.db
LLM_PROVIDER=groq
GROQ_API_KEY=<your-groq-api-key>
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_TIMEOUT_MS=30000
FRONTEND_URL=https://<your-vercel-app>.vercel.app
```

### 4. Deploy

Click **Create Web Service**. Wait for the build to complete.

### 5. Verify backend

```bash
curl https://<your-service>.onrender.com/health
# → {"status":"ok"}

curl -X POST https://<your-service>.onrender.com/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Do you ship internationally?"}'
```

### 6. Connect Vercel frontend

In Vercel project settings, set:

```env
PUBLIC_API_URL=https://<your-service>.onrender.com
```

Redeploy the frontend.

---

## SQLite on Render

### Current setup

```env
DATABASE_URL=file:./prisma/prod.db
```

Prisma creates the database file at `prisma/prod.db` relative to the project root during `prisma migrate deploy`.

### Implications

| Aspect | Behavior |
|---|---|
| **Within a running instance** | Data persists across requests |
| **On redeploy** | Data is **lost** (ephemeral filesystem on free tier) |
| **Scaling** | Multiple instances cannot share a SQLite file |

SQLite is acceptable for demos and take-home evaluation. For production durability, migrate to PostgreSQL.

---

## PostgreSQL Migration (Recommended for Production)

### 1. Create a Render PostgreSQL database

1. **New +** → **PostgreSQL**
2. Copy the **Internal Database URL**

### 2. Update Prisma schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Update environment variable

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### 4. Create and deploy migration

```bash
npx prisma migrate dev --name switch_to_postgresql
git add prisma/
git commit -m "Migrate to PostgreSQL"
git push
```

Render will run `prisma migrate deploy` on the next deploy.

---

## Error Handling (Verified)

| Scenario | Response |
|---|---|
| Empty message | `400` — validation error |
| Message > 2000 chars | `400` — validation error |
| Invalid session UUID | `400` or `404` |
| Missing env vars at startup | Process exits with clear error |
| OpenAI failure | `200` with friendly fallback message |
| Unexpected server error | `500` — generic error message |

---

## Local Production Simulation

```bash
# Build
npm run build

# Run (set env vars first)
NODE_ENV=production \
DATABASE_URL="file:./prisma/prod.db" \
LLM_PROVIDER=groq \
GROQ_API_KEY=gsk_... \
FRONTEND_URL=http://localhost:5173 \
node dist/server.js
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Build fails on Prisma | Ensure `DATABASE_URL` is set before build |
| CORS errors from Vercel | Set `FRONTEND_URL` to exact Vercel URL (no trailing slash) |
| `Invalid environment configuration` | Check all required env vars are set |
| LLM always returns fallback | Verify `GROQ_API_KEY` and `LLM_PROVIDER=groq` |
| Data lost after redeploy | Expected with SQLite on Render; use PostgreSQL |
