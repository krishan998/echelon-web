import React from 'react';
import { Download } from 'lucide-react';
import { InvoiceResponse } from '../types';
import { InvoiceDetails } from './InvoiceDetails';
import { LineItems } from './LineItems';
import { generateExcelFile } from '../utils/excelUtils';

interface ResultsViewProps {
  data?: InvoiceResponse;
  error?: string | null;
}

export function ResultsView({ data, error }: ResultsViewProps) {
  const storedFile = JSON.parse(sessionStorage.getItem('originalFile') || '{}');

  // Handle loading/error states
  if (!data?.documents) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No invoice data available</p>
      </div>
    );
  }

  const invoice = data.documents[0];
  
  const handleDownload = () => {
    if (invoice?.fields?.Items?.valueArray) {
      generateExcelFile(invoice.fields.Items.valueArray);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Invoice Details</h2>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </button>
        </div>

        <div className="space-y-6">
          <InvoiceDetails invoice={invoice} />
          
          {invoice.fields.Items?.valueArray && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Line Items</h3>
              <LineItems items={invoice.fields.Items.valueArray} />
            </div>
          )}

          {storedFile.base64 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Original Document</h3>
              {storedFile.type?.startsWith('image/') ? (
                <img
                  src={`data:${storedFile.type};base64,${storedFile.base64}`}
                  alt="Original document"
                  className="w-full rounded-lg border border-gray-200"
                />
              ) : (
                <iframe
                  src={`data:${storedFile.type};base64,${storedFile.base64}`}
                  className="w-full h-[800px] rounded-lg border border-gray-200"
                  title="Original document"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}