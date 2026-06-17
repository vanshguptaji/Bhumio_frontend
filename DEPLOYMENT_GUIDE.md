# Bhumio Frontend - Deployment Guide

## Overview

This guide covers deploying the Bhumio frontend to production environments.

---

## 📦 Build Process

### Prerequisites
- Node.js 16+
- npm or yarn
- All dependencies installed

### Building for Production

1. **Prepare environment:**
```bash
cd /Users/vanshgupta/Developer/frontend/Bhumio_frontend
```

2. **Create production environment file:**
```bash
# Create .env.production or use environment variables
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Bhumio
```

3. **Build the application:**
```bash
npm run build
```

This creates an optimized build in the `dist/` folder:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Source maps (optional)

4. **Test the build:**
```bash
npm run preview
```

This starts a local server to test the production build.

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Advantages:**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Preview deployments
- Environment variables management

**Steps:**

1. **Create Vercel account:** https://vercel.com

2. **Connect GitHub repository:**
```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/vanshguptaji/Bhumio_frontend.git
git push -u origin main
```

3. **Import project on Vercel:**
   - Go to vercel.com/new
   - Select "Import Git Repository"
   - Choose the Bhumio_frontend repo
   - Click Import

4. **Configure environment variables:**
   - Settings → Environment Variables
   - Add: `VITE_API_URL=https://api.yourdomain.com`

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live at `bhumio-frontend.vercel.app`

6. **Connect custom domain** (optional):
   - Settings → Domains
   - Add your custom domain
   - Update DNS records

---

### Option 2: Netlify

**Advantages:**
- Git-based deployments
- Automatic SSL
- Form handling
- Split testing

**Steps:**

1. **Create Netlify account:** https://netlify.com

2. **Connect Git repository:**
   - Click "New site from Git"
   - Choose GitHub
   - Select Bhumio_frontend repo

3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set environment variables:**
   - Site settings → Build & deploy → Environment
   - Add: `VITE_API_URL=https://api.yourdomain.com`

5. **Deploy:**
   - Click Deploy site
   - Monitor build in Deploys tab

6. **Custom domain:**
   - Site settings → Domain management
   - Add custom domain

---

### Option 3: AWS S3 + CloudFront

**Advantages:**
- Highly scalable
- Global distribution
- Cost-effective
- Full control

**Prerequisites:**
- AWS account
- AWS CLI installed

**Steps:**

1. **Build the application:**
```bash
npm run build
```

2. **Create S3 bucket:**
```bash
# Set bucket name
BUCKET_NAME="bhumio-frontend-prod"

# Create bucket
aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document index.html
```

3. **Set bucket policy:**
```bash
# Create policy.json
cat > policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
EOF

# Replace BUCKET_NAME and apply
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://policy.json
```

4. **Upload build files:**
```bash
aws s3 sync dist/ s3://$BUCKET_NAME \
  --delete \
  --cache-control "max-age=31536000" \
  --exclude "index.html"

# Special handling for index.html (no cache)
aws s3 cp dist/index.html s3://$BUCKET_NAME/index.html \
  --cache-control "no-cache"
```

5. **Create CloudFront distribution:**
   - AWS CloudFront console
   - Create distribution
   - S3 origin: s3://bucket-name
   - Default root object: index.html
   - Redirect HTTP to HTTPS
   - Create distribution

6. **Update DNS:**
   - Point domain CNAME to CloudFront URL

---

### Option 4: Docker + Container Registry

**Advantages:**
- Consistent environment
- Easy scaling
- Container orchestration ready

**Steps:**

1. **Create Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

2. **Build Docker image:**
```bash
docker build -t bhumio-frontend:1.0.0 .
```

3. **Test locally:**
```bash
docker run -p 3000:3000 \
  -e VITE_API_URL=http://localhost:3000 \
  bhumio-frontend:1.0.0
```

4. **Push to registry:**

**Docker Hub:**
```bash
docker tag bhumio-frontend:1.0.0 yourusername/bhumio-frontend:1.0.0
docker login
docker push yourusername/bhumio-frontend:1.0.0
```

