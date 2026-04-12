"use client";
import React, { useState } from "react";
import ocr_api from "../api/ocr_api";
import { Upload, Loader2, FileImage, X } from "lucide-react";

interface ContextModalProps {
  title: string;
  details: string;
  onClose: () => void;
  onSave: (title: string, details: string) => void;
}

const ContextModal = ({
  title: initialTitle,
  details: initialDetails,
  onClose,
  onSave,
}: ContextModalProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [details, setDetails] = useState(initialDetails);

  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  
  
  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    setIsUploading(true);
    if (!file) return;

    try {
      console.log(`Uploading: ${file.name}`);
      const responseData = await ocr_api(file);
      if(responseData.status !== "success") {
        alert("error ocr")
        return;
      }
      setIsUploading(false);
      console.log("Resonse", responseData)
      setDetails(responseData.extracted_text)
    } catch (error) {
      console.error("Upload process failed.", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
  
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 space-y-6">
        <header className="text-center">
          <h3 className="text-xl font-bold text-slate-800">Context Details</h3>
          <p className="text-sm text-slate-500">Add info manually or via image OCR</p>
        </header>
  
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Title</label>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekly Work Constraints"
          />
        </div>
  
        {/* OCR / Image Upload Area */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Quick Add via Image</label>
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadImage}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isUploading}
            />
            <div className={`
              border-2 border-dashed rounded-2xl p-4 transition-all flex items-center justify-center gap-3
              ${isUploading ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/30 border-blue-200 group-hover:bg-blue-50 group-hover:border-blue-400'}
            `}>
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-slate-600">Reading image...</span>
                </>
              ) : fileName ? (
                <>
                  <FileImage className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-600 truncate max-w-[200px]">{fileName}</span>
                  <button onClick={(e) => {e.stopPropagation(); setFileName("")}} className="ml-auto p-1 hover:bg-slate-200 rounded-full">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-500">Click or drop image for OCR</span>
                </>
              )}
            </div>
          </div>
        </div>
  
        {/* Details Area */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">Full Details</label>
          <textarea
            className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none transition-all"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Paste context here or upload an image above..."
          />
        </div>
  
        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">
            Cancel
          </button>
          <button
            onClick={() => onSave(title, details)}
            disabled={isUploading}
            className="flex-1 py-4 font-bold bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all"
          >
            Save Context
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContextModal;
