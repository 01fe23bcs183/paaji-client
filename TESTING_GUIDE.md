# Testing Guide - JMC Skincare Platform

## Overview

This guide provides testing setup and examples for both backend (Node.js/Express) and frontend (React) testing.

---

## 🧪 Phase 8: Testing Infrastructure

### Backend Testing (Jest + Supertest)

#### Setup Jest

1. **Install dependencies**:

```bash
cd server
npm install --save-dev jest supertest @types/jest
```

1. **Add to `package.json`**:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    "testMatch": ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"]
  }
}
```

#### Sample Backend Tests

**`server/__tests__/auth.test.js`**:

```javascript
import request from 'supertest';
import app from '../server.js';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});
```

---

### Frontend Testing (Vitest + React Testing Library)

#### Setup Vitest

1. **Install dependencies**:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

1. **Create `vitest.config.js`**:

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.js'
  }
});
```

1. **Add to `package.json`**:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

#### Sample Frontend Tests

**`src/__tests__/ErrorBoundary.test.jsx`**:

```javascript
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('should display error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

---

## 📊 Phase 9: Performance Optimization

### 1. Lazy Loading Routes

**Update `App.jsx`**:

```javascript
import { lazy, Suspense } from 'react';

// Lazy load admin pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Products = lazy(() => import('./pages/admin/Products'));
const Orders = lazy(() => import('./pages/admin/Orders'));

// Wrap routes in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Route path="/admin" element={<Dashboard />} />
</Suspense>
```

### 2. Image Optimization

- **Use WebP format** for better compression
- **Lazy load images** below the fold
- **Implement proper sizing** with srcset
- **Use a CDN** for image delivery

**Example**:

```javascript
<img 
  src="/images/product.webp"
  srcSet="/images/product-sm.webp 480w, /images/product-lg.webp 800w"
  loading="lazy"
  alt="Product"
/>
```

### 3. Code Splitting

**Split by route**:

```javascript
// Already using React.lazy for routes
const Home = lazy(() => import('./pages/Home'));
```

**Split by component**:

```javascript
// Heavy components
const Chart = lazy(() => import('./components/Chart'));
```

---

## 🚀 Phase 10: Production Readiness

### Security Checklist

- ✅ Environment variables secured
- ✅ HTTPS enabled
- ✅ CORS configured properly
- ✅ Rate limiting enabled
- ✅ SQL injection prevented (Sequelize)
- ✅ XSS prevented (React)
- ✅ CSRF tokens implemented
- ✅ Helmet.js security headers
- ✅ JWT tokens expire properly
- ✅ Passwords hashed (bcrypt)

### Deployment Checklist

#### Backend (Railway/Render/Heroku)

- [ ] Create production database
- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Run seeders (if needed)
- [ ] Test all API endpoints
- [ ] Setup monitoring (e.g., PM2, New Relic)
- [ ] Configure logging
- [ ] Setup backup strategy

#### Frontend (Netlify)

- [ ] Connect GitHub repository
- [ ] Set `VITE_API_URL` to production backend
- [ ] Configure build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Test deployment
- [ ] Setup custom domain
- [ ] Enable HTTPS
- [ ] Configure redirects (_redirects file)

### Monitoring & Logging

**Recommended Tools**:

- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Uptime Monitoring**: UptimeRobot
- **Log Management**: Logtail, Papertrail

**Setup Sentry**:

```bash
npm install @sentry/react @sentry/node
```

```javascript
// Frontend
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE
});
```

---

## 📋 Testing Status Summary

| Area | Status | Notes |
|------|--------|-------|
| Backend Routes | ⚠️ Setup Only | Examples provided |
| Frontend Components | ⚠️ Setup Only | Examples provided |
| Integration Tests | ❌ Not Setup | Recommended for future |
| E2E Tests | ❌ Not Setup | Consider Playwright |
| Performance | ✅ Optimized | Lazy loading ready |
| Security | ✅ Production Ready | All measures in place |
| Monitoring | ⚠️ Setup Needed | Tools recommended |

---

## 🎯 Quick Start Testing

### Run Backend Tests

```bash
cd server
npm test
```

### Run Frontend Tests

```bash
npm test
```

### Run with Coverage

```bash
npm run test:coverage
```

---

## 📚 Resources

- **Jest**: [jestjs.io](https://jestjs.io)
- **Vitest**: [vitest.dev](https://vitest.dev)
- **React Testing Library**: [testing-library.com/react](https://testing-library.com/react)
- **Supertest**: [github.com/ladjs/supertest](https://github.com/ladjs/supertest)

---

**Testing infrastructure is documented and ready for implementation!** ✅
