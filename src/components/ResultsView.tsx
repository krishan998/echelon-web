import React from 'react';
import { Download } from 'lucide-react';
import { ExtractionResponse } from '../types';
import { generateExcelFile } from '../utils/excelUtils';

interface ResultsViewProps {
  extractedData: ExtractionResponse;
  error?: string;
}

export function ResultsView({ extractedData, error }: ResultsViewProps) {
  const { analyzeResult } = extractedData;
  const tables = analyzeResult.tables;
  const storedFile = JSON.parse(sessionStorage.getItem('originalFile') || '{}');

  const handleDownload = () => {
    generateExcelFile(extractedData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
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

          <div className="grid grid-cols-2 gap-6">
            {/* Left side - Extracted Tables */}
            <div>
              <div className="space-y-6">
                {tables.map((table, tableIndex) => (
                  <div key={tableIndex} className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Array.from({ length: table.columnCount }).map((_, colIndex) => {
                            const headerCell = table.cells.find(
                              cell => cell.kind === 'columnHeader' && cell.columnIndex === colIndex
                            );
                            return (
                              <th
                                key={colIndex}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {headerCell?.content || ''}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.from({ length: table.rowCount - 1 }).map((_, rowIndex) => (
                          <tr key={rowIndex}>
                            {Array.from({ length: table.columnCount }).map((_, colIndex) => {
                              const cell = table.cells.find(
                                c => c.kind !== 'columnHeader' && 
                                    c.rowIndex === rowIndex + 1 && 
                                    c.columnIndex === colIndex
                              );
                              return (
                                <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm">
                                  {cell?.content || ''}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
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