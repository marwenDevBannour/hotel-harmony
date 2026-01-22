// Configuration d'environnement
// Production: Lovable Cloud (Supabase)
// Développement: Spring Boot localhost

export type Environment = 'production' | 'development';

// Détecter l'environnement basé sur l'URL
export const getEnvironment = (): Environment => {
  const hostname = window.location.hostname;
  
  // En production sur Lovable (*.lovable.app, *.lovableproject.com)
  if (hostname.includes('lovable.app') || hostname.includes('lovableproject.com')) {
    return 'production';
  }
  
  // En local (localhost, 127.0.0.1)
  return 'development';
};

export const isProduction = (): boolean => getEnvironment() === 'production';
export const isDevelopment = (): boolean => getEnvironment() === 'development';

// Configuration des backends
export const config = {
  get backend() {
    return isProduction() ? 'supabase' : 'springboot';
  },
  
  get apiUrl() {
    return isDevelopment() 
      ? (import.meta.env.VITE_API_URL || 'http://localhost:8081/api')
      : ''; // Supabase n'utilise pas d'API URL directe
  },
};

console.log(`🌐 Environment: ${getEnvironment()} | Backend: ${config.backend}`);
