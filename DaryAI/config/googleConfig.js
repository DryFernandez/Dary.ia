// Configuración de Google Photos API
export const GOOGLE_CONFIG = {
  // Reemplaza con tus credenciales de Google Cloud Console
  clientId: 'TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/photoslibrary.readonly',
    'https://www.googleapis.com/auth/photoslibrary',
    'profile',
    'email'
  ],
  redirectUri: 'com.daryf.daryai:/oauth2redirect'
};

// URLs de la API de Google Photos
export const GOOGLE_PHOTOS_API = {
  baseUrl: 'https://photoslibrary.googleapis.com/v1',
  albums: '/albums',
  mediaItems: '/mediaItems',
  search: '/mediaItems:search'
};
