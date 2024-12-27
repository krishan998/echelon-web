// types.ts
export interface Address {
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  houseNumber?: string;
  road?: string;
  stateDistrict?: string;
}

export interface Currency {
  amount: number;
  currencyCode: string;
}

export interface Field {
  type: string;
  content: string;
  confidence: number;
  boundingRegions?: any[];
  spans?: any[];
}

export interface StringField extends Field {
  valueString: string;
}

export interface DateField extends Field {
  valueDate: string;
}

export interface CurrencyField extends Field {
  valueCurrency: Currency;
}

export interface AddressField extends Field {
  valueAddress: Address;
}

export interface ArrayField extends Field {
  valueArray: Array<{
    type: string;
    valueObject: {
      Amount?: CurrencyField;
      Description?: StringField;
      ProductCode?: StringField;
      Tax?: Field;
      TaxRate?: Field;
    };
    content: string;
    boundingRegions: any[];
    confidence: number;
    spans: any[];
  }>;
}

export interface InvoiceFields {
  InvoiceDate: DateField;
  InvoiceId: StringField;
  InvoiceTotal: CurrencyField;
  Items: ArrayField;
  TaxDetails: ArrayField;
  VendorAddress: AddressField;
  VendorAddressRecipient: StringField;
  VendorName: StringField;
  VendorTaxId: StringField;
}

export interface InvoiceDocument {
  docType: string;
  boundingRegions: any[];
  fields: InvoiceFields;
  confidence: number;
  spans: any[];
}

export interface InvoiceResponse {
  response: {
    tables: any[];
    documents: InvoiceDocument[];
  };
}

// sample-response.ts
export const sampleInvoiceResponse: InvoiceResponse = {
  response: {
    tables: [], // Tables data omitted for brevity
    documents: [{
      docType: "invoice",
      boundingRegions: [{
        pageNumber: 1,
        polygon: [0, 0, 1078, 0, 1078, 1536, 0, 1536]
      }],
      fields: {
        InvoiceDate: {
          type: "date",
          valueDate: "2024-06-21",
          content: "21-Jun-24",
          confidence: 0.938,
          boundingRegions: [{
            pageNumber: 1,
            polygon: [806, 288, 888, 289, 888, 305, 806, 305]
          }],
          spans: [{
            offset: 317,
            length: 9
          }]
        },
        InvoiceId: {
          type: "string",
          valueString: "SHAL/24-25/368",
          content: "SHAL/24-25/368",
          confidence: 0.939,
          boundingRegions: [{
            pageNumber: 1,
            polygon: [598, 288, 694, 288, 694, 305, 598, 305]
          }],
          spans: [{
            offset: 289,
            length: 14
          }]
        },
        InvoiceTotal: {
          type: "currency",
          valueCurrency: {
            amount: 2120705.44,
            currencyCode: "INR"
          },
          content: "₹ 21,20,705.44",
          confidence: 0.926,
          boundingRegions: [{
            pageNumber: 1,
            polygon: [895, 1072, 1009, 1073, 1009, 1094, 895, 1093]
          }],
          spans: [{
            offset: 1580,
            length: 14
          }]
        },
        Items: {
          type: "array",
          valueArray: [{
            type: "object",
            valueObject: {
              Amount: {
                type: "currency",
                valueCurrency: {
                  amount: 410200,
                  currencyCode: "INR"
                },
                content: "4,10,200.00",
                confidence: 0.92
              },
              Description: {
                type: "string",
                valueString: "Tmt Bars 10mm",
                content: "Tmt Bars 10mm",
                confidence: 0.915
              },
              ProductCode: {
                type: "string",
                valueString: "72142090",
                content: "72142090",
                confidence: 0.886
              }
            },
            content: "1\nTmt Bars 10mm\n72142090\n7.000 MT\n58,600.00\nMT\n4,10,200.00",
            confidence: 0.878,
            boundingRegions: [{
              pageNumber: 1,
              polygon: [68, 699, 1007, 699, 1007, 717, 68, 717]
            }],
            spans: [{
              offset: 1230,
              length: 46
            }, {
              offset: 1291,
              length: 11
            }]
          }]
        },
        VendorAddress: {
          type: "address",
          valueAddress: {
            houseNumber: "C-82",
            road: "LOHA MANDI, B.S ROAD, INDUSTRIAL AREA",
            postalCode: "201001",
            city: "GHAZIABAD",
            state: "UTTAR PRADESH",
            streetAddress: "C-82 LOHA MANDI, B.S ROAD, INDUSTRIAL AREA",
            stateDistrict: "GHAZIABAD"
          },
          content: "C-82, LOHA MANDI, B.S ROAD, INDUSTRIAL AREA GHAZIABAD\nGHAZIABAD , UTTAR PRADESH - 201001",
          confidence: 0.779
        },
        VendorAddressRecipient: {
          type: "string",
          valueString: "SHALIKA ENTERPRISES PVT LTD (GZB)",
          content: "SHALIKA ENTERPRISES PVT LTD (GZB)",
          confidence: 0.886
        },
        VendorName: {
          type: "string",
          valueString: "सेल SAIL",
          content: "सेल SAIL",
          confidence: 0.683
        },
        VendorTaxId: {
          type: "string",
          valueString: "09AABCS7005H2ZF",
          content: "09AABCS7005H2ZF",
          confidence: 0.937
        },
        TaxDetails: {
          type: "array",
          valueArray: [{
            type: "object",
            valueObject: {
              Amount: {
                type: "currency",
                valueCurrency: {
                  amount: 323497.44,
                  currencyCode: "INR"
                },
                content: "3,23,497.44",
                confidence: 0.888
              }
            },
            content: "IGST@18%\n18\n%\n3,23,497.44",
            confidence: 0.39,
            boundingRegions: [{
              pageNumber: 1,
              polygon: [64, 822, 1009, 822, 1009, 1188, 64, 1188]
            }],
            spans: [{
              offset: 1539,
              length: 291
            }]
          }]
        }
      },
      confidence: 1,
      spans: [{
        offset: 0,
        length: 2261
      }]
    }]
  }
};