import { ApiResponse } from '../types';

export function extractTableData(response: ApiResponse) {
  const itemsTable = response.response.tables[1]; // Assuming the second table contains line items

  if (!itemsTable) return { headers: [], rows: [] };

  const headers = itemsTable.headers.map(header => header.title);
  const rows = itemsTable.rows.map(row => {
    const rowData: Record<string, string> = {};
    Object.keys(row.values).forEach(key => {
      const columnIndex = parseInt(key.replace('col_', ''));
      if (headers[columnIndex]) {
        rowData[headers[columnIndex]] = row.values[key].value;
      }
    });
    return rowData;
  });

  return { headers, rows };
}

export function validateApiResponse(data: any): data is ApiResponse {
  return Boolean(
    data?.response?.tables &&
    Array.isArray(data.response.tables) &&
    data.response.tables.length > 0
  );
}

export function extractDocument(data?: ApiResponse) {
  if (!validateApiResponse(data)) {
    return null;
  }
  return data.response.documents[0] || null;
}

export function extractInvoiceDetails(data?: ApiResponse) {
  if (!validateApiResponse(data)) return null;

  const document = data.response.documents[0];
  if (!document) return null;

  const formatAddress = (address: any) => {
    if (!address) return '';
    return `${address.houseNumber || ''} ${address.road || ''} ${address.postalCode || ''} ${address.city || ''} ${address.state || ''} ${address.streetAddress || ''} ${address.stateDistrict || ''}`.trim();
  };

  return {
    invoiceNumber: document.fields.InvoiceId?.valueString || '',
    invoiceDate: document.fields.InvoiceDate?.content || '',
    eWayBillNumber: document.fields.InvoiceId?.content.split('\n')[1] || '',
    vendorName: document.fields.VendorName?.valueString || '',
    vendorAddress: formatAddress(document.fields.VendorAddress?.valueAddress),
    customerName: document.fields.CustomerName?.valueString || '',
    customerAddress: formatAddress(document.fields.CustomerAddress?.valueAddress)
  };
}

export function extractTaxDetails(data?: ApiResponse) {
  if (!validateApiResponse(data)) return null;

  const taxTable = data.response.tables[2]; // Assuming the third table contains tax details
  if (!taxTable) return null;

  const taxRow = taxTable.rows.find(row => row.isTotal);
  return {
    taxableValue: parseFloat(taxRow?.values.col_1?.value?.replace(/,/g, '') || '0'),
    taxRate: taxRow?.values.col_2?.value || '0%',
    taxAmount: parseFloat(taxRow?.values.col_3?.value?.replace(/,/g, '') || '0'),
    totalTaxAmount: parseFloat(taxRow?.values.col_4?.value?.replace(/,/g, '') || '0')
  };
}