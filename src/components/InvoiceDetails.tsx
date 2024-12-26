import React from 'react';
import { InvoiceDocument } from '../types';

interface InvoiceDetailsProps {
  invoice: InvoiceDocument;
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const { fields } = invoice;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Invoice Information</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Invoice Number</dt>
              <dd className="font-medium">{fields.InvoiceId.content}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Date</dt>
              <dd className="font-medium">{fields.InvoiceDate.content}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Total Amount</dt>
              <dd className="font-medium">{fields.InvoiceTotal.content}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-600">Customer Name</dt>
              <dd className="font-medium">{fields.CustomerName.content}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Billing Address</dt>
              <dd className="font-medium">{fields.BillingAddress.content}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Shipping Address</dt>
              <dd className="font-medium">{fields.ShippingAddress.content}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}