**AWS ECR:**
```bash
aws ecr create-repository --repository-name bhumio-frontend

docker tag bhumio-frontend:1.0.0 \
  ACCOUNT.dkr.ecr.REGION.amazonaws.com/bhumio-frontend:1.0.0

docker push ACCOUNT.dkr.ecr.REGION.amazonaws.com/bhumio-frontend:1.0.0
```

5. **Deploy to:**
   - Heroku
   - ECS
   - Kubernetes
   - Google Cloud Run
   - Azure Container Instances

---

### Option 5: Heroku

**Advantages:**
- Easy Git-based deployment
- Built-in environment management
- Easy scaling

**Steps:**

1. **Create Heroku app:**
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create bhumio-frontend
```

2. **Create Procfile:**
```bash
cat > Procfile << 'EOF'
web: npm run build && npx serve -s dist -l $PORT
EOF
```

3. **Add buildpacks:**
```bash
heroku buildpacks:add heroku/nodejs
```

4. **Set environment variables:**
```bash
heroku config:set VITE_API_URL=https://api.yourdomain.com
```

5. **Deploy:**
```bash
git push heroku main
```

6. **View logs:**
```bash
heroku logs --tail
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

**Create `.github/workflows/deploy.yml`:**

```yaml
name: Deploy Frontend

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📊 Performance Optimization

### Before Deployment

1. **Analyze bundle size:**
```bash
npm install -g vite-plugin-visualizer

# Then run build and check report
```

2. **Test with Lighthouse:**
   - Build and serve: `npm run preview`
   - Open Chrome DevTools (F12)
   - Go to Lighthouse
   - Run audit

3. **Optimize images:**
   - Use WebP format where possible
   - Compress PNG/JPEG files
   - Use appropriate dimensions

4. **Enable compression:**
   - Gzip enabled on server
   - Brotli for modern browsers

### vite.config.js Optimization

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'brotli',
      ext: '.br',
    })
  ],
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
```

---

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] API CORS properly set
- [ ] Environment secrets not in code
- [ ] Sensitive endpoints require authentication
- [ ] Rate limiting enabled
- [ ] Input validation on backend
- [ ] CSRF protection enabled
- [ ] XSS protection headers set
- [ ] Dependencies scanned for vulnerabilities

**Check vulnerabilities:**
```bash
npm audit
npm audit fix
```

---

## 📈 Monitoring & Logging

### Essential Metrics

1. **Uptime**: Monitor 24/7
2. **Response Time**: Track API latency
3. **Error Rate**: Monitor 4xx/5xx errors
4. **User Activity**: Track page views, submissions
5. **Performance**: Monitor Core Web Vitals

### Recommended Tools

- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay and analytics
- **Datadog**: Infrastructure monitoring
- **New Relic**: Full stack monitoring
- **Cloudflare Analytics**: CDN analytics

### Integration Example (Sentry)

```bash
npm install @sentry/react

# In main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/xxx",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

---

## 🔄 Rollback Procedure

### Vercel
1. Go to Deployments
2. Click the previous deployment
3. Click "Redeploy"

### Netlify
1. Go to Deploys
2. Select previous deployment
3. Click "Publish Deploy"

### AWS
1. Update S3 with previous build
2. Invalidate CloudFront cache

```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Build size checked
- [ ] Environment variables set
- [ ] API endpoints verified
- [ ] Database migrations completed
- [ ] SSL certificate valid
- [ ] CDN configured
- [ ] Monitoring setup
- [ ] Backup created
- [ ] Team notified
- [ ] Documentation updated

---

## 🆘 Troubleshooting

### Build fails
```bash
# Clear cache
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### API calls fail after deploy
- Check CORS on backend
- Verify API URL in environment
- Check API authentication tokens

### Styles not loading
- Ensure Tailwind is built
- Check CSS minification
- Verify asset paths

### Slow performance
- Analyze bundle size
- Check network requests
- Use DevTools Lighthouse

---

## 📞 Support & Escalation

1. **Check logs**: `npm run preview` output
2. **Verify environment**: Correct API URL set
3. **Test locally**: Ensure build works locally
4. **Contact DevOps**: If infrastructure issue

---

**Last Updated:** June 17, 2026
**Version:** 1.0.0
