"use client";
import React, { useState } from "react";
import { Sparkles, Edit3 } from "lucide-react"; // Icons for Generation and Manual Edit
import GenerationSection from "./GenerationSection";
import ManualEditSection from "./ManualEditSection";
import DotGrid from "@/components/DotGrid";

export default function Main() {
  const [currentSection, setCurrentSection] = useState<string>("Generation");

  // Helper to handle active tab styling
  const getTabClass = (section: string) => {
    const isActive = currentSection === section;
    return `
      flex items-center justify-center px-6 py-3 transition-all duration-200
      border-t border-l border-r border-slate-300
      ${isActive 
        ? "border-b-transparent bg-white z-20 -mb-[1px]" 
        : "border-b-slate-300 opacity-60 hover:opacity-100 z-0"}
      rounded-t-lg
    `;
  };

  return (
    <div className="relative h-screen w-full font-sans overflow-hidden bg-white text-slate-800">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotGrid dotSize={5} gap={32} baseColor="#e2e8f0" />
      </div>

      <div className="relative z-10 h-full w-full overflow-y-auto custom-scrollbar">
          
        <nav className="sticky top-0 z-40 mx-10 mt-20 flex items-end space-x-1 backdrop-blur-md border-b border-slate-100">
          <button 
            onClick={() => setCurrentSection("Generation")}
            className={getTabClass("Generation")}
            title="Generation Section"
          >
            <Sparkles size={20} />
          </button>
          
          <button 
            onClick={() => setCurrentSection("ManualEdit")}
            className={getTabClass("ManualEdit")}
            title="Manual Edit Section"
          >
            <Edit3 size={20} />
          </button>
        </nav>

          {/* MAIN CONTENT AREA (The Folder Body) */}
          <div className="mx-10 flex-1 border border-slate-300 p-8 rounded-b-xl rounded-tr-xl bg-transparent backdrop-blur-[2px]">
            {currentSection === "Generation" ? (
              <GenerationSection />
            ) : (
              <ManualEditSection />
            )}
          </div>

      </div>
    </div>
  );
}