import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface TaxDetailsProps {
  taxDetails: {
    taxableValue: number;
    taxRate: string;
    taxAmount: number;
    totalTaxAmount: number;
  } | null;
}

export function TaxDetails({ taxDetails }: TaxDetailsProps) {
  if (!taxDetails) return null;

  console.log(taxDetails);

  const detailRows = [
    { label: 'Taxable Value', value: formatCurrency(taxDetails.taxableValue) },
    { label: 'Tax Rate', value: taxDetails.taxRate },
    { label: 'Tax Amount', value: formatCurrency(taxDetails.taxAmount) },
    { label: 'Total Tax Amount', value: formatCurrency(taxDetails.totalTaxAmount) }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Price and Tax Details</h3>
      <dl className="space-y-4">
        {detailRows.map((row, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-gray-500">{row.label}</dt>
            <dd className="text-sm text-gray-900 col-span-2">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}