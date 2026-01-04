# 🚀 Netlify Deployment Guide for JMC Skincare

## Overview

This guide covers deploying the JMC Skincare frontend to Netlify.

**Important**: Netlify hosts static sites only. Your Node.js backend needs to be deployed separately.

---

## 📋 Prerequisites

1. GitHub account with your code pushed
2. Netlify account (free tier works)
3. Backend deployed somewhere (Railway, Render, Heroku, etc.)

---

## 🎯 Quick Deploy

### Option 1: Deploy via Netlify Dashboard

1. **Push code to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize
   - Choose your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com`

### Option 2: Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy (draft)
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## ⚙️ Configuration Files

### netlify.toml

Located in project root. Contains:

- Build settings
- Redirect rules for SPA
- API proxy configuration
- Security headers
- Cache policies

### public/_redirects

Backup redirect rules (in case TOML isn't read)

---

## 🔧 Environment Variables

Set these in Netlify Dashboard (Site settings → Environment variables):

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Your backend API URL | `https://api.jmcskincare.com` |
| `VITE_GA_TRACKING_ID` | Google Analytics ID | `G-XXXXXXXXXX` |

---

## 🌐 API Proxy Setup

### Update netlify.toml

Replace this line with your actual backend URL:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-backend.com/api/:splat"
  status = 200
  force = true
```

### Backend Deployment Options

| Platform | Cost | Best For |
|----------|------|----------|
| **Railway** | Free tier | Easy deployment |
| **Render** | Free tier | Auto-deploy |
| **Heroku** | $5/mo | Established apps |
| **DigitalOcean** | $5/mo | Full control |
| **AWS EC2** | Pay-as-go | Enterprise |

---

## 📱 Custom Domain

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `jmcskincare.com`)
4. Update DNS records:
   - Type: `A` or `CNAME`
   - Follow Netlify instructions

### SSL Certificate

- Automatically provisioned by Netlify
- Free via Let's Encrypt

---

## 🔒 Security Headers

Already configured in `netlify.toml`:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- Strict CSP headers

---

## 📦 Build Settings

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Vite Configuration

Your `vite.config.js` should work as-is for Netlify.

---

## 🐛 Troubleshooting

### Build Fails

**Check Node version:**

```bash
# In netlify.toml
[build.environment]
  NODE_VERSION = "20"
```

**Check dependencies:**

```bash
npm install
npm run build
```

### 404 on Page Refresh

The `_redirects` file should handle this. If not:

1. Ensure `public/_redirects` exists
2. Check netlify.toml redirect rules
3. Verify `dist/_redirects` after build

### API Calls Failing

1. Check CORS on your backend
2. Verify `VITE_API_URL` is set
3. Check API proxy in netlify.toml

### Images Not Loading

Ensure images are in `public/images/` or imported correctly.

---

## 🚀 Continuous Deployment

Once connected to GitHub:

- Every push to `main` triggers a new deploy
- Pull requests get preview URLs
- Rollback with one click in dashboard

---

## 📊 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All routes work (no 404s)
- [ ] API calls connect to backend
- [ ] Images load properly
- [ ] Mobile responsive works
- [ ] SSL certificate active
- [ ] Custom domain configured (optional)
- [ ] Google Analytics working (optional)

---

## 🔗 Useful Links

- [Netlify Docs](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)

---

## 💡 Backend Deployment

For your Node.js backend, I recommend **Railway**:

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo (select `server` folder)
3. Add environment variables from `.env`
4. Deploy automatically
5. Get your URL (e.g., `https://jmc-backend.railway.app`)
6. Update `netlify.toml` with this URL

---

**Happy Deploying!** 🎉
