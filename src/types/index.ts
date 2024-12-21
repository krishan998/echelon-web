export interface ExtractedData {
  content: string;
  tables: Table[];
  paragraphs: Paragraph[];
}

interface Table {
  rowCount: number;
  columnCount: number;
  cells: Cell[];
  boundingRegions: BoundingRegion[];
}

interface Cell {
  kind?: string;
  rowIndex: number;
  columnIndex: number;
  content: string;
  boundingRegions: BoundingRegion[];
}

interface BoundingRegion {
  pageNumber: number;
  polygon: number[];
}

interface Paragraph {
  content: string;
  boundingRegions: BoundingRegion[];
  role?: string;
}

export interface ExtractionResponse {
  status: string;
  createdDateTime: string;
  lastUpdatedDateTime: string;
  analyzeResult: {
    apiVersion: string;
    modelId: string;
    content: string;
    tables: Table[];
    paragraphs: Paragraph[];
  };
}