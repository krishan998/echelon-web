import { InvoiceResponse } from '../types';

export const sampleInvoiceResponse: InvoiceResponse = {
  documents: [{
    docType: 'invoice',
    fields: {
      InvoiceId: {
        type: 'string',
        content: 'INV-2024-001',
        confidence: 0.99,
        valueString: 'INV-2024-001'
      },
      InvoiceDate: {
        type: 'date',
        content: '21-Mar-2024',
        confidence: 0.99,
        valueDate: '2024-03-21'
      },
      InvoiceTotal: {
        type: 'currency',
        content: '₹ 21,20,705.44',
        confidence: 0.99,
        valueCurrency: {
          amount: 2120705.44,
          currencyCode: 'INR',
          currencySymbol: '₹'
        }
      },
      CustomerName: {
        type: 'string',
        content: 'HARD HAT TECHNOLOGIES PRIVATE LIMITED',
        confidence: 0.99,
        valueString: 'HARD HAT TECHNOLOGIES PRIVATE LIMITED'
      },
      BillingAddress: {
        type: 'address',
        content: '837/1, C-1, 7TH MAIN, 2nd CROSS, INDIRANAGAR, Bengaluru Urban, Bangalore',
        confidence: 0.99,
        valueAddress: {
          streetAddress: '837/1, C-1 7TH MAIN, 2nd CROSS',
          city: 'Bangalore',
          state: 'Karnataka'
        }
      },
      ShippingAddress: {
        type: 'address',
        content: '837/1, C-1, 7TH MAIN, 2nd CROSS, INDIRANAGAR, Bengaluru Urban, Bangalore',
        confidence: 0.99,
        valueAddress: {
          streetAddress: '837/1, C-1 7TH MAIN, 2nd CROSS',
          city: 'Bangalore',
          state: 'Karnataka'
        }
      },
      VendorName: {
        type: 'string',
        content: 'SHALIKA ENTERPRISES PVT LTD',
        confidence: 0.99,
        valueString: 'SHALIKA ENTERPRISES PVT LTD'
      },
      VendorAddress: {
        type: 'address',
        content: 'C-82, LOHA MANDI, INDUSTRIAL AREA, GHAZIABAD, UTTAR PRADESH - 201001',
        confidence: 0.99,
        valueAddress: {
          streetAddress: 'C-82, LOHA MANDI, INDUSTRIAL AREA',
          city: 'GHAZIABAD',
          state: 'UTTAR PRADESH',
          postalCode: '201001'
        }
      },
      Items: {
        type: 'array',
        valueArray: [
          {
            type: 'object',
            valueObject: {
              Description: { type: 'string', content: 'TMT Bars 10mm', confidence: 0.99 },
              Quantity: { type: 'number', content: '7.000 MT', confidence: 0.99 },
              UnitPrice: { 
                type: 'currency', 
                content: '58,600.00',
                valueCurrency: { amount: 58600, currencyCode: 'INR' }
              },
              Amount: { 
                type: 'currency', 
                content: '4,10,200.00',
                valueCurrency: { amount: 410200, currencyCode: 'INR' }
              },
              ProductCode: { type: 'string', content: '72142090', confidence: 0.99 },
              Unit: { type: 'string', content: 'MT', confidence: 0.99 }
            }
          }
        ]
      },
      SubTotal: {
        type: 'currency',
        content: '17,97,208.00',
        confidence: 0.99,
        valueCurrency: { amount: 1797208, currencyCode: 'INR' }
      },
      TotalTax: {
        type: 'currency',
        content: '3,23,497.44',
        confidence: 0.99,
        valueCurrency: { amount: 323497.44, currencyCode: 'INR' }
      }
    }
  }]
};