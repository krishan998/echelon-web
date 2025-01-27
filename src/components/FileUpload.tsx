import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
      />
      <label
        htmlFor="file-upload"
        className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          selectedFile
            ? 'border-blue-600 bg-blue-50'
            : 'border-blue-300 hover:border-blue-400'
        }`}
      >
        <Upload className="w-5 h-5 text-blue-600" />
        <span className="text-blue-600">
          {selectedFile ? selectedFile.name : 'Upload a file'}
        </span>
      </label>
      <p className="mt-2 text-sm text-blue-600">
        Trial limit 15 pages
      </p>
    </div>
  );
}