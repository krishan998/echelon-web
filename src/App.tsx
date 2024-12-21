import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsView } from './components/ResultsView';
import { LoadingModal } from './components/LoadingModal';
import { convertFileToBase64, storeFileData } from './utils/fileUtils';
import { ExtractionResponse } from './types';
import { sampleInvoiceData } from './mocks/sampleData';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleExtraction = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const base64Data = await convertFileToBase64(selectedFile);
      storeFileData(selectedFile, base64Data);

      // Replace with your actual API endpoint
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64Data,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Extraction failed');
      }

      const data = await response.json();
      setExtractedData(data);
    } catch (error) {
      console.error('Error during extraction:', error);
      setError('API call failed. Showing sample data instead.');
      // Using the sample response structure for the error case
      setExtractedData({
        status: "succeeded",
        createdDateTime: new Date().toISOString(),
        lastUpdatedDateTime: new Date().toISOString(),
        analyzeResult: {
          apiVersion: "2024-02-29-preview",
          modelId: "prebuilt-layout",
          content: "Sample content",
          tables: [
            {
              rowCount: 3,
              columnCount: 5,
              cells: [
                // ... sample cells from the provided response
              ],
              boundingRegions: []
            }
          ],
          paragraphs: []
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (extractedData) {
    return <ResultsView extractedData={extractedData} error={error} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {isLoading && <LoadingModal />}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">
          Transform PDFs & Images into Structured Data
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Document Upload</h2>
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
        </section>

        <button
          onClick={handleExtraction}
          disabled={!selectedFile}
          className={`w-full py-3 px-4 rounded-lg text-white text-lg font-medium transition-colors ${
            selectedFile
              ? 'bg-black hover:bg-gray-800'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Begin Extraction
        </button>

        <p className="mt-4 text-gray-600">
          We accept PDF and Image files. For the demo we limit it to 1 doc per extraction.
        </p>
      </div>
    </div>
  );
}