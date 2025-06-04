import React, { useState } from 'react';
import { Upload, X, File, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

const ContentUploader = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      onUpload(files);
      setFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <Upload 
            size={40} 
            className={`mb-4 ${
              dragActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-600'
            }`} 
          />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Drag and drop your files here
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            or click to select files
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" size="sm">
              Select Files
            </Button>
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Selected Files ({files.length})
          </h3>
          {files.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center">
                <File size={20} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          
          <Button
            onClick={handleUpload}
            isLoading={uploading}
            fullWidth
            icon={uploading ? null : <CheckCircle size={16} />}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentUploader;