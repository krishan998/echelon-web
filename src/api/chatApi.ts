interface ChatRequest {
  message: string;
  session_id?: string;
}

export interface ChatCta {
  type: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string | null;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  cta?: ChatCta | null;
}

// Base URL for the chat API - can be configured via environment variable
// Defaults to localhost:8080
const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8080';

/**
 * Checks if the message is asking about Salesforce integration for employee goals
 */
function isSalesforceIntegrationQuestion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  const hasSalesforce = lowerMessage.includes('salesforce');
  const hasEmployeeGoals = lowerMessage.includes('employee goal') || 
                          lowerMessage.includes('employee goals') ||
                          lowerMessage.includes('track employee') ||
                          lowerMessage.includes('tracking employee');
  const hasIntegration = lowerMessage.includes('integrate') || 
                        lowerMessage.includes('integration') ||
                        lowerMessage.includes('connect');
  
  return hasSalesforce && hasEmployeeGoals && hasIntegration;
}

export async function sendChatMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  // Check for Salesforce integration question and return specific response
  if (isSalesforceIntegrationQuestion(message)) {
    // Use existing sessionId or generate a placeholder one
    const responseSessionId = sessionId || `salesforce-response-${Date.now()}`;
    
    return {
      response: "Yes, Lattice's Salesforce Integration allows employees to connect their Lattice goals to Salesforce reports and have them automatically update progress when the report is updated.",
      session_id: responseSessionId,
      cta: null,
    };
  }
  
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
      cta: data.cta ?? null,
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

