import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useChat } from "../hooks/useChat";

export default function UploadBox({ onUploadSuccess, variant = "box" }) {
  const { sessionId } = useChat();

  const uploadPDF = async (selectedFile) => {
    if (!selectedFile) return;

    if (!sessionId) {
      toast.error("Waiting for session to initialize...");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("session_id", sessionId);

    try {
      const response = await api.post("/api/upload", formData);
      toast.success(response.data.message || "PDF uploaded successfully");
      if (onUploadSuccess) onUploadSuccess(selectedFile.name);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      uploadPDF(selected);
    }
  };

  if (variant === "icon") {
    return (
      <label className="w-10 h-10 flex items-center justify-center text-neutral hover:text-primary rounded-full transition-colors cursor-pointer">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <input 
          type="file" 
          className="hidden" 
          accept=".pdf" 
          onChange={handleFileChange}
        />
      </label>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center w-full bg-white rounded-[20px] p-6 border-2 border-dashed border-slate-200 cursor-pointer hover:border-secondary transition-colors group shadow-sm">
      <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
        <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <h3 className="text-sm font-bold text-primary mb-1">New Conversation</h3>
      <p className="text-neutral text-xs">Upload a new PDF</p>
      
      <input 
        type="file" 
        className="hidden" 
        accept=".pdf" 
        onChange={handleFileChange}
      />
    </label>
  );
}