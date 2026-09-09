import { useState } from 'react';

interface FileUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export const useFileUpload = (options?: FileUploadOptions) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const maxSize = (options?.maxSizeMB || 10) * 1024 * 1024;
    
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds maximum limit of ${options?.maxSizeMB || 10}MB.`);
      setFile(null);
      return false;
    }

    if (options?.allowedTypes && options.allowedTypes.length > 0) {
      const isAllowed = options.allowedTypes.some((type) =>
        selectedFile.type.includes(type) || selectedFile.name.endsWith(type)
      );
      if (!isAllowed) {
        setError(`Invalid file type. Allowed formats: ${options.allowedTypes.join(', ')}`);
        setFile(null);
        return false;
      }
    }

    setFile(selectedFile);
    return true;
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return {
    file,
    error,
    validateAndSetFile,
    clearFile,
  };
};
