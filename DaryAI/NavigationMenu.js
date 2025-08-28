import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FotosScreen, FechasImportantesScreen, CosasFavoritasScreen, DefinirFechasScreen, CitaScreen, InicioScreen } from './screens';
import { enableScreens } from 'react-native-screens';
import { View, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChatModal from './components/ChatModal';
import { sendMessageToN8N } from './api/n8nChat';
enableScreens();

const Drawer = createDrawerNavigator();

export default function NavigationMenu() {
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
  return (
    <View className="flex-1">
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Inicio">
          <Drawer.Screen name="Fotos" component={FotosScreen} />
          <Drawer.Screen name="Fechas Importantes" component={FechasImportantesScreen} />
          <Drawer.Screen name="Cosas Favoritas" component={CosasFavoritasScreen} />
          <Drawer.Screen name="Definir Fechas" component={DefinirFechasScreen} />
          <Drawer.Screen name="Citas" component={CitaScreen} />
          <Drawer.Screen name="Inicio" component={InicioScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
      <ChatModal 
        visible={chatVisible} 
        onClose={() => setChatVisible(false)} 
        messages={messages}
        onSend={handleSendMessage}
      />
      {!chatVisible && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-blue-600 rounded-full p-4 shadow-lg z-[1000] cursor-pointer flex items-center justify-center"
          style={{ pointerEvents: 'auto' }}
          onPress={() => setChatVisible(true)}
        >
          <MaterialIcons name="chat" size={32} color="#fff" />
        </TouchableOpacity>
      )}
      {chatVisible && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-blue-600 rounded-full p-4 shadow-lg z-[1000] cursor-pointer flex items-center justify-center"
          style={{ pointerEvents: 'auto' }}
          onPress={() => setChatVisible(false)}
        >
          <MaterialIcons name="close" size={32} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
