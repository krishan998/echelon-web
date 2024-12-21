import * as XLSX from 'xlsx';
import { ExtractionResponse } from '../types';

export function generateExcelFile(data: ExtractionResponse): void {
  const { tables } = data.analyzeResult;
  const workbook = XLSX.utils.book_new();

  tables.forEach((table, index) => {
    // Create headers array
    const headers = Array.from({ length: table.columnCount }).map((_,colIndex) => {
      const headerCell = table.cells.find(
        cell => cell.kind === 'columnHeader' && cell.columnIndex === colIndex
      );
      return headerCell?.content || '';
    });

    // Create rows array
    const rows = Array.from({ length: table.rowCount - 1 }).map((_, rowIndex) => {
      return Array.from({ length: table.columnCount }).map((_, colIndex) => {
        const cell = table.cells.find(
          c => c.kind !== 'columnHeader' && 
              c.rowIndex === rowIndex + 1 && 
              c.columnIndex === colIndex
        );
        return cell?.content || '';
      });
    });

    // Combine headers and rows
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, `Table ${index + 1}`);
  });

  // Generate and download file
  XLSX.writeFile(workbook, 'extracted_data.xlsx');
}