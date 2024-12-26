import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsView } from './components/ResultsView';
import { LoadingModal } from './components/LoadingModal';
import { convertFileToBase64, storeFileData } from './utils/fileUtils';
import { extractDocument } from './api/documentApi';
import { sampleResponse } from './mocks/sampleResponse';
import type { ExtractedData } from './types';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
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

      const data = await extractDocument({
        base64Source: base64Data,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      });

      setExtractedData(data);
    } catch (error) {
      console.error('Error during extraction:', error);
      setError('Failed to process document. Using sample data instead.');
      setExtractedData(sampleResponse);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {isLoading && <LoadingModal />}
      {extractedData ? (
        <ResultsView data={extractedData} error={error} />
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">
            Transform PDFs & Images into Structured Data
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>
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
      )}
    </div>
  );
}