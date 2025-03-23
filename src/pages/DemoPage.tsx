import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { ResultsView } from '../components/ResultsView';
import { LoadingModal } from '../components/LoadingModal';
import { convertFileToBase64, storeFileData } from '../utils/fileUtils';
import { extractDocument } from '../api/documentApi';
import { sampleInvoiceResponse } from '../mocks/sampleInvoiceResponse';
import type { ApiResponse } from '../types';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import logo from '../assets/logo.png';

export function DemoPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ApiResponse | null>(null);
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
      setExtractedData(sampleInvoiceResponse);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navbar */}
      <nav className="bg-dark-950 border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Nexbit Logo" className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold text-black">Nexbit AI</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {isLoading && <LoadingModal />}
      {extractedData ? (
        <ResultsView data={extractedData} error={error} />
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-dark-800 rounded-2xl p-8 shadow-lg border border-dark-700">
            <h1 className="text-4xl font-bold text-black mb-6">
              Transform Documents into Structured Data
            </h1>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Any Invoice</h2>
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            </section>

            <button
              onClick={handleExtraction}
              disabled={!selectedFile}
              className={`w-full py-3 px-4 rounded-lg text-dark-900 text-lg font-medium transition-colors ${
                selectedFile
                  ? 'bg-primary-400 hover:bg-primary-500'
                  : 'bg-dark-600 cursor-not-allowed text-dark-400'
              }`}
            >
              Begin Extraction
            </button>

            <p className="mt-4 text-sm text-primary-400">
              We accept PDF and Image files. For the demo we limit it to 1 doc per extraction.
            </p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}