import { useState, useEffect } from 'react';
import { ApiResponse } from '../types';
import { extractDocument } from '../api/documentApi';
import { sampleInvoiceData } from '../mocks/sampleData';

interface ExtractDocumentProps {
  file: File | null;
  base64Data: string;
}

export function useDocumentExtraction({ file, base64Data }: ExtractDocumentProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!file || !base64Data) return;

    let timeoutId: NodeJS.Timeout;
    const controller = new AbortController();

    const extractData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Set timeout for 30 seconds
        const timeoutPromise = new Promise<ApiResponse>((_, reject) => {
          timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error('Request timeout'));
          }, 30000);
        });

        // API request promise
        const apiPromise = extractDocument({
          base64Source: base64Data,
          fileName: file.name,
          fileType: file.type,
        }, controller.signal);

        const response = await Promise.race([apiPromise, timeoutPromise]);

        clearTimeout(timeoutId);

        // Validate response structure
        if (!response || !response.documents || response.documents.length === 0) {
          throw new Error('Invalid response format');
        }

        setData(response);
      } catch (err) {
        console.error('Error during extraction:', err);
        
        // Handle different error cases
        if (err instanceof Error && (err.name === 'AbortError' || err.message === 'Request timeout')) {
          setData(null);
          setError('API request taking too long to process. Showing sample response instead.');
        } else {
          setData(sampleInvoiceData as any);
          setError('Failed to process document. Using sample data instead.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    extractData();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [file, base64Data]);

  return { data, error, isLoading };
}