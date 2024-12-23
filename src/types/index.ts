export interface ExtractedData {
  response: {
    tables: Table[];
    paragraphs: any[];
  };
}

export interface Table {
  headers: string[];
  rows: Record<string, string>[];
  meta: {
    columnCount: number;
    rowCount: number;
  };
}