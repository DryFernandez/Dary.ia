import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { sendMessageToN8N } from '../api/n8nChat';

export default function ChatModal({ visible, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: '¡Bienvenido a AlexIA! Soy el nuevo asistente virtual de AlexIA.' },
    { role: 'ai', text: 'Estoy aquí para ayudarte con la búsqueda de información.' },
    { role: 'ai', text: 'Ingresa la cédula que deseas consultar y te proporcionaré la información disponible. Al terminar tu consulta pulsa el botón de cerrar debajo del chat para seguir navegando por la página.' }
  ]);
  const [loading, setLoading] = useState(false);

  function getSessionId() {
    let sessionId = localStorage.getItem('colemon_session_id');
    if (!sessionId) {
      sessionId = 'sess-' + Math.random().toString(36).substr(2, 12);
      localStorage.setItem('colemon_session_id', sessionId);
    }
    return sessionId;
  }

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: input }]);
  const res = await sendMessageToN8N(input, getSessionId());
  const aiText = res.response || res.output || res.result || res.message || res.text || res.raw || res.reply || res.error || 'Sin respuesta';
  setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    setInput('');
    setLoading(false);
  };

  if (!visible) return null;
  return (
    <>
  <View className="flex-1 justify-end items-end bg-black/30 pointer-events-none" style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
  <View className="bg-white rounded-2xl shadow-2xl flex flex-col" style={{ position: 'absolute', bottom: 60, right: 32, width: 350, height: 600 }}>
          {/* Header */}
          <View className="px-5 py-4 bg-blue-600 rounded-t-2xl">
            <View className="flex-row items-center gap-2">
              {/* Logo y nombre alineados horizontalmente */}
              <View className="bg-white rounded-full p-1 mr-2 flex-row items-center">
                <Text className="text-2xl">🤖</Text>
              </View>
              <Text className="text-lg font-bold text-white">AlexIA</Text>
            </View>
          </View>
          {/* Body */}
          <View className="flex-1 px-5 py-6 bg-white overflow-y-auto">
            <View className="flex flex-col gap-2">
              {messages.map((item, i) => (
                <View key={i} className={item.role === 'user' ? 'flex items-end mb-2' : 'flex items-start mb-2'}>
                  <View
                    className={item.role === 'user'
                      ? 'bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-br-sm shadow-md max-w-[80%]'
                      : 'bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm border border-gray-200 shadow-md max-w-[80%]'}
                    style={{ alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start' }}
                  >
                    <Text className={item.role === 'user' ? 'text-white' : 'text-gray-800'}>{item.text}</Text>
                  </View>
                </View>
              ))}
              {loading && (
                <Text className="text-blue-600 text-lg">••••</Text>
              )}
            </View>
          </View>
          {/* Footer */}
          <View className="border-t border-gray-200 px-5 py-4 bg-gray-50 rounded-b-2xl">
            <Text className="text-sm text-gray-600 mb-2">Escribe tu mensaje:</Text>
            <View className="flex-row items-center gap-2 mb-2">
              <TextInput
                className="flex-1 border border-gray-300 rounded-full p-2 bg-white"
                value={input}
                onChangeText={setInput}
                placeholder="Escribe tu mensaje aquí..."
                editable={!loading}
              />
              <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-full" onPress={handleSend} disabled={loading}>
                <Text className="text-white font-bold">Enviar</Text>
              </TouchableOpacity>
            </View>
            {/* Botón de cerrar eliminado */}
          </View>
        </View>
      </View>
    </>
  );
}
