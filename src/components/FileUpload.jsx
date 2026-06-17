import React from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

export const FileUpload = ({
  onFiles,
  accept = 'application/pdf,image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  label,
  error,
  required,
  className,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFiles(acceptedFiles);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxSize,
    multiple,
  });

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          error && 'border-red-500 bg-red-50',
          className
        )}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h16m8 6l-6-6m6 6v16m0 0l6 6m-6-6l-6 6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {isDragActive ? (
          <p className="mt-2 text-blue-600 font-medium">Drop files here...</p>
        ) : (
          <>
            <p className="mt-2 text-gray-600">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500 mt-1">PDF or Images up to 10MB</p>
          </>
        )}
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};
