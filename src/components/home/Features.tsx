import React from 'react';
import { FileText, FileSpreadsheet, Building2, Network } from 'lucide-react';

export function Features() {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Your business needs data<br />from documents
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Invoices</span>
              </div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                <span>Financial Statements</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span>Field notes</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                <span>Quarterly Reports and so on...</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-8">
              We extract and put that<br />data where you need it
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg" alt="Excel" className="h-5 w-5" />
                <span>Excel Spreadsheets</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6d/Sap_logo.svg" alt="SAP" className="h-5 w-5" />
                <span>ERP Systems</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" alt="CRM" className="h-5 w-5" />
                <span>CRM</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg" alt="BI" className="h-5 w-5" />
                <span>BI Platforms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}