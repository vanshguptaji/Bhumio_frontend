/**
 * Environment Configuration
 * Centralized configuration for all environment variables
 */

export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 30000,
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Bhumio',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },

  // Debug Configuration
  debug: import.meta.env.VITE_DEBUG === 'true' || false,

  // Validate configuration on startup
  validate() {
    if (!this.api.baseURL) {
      console.warn('⚠️ VITE_API_URL not set, using default: http://localhost:3000');
    }
    if (this.debug) {
      console.log('🔍 Debug mode enabled');
      console.log('📡 API URL:', this.api.baseURL);
    }
  },
};

// Validate on import
config.validate();

export default config;
