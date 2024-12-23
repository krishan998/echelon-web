import React from 'react';
import { Download } from 'lucide-react';
import { Table } from './Table';
import { generateExcelFile } from '../utils/excelUtils';

interface ResultsViewProps {
  data: {
    response: {
      tables: {
        headers: string[];
        rows: Record<string, string>[];
        meta: {
          columnCount: number;
          rowCount: number;
        };
      }[];
      paragraphs: any[];
    };
  };
  error?: string;
}

export function ResultsView({ data, error }: ResultsViewProps) {
  const { tables } = data.response;
  const storedFile = JSON.parse(sessionStorage.getItem('originalFile') || '{}');

  const handleDownload = () => {
    generateExcelFile(tables);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-2 py-8"> {/* Reduce horizontal padding */}
        {error && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Extracted Data</h2>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Excel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Use full width */}
            {/* Left side - Extracted Tables */}
            <div className="space-y-6">
              {tables.map((table, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Table {index + 1}</h3>
                  <Table headers={table.headers} rows={table.rows} />
                </div>
              ))}
            </div>

            {/* Right side - Original Document */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Original Document</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
}