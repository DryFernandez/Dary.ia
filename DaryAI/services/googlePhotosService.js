import { GOOGLE_CONFIG, GOOGLE_PHOTOS_API } from '../config/googleConfig';

class GooglePhotosService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  // Configurar Google Sign-In
  configureGoogleSignin() {
    // Esta configuración se haría en el lado nativo
    // Para React Native CLI, necesitarías configurar en AndroidManifest.xml e Info.plist
    console.log('Configurando Google Sign-In...');
  }

  // Iniciar sesión con Google
  async signInWithGoogle() {
    try {
      console.log('Iniciando sesión con Google...');

      // Para Expo, usar expo-auth-session
      const redirectUri = GOOGLE_CONFIG.redirectUri;
      const clientId = GOOGLE_CONFIG.clientId;

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(GOOGLE_CONFIG.scopes.join(' '))}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`;

      console.log('URL de autenticación:', authUrl);

      // Aquí iría la lógica para abrir el navegador y manejar la respuesta
      // Por ahora, simularemos una respuesta exitosa
      return {
        success: true,
        accessToken: 'simulated_access_token',
        refreshToken: 'simulated_refresh_token'
      };

    } catch (error) {
      console.error('Error en signInWithGoogle:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener álbumes de fotos
  async getAlbums() {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso. Inicia sesión primero.');
      }

      const response = await fetch(`${GOOGLE_PHOTOS_API.baseUrl}${GOOGLE_PHOTOS_API.albums}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.albums || [];

    } catch (error) {
      console.error('Error obteniendo álbumes:', error);
      return [];
    }
  }

  // Obtener fotos recientes
  async getRecentPhotos(count = 20) {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso. Inicia sesión primero.');
      }

      const response = await fetch(`${GOOGLE_PHOTOS_API.baseUrl}${GOOGLE_PHOTOS_API.mediaItems}?pageSize=${count}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.mediaItems || [];

    } catch (error) {
      console.error('Error obteniendo fotos recientes:', error);
      return [];
    }
  }

  // Buscar fotos por fecha
  async searchPhotosByDate(startDate, endDate) {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso. Inicia sesión primero.');
      }

      const searchRequest = {
        filters: {
          dateFilter: {
            ranges: [{
              startDate: { year: startDate.getFullYear(), month: startDate.getMonth() + 1, day: startDate.getDate() },
              endDate: { year: endDate.getFullYear(), month: endDate.getMonth() + 1, day: endDate.getDate() }
            }]
          }
        }
      };

      const response = await fetch(`${GOOGLE_PHOTOS_API.baseUrl}${GOOGLE_PHOTOS_API.search}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchRequest)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.mediaItems || [];

    } catch (error) {
      console.error('Error buscando fotos por fecha:', error);
      return [];
    }
  }

  // Establecer tokens de acceso
  setTokens(accessToken, refreshToken = null) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return this.accessToken !== null;
  }

  // Cerrar sesión
  signOut() {
    this.accessToken = null;
    this.refreshToken = null;
  }
}

// Exportar instancia singleton
export const googlePhotosService = new GooglePhotosService();
