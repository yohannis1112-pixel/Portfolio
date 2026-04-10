# 🚀 Complete Deployment Guide

Step-by-step guide to deploy your Professional Portfolio to production.

## 📋 Pre-Deployment Checklist

### ✅ Required Services Setup
- [ ] **Database**: PostgreSQL (Neon, Supabase, or Railway)
- [ ] **Media Storage**: Cloudinary account configured
- [ ] **Domain**: Custom domain (optional but recommended)
- [ ] **Git Repository**: Code pushed to GitHub/GitLab

### ✅ Environment Variables Ready
- [ ] `DATABASE_URL` - Production PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Secure random string (32+ characters)
- [ ] `NEXTAUTH_URL` - Your production domain
- [ ] `ADMIN_EMAIL` & `ADMIN_PASSWORD` - Admin credentials
- [ ] `CLOUDINARY_*` - All Cloudinary credentials

---

## 🎯 Deployment Options

| Platform | Difficulty | Cost | Best For |
|----------|------------|------|----------|
| **Vercel** | ⭐ Easy | Free/Paid | Next.js optimized |
| **Railway** | ⭐⭐ Easy | Free/Paid | Full-stack apps |
| **Render** | ⭐⭐ Medium | Free/Paid | Docker support |
| **DigitalOcean** | ⭐⭐⭐ Medium | Paid | Scalable apps |
| **AWS/GCP** | ⭐⭐⭐⭐ Hard | Paid | Enterprise |

---

## 🌟 Option 1: Vercel (Recommended for Next.js)

