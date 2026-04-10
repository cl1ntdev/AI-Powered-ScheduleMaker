"use client";
import React, { useState, useEffect } from "react";
import PdfGenerator from "./PdfGenerator";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Schedule, ScheduleDay } from "../models/Schedule";

interface GeneratedScheduleProps {
  result: Schedule,
  onUpdate: (sched: Schedule) => void;
}

const GeneratedSchedule = ({ result,onUpdate }: GeneratedScheduleProps) => {
  const [editableSchedule, setEditableSchedule] = useState<Schedule | null>(
    null,
  );

  useEffect(() => {
    if (!result) return;
    
    let data: any = result;
    
    if (typeof result === "string") {
      try {
        data = JSON.parse(result);
      } catch (error) {
        console.error("Failed to parse result string:", error);
        return;
      }
    }

    // CRITICAL FIX: Unwrap the schedule object if it comes in as {"schedule": {...}}
    const actualSchedule = data.schedule ? data.schedule : data;

    if (actualSchedule) {
      setEditableSchedule(actualSchedule);
    }
  }, [result]);

  if (!editableSchedule) return null;

  const days = Object.keys(editableSchedule) as (keyof Schedule)[];

  const handleUpdateTask = (
    day: keyof Schedule,
    taskIdx: number,
    field: keyof ScheduleDay,
    value: string,
  ) => {
    const newSchedule = { ...editableSchedule };
    // Clone the specific day's array and task to avoid mutating state directly
    const updatedDay = [...newSchedule[day]];
    updatedDay[taskIdx] = { ...updatedDay[taskIdx], [field]: value };
    
    newSchedule[day] = updatedDay;
    setEditableSchedule(newSchedule);
    onUpdate(newSchedule)
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-slate-200 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Weekly Plan
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Optimized shift breakdown based on your context.
          </p>
        </div>

        <PDFDownloadLink
          document={<PdfGenerator schedule={editableSchedule} />}
          fileName="weekly-schedule.pdf"
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-700"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download as PDF")}
        </PDFDownloadLink>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
        {days.map((day) => {
          const tasks = editableSchedule[day];
          
          // Extra safety check to ensure tasks is actually an array before rendering
          if (!tasks || !Array.isArray(tasks) || tasks.length === 0) return null;

          return (
            <div
              key={day}
              className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col"
            >
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em]">
                  {day}
                </h3>
              </div>

              <div className="p-5 space-y-6 relative flex-1">
                <div className="absolute left-[2.5rem] top-8 bottom-6 w-0.5 bg-gradient-to-b from-indigo-100 via-indigo-200 to-transparent" />

                {tasks.map((task: ScheduleDay, idx: number) => (
                  <div
                    key={idx}
                    className="flex gap-4 relative z-10 group/task items-start"
                  >
                    <div className="flex flex-col items-center justify-start min-w-[55px] pt-1">
                      <input
                        className="text-sm font-black text-slate-900 bg-transparent border-none p-0 w-full text-center focus:ring-0"
                        value={task.time}
                        onChange={(e) =>
                          handleUpdateTask(day, idx, "time", e.target.value)
                        }
                      />
                      <input
                        className="text-[10px] font-bold text-slate-400 uppercase bg-transparent border-none p-0 w-full text-center focus:ring-0"
                        value={task.meridiem}
                        onChange={(e) =>
                          handleUpdateTask(day, idx, "meridiem", e.target.value)
                        }
                      />
                    </div>

                    <div className="mt-2 w-3.5 h-3.5 rounded-full border-2 border-white bg-indigo-500 shrink-0" />

                    <div className="flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100 focus-within:bg-white focus-within:border-indigo-300 transition-colors">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="text-sm text-slate-700 font-semibold leading-relaxed outline-none"
                        onBlur={(e) =>
                          handleUpdateTask(
                            day,
                            idx,
                            "title",
                            e.currentTarget.textContent || "",
                          )
                        }
                      >
                        {task.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneratedSchedule;