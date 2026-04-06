"use client";
import React, { useState, useEffect, useRef } from "react";
import { Context } from "../models/ContextSend";
import { SendContext } from "../api/SendContext";
import GeneratedSchedule from "../components/GeneratedSchedule";
import ContextModal from "../components/ContextModal";
import ScheduleService from "../services/Schedule";

const GenerationSection = () => {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result) {
      const scrollTimeout = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }, 100); 
  
      return () => clearTimeout(scrollTimeout);
    }
  }, [result]);

  const handleAddContext = () => {
    setContexts([...contexts, { title: "", details: "" }]);
    setSelectedIndex(contexts.length);
  };

  const handleRemoveContext = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    setContexts(contexts.filter((_, index) => index !== i));
  };

  const updateContext = (title: string, details: string) => {
    if (selectedIndex === null) return;
    const newContexts = [...contexts];
    newContexts[selectedIndex] = { title, details };
    setContexts(newContexts);
  };

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    try {
      const res = await SendContext(contexts, userPrompt);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="text-center space-y-3 shrink-0">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          AI Weekly Schedule{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Input your context and let the algorithm do the heavy lifting. - cl1ntdev
        </p>
      </div>

      <div className="rounded-[2.5rem] border border-slate-200/60 w-full h-full bg-white shadow-sm">
        <div className="p-6 sm:p-10 space-y-10">
          <div className="space-y-6 w-full h-full">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/40">
              <button
                onClick={handleAddContext}
                className="text-sm font-bold text-blue-600 hover:bg-blue-50 border border-blue-600/30 px-5 py-2.5 rounded-xl transition-all"
              >
                + Add Context
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    // Added await and type handling
                    const imported = await ScheduleService.handleImportSchedule();
                    if (imported) {
                      console.log("The result from import is", imported);
                      setResult(imported);
                    }
                  }}
                  className="text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-xl transition-all"
                >
                  Import Schedule
                </button>
                <button
                  onClick={() => ScheduleService.handleExportSchedule(result)}
                  disabled={!result}
                  className="text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  Export Schedule
                </button>
              </div>
            </div>

            {contexts.length === 0 && (
              <div className="text-center py-10 text-slate-400 italic">
                No contexts yet. Add some to get started!
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {contexts.map((ctx, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className="group cursor-pointer flex flex-col gap-2 p-5 rounded-3xl border border-slate-200/60 hover:border-blue-400/50 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">
                      {ctx.title || <span className="text-slate-400 italic">Untitled Context</span>}
                    </span>
                    <button
                      onClick={(e) => handleRemoveContext(e, index)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-all p-1"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {ctx.details || "No details provided yet..."}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-10 border-t border-slate-200/40">
            <input
              className="w-full bg-slate-50 border border-slate-200/60 text-slate-900 rounded-2xl px-6 py-5 outline-none text-lg focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Any other Request? (Optional)"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            />
            <button
              onClick={handleGenerateSchedule}
              disabled={isGenerating}
              className="w-full py-5 bg-slate-900 text-white font-black text-lg rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.99]"
            >
              {isGenerating ? "Processing AI logic..." : "Generate Schedule"}
            </button>
          </div>
        </div>
      </div>

      {selectedIndex !== null && (
        <ContextModal
          title={contexts[selectedIndex].title}
          details={contexts[selectedIndex].details}
          onClose={() => setSelectedIndex(null)}
          onSave={(t, d) => {
            updateContext(t, d);
            setSelectedIndex(null);
          }}
        />
      )}

      {/* 3. Wrap the results in the ref div */}
      <div ref={resultsRef} className="pt-4">
        {result && <GeneratedSchedule result={result} />}
      </div>
    </div>
  );
};

export default GenerationSection;