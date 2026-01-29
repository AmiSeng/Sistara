"use client";

import { useState } from "react";
import { FaPlus, FaTrash, FaLayerGroup } from "react-icons/fa";

/* ================= TYPES ================= */
type Row = {
  videoLink: string;
  notesFile: File | null;
};

type Week = {
  rows: Row[];
};

type Month = {
  name: string;
  weeks: Week[];
};

type Phase = {
  name: string;
  months: Month[];
};

type CourseName = "Beginner" | "Frontend" | "Backend" | "Fullstack";

type Course = {
  name: CourseName;
  phases: Phase[];
};

/* ================= HELPERS ================= */
const createMonths = (num: number): Month[] =>
  Array.from({ length: num }, (_, i) => ({
    name: `Month ${i + 1}`,
    weeks: Array.from({ length: 4 }, () => ({
      rows: [{ videoLink: "", notesFile: null }],
    })),
  }));

const createPhases = (course: CourseName): Phase[] => {
  switch (course) {
    case "Beginner":
      return [{ name: "Beginner", months: createMonths(4) }];

    case "Frontend":
      return [
        { name: "Intermediate", months: createMonths(1) }, // ✅ 1 month
        { name: "Advanced", months: createMonths(1) },
      ];

    case "Backend":
      return [
        { name: "Intermediate", months: createMonths(2) }, // ✅ 2 months
        { name: "Advanced", months: createMonths(1) },
      ];

    case "Fullstack":
      return [
        { name: "Intermediate", months: createMonths(3) },
        { name: "Advanced", months: createMonths(2) },
      ];

    default:
      return [];
  }
};

/* ================= INITIAL DATA ================= */
const initialCourses: Course[] = [
  { name: "Beginner", phases: createPhases("Beginner") },
  { name: "Frontend", phases: createPhases("Frontend") },
  { name: "Backend", phases: createPhases("Backend") },
  { name: "Fullstack", phases: createPhases("Fullstack") },
];
/* ================= PAGE ================= */
export default function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<CourseName>("Beginner");

  const addRow = (p: number, m: number, w: number) => {
    const updated = { ...courses };
    const courseIdx = updated.findIndex((c) => c.name === selectedCourse);
    updated[courseIdx].phases[p].months[m].weeks[w].rows.push({
      videoLink: "",
      notesFile: null,
    });
    setCourses(updated);
  };

  const removeRow = (p: number, m: number, w: number, r: number) => {
    const updated = { ...courses };
    const courseIdx = updated.findIndex((c) => c.name === selectedCourse);
    updated[courseIdx].phases[p].months[m].weeks[w].rows.splice(r, 1);
    setCourses(updated);
  };

  const handleRowChange = (
    p: number,
    m: number,
    w: number,
    r: number,
    field: keyof Row,
    value: string | File | null,
  ) => {
    const updated = { ...courses };
    const courseIdx = updated.findIndex((c) => c.name === selectedCourse);
    updated[courseIdx].phases[p].months[m].weeks[w].rows[r][field] =
      value as never;
    setCourses(updated);
  };

  const currentCourse = courses.find((c) => c.name === selectedCourse)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050728] via-[#0B0E48] to-[#141866] p-8 space-y-10">
      {/* ===== HEADER ===== */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-between">
        <div className="absolute -top-10 -right-10 w-40 h-100 bg-[#3f46ff] opacity-20 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-white">
            Course Structure
          </h1>
          <p className="text-gray-500 mt-1">
            Organize videos and learning materials per phase
          </p>
          {/* COURSE SELECT */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value as CourseName)}
            className="mt-4 bg-white text-black rounded-lg px-4 py-2"
          >
            {courses.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <FaLayerGroup className="text-4xl text-white" />
      </div>

      {/* ===== PHASES ===== */}
      {currentCourse.phases.map((phase, pIdx) => (
        <div
          key={phase.name}
          className="relative rounded-3xl bg-white/20 backdrop-blur-xl shadow-[0_20px_60px_rgba(11,14,72,0.25)]
          hover:shadow-[0_25px_70px_rgba(11,14,72,0.35)]
          transition p-8 space-y-6 w-full max-w-5xl mx-auto transform hover:scale-[1.02] motion-safe:duration-300"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            {phase.name} Phase
          </h2>

          {/* ===== MONTHS ===== */}
          <div className="grid gap-6">
            {phase.months.map((month, mIdx) => (
              <div
                key={month.name}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-5"
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  {month.name}
                </h3>

                {/* ===== WEEKS ===== */}
                <div className="grid md:grid-cols-2 gap-6">
                  {month.weeks.map((week, wIdx) => (
                    <div
                      key={wIdx}
                      className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(11,14,72,0.15)]
  border border-white/10 p-5 space-y-4
  hover:shadow-[0_15px_50px_rgba(11,14,72,0.25)]
  hover:scale-[1.01] transition transform motion-safe:duration-300"
                    >
                      <span className="text-sm font-semibold text-gray-500">
                        Week {wIdx + 1}
                      </span>

                      {week.rows.map((row, rIdx) => (
                        <div
                          key={rIdx}
                          className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                        >
                          <input
                            type="text"
                            placeholder="Video URL"
                            value={row.videoLink}
                            onChange={(e) =>
                              handleRowChange(
                                pIdx,
                                mIdx,
                                wIdx,
                                rIdx,
                                "videoLink",
                                e.target.value,
                              )
                            }
                            className="rounded-xl border border-gray-200 px-4 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#0B0E48]/60 transition"
                          />

                          <div className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 flex items-center gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-[#0B0E48]/60 transition">
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) =>
                                handleRowChange(
                                  pIdx,
                                  mIdx,
                                  wIdx,
                                  rIdx,
                                  "notesFile",
                                  e.target.files ? e.target.files[0] : null,
                                )
                              }
                              className="absolute w-full h-full opacity-0 cursor-pointer"
                            />
                            <span className="truncate text-gray-700 text-sm">
                              {currentCourse.phases[pIdx].months[mIdx].weeks[
                                wIdx
                              ].rows[rIdx].notesFile
                                ? currentCourse.phases[pIdx].months[mIdx].weeks[
                                    wIdx
                                  ].rows[rIdx].notesFile!.name
                                : "Choose PDF file"}
                            </span>
                          </div>

                          <button
                            onClick={() => removeRow(pIdx, mIdx, wIdx, rIdx)}
                            className="rounded-xl bg-[#0B0E48]/5 text-[#0B0E48] px-3 hover:bg-[#0B0E48]/10 transition flex items-center gap-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => addRow(pIdx, mIdx, wIdx)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B0E48] hover:underline"
                      >
                        <FaPlus /> Add Video / Notes
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
