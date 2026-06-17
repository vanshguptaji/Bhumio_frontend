# 🎯 Environment Configuration Update Summary

## What Changed

All API configuration has been **centralized** into a single configuration file to ensure consistency across the entire application.

## Key Changes

### 1. **New Config File** (`src/config/index.js`)
- Centralized configuration management
- All environment variables in one place
- Automatic validation on startup
- Debug logging support

### 2. **Updated Axios** (`src/api/axios.js`)
- Now imports from centralized config
- Uses `config.api.baseURL` instead of direct env variable
- Uses `config.api.timeout` for consistency

### 3. **Environment Variables** (`.env*` files)
```bash
# API Configuration
VITE_API_URL=http://localhost:3000

# App Configuration
VITE_APP_NAME=Bhumio
VITE_APP_VERSION=1.0.0

# Debug Mode
VITE_DEBUG=false
```

## How to Use

### Setup

```bash
# 1. Create local env file
cp .env.example .env.local

# 2. Edit with your values
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true

# 3. Start dev server
npm run dev
```

### In Code

Instead of scattered env variables, use the centralized config:

```javascript
// ❌ OLD - Direct env variable access
const baseURL = import.meta.env.VITE_API_URL;

// ✅ NEW - Use centralized config
import config from './config';
const baseURL = config.api.baseURL;
```

### API Calls

All API calls automatically use the configured baseURL:

```javascript
import api from './api/axios';

// Automatically uses config.api.baseURL
api.get('/api/v1/properties');
```

## Benefits

✅ **Single Source of Truth**: All configuration in one place
✅ **Easy to Change**: Update API URL in one file
✅ **Consistency**: All parts of app use same config
✅ **Validation**: Automatic checks on startup
✅ **Debug Support**: Built-in logging for development
✅ **Environment Specific**: Easy to set per environment

## Configuration Reference

See **[ENV_GUIDE.md](./ENV_GUIDE.md)** for complete documentation:
- How to set environment variables
- Per-environment configuration
- Deployment instructions
- Troubleshooting guide

## Deployment

### Development
```bash
cp .env.example .env.local
VITE_API_URL=http://localhost:3000
npm run dev
```

### Production
```bash
# Set environment variables
export VITE_API_URL=https://api.yourdomain.com
export VITE_DEBUG=false

# Build
npm run build
```

### Docker/Container
```bash
ENV VITE_API_URL=https://api.yourdomain.com
ENV VITE_DEBUG=false
```

## Files Changed

- ✅ Created: `src/config/index.js`
- ✅ Updated: `src/api/axios.js`
- ✅ Updated: `.env.example`
- ✅ Created: `ENV_GUIDE.md`

## Next Steps

1. Review `ENV_GUIDE.md` for complete reference
2. Copy `.env.example` to `.env.local`
3. Set your `VITE_API_URL` to your backend
4. Restart development server
5. Check console for validation messages

---

**Status**: ✅ **Complete**
**Date**: June 17, 2026
