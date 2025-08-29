import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { FotosScreen, FechasImportantesScreen, CosasFavoritasScreen, DefinirFechasScreen, CitaScreen, InicioScreen } from './screens';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { enableScreens } from 'react-native-screens';
import { View, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChatModal from './components/ChatModal';
import { sendMessageToN8N } from './api/n8nChat';
import { SessionProvider, useSession } from './contexts/SessionContext';

enableScreens();

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Inicio">
      <Drawer.Screen name="Fotos" component={FotosScreen} />
      <Drawer.Screen name="Fechas Importantes" component={FechasImportantesScreen} />
      <Drawer.Screen name="Cosas Favoritas" component={CosasFavoritasScreen} />
      <Drawer.Screen name="Definir Fechas" component={DefinirFechasScreen} />
      <Drawer.Screen name="Citas" component={CitaScreen} />
      <Drawer.Screen name="Inicio" component={InicioScreen} />
      <Drawer.Screen name="Configuración" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
      <Text style={{ fontSize: 18, color: '#666' }}>Cargando...</Text>
    </View>
  );
}
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function NavigationMenu() {
  const { isAuthenticated, isLoading } = useSession();
  const [currentRoute, setCurrentRoute] = useState('');
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([
    { text: '¡Hola! Soy tu asistente DaryAI. ¿En qué puedo ayudarte hoy?', sender: 'bot' }
  ]);

  const handleSendMessage = async (message) => {
    // Agregar el mensaje del usuario
    const userMessage = { text: message, sender: 'yo' };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      // Enviar mensaje a N8N
      console.log('Enviando mensaje a N8N:', message);
      const response = await sendMessageToN8N(message, 'session-123');
      console.log('Respuesta completa de N8N:', response);

      // Agregar respuesta del bot
      let botResponse = 'Lo siento, no pude procesar tu mensaje.';

      if (response && !response.error) {
        // Si la respuesta tiene un output directo
        if (response.output) {
          botResponse = response.output;
        }
        // Si la respuesta es un string directo
        else if (typeof response === 'string') {
          botResponse = response;
        }
        // Si es un objeto con message
        else if (response.message) {
          botResponse = response.message;
        }
        // Si es un objeto con text
        else if (response.text) {
          botResponse = response.text;
        }
        // Si es un objeto con data
        else if (response.data) {
          botResponse = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        }
        // Si es cualquier otro objeto, intentar convertirlo a string
        else if (typeof response === 'object') {
          botResponse = JSON.stringify(response);
        }
      } else if (response && response.error) {
        botResponse = `Error: ${response.error}`;
        if (response.raw) {
          botResponse += `\nRespuesta cruda: ${response.raw}`;
        }
      }

      console.log('Respuesta final del bot:', botResponse);
      const botMessage = { text: botResponse, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error en handleSendMessage:', error);
      // Respuesta de respaldo si N8N no funciona
      const fallbackResponse = `¡Hola! Recibí tu mensaje: "${message}". Actualmente estoy en modo de respaldo porque hay un problema con la conexión al servidor.`;
      const botMessage = { text: fallbackResponse, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }
  };

  // Track current route
  const handleStateChange = (state) => {
    if (state) {
      const route = state.routes[state.index];
      setCurrentRoute(route ? route.name : '');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderAppContent = () => (
    <View className="flex-1">
      <AppDrawer />
      {currentRoute && currentRoute !== 'Login' && (
        <>
          <ChatModal
            visible={chatVisible}
            onClose={() => setChatVisible(false)}
            messages={messages}
            onSend={handleSendMessage}
          />
          <View pointerEvents="box-none" style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 1000 }}>
            {!chatVisible ? (
              <TouchableOpacity
                className="bg-blue-600 rounded-full p-4 shadow-lg cursor-pointer flex items-center justify-center"
                onPress={() => setChatVisible(true)}
              >
                <MaterialIcons name="chat" size={32} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="bg-blue-600 rounded-full p-4 shadow-lg cursor-pointer flex items-center justify-center"
                onPress={() => setChatVisible(false)}
              >
                <MaterialIcons name="close" size={32} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );

  return (
    <NavigationContainer onStateChange={handleStateChange}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App">
            {() => renderAppContent()}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Wrap the entire app with SessionProvider
export function AppWithSession() {
  return (
    <SessionProvider>
      <NavigationMenu />
    </SessionProvider>
  );
}
