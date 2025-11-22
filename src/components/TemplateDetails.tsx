import React from 'react';
import X from 'lucide-react/dist/esm/icons/x';

interface TemplateDetailsProps {
  onClose: () => void;
}

export function TemplateDetails({ onClose }: TemplateDetailsProps) {
  return (
    <div className="mt-4 bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Commercial Invoice</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-gray-600 mb-4">We will extract data into this table.</p>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left font-medium text-gray-600">Product Description</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600">Unit Price</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600">HS Code</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600">Total Price</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600">Unit</th>
              <th className="py-2 px-4 text-left font-medium text-gray-600">Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 text-gray-500">Sample data will appear here</td>
              <td className="py-2 px-4 text-gray-500">-</td>
              <td className="py-2 px-4 text-gray-500">-</td>
              <td className="py-2 px-4 text-gray-500">-</td>
              <td className="py-2 px-4 text-gray-500">-</td>
              <td className="py-2 px-4 text-gray-500">-</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Single Values</h4>
        <p className="text-gray-500">Additional extracted data will appear here</p>
      </div>
    </div>
  );
}