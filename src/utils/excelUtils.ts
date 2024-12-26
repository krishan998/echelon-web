import * as XLSX from 'xlsx';
import { LineItem } from '../types';

export function generateExcelFile(items: LineItem[]): void {
  const workbook = XLSX.utils.book_new();

  // Convert items to rows
  const rows = items.map(item => ({
    Description: item.valueObject.Description.content,
    Quantity: item.valueObject.Quantity.content,
    Unit: item.valueObject.Unit.content,
    'Unit Price': item.valueObject.UnitPrice.content,
    Amount: item.valueObject.Amount.content,
    'Product Code': item.valueObject.ProductCode.content
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoice Items');

  // Generate and download file
  XLSX.writeFile(workbook, 'invoice_details.xlsx');
}