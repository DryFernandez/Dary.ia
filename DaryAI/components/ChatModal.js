import React, { useState, useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChatModal = ({ visible, onClose, messages = [], onSend, user = 'yo' }) => {
  const [input, setInput] = useState('');

  const scrollViewRef = useRef();

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.closeButtonOverlay} onPress={onClose}>
          <MaterialIcons name="close" size={32} color="#fff" />
        </TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Chat</Text>
          </View>
          <ScrollView
            style={styles.messagesContainer}
            ref={scrollViewRef}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
          >
            {messages && Array.isArray(messages) && messages.map((msg, idx) => {
              // Si el mensaje es un objeto, puede tener {text, sender}
              let text = msg;
              let sender = 'bot';
              if (typeof msg === 'object') {
                text = msg.text;
                sender = msg.sender || 'bot';
              }
              const isUser = sender === user;
              return (
                <View
                  key={idx}
                  style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowBot]}
                >
                  <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
                    <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>{text}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#888"
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 100,
    paddingRight: 20,
  },
  container: {
    width: '85%',
    height: '60%',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    maxWidth: 350,
    maxHeight: 500,
    zIndex: 1002,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#6366f1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomWidth: 1,
    borderColor: '#e0e7ef',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  closeButtonOverlay: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2563eb',
    borderRadius: 50,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1003,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  userBubble: {
    backgroundColor: '#6366f1',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#111827',
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#111827',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    marginRight: 10,
    color: '#111827',
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 12,
    elevation: 2,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default ChatModal;
