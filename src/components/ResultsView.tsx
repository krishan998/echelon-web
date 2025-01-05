import React from 'react';
import { Download } from 'lucide-react';
import { ApiResponse } from '../types';
import { InvoiceDetails } from './InvoiceDetails';
import { LineItems } from './LineItems';
import { TaxDetails } from './TaxDetails';
import { generateExcelFile } from '../utils/excelUtils';
import { 
  extractTableData, 
  extractInvoiceDetails,
  extractTaxDetails 
} from '../utils/invoiceTransformer';

interface ResultsViewProps {
  data?: ApiResponse;
  error?: string | null;
}

export function ResultsView({ data, error }: ResultsViewProps) {
  const storedFile = JSON.parse(sessionStorage.getItem('originalFile') || '{}');
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No invoice data available</p>
      </div>
    );
  }

  const tables = extractTableData(data);
  const invoiceDetails = extractInvoiceDetails(data);
  const taxDetails = extractTaxDetails(data);

  const handleDownload = () => {
    if (tables.length > 0 && invoiceDetails && taxDetails) {
      const rows = tables.flatMap(table => table.rows);
      generateExcelFile(rows, invoiceDetails, taxDetails);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-8">
        {error && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Invoice Details</h2>
          <button
            onClick={handleDownload}
            disabled={tables.length === 0 || !invoiceDetails || !taxDetails}
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <InvoiceDetails 
              invoiceDetails={invoiceDetails} 
              taxDetails={null}
            />
            
            {tables.map((table, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Items Table {index + 1}</h3>
                <div className="overflow-x-auto">
                  <LineItems headers={table.headers} rows={table.rows} />
                </div>
              </div>
            ))}

            <div className="mt-6">
              <TaxDetails taxDetails={taxDetails} />
            </div>
          </div>

          {storedFile.base64 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Original Document</h3>
              {storedFile.type?.startsWith('image/') ? (
                <img
                  src={`data:${storedFile.type};base64,${storedFile.base64}`}
                  alt="Original document"
                  className="w-full rounded-lg border border-gray-200 mt-4"
                />
              ) : (
                <iframe
                  src={`data:${storedFile.type};base64,${storedFile.base64}`}
                  className="w-full h-[800px] rounded-lg border border-gray-200 mt-4"
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