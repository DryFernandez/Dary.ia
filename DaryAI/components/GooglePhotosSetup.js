import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { tw } from 'nativewind';

export default function GooglePhotosSetup({ onRetry }) {
  const openGoogleCloudConsole = () => {
    Linking.openURL('https://console.cloud.google.com/');
  };

  const openSetupGuide = () => {
    // Aquí podrías abrir el archivo README
    console.log('Abrir guía de configuración');
  };

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Configuración de Google Photos
      </Text>

      <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <Text className="text-yellow-800 font-semibold mb-2">
          ⚠️ Configuración requerida
        </Text>
        <Text className="text-yellow-700 text-sm">
          Para usar Google Photos, necesitas configurar credenciales en Google Cloud Console.
        </Text>
      </View>

      <View className="space-y-4">
        <View className="bg-gray-50 rounded-lg p-4">
          <Text className="font-semibold text-gray-800 mb-2">Paso 1: Crear proyecto</Text>
          <Text className="text-gray-600 text-sm">
            Ve a Google Cloud Console y crea un nuevo proyecto o selecciona uno existente.
          </Text>
        </View>

        <View className="bg-gray-50 rounded-lg p-4">
          <Text className="font-semibold text-gray-800 mb-2">Paso 2: Habilitar API</Text>
          <Text className="text-gray-600 text-sm">
            Habilita la "Photos Library API" en la biblioteca de APIs.
          </Text>
        </View>

        <View className="bg-gray-50 rounded-lg p-4">
          <Text className="font-semibold text-gray-800 mb-2">Paso 3: Crear credenciales</Text>
          <Text className="text-gray-600 text-sm">
            Crea un ID de cliente OAuth 2.0 con los scopes apropiados.
          </Text>
        </View>

        <View className="bg-gray-50 rounded-lg p-4">
          <Text className="font-semibold text-gray-800 mb-2">Paso 4: Configurar app</Text>
          <Text className="text-gray-600 text-sm">
            Actualiza el Client ID en config/googleConfig.js
          </Text>
        </View>
      </View>

      <View className="flex-row justify-center space-x-4 mt-8">
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-lg flex-1 mr-2"
          onPress={openGoogleCloudConsole}
        >
          <Text className="text-white font-semibold text-center">
            Ir a Google Cloud
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-600 px-6 py-3 rounded-lg flex-1 ml-2"
          onPress={openSetupGuide}
        >
          <Text className="text-white font-semibold text-center">
            Ver guía completa
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-green-600 px-6 py-3 rounded-lg mt-4"
        onPress={onRetry}
      >
        <Text className="text-white font-semibold text-center">
          Ya configuré, reintentar
        </Text>
      </TouchableOpacity>

      <Text className="text-xs text-gray-500 text-center mt-6 px-4">
        Una vez configurado, podrás ver todas tus fotos y álbumes de Google Photos directamente en la app.
      </Text>
    </ScrollView>
  );
}
