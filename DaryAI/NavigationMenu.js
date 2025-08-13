import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FotosScreen, FechasImportantesScreen, CosasFavoritasScreen, DefinirFechasScreen } from './screens';
import { enableScreens } from 'react-native-screens';
import { View, TouchableOpacity, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChatModal from './components/ChatModal';
enableScreens();

const Drawer = createDrawerNavigator();

export default function NavigationMenu() {
  const [chatVisible, setChatVisible] = useState(false);
  return (
    <View className="flex-1">
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Fotos">
          <Drawer.Screen name="Fotos" component={FotosScreen} />
          <Drawer.Screen name="Fechas Importantes" component={FechasImportantesScreen} />
          <Drawer.Screen name="Cosas Favoritas" component={CosasFavoritasScreen} />
          <Drawer.Screen name="Definir Fechas" component={DefinirFechasScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
      <ChatModal visible={chatVisible} onClose={() => setChatVisible(false)} />
      {!chatVisible && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-blue-600 rounded-full p-4 shadow-lg z-50 cursor-pointer flex items-center justify-center"
          style={{ pointerEvents: 'auto' }}
          onPress={() => setChatVisible(true)}
        >
          <MaterialIcons name="chat" size={32} color="#fff" />
        </TouchableOpacity>
      )}
      {chatVisible && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-blue-600 rounded-full p-4 shadow-lg z-[1001] cursor-pointer flex items-center justify-center"
          style={{ pointerEvents: 'auto' }}
          onPress={() => setChatVisible(false)}
        >
          <MaterialIcons name="close" size={32} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
