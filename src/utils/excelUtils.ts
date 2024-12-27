import * as XLSX from 'xlsx';

interface LineItem {
  description: string;
  quantity: string;
  unitPrice: number;
  amount: number;
  productCode: string;
  unit: string;
  tax?: number;
}

interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  eWayBillNumber: string;
  vendorName: string;
  vendorAddress: string;
  customerName: string;
  customerAddress: string;
}

interface TaxDetails {
  taxableValue: number;
  taxRate: string;
  taxAmount: number;
  totalTaxAmount: number;
}

export function generateExcelFile(
  items: LineItem[], 
  invoiceDetails: InvoiceDetails, 
  taxDetails: TaxDetails
): void {
  const workbook = XLSX.utils.book_new();

  // Convert invoice details to rows
  const invoiceDetailsRows = [
    { A: 'Invoice Number', B: invoiceDetails.invoiceNumber },
    { A: 'Invoice Date', B: invoiceDetails.invoiceDate },
    { A: 'e-Way Bill Number', B: invoiceDetails.eWayBillNumber },
    { A: 'Vendor Name', B: invoiceDetails.vendorName },
    { A: 'Vendor Address', B: invoiceDetails.vendorAddress },
    { A: 'Customer Name', B: invoiceDetails.customerName },
    { A: 'Customer Address', B: invoiceDetails.customerAddress }
  ];

  // Convert items to rows
  const itemsRows = items.map(item => ({
    Description: item.description,
    Quantity: item.quantity,
    Unit: item.unit,
    'Unit Price': item.unitPrice,
    Amount: item.amount,
    'Product Code': item.productCode,
    ...(item.tax !== undefined && { Tax: item.tax })
  }));

  // Convert tax details to rows
  const taxDetailsRows = [
    { A: 'Taxable Value', B: taxDetails.taxableValue },
    { A: 'Tax Rate', B: taxDetails.taxRate },
    { A: 'Tax Amount', B: taxDetails.taxAmount },
    { A: 'Total Tax Amount', B: taxDetails.totalTaxAmount }
  ];

  // Create sheets
  const invoiceDetailsSheet = XLSX.utils.json_to_sheet(invoiceDetailsRows, { header: ['A', 'B'] });
  const itemsSheet = XLSX.utils.json_to_sheet(itemsRows);
  const taxDetailsSheet = XLSX.utils.json_to_sheet(taxDetailsRows, { header: ['A', 'B'] });

  // Append sheets to workbook
  XLSX.utils.book_append_sheet(workbook, invoiceDetailsSheet, 'Invoice Details');
  XLSX.utils.book_append_sheet(workbook, itemsSheet, 'Items');
  XLSX.utils.book_append_sheet(workbook, taxDetailsSheet, 'Tax Details');

  // Generate Excel file
  XLSX.writeFile(workbook, 'Invoice.xlsx');
}