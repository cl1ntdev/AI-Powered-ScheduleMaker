"use client";
import React, { useState } from "react";
import ocr_api from "../api/ocr_api";
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

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
      console.log(`Uploading: ${file.name}`);
      const responseData = await ocr_api(file);
    } catch (error) {
      console.error("Upload process failed.", error);
    }
  };

  return (
    // Fixed inset-0 z-50 ensures it is the TOPMOST layer, above the dots.
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Dimmer */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
            Title
          </label>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500/20"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Work Schedule, Constraints, etc."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
            Details
          </label>
          <textarea
            className="w-full h-48 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Type out all the specific details..."
          />
          <div>
            <h2>Upload Receipt for OCR</h2>

            <input type="file" accept="image/*" onChange={handleUploadImage} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title, details)}
            className="flex-1 py-4 font-bold bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            Save Context
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContextModal;
