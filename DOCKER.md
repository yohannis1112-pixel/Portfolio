# 🐳 Docker Deployment Guide

Complete Docker setup for your Portfolio application with production-ready configuration.

## 📋 Prerequisites

- Docker Desktop installed and running
- Git repository with your code
- Environment variables configured

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo>
cd Portfolio
cp .env.docker.example .env.docker
# Edit .env.docker with your values
```

### 2. Build and Run
```bash
# Windows
docker-deploy.bat build
docker-deploy.bat dev

# Linux/Mac
chmod +x docker-deploy.sh
./docker-deploy.sh build
./docker-deploy.sh dev
```

### 3. Setup Database
```bash
# Windows
docker-deploy.bat setup-db

# Linux/Mac
./docker-deploy.sh setup-db
```

## 📁 Docker Files Overview

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build for production |
| `docker-compose.yml` | Development environment |
| `docker-compose.prod.yml` | Production environment |
| `.dockerignore` | Exclude files from build |
| `docker-deploy.sh/.bat` | Deployment scripts |

## 🛠️ Available Commands

### Development
```bash
docker-deploy.sh dev     # Start with hot reload
docker-deploy.sh logs    # View logs
docker-deploy.sh stop    # Stop containers
```

### Production
```bash
docker-deploy.sh prod    # Start production mode
docker-deploy.sh clean   # Clean up resources
```

## 🌐 Deployment Platforms

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure environment variables
3. Deploy with Docker

### AWS ECS/Fargate
1. Push image to ECR
2. Create ECS service
3. Configure load balancer

### Google Cloud Run
```bash
# Build and push
docker build -t gcr.io/PROJECT-ID/portfolio .
docker push gcr.io/PROJECT-ID/portfolio

# Deploy
gcloud run deploy --image gcr.io/PROJECT-ID/portfolio
```

## 🔧 Environment Variables

Required for production:

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## 📊 Health Monitoring

Health check endpoint: `GET /api/health`

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

## 🔍 Troubleshooting

### Build Issues
```bash
# Clear cache and rebuild
docker system prune -a
docker-deploy.sh build
```

### Database Connection
```bash
# Check database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
docker-deploy.sh setup-db
```

### Performance Issues
```bash
# Check resource usage
docker stats

# View detailed logs
docker-deploy.sh logs
```

## 🚀 Production Deployment

### Option 1: Railway (Recommended)
1. Fork repository to GitHub
2. Connect Railway to GitHub
3. Add environment variables
4. Deploy automatically

### Option 2: DigitalOcean
1. Create App Platform app
2. Connect GitHub repository
3. Configure environment variables
4. Deploy

### Option 3: Self-Hosted VPS
```bash
# On your server
git clone <your-repo>
cd Portfolio
cp .env.docker.example .env.docker
# Edit environment variables
./docker-deploy.sh prod
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# docker-compose.prod.yml
services:
  portfolio:
    deploy:
      replicas: 3
```

### Load Balancing
Add nginx reverse proxy:
```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
  depends_on:
    - portfolio
```

## 🔒 Security

- Use secrets management for sensitive data
- Enable HTTPS in production
- Regular security updates
- Monitor logs for suspicious activity

## 📝 Maintenance

### Updates
```bash
git pull origin main
docker-deploy.sh build
docker-deploy.sh prod
```

### Backups
```bash
# Database backup
docker-compose exec postgres pg_dump -U portfolio_user portfolio > backup.sql
```

### Monitoring
- Set up log aggregation
- Configure alerts
- Monitor resource usage
- Track application metrics