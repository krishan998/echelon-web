import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface InvoiceDetailsProps {
  invoiceDetails: {
    invoiceNumber: string;
    invoiceDate: string;
    eWayBillNumber: string;
    vendorName: string;
    vendorAddress: string;
    customerName: string;
    customerAddress: string;
  } | null;
}

export function InvoiceDetails({ invoiceDetails }: InvoiceDetailsProps) {
  if (!invoiceDetails) return null;

  const detailRows = [
    { label: 'Vendor Name', value: invoiceDetails.vendorName },
    { label: 'Vendor Address', value: invoiceDetails.vendorAddress },
    { label: 'Customer Name', value: invoiceDetails.customerName },
    { label: 'Customer Address', value: invoiceDetails.customerAddress },
    { label: 'Invoice Number', value: invoiceDetails.invoiceNumber },
    { label: 'Invoice Date', value: invoiceDetails.invoiceDate },
    { label: 'e-Way Bill Number', value: invoiceDetails.eWayBillNumber },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
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