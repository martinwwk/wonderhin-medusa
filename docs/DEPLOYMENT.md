# Deploying Wonderhin to Railway

This guide covers deploying the Wonderhin Medusa monorepo (backend, admin, storefront) to Railway with PostgreSQL and Redis.

---

## Prerequisites

- Railway account at [railway.app](https://railway.app)
- Railway CLI: `npm install -g @railway/cli`
- GitHub repository connected to Railway

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Storefront    │────▶│     Backend     │
│   (Next.js)     │     │   (Medusa v2)   │
│   Railway       │     │   Railway       │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              ┌─────▼─────┐            ┌──────▼──────┐
              │ PostgreSQL│            │    Redis    │
              │  Railway  │            │   Railway   │
              └───────────┘            └─────────────┘
```

---

## Step 1: Set Up Railway Project

### 1.1 Create Railway Project

```bash
# Login to Railway
railway login

# Initialize project
railway init
# Select "Empty Project" when prompted

# Name your project
railway project rename wonderhin-medusa
```

### 1.2 Add Database Services

```bash
# Add PostgreSQL (from Railway dashboard or CLI)
railway add --plugin postgresql

# Add Redis
railway add --plugin redis
```

### 1.3 Get Connection Strings

```bash
railway variables
```

Copy these values:
- `DATABASE_URL` (PostgreSQL)
- `REDIS_URL` (Redis)

---

## Step 2: Configure Environment Variables

### 2.1 Backend Environment Variables

Set these in Railway dashboard under the backend service:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://...` |
| `REDIS_URL` | Redis connection string | `redis://...` |
| `JWT_SECRET` | Secret for JWT tokens | Generate a secure string |
| `COOKIE_SECRET` | Secret for cookies | Generate a secure string |
| `MEDUSA_STOREFRONT_URL` | Your storefront URL | `https://wonderhin-storefront.railway.app` |
| `NODE_ENV` | Environment | `production` |

### 2.2 Admin Environment Variables

Set these in Railway dashboard under the admin service:

| Variable | Description | Example |
|----------|-------------|---------|
| `MEDUSA_BACKEND_URL` | Backend API URL | `https://wonderhin-backend.railway.app` |
| `VITE_PORT` | Port for Vite preview | `4173` |
| `NODE_ENV` | Environment | `production` |

### 2.3 Storefront Environment Variables

Set these in Railway dashboard under the storefront service:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `https://wonderhin-backend.railway.app` |
| `NODE_ENV` | Environment | `production` |

---

## Step 3: Deploy Services

### Option A: Auto-Deploy (Recommended)

1. Connect your GitHub repository to Railway
2. Enable "Deploy on Push" in Railway dashboard
3. Each push to main/master branch triggers automatic deployment

### Option B: Manual Deploy

```bash
# Deploy from Railway dashboard or CLI
railway up

# Deploy specific service
railway up --service backend
railway up --service admin
railway up --service storefront
```

---

## Step 4: Verify Deployment

### 4.1 Check Service Health

```bash
# View logs
railway logs -d

# Check status
railway status

# Open Railway dashboard
railway open
```

### 4.2 Test Endpoints

| Service | Expected URL |
|---------|--------------|
| Backend | `https://wonderhin-backend.railway.app/health` |
| Admin | `https://wonderhin-admin.railway.app` |
| Storefront | `https://wonderhin-storefront.railway.app` |

---

## Step 5: Database Backup & Restore

### 5.1 Manual Backup

```bash
# Create database dump
railway db execute --query "pg_dump -U postgres -d railway > backup_\$(date +%Y%m%d).sql"

# Download the dump
railway db pull backup_20240101.sql
```

### 5.2 Automated Backups (Railway Cron)

Create a backup script `scripts/backup.sh`:

```bash
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /tmp/backup_$TIMESTAMP.sql

# Upload to cloud storage (AWS S3 example)
aws s3 cp /tmp/backup_$TIMESTAMP.sql s3://your-bucket/backups/

# Clean up local file
rm /tmp/backup_$TIMESTAMP.sql
```

Add a Railway cron job to run daily:

```bash
# In Railway dashboard: Settings > Cron Jobs
# Schedule: 0 2 * * * (daily at 2 AM)
```

### 5.3 Restore Database

```bash
# Stop backend to prevent data conflicts
railway down --service backend

# Drop and recreate database
railway db execute --query "DROP DATABASE IF EXISTS postgres; CREATE DATABASE postgres;"

# Restore from backup
railway db execute --query "\i backup_20240101.sql"

# Restart backend
railway up --service backend
```

---

## Step 6: Code Change Workflow

### 6.1 Development Flow

1. Make changes locally
2. Test locally (see AGENTS.md for local development)
3. Push to GitHub

```bash
git add .
git commit -m "feat: description of changes"
git push origin main
```

### 6.2 Deployment Flow

```
GitHub Push → Railway Auto-Deploy → Health Check → Live
```

### 6.3 Rollback

```bash
# View deployments
railway deployments

# Rollback to previous version
railway rollback <deployment-id>
```

---

## Useful Commands

```bash
# View logs for specific service
railway logs -d --service backend

# Open Railway shell
railway shell

# Connect to database
railway db connect

# Add environment variables
railway variables set DATABASE_URL=$DATABASE_URL --service backend

# Restart service
railway restart --service backend

# Scale service
railway scale --service backend --replicas 2
```

---

## Cost Estimation (Railway)

| Service | Plan | Est. Cost |
|---------|------|-----------|
| PostgreSQL | Starter | $5/month |
| Redis | Starter | $5/month |
| Backend | Hobby | $5/month |
| Admin | Hobby | $5/month |
| Storefront | Hobby | $5/month |
| **Total** | | **~$25-30/month** |

---

## Troubleshooting

### Backend Won't Start

1. Check logs: `railway logs --service backend`
2. Verify DATABASE_URL and REDIS_URL are set
3. Ensure migrations ran: `railway run --service backend -- yarn medusa migrations run`

### Storefront Can't Connect to Backend

1. Verify NEXT_PUBLIC_API_BASE_URL is correct
2. Check CORS settings in backend
3. Check backend is healthy: `https://your-backend.railway.app/health`

### Admin Shows Blank Page

1. Check browser console for errors
2. Verify MEDUSA_BACKEND_URL is set correctly
3. Rebuild admin: `railway up --service admin --build`
