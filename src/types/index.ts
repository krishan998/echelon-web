export interface ApiResponse {
  response: {
      tables: Table[];
      documents: Document[];
  };
}

export interface Table {
headers: Header[];
rows: Row[];
columnTypes: Record<string, string>;
}

export interface Header {
title: string;
span: number;
level: number;
children?: Header[];
}

export interface Row {
values: Record<string, CellValue>;
isTotal: boolean;
}

interface CellValue {
value: string;
type: string;
}

export interface Document {
docType: string;
fields: DocumentFields;
boundingRegions: BoundingRegion[];
confidence: number;
spans: Span[];
}

interface DocumentFields {
InvoiceDate: Field<string>;
InvoiceId: Field<string>;
InvoiceTotal: Field<Currency>;
Items: {
  type: 'array';
  valueArray: LineItem[];
};
VendorAddress: Field<Address>;
VendorName: Field<string>;
VendorTaxId: Field<string>;
}

interface Field<T> {
type: string;
content: string;
confidence: number;
valueString?: string;
valueDate?: string;
valueCurrency?: Currency;
valueAddress?: Address;
boundingRegions?: BoundingRegion[];
spans?: Span[];
}

interface Currency {
amount: number;
currencyCode: string;
currencySymbol?: string;
}

interface Address {
houseNumber?: string;
road?: string;
postalCode?: string;
city?: string;
state?: string;
streetAddress?: string;
stateDistrict?: string;
}

interface BoundingRegion {
pageNumber: number;
polygon: number[];
}

interface Span {
offset: number;
length: number;
}

export interface LineItem {
type: 'object';
valueObject: {
  Amount: Field<Currency>;
  Description: Field<string>;
  ProductCode: Field<string>;
  Tax?: Field<Currency>;
  TaxRate?: Field<string>;
};
content: string;
boundingRegions: BoundingRegion[];
confidence: number;
spans: Span[];
}