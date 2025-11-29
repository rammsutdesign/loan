import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, ScanLine, Loader2 } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { Button } from './Button';
import { AnalyzedDocumentData } from '../types';

interface DocumentUploaderProps {
  onDataExtracted: (data: AnalyzedDocumentData) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDataExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile: File) => {
    if (!uploadedFile.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG).');
      return;
    }
    setFile(uploadedFile);
    setError(null);
    setSuccess(false);
  };

  const analyzeFile = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const mimeType = file.type;

        try {
          const data = await GeminiService.analyzeDocument(base64String, mimeType);
          onDataExtracted(data);
          setSuccess(true);
        } catch (err) {
          setError("AI Analysis failed. Please try again or enter details manually.");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to read file.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'
        } ${success ? 'border-emerald-500 bg-emerald-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {success ? (
            <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
          ) : (
            <div className="bg-white p-3 rounded-full shadow-sm mb-4">
              <ScanLine className="w-8 h-8 text-blue-600" />
            </div>
          )}
          
          <h4 className="text-lg font-medium text-slate-800">
            {success ? "Analysis Complete" : file ? file.name : "Upload Paystub / Income Proof"}
          </h4>
          
          <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
            {success 
              ? "We've extracted the financial details from your document." 
              : "Drag and drop your image here, or click to browse. We use Gemini AI to extract details instantly."}
          </p>

          {!success && (
            <div className="mt-6 flex gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onFileInputChange} 
                className="hidden" 
                accept="image/*"
              />
              
              {!file ? (
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Select File
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => { setFile(null); setSuccess(false); }}>
                    Change
                  </Button>
                  <Button variant="primary" onClick={analyzeFile} isLoading={isAnalyzing}>
                    <FileText className="w-4 h-4 mr-2" />
                    Analyze with AI
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};
