import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface LineItem {
  description: string;
  quantity: string;
  unitPrice: number;
  amount: number;
  productCode: string;
  unit: string;
  tax?: number;
}

interface LineItemsProps {
  items: LineItem[];
}

export function LineItems({ items }: LineItemsProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No items found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            {items.some(item => item.tax !== undefined) && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {item.description}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {item.quantity}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {item.unit}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(item.unitPrice)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(item.amount)}
              </td>
              {items.some(item => item.tax !== undefined) && (
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {item.tax ? formatCurrency(item.tax) : '-'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}