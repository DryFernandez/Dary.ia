import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import googleCalendarService from '../services/googleCalendarService';

export default function FechasImportantesScreen() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Placeholder: Replace with real access token from Google OAuth
  const accessToken = 'ACCESS_TOKEN';

  const handleCreateEvent = async () => {
    if (!title) {
      Alert.alert('Error', 'Por favor ingresa un título');
      return;
    }
    const event = {
      summary: title,
      start: { dateTime: date.toISOString() },
      end: { dateTime: new Date(date.getTime() + 60 * 60 * 1000).toISOString() }, // 1 hour event
    };
    try {
      await googleCalendarService.createEvent(accessToken, event);
      Alert.alert('Éxito', 'Evento creado en Google Calendar');
      setTitle('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el evento');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fechas Importantes</Text>
      <TextInput
        style={styles.input}
        placeholder="Título del evento"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#888"
      />
      <Button title="Seleccionar fecha" color="#4CAF50" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
      <Text style={styles.dateText}>Fecha seleccionada: {date.toLocaleDateString()}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Crear evento" color="#2196F3" onPress={handleCreateEvent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    color: '#222',
  },
  dateText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 16,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 350,
    marginTop: 8,
  },
});
