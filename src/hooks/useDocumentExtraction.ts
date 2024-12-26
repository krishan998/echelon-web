import { useState, useEffect } from 'react';
import { InvoiceResponse } from '../types';
import { extractDocument } from '../api/documentApi';
import { sampleInvoiceResponse } from '../mocks/sampleInvoiceResponse';

interface ExtractDocumentProps {
  file: File | null;
  base64Data: string;
}

export function useDocumentExtraction({ file, base64Data }: ExtractDocumentProps) {
  const [data, setData] = useState<InvoiceResponse | null>(null);
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
        timeoutId = setTimeout(() => {
          controller.abort();
          setData(sampleInvoiceResponse);
          setError('API request taking too long to process. Showing sample response instead.');
        }, 30000);

        const response = await extractDocument({
          base64Source: base64Data,
          fileName: file.name,
          fileType: file.type,
        }, controller.signal);

        clearTimeout(timeoutId);
        setData(response);
      } catch (err) {
        if (err.name === 'AbortError') return;
        
        console.error('Error during extraction:', err);
        setData(sampleInvoiceResponse);
        setError('Failed to process document. Using sample data instead.');
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