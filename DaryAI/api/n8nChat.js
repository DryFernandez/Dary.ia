// Función de prueba para verificar la conectividad con N8N
export async function testN8NConnection() {
  try {
    console.log('Probando conexión con N8N...');
    const response = await sendMessageToN8N('test', 'test-session');
    console.log('Resultado del test:', response);
    return response;
  } catch (error) {
    console.error('Error en test de conexión:', error);
    return { error: error.message };
  }
}

// Endpoint para enviar mensajes al workflow de n8n
export async function sendMessageToN8N(chatInput, sessionId) {
  try {
    const response = await fetch('https://daryfernand.app.n8n.cloud/webhook-test/bd6f916d-e24f-477b-baa1-da95c8c1ee1b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatInput, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    console.log('Respuesta cruda de N8N:', text);

    // Intentar parsear como JSON
    try {
      const jsonResponse = JSON.parse(text);
      console.log('Respuesta JSON parseada:', jsonResponse);
      return jsonResponse;
    } catch (parseError) {
      console.log('No es JSON válido, devolviendo como texto:', parseError);
      // Si no es JSON válido, devolver el texto como respuesta
      return { output: text, raw: text };
    }
  } catch (error) {
    console.error('Error en sendMessageToN8N:', error);
    return { error: error.message };
  }
}
