import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { tw } from 'nativewind';
import { googlePhotosService } from '../services/googlePhotosService';
import GooglePhotosSetup from '../components/GooglePhotosSetup';

const { width } = Dimensions.get('window');
const numColumns = 3;
const imageSize = (width - 40) / numColumns - 10;

export default function FotosScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('photos'); // 'photos' o 'albums'
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    // Verificar si las credenciales están configuradas
    const { GOOGLE_CONFIG } = require('../config/googleConfig');
    const hasValidConfig = GOOGLE_CONFIG.clientId && !GOOGLE_CONFIG.clientId.includes('TU_CLIENT_ID');

    if (!hasValidConfig) {
      setShowSetup(true);
      return;
    }

    checkAuthentication();
  };

  const handleRetryAfterSetup = () => {
    setShowSetup(false);
    checkConfiguration();
  };

  const checkAuthentication = () => {
    const authenticated = googlePhotosService.isAuthenticated();
    setIsAuthenticated(authenticated);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('Iniciando proceso de autenticación...');

      // Por ahora, simularemos la autenticación
      // En producción, esto abriría el navegador para OAuth
      const result = await googlePhotosService.signInWithGoogle();

      if (result.success) {
        googlePhotosService.setTokens(result.accessToken, result.refreshToken);
        setIsAuthenticated(true);
        Alert.alert('Éxito', 'Conectado a Google Photos exitosamente');

        // Cargar fotos iniciales
        await loadRecentPhotos();
      } else {
        Alert.alert('Error', result.error || 'No se pudo conectar a Google Photos');
      }
    } catch (error) {
      console.error('Error en sign in:', error);
      Alert.alert('Error', 'Hubo un problema al conectar con Google Photos');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentPhotos = async () => {
    try {
      setLoading(true);
      const recentPhotos = await googlePhotosService.getRecentPhotos(50);
      setPhotos(recentPhotos);
      console.log(`Cargadas ${recentPhotos.length} fotos recientes`);
    } catch (error) {
      console.error('Error cargando fotos:', error);
      Alert.alert('Error', 'No se pudieron cargar las fotos');
    } finally {
      setLoading(false);
    }
  };

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const userAlbums = await googlePhotosService.getAlbums();
      setAlbums(userAlbums);
      setCurrentView('albums');
      console.log(`Cargados ${userAlbums.length} álbumes`);
    } catch (error) {
      console.error('Error cargando álbumes:', error);
      Alert.alert('Error', 'No se pudieron cargar los álbumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    googlePhotosService.signOut();
    setIsAuthenticated(false);
    setPhotos([]);
    setAlbums([]);
    setCurrentView('photos');
    Alert.alert('Sesión cerrada', 'Has cerrado sesión de Google Photos');
  };

  const renderPhoto = ({ item }) => (
    <TouchableOpacity
      className="m-1 rounded-lg overflow-hidden"
      onPress={() => {
        // Aquí podrías abrir una vista detallada de la foto
        Alert.alert('Foto', `Título: ${item.filename || 'Sin título'}`);
      }}
    >
      <Image
        source={{ uri: `${item.baseUrl}=w${Math.floor(imageSize * 2)}` }}
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: 8
        }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderAlbum = ({ item }) => (
    <TouchableOpacity
      className="m-2 p-4 bg-gray-100 rounded-lg"
      onPress={() => {
        Alert.alert('Álbum', `Título: ${item.title}\n${item.mediaItemsCount || 0} fotos`);
      }}
    >
      <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
      <Text className="text-sm text-gray-600">
        {item.mediaItemsCount || 0} fotos
      </Text>
    </TouchableOpacity>
  );

  if (showSetup) {
    return <GooglePhotosSetup onRetry={handleRetryAfterSetup} />;
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Conecta con Google Photos
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Para ver tus fotos, necesitas conectarte con tu cuenta de Google Photos
        </Text>

        <TouchableOpacity
          className="bg-blue-600 px-8 py-4 rounded-lg shadow-lg"
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Conectar con Google
            </Text>
          )}
        </TouchableOpacity>

        <Text className="text-xs text-gray-500 text-center mt-4 px-4">
          Se requiere acceso de solo lectura a tus fotos y álbumes
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header con navegación */}
      <View className="flex-row justify-between items-center p-4 bg-blue-600">
        <Text className="text-white font-bold text-lg">Google Photos</Text>
        <View className="flex-row">
          <TouchableOpacity
            className={`px-3 py-1 rounded mr-2 ${currentView === 'photos' ? 'bg-white' : 'bg-blue-700'}`}
            onPress={() => setCurrentView('photos')}
          >
            <Text className={currentView === 'photos' ? 'text-blue-600' : 'text-white'}>
              Fotos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-3 py-1 rounded mr-2 ${currentView === 'albums' ? 'bg-white' : 'bg-blue-700'}`}
            onPress={loadAlbums}
          >
            <Text className={currentView === 'albums' ? 'text-blue-600' : 'text-white'}>
              Álbumes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-3 py-1 bg-red-600 rounded"
            onPress={handleSignOut}
          >
            <Text className="text-white">Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-gray-600 mt-2">Cargando...</Text>
        </View>
      ) : currentView === 'photos' ? (
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={{ padding: 10 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-500 text-center">
                No hay fotos disponibles.{'\n'}Intenta recargar la página.
              </Text>
              <TouchableOpacity
                className="mt-4 bg-blue-600 px-4 py-2 rounded"
                onPress={loadRecentPhotos}
              >
                <Text className="text-white">Recargar</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-500 text-center">
                No hay álbumes disponibles.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
