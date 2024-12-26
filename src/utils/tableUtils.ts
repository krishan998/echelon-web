import { Table, ProcessedTable } from '../types';

export function processTable(table: Table): ProcessedTable {
  // Get unique column indices
  const columnIndices = [...new Set(table.cells.map(cell => cell.columnIndex))].sort();
  
  // Create headers from first row cells
  const headerCells = table.cells.filter(cell => cell.rowIndex === 0);
  const headers = columnIndices.map(colIndex => {
    const headerCell = headerCells.find(cell => cell.columnIndex === colIndex);
    return headerCell?.content || `Column ${colIndex + 1}`;
  });

  // Group cells by row
  const rowGroups = table.cells.reduce((groups, cell) => {
    if (cell.rowIndex === 0) return groups; // Skip header row
    if (!groups[cell.rowIndex]) {
      groups[cell.rowIndex] = [];
    }
    groups[cell.rowIndex].push(cell);
    return groups;
  }, {} as Record<number, typeof table.cells>);

  // Convert cell groups to rows
  const rows = Object.values(rowGroups).map(rowCells => {
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      const cell = rowCells.find(c => c.columnIndex === columnIndices[index]);
      row[header] = cell?.content || '';
    });
    return row;
  });

  return {
    headers,
    rows,
    meta: {
      columnCount: table.columnCount,
      rowCount: table.rowCount
    }
  };
}