"use client";
import React, { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Code,
  Calendar,
  Download,
  Upload,
  ArrowDown,
} from "lucide-react";

import { ScheduleDay, DayOfWeek, Schedule } from "../models/Schedule";

import ScheduleService from "../services/Schedule";
import GeneratedSchedule from "../components/GeneratedSchedule";

export default function ManualEditSection() {
  const [scheduleData, setScheduleData] = useState<Schedule>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const updateField = (
    day: DayOfWeek,
    index: number,
    field: keyof ScheduleDay,
    value: string,
  ) => {
    setScheduleData((prev) => {
      const updatedDayArray = [...prev[day]];
      updatedDayArray[index] = { ...updatedDayArray[index], [field]: value };

      return { ...prev, [day]: updatedDayArray };
    });
  };

  const deleteClass = (day: DayOfWeek, index: number) => {
    setScheduleData((prev) => {
      const updatedDayArray = prev[day].filter((_, i) => i !== index);

      return { ...prev, [day]: updatedDayArray };
    });
  };

  const addClass = (day: DayOfWeek) => {
    setScheduleData((prev) => {
      const newEntry: ScheduleDay = {
        time: "12:00 - 01:00",
        meridiem: "PM",
        title: "New Schedule",
      };

      return { ...prev, [day]: [...prev[day], newEntry] };
    });
  };

  const handleImport = async () => {
    try {
      let result = (await ScheduleService.handleImportSchedule()) as any;

      if (typeof result === "string") {
        try {
          result = JSON.parse(result);
        } catch (parseError) {
          console.error("Failed to parse JSON string:", parseError);
          alert("The imported file is not valid JSON.");
          return; // Exit early if parsing fails
        }
      }

      if (result) {
        const importedData = (
          result.schedule ? result.schedule : result
        ) as Partial<Schedule>;

        const safeSchedule: Schedule = {
          Monday: Array.isArray(importedData.Monday) ? importedData.Monday : [],
          Tuesday: Array.isArray(importedData.Tuesday)
            ? importedData.Tuesday
            : [],
          Wednesday: Array.isArray(importedData.Wednesday)
            ? importedData.Wednesday
            : [],
          Thursday: Array.isArray(importedData.Thursday)
            ? importedData.Thursday
            : [],
          Friday: Array.isArray(importedData.Friday) ? importedData.Friday : [],
          Saturday: Array.isArray(importedData.Saturday)
            ? importedData.Saturday
            : [],
          Sunday: Array.isArray(importedData.Sunday) ? importedData.Sunday : [],
        };

        setScheduleData(safeSchedule);

        setTimeout(() => {
          previewRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to import schedule:", error);
      alert("Invalid schedule file.");
    }
  };

  return (
    <div className="flex flex-col gap-12 pb-20">
      <div className="flex items-center justify-between py-6 border-b-2 border-slate-300">
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-blue-700" />
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Manual Editor
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleImport}
            className="flex items-center gap-2 text-sm font-bold text-slate-700 border border-slate-300 px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-all active:scale-95"
          >
            <Upload size={16} /> Import
          </button>
          <button
            onClick={() => ScheduleService.handleExportSchedule(scheduleData)}
            className="flex items-center gap-2 text-sm font-bold text-white bg-blue-700 px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-all shadow-md active:scale-95"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-[75vh]">
        <div className="flex flex-col border-2 border-slate-300 rounded-xl overflow-hidden bg-white shadow-lg shadow-slate-100">
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {(Object.entries(scheduleData) as [DayOfWeek, ScheduleDay[]][]).map(
              ([day, classes]) => (
                <section key={day}>
                  <div className="flex justify-between items-center mb-5 border-b-2 border-slate-200 pb-3 sticky top-0 bg-white z-10">
                    <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest">
                      {day}
                    </h3>
                    <button
                      onClick={() => addClass(day)}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5"
                    >
                      <Plus size={14} strokeWidth={3} /> ADD SCHEDULE
                    </button>
                  </div>

                  <div className="space-y-3">
                    {classes.length > 0 ? (
                      classes.map((item, idx) => (
                        <div
                          key={`${day}-${idx}`}
                          className="group flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-slate-50 transition-all"
                        >
                          <div className="flex-1 space-y-0.5">
                            <p
                              className="text-base font-bold text-slate-950 outline-none"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateField(
                                  day,
                                  idx,
                                  "title",
                                  e.currentTarget.textContent || "",
                                )
                              }
                            >
                              {item.title}
                            </p>
                            <div className="flex gap-2.5 text-xs text-slate-600 font-semibold tracking-wide">
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                className="focus:text-slate-950 outline-none"
                                onBlur={(e) =>
                                  updateField(
                                    day,
                                    idx,
                                    "time",
                                    e.currentTarget.textContent || "",
                                  )
                                }
                              >
                                {item.time}
                              </span>
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                className="text-blue-700 font-extrabold outline-none"
                                onBlur={(e) =>
                                  updateField(
                                    day,
                                    idx,
                                    "meridiem",
                                    e.currentTarget.textContent || "",
                                  )
                                }
                              >
                                {item.meridiem}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteClass(day, idx)}
                            className="opacity-0 group-hover:opacity-100 p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-5 text-center border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest">
                          Free Day
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              ),
            )}
          </div>
        </div>

        <div className="flex flex-col border border-slate-800 rounded-xl overflow-hidden bg-[#0a0a0a]">
          <div className="p-3.5 border-b border-slate-800 flex items-center gap-2.5 bg-slate-950/50">
            <Code size={16} className="text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-tighter">
              Raw Output Buffer
            </span>
          </div>
          <div className="flex-1 p-7 overflow-auto font-mono text-[13px] leading-relaxed text-slate-200 custom-scrollbar">
            <pre>{JSON.stringify({ schedule: scheduleData }, null, 2)}</pre>
          </div>
        </div>
      </div>

      <div
        ref={previewRef}
        className="mt-12 space-y-6 pt-12 border-t-2 border-slate-300"
      >
        <div className="flex flex-col items-center gap-3 mb-10">
          <ArrowDown size={24} className="text-slate-400 animate-bounce" />
          <span className="text-xs font-black text-slate-600 uppercase tracking-[0.4em]">
            Final Preview
          </span>
        </div>

        <div className="overflow-hidden">
          {/* Note: If GeneratedSchedule expects a wrapper object, you may need to pass { schedule: scheduleData } instead */}
          <GeneratedSchedule result={{ schedule: scheduleData } as any} />
        </div>
      </div>
    </div>
  );
}
