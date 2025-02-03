import { ApiResponse } from '../types';

const API_URL = 'https://doc-intelligence-backend.onrender.com/v1/doc/parse';

interface ExtractRequest {
  base64Source: string;
  fileName: string;
  fileType: string;
}

export async function extractDocument(
  request: ExtractRequest, 
  signal?: AbortSignal
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}?modelID=prebuilt-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data || !data.response || !Array.isArray(data.response.tables) || !Array.isArray(data.response.documents)) {
      console.error('Invalid response format', data);
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    // Enhance error message
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    } else {
      throw new Error('API request failed');
    }
  }
}