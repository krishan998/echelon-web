import React from 'react';

interface LineItemsProps {
  headers: string[];
  rows: Record<string, string>[];
}

export function LineItems({ headers, rows }: LineItemsProps) {
  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="py-2 px-4 border-b border-gray-200">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-b border-gray-200">
            {headers.map((header, colIndex) => (
              <td key={colIndex} className="py-2 px-4 border-r border-gray-200">{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}