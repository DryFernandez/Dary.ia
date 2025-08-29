import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSession } from '../contexts/SessionContext';

export default function SettingsScreen({ navigation }) {
  const { logout, user } = useSession();

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        // Navigation will happen automatically due to session state change
        console.log('Logout successful');
      } else {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Cambiar contraseña</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Notificaciones</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleLogout}>
        <Text style={styles.optionText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 32,
  },
  option: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  optionText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '500',
  },
});
