interface ChatRequest {
  message: string;
  session_id?: string;
}

interface ChatResponse {
  response: string;
  session_id: string;
}

// Base URL for the chat API - can be configured via environment variable
// Defaults to localhost:8080
const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8080';

export async function sendChatMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  // Construct URL with base endpoint
  const url = `${CHAT_API_BASE_URL}/v1/sales/chat`;
  
  const body: ChatRequest = {
    message,
  };
  
  // Include session_id only if it exists (not for first message)
  if (sessionId) {
    body.session_id = sessionId;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data || !data.response || !data.session_id) {
      console.error('Invalid response format', data);
      throw new Error('Invalid response format');
    }

    return {
      response: data.response,
      session_id: data.session_id,
    };
  } catch (error) {
    // Enhance error message
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof Error) {
      throw new Error(`Chat API request failed: ${error.message}`);
    } else {
      throw new Error('Chat API request failed');
    }
  }
}

