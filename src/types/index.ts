export interface InvoiceResponse {
  documents: InvoiceDocument[];
}

export interface InvoiceDocument {
  docType: string;
  fields: {
    InvoiceId: Field<string>;
    InvoiceDate: Field<string>;
    InvoiceTotal: Field<Currency>;
    CustomerName: Field<string>;
    BillingAddress: Field<Address>;
    ShippingAddress: Field<Address>;
    VendorName: Field<string>;
    VendorAddress: Field<Address>;
    Items: {
      type: 'array';
      valueArray: LineItem[];
    };
    SubTotal: Field<Currency>;
    TotalTax: Field<Currency>;
  };
}

interface Field<T> {
  type: string;
  content: string;
  confidence: number;
  valueString?: string;
  valueDate?: string;
  valueCurrency?: Currency;
  valueAddress?: Address;
}

interface Currency {
  amount: number;
  currencyCode: string;
  currencySymbol?: string;
}

interface Address {
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface LineItem {
  type: 'object';
  valueObject: {
    Description: Field<string>;
    Quantity: Field<number>;
    UnitPrice: Field<Currency>;
    Amount: Field<Currency>;
    ProductCode: Field<string>;
    Unit: Field<string>;
  };
}