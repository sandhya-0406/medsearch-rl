import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndPass = (file: File) => {
    setError(null);
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Supported formats: PNG, JPG, JPEG');
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10 dark:border-cyan-400 dark:bg-cyan-500/10'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-cyan-500'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && validateAndPass(e.target.files[0])}
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-cyan-950/60 text-blue-600 dark:text-cyan-400">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="font-poppins font-medium text-slate-800 dark:text-slate-200">
              Drag and drop medical image here, or <span className="text-blue-600 dark:text-cyan-400 underline">browse</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Supports Brain MRI, Surgical Endoscopy (ESAD / MESAD) - PNG, JPG
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-xs text-rose-500">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};