import * as XLSX from 'xlsx';

interface Table {
  headers: string[];
  rows: Record<string, string>[];
  meta: {
    columnCount: number;
    rowCount: number;
  };
}

export function generateExcelFile(tables: Table[]): void {
  const workbook = XLSX.utils.book_new();

  tables.forEach((table, index) => {
    // Create worksheet data with headers and rows
    const wsData = [
      table.headers,
      ...table.rows.map(row => table.headers.map(header => row[header] || ''))
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, `Table ${index + 1}`);
  });

  // Generate and download file
  XLSX.writeFile(workbook, 'extracted_data.xlsx');
}