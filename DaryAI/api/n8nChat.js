// Endpoint para enviar mensajes al workflow de n8n
export async function sendMessageToN8N(chatInput, sessionId) {
  try {
    const response = await fetch('https://daryff.app.n8n.cloud/webhook/ebaee106-fa44-4a36-b548-42bc6a107b82', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatInput, sessionId }),
    });
    if (!response.ok) throw new Error('Error en la petición a n8n');
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: 'Respuesta inválida del servidor', raw: text };
    }
  } catch (error) {
    return { error: error.message };
  }
}
