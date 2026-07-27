import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function UploadBox() {
  const [file, setFile] = useState(null);

  const uploadPDF = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const loadingToast = toast.loading("Uploading PDF...");

    try {
      const response = await api.post("/api/upload", formData);
      toast.success(response.data.message || "PDF uploaded successfully", { id: loadingToast });
      setFile(null); // Reset UI after successful upload
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed", { id: loadingToast });
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative mb-6">
        <div className="w-20 h-24 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center relative z-10">
          {file ? (
            <svg className="w-10 h-10 text-secondary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-secondary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="absolute -top-3 -right-3 w-7 h-7 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md leading-none z-20">
          {file ? "✓" : "+"}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-primary mb-2 text-center break-words max-w-sm">
        {file ? file.name : "Upload your PDF to start chatting"}
      </h3>
      <p className="text-neutral text-sm mb-8">
        {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or drag and drop files here"}
      </p>

      {file ? (
        <div className="flex gap-4">
          <button 
            onClick={() => setFile(null)}
            className="bg-white border border-slate-200 text-neutral hover:bg-slate-50 font-medium py-3 px-6 rounded-xl transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={uploadPDF}
            className="bg-primary hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-xl transition-colors flex items-center gap-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload File
          </button>
        </div>
      ) : (
        <label className="bg-primary hover:bg-slate-800 text-white font-medium py-3 px-8 rounded-xl cursor-pointer transition-colors flex items-center gap-2 shadow-md">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Browse Files
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf" 
            onChange={handleFileChange}
          />
        </label>
      )}

      <div className="flex items-center gap-6 mt-10 text-[10px] font-mono text-slate-400 font-bold tracking-wider">
        <span className="flex items-center gap-1.5 uppercase">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure Encryption
        </span>
        <span className="flex items-center gap-1.5 uppercase">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Max 50MB
        </span>
        <span className="flex items-center gap-1.5 uppercase">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI-Ready
        </span>
      </div>
    </div>
  );
}