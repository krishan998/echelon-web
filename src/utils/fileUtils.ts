import { FileWithPath } from 'react-dropzone';

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = error => reject(error);
  });
};

export const storeFileData = (file: File, base64Data: string) => {
  sessionStorage.setItem('originalFile', JSON.stringify({
    name: file.name,
    type: file.type,
    base64: base64Data
  }));
};