### Step 1: Prepare Repository
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. **Visit**: [vercel.com/new](https://vercel.com/new)
2. **Sign in** with GitHub
3. **Import** your repository
4. **Configure**:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Step 3: Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://your-app.vercel.app
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
```

### Step 4: Deploy & Setup Database
```bash
# After deployment, setup database
npx prisma db push --preview-feature
npm run prisma:seed
```

### Step 5: Custom Domain (Optional)
1. **Vercel Dashboard** → Domains
2. **Add** your domain
3. **Configure DNS** as instructed
4. **Update** `NEXTAUTH_URL` to your domain

---

## 🚂 Option 2: Railway (Full-Stack Friendly)

### Step 1: Setup Railway
1. **Visit**: [railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **New Project** → Deploy from GitHub repo

### Step 2: Configure Services
```yaml
# railway.toml (create this file)
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/api/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"

[[services]]
name = "portfolio"
source = "."

[services.portfolio.variables]
NODE_ENV = "production"
PORT = "3000"
```

### Step 3: Add Database
1. **Railway Dashboard** → Add Service → PostgreSQL
2. **Copy** connection string
3. **Add** to environment variables

### Step 4: Environment Variables
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=${{RAILWAY_STATIC_URL}}
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 5: Deploy & Seed
```bash
# Railway will auto-deploy
# After deployment, seed database via Railway console
railway run npm run prisma:seed
```

---

## 🎨 Option 3: Render (Docker Support)

### Step 1: Prepare Docker
Ensure you have the Docker files from the previous setup:
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

### Step 2: Create Render Service
1. **Visit**: [render.com](https://render.com)
2. **New** → Web Service
3. **Connect** GitHub repository
4. **Configure**:
   - Environment: `Docker`
   - Build Command: `docker build -t portfolio .`
   - Start Command: `docker run -p 10000:3000 portfolio`

### Step 3: Add PostgreSQL Database
1. **Render Dashboard** → New → PostgreSQL
2. **Copy** connection details
3. **Add** to web service environment

### Step 4: Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-app.onrender.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## ☁️ Option 4: DigitalOcean App Platform

### Step 1: Create App
1. **DigitalOcean** → Apps → Create App
2. **Connect** GitHub repository
3. **Configure**:
   - Source Directory: `/`
   - Build Command: `npm run build`
   - Run Command: `npm start`

### Step 2: Add Database
1. **Add Component** → Database → PostgreSQL
2. **Configure** connection in environment variables

### Step 3: App Spec Configuration
```yaml
# .do/app.yaml
name: portfolio
services:
- name: web
  source_dir: /
  github:
    repo: your-username/portfolio
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: DATABASE_URL
    scope: RUN_AND_BUILD_TIME
    value: ${db.DATABASE_URL}
  - key: NEXTAUTH_SECRET
    scope: RUN_AND_BUILD_TIME
    value: your-secret
databases:
- name: db
  engine: PG
  version: "13"
```

---

## 🐳 Option 5: Docker Self-Hosted (VPS)

### Step 1: Prepare VPS
```bash
# Install Docker on Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Deploy Application
```bash
# Clone repository
git clone https://github.com/your-username/portfolio.git
cd portfolio

# Setup environment
cp .env.production.example .env.production
# Edit .env.production with your values

# Deploy
chmod +x docker-deploy.sh
./docker-deploy.sh prod
```

### Step 3: Setup Reverse Proxy (Nginx)
```nginx
# /etc/nginx/sites-available/portfolio
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 4: SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## 🗄️ Database Setup Guide

### Option A: Neon (Recommended)
1. **Visit**: [neon.tech](https://neon.tech)
2. **Create** new project
3. **Copy** connection string
4. **Use** in `DATABASE_URL`

### Option B: Supabase
1. **Visit**: [supabase.com](https://supabase.com)
2. **New Project** → Database
3. **Settings** → Database → Connection string
4. **Use** in `DATABASE_URL`

### Option C: Railway PostgreSQL
1. **Railway Dashboard** → Add Service → PostgreSQL
2. **Variables** tab → Copy `DATABASE_URL`
3. **Use** in your app environment

---

## 🎨 Cloudinary Setup

### Step 1: Create Account
1. **Visit**: [cloudinary.com](https://cloudinary.com)
2. **Sign up** for free account
3. **Dashboard** → Settings → Security

### Step 2: Get Credentials
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 3: Create Upload Preset
1. **Settings** → Upload → Upload presets
2. **Add upload preset**:
   - Name: `portfolio_uploads`
   - Signing Mode: `Unsigned`
   - Folder: `portfolio`
3. **Use** preset name in `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

---

## 🔧 Post-Deployment Steps

### 1. Database Migration
```bash
# Run after first deployment
npx prisma db push
npm run prisma:seed
```

### 2. Test Admin Access
1. **Visit**: `https://your-domain.com/admin/login`
2. **Login** with admin credentials
3. **Test** all admin functions

### 3. Upload Test Content
1. **Admin Panel** → Portfolio
2. **Add** sample portfolio items
3. **Test** image/video uploads

### 4. Performance Check
1. **Google PageSpeed Insights**
2. **GTmetrix** performance test
3. **Lighthouse** audit

### 5. SEO Setup
1. **Google Search Console**
2. **Submit** sitemap
3. **Verify** domain ownership

---

## 🚨 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
```bash
# Test connection
npx prisma db push --preview-feature
npx prisma studio
```

### Environment Variable Issues
```bash
# Check variables are loaded
console.log(process.env.DATABASE_URL)
```

### Image Upload Issues
1. **Check** Cloudinary credentials
2. **Verify** upload preset exists
3. **Test** API endpoints

---

## 📊 Monitoring & Maintenance

### Health Checks
- **Endpoint**: `/api/health`
- **Monitor**: Database connectivity
- **Alerts**: Set up uptime monitoring

### Backups
```bash
# Database backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

### Updates
```bash
# Update dependencies
npm update
npm audit fix

# Redeploy
git add .
git commit -m "Update dependencies"
git push origin main
```

---

## 🎉 Success Checklist

- [ ] **Application** loads without errors
- [ ] **Admin login** works correctly
- [ ] **Portfolio items** display properly
- [ ] **Image uploads** function
- [ ] **CV download** works
- [ ] **Contact form** sends emails (if implemented)
- [ ] **Mobile responsive** design
- [ ] **Performance** score > 90
- [ ] **SSL certificate** active
- [ ] **Custom domain** configured
- [ ] **SEO** meta tags working
- [ ] **Analytics** tracking (if added)

---

## 🆘 Need Help?

### Common Issues
1. **Build fails**: Check Node.js version (18+)
2. **Database errors**: Verify connection string
3. **Images not loading**: Check Cloudinary setup
4. **Admin can't login**: Verify credentials and NextAuth config

### Support Resources
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)

---

**🚀 Your portfolio is now live and ready to showcase your work!**