# Environment Configuration Guide

## Overview

All environment variables are centralized in `src/config/index.js` for easy management and consistency across the application.

## Environment Variables

### Backend API Configuration

```bash
VITE_API_URL=http://localhost:3000
```

- **Purpose**: Base URL for all API calls
- **Default**: `http://localhost:3000`
- **Usage**: Used in `axios` configuration
- **Environment**: All environments

**Example values:**
- Development: `http://localhost:3000`
- Staging: `https://api-staging.yourdomain.com`
- Production: `https://api.yourdomain.com`

### Application Configuration

```bash
VITE_APP_NAME=Bhumio
```

- **Purpose**: Application display name
- **Default**: `Bhumio`
- **Usage**: Browser title, branding
- **Environment**: All environments

```bash
VITE_APP_VERSION=1.0.0
```

- **Purpose**: Application version for tracking
- **Default**: `1.0.0`
- **Usage**: Logging, debugging
- **Environment**: All environments

### Debug Configuration

```bash
VITE_DEBUG=false
```

- **Purpose**: Enable debug logging
- **Default**: `false`
- **Values**: `true` or `false`
- **Usage**: Console logs for debugging
- **Environment**: Development only (recommended)

## Setup Instructions

### 1. Create Environment File

```bash
cp .env.example .env.local
```

### 2. Update Environment Variables

Edit `.env.local` with your values:

```bash
# Development
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true

# Staging
VITE_API_URL=https://api-staging.example.com
VITE_DEBUG=false

# Production
VITE_API_URL=https://api.example.com
VITE_DEBUG=false
```

### 3. Environment-Specific Files

Vite supports environment-specific files:

```bash
.env                 # All environments (shouldn't be committed)
.env.local           # Local machine (git ignored)
.env.development     # Development
.env.staging         # Staging
.env.production      # Production
```

## Using Configuration in Code

### Import the config

```javascript
import config from './config';

console.log(config.api.baseURL);        // http://localhost:3000
console.log(config.app.name);           // Bhumio
console.log(config.app.version);        // 1.0.0
console.log(config.debug);              // true or false
```

### In API calls (Axios)

```javascript
// Automatically uses config.api.baseURL
import api from './api/axios';

api.get('/api/v1/properties');  // → http://localhost:3000/api/v1/properties
```

### In components

```javascript
import config from './config';

function AppHeader() {
  return <h1>{config.app.name}</h1>;  // Displays: Bhumio
}
```

### For debugging

```javascript
import config from './config';

if (config.debug) {
  console.log('🔍 Debug mode is ON');
  console.log('📡 API URL:', config.api.baseURL);
  console.log('📱 App:', config.app.name);
}
```

## Runtime Validation

The config automatically validates on import and logs warnings:

```javascript
// If VITE_API_URL is not set:
// ⚠️ VITE_API_URL not set, using default: http://localhost:3000

// If debug mode is enabled:
// 🔍 Debug mode enabled
// 📡 API URL: http://localhost:3000
```

## Deployment Environment Variables

### Vercel

Settings → Environment Variables

```
VITE_API_URL=https://api.yourdomain.com
VITE_DEBUG=false
```

### Netlify

Site Settings → Build & Deploy → Environment

```
VITE_API_URL=https://api.yourdomain.com
VITE_DEBUG=false
```

### Docker

```dockerfile
ENV VITE_API_URL=https://api.yourdomain.com
ENV VITE_DEBUG=false
```

### AWS S3/CloudFront

Build with environment variables:

```bash
VITE_API_URL=https://api.yourdomain.com npm run build
```

## Development Workflow

### Local Development

```bash
# Copy example
cp .env.example .env.local

# Edit with local values
# VITE_API_URL=http://localhost:3000
# VITE_DEBUG=true

# Start dev server
npm run dev
```

### Building for Production

```bash
# Set production variables
export VITE_API_URL=https://api.yourdomain.com
export VITE_DEBUG=false

# Build
npm run build

# Or in one command
VITE_API_URL=https://api.yourdomain.com npm run build
```

## Troubleshooting

### Variables not updating

1. Restart dev server: `npm run dev`
2. Clear browser cache
3. Check file saved correctly
4. Verify variable name (must start with `VITE_`)

### API calls going to wrong URL

```javascript
import config from './config';

// Check current API URL
console.log(config.api.baseURL);

// Should match your VITE_API_URL variable
```

### Debug logs not showing

```javascript
import config from './config';

// Check debug setting
console.log(config.debug);

// Should be true if VITE_DEBUG=true
```

## Security Best Practices

✅ **DO:**
- Use environment variables for all configuration
- Keep `.env.local` in `.gitignore`
- Use different values per environment
- Commit `.env.example` to git

❌ **DON'T:**
- Commit `.env.local` or sensitive files
- Hardcode API URLs in code
- Use production secrets in development
- Expose sensitive information in client-side code

## Reference

### Config Object Structure

```javascript
config = {
  api: {
    baseURL: string,        // API base URL
    timeout: number,        // Request timeout (ms)
  },
  app: {
    name: string,          // Application name
    version: string,       // Application version
  },
  debug: boolean,          // Debug mode flag
  validate: function,      // Validation function
}
```

### Environment Variable Naming Convention

All environment variables must start with `VITE_`:

- ✅ `VITE_API_URL`
- ✅ `VITE_DEBUG`
- ❌ `API_URL` (won't work)
- ❌ `DEBUG` (won't work)

This is a Vite requirement for security.

## Next Steps

1. Copy `.env.example` to `.env.local`
2. Update `VITE_API_URL` to your backend URL
3. Set `VITE_DEBUG=true` for development
4. Restart dev server
5. Check console for validation messages

---

**Last Updated:** June 17, 2026
**Version:** 1.0.0
