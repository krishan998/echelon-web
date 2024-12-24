import { ExtractedData } from '../types';

const API_URL = 'https://doc-intelligence-backend.onrender.com/v1/doc/parse';

interface ExtractRequest {
  base64Source: string;
  fileName: string;
  fileType: string;
}

export async function extractDocument(request: ExtractRequest): Promise<ExtractedData> {
  const response = await fetch(`${API_URL}?modelID=prebuilt-invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.response) {
    throw new Error('Invalid response format');
  }

  return data;
}