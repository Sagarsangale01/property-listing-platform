/**
 * Centralized Application Configuration
 */
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  appName: import.meta.env.VITE_APP_NAME || 'Real Estate Platform',
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
};
