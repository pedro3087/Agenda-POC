
import React, { useRef } from 'react';
import { FileUploadIcon, SparklesIcon } from './icons';

interface FileUploadPanelProps {
  onFileSelect: (fileName: string, content: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  fileName: string | null;
  hasContent: boolean;
}

const FileUploadPanel: React.FC<FileUploadPanelProps> = ({
  onFileSelect,
  onGenerate,
  isLoading,
  fileName,
  hasContent
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileSelect(file.name, content);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border-r border-slate-200 p-6 flex flex-col h-full">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Gemini Agenda Architect</h1>
      <p className="text-slate-500 mb-6">Upload a document to instantly generate a smart meeting agenda.</p>

      <div className="flex-grow">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.md,.doc,.docx,.pdf"
        />
        <button
          onClick={handleUploadClick}
          className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
        >
          <FileUploadIcon className="w-10 h-10 mb-2" />
          <span className="font-medium">{fileName ? 'Change Document' : 'Click to Upload Document'}</span>
          <span className="text-xs mt-1">TXT, MD, DOCX, etc.</span>
        </button>

        {fileName && (
          <div className="mt-4 p-3 bg-slate-100 rounded-md text-sm text-slate-700">
            <strong>Selected:</strong> {fileName}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <button
          onClick={onGenerate}
          disabled={!hasContent || isLoading}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate Agenda
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploadPanel;
