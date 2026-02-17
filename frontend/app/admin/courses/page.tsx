"use client";
import { useState } from "react";
import { FaPlus, FaTrash, FaLayerGroup } from "react-icons/fa";

type Row = { videoLink: string; notesFile: File | null };
type Week = { id: number; lessonTitle: string; rows: Row[] };
type Month = { name: string; weeks: Week[] };
type Phase = { id: number; name: string; months: Month[] };
type CourseName = "Beginner" | "Frontend" | "Backend" | "Fullstack";
type Course = { id: number; name: CourseName; phases: Phase[] };

const createMonths = (num: number, startId = 1): Month[] =>
  Array.from({ length: num }, (_, i) => ({
    id: startId + i,
    name: `Month ${i + 1}`,
    weeks: Array.from({ length: 4 }, (_, wi) => ({
      id: (startId + i) * 10 + (wi + 1), // temporary unique ID
      lessonTitle: "",
      rows: [{ videoLink: "", notesFile: null }],
    })),
  }));

const createPhases = (course: CourseName, startId = 1): Phase[] => {
  switch (course) {
    case "Beginner":
      return [{ id: startId, name: "Beginner", months: createMonths(4) }];
    case "Frontend":
      return [
        { id: startId + 1, name: "Intermediate", months: createMonths(1) },
        { id: startId + 2, name: "Advanced", months: createMonths(1) },
      ];
    case "Backend":
      return [
        { id: startId + 3, name: "Intermediate", months: createMonths(2) },
        { id: startId + 4, name: "Advanced", months: createMonths(1) },
      ];
    case "Fullstack":
      return [
        { id: startId + 5, name: "Intermediate", months: createMonths(3) },
        { id: startId + 6, name: "Advanced", months: createMonths(2) },
      ];
    default:
      return [];
  }
};

const initialCourses: Course[] = [
  { id: 1, name: "Beginner", phases: createPhases("Beginner") },
  { id: 2, name: "Frontend", phases: createPhases("Frontend") },
  { id: 3, name: "Backend", phases: createPhases("Backend") },
  { id: 4, name: "Fullstack", phases: createPhases("Fullstack") },
];

export default function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<CourseName>("Beginner");

  const handleRowChange = (
    p: number,
    m: number,
    w: number,
    r: number,
    field: keyof Row,
    value: string | File | null,
  ) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.name !== selectedCourse
          ? course
          : {
              ...course,
              phases: course.phases.map((phase, pi) =>
                pi !== p
                  ? phase
                  : {
                      ...phase,
                      months: phase.months.map((month, mi) =>
                        mi !== m
                          ? month
                          : {
                              ...month,
                              weeks: month.weeks.map((week, wi) =>
                                wi !== w
                                  ? week
                                  : {
                                      ...week,
                                      rows: week.rows.map((row, ri) =>
                                        ri !== r
                                          ? row
                                          : { ...row, [field]: value },
                                      ),
                                    },
                              ),
                            },
                      ),
                    },
              ),
            },
      ),
    );
  };

  const handleWeekTitleChange = (
    p: number,
    m: number,
    w: number,
    value: string,
  ) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.name !== selectedCourse
          ? course
          : {
              ...course,
              phases: course.phases.map((phase, pi) =>
                pi !== p
                  ? phase
                  : {
                      ...phase,
                      months: phase.months.map((month, mi) =>
                        mi !== m
                          ? month
                          : {
                              ...month,
                              weeks: month.weeks.map((week, wi) =>
                                wi !== w
                                  ? week
                                  : { ...week, lessonTitle: value },
                              ),
                            },
                      ),
                    },
              ),
            },
      ),
    );
  };

  const addRow = (p: number, m: number, w: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.name !== selectedCourse
          ? course
          : {
              ...course,
              phases: course.phases.map((phase, pi) =>
                pi !== p
                  ? phase
                  : {
                      ...phase,
                      months: phase.months.map((month, mi) =>
                        mi !== m
                          ? month
                          : {
                              ...month,
                              weeks: month.weeks.map((week, wi) =>
                                wi !== w
                                  ? week
                                  : {
                                      ...week,
                                      rows: [
                                        ...week.rows,
                                        { videoLink: "", notesFile: null },
                                      ],
                                    },
                              ),
                            },
                      ),
                    },
              ),
            },
      ),
    );
  };

  const removeRow = (p: number, m: number, w: number, r: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.name !== selectedCourse
          ? course
          : {
              ...course,
              phases: course.phases.map((phase, pi) =>
                pi !== p
                  ? phase
                  : {
                      ...phase,
                      months: phase.months.map((month, mi) =>
                        mi !== m
                          ? month
                          : {
                              ...month,
                              weeks: month.weeks.map((week, wi) =>
                                wi !== w
                                  ? week
                                  : {
                                      ...week,
                                      rows: week.rows.filter(
                                        (_, ri) => ri !== r,
                                      ),
                                    },
                              ),
                            },
                      ),
                    },
              ),
            },
      ),
    );
  };

  const uploadLesson = async (p: number, m: number, w: number) => {
    const courseObj = courses.find((c) => c.name === selectedCourse)!;
    const weekObj = courseObj.phases[p].months[m].weeks[w];

    if (!weekObj.lessonTitle) {
      alert("Lesson title required");
      return;
    }

    const weekId = weekObj.id;
    const courseId = courseObj.id;

    if (!weekId || !courseId) {
      alert("Week or Course not properly loaded");
      return;
    }

    const formData = new FormData();
    formData.append("title", weekObj.lessonTitle);
    formData.append("weekId", String(weekId));
    formData.append("courseId", String(courseId));

    weekObj.rows.forEach((row) => {
      if (row.videoLink) {
        formData.append("videoLinks", row.videoLink);
      }
      if (row.notesFile) {
        formData.append("notesFiles", row.notesFile);
      }
    });

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Admin not logged in");
        return;
      }
      const res = await fetch(
        "http://localhost:5000/api/admin/lessons/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      console.log("Lesson saved:", data);
      alert("Lesson uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }
  };

  const currentCourse = courses.find((c) => c.name === selectedCourse)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050728] via-[#0B0E48] to-[#141866] p-8 space-y-10">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-between">
        <div className="absolute -top-10 -right-10 w-40 h-100 bg-[#3f46ff] opacity-20 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-white">
            Course Structure
          </h1>
          <p className="text-gray-300 mt-1">
            Organize videos and learning materials per phase
          </p>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value as CourseName)}
            className="mt-4 bg-white text-black rounded-lg px-4 py-2 w-56"
          >
            {courses.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <FaLayerGroup className="text-4xl text-white" />
      </div>

      {/* PHASES */}
      {currentCourse.phases.map((phase, pIdx) => (
        <div
          key={phase.name}
          className="relative rounded-3xl bg-white/10 backdrop-blur-xl shadow-lg p-6 space-y-6 w-full max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white">{phase.name} Phase</h2>

          {phase.months.map((month, mIdx) => (
            <div
              key={month.name}
              className="rounded-xl bg-white/20 p-5 space-y-4 border border-white/30"
            >
              <h3 className="text-lg font-semibold text-white">{month.name}</h3>

              {month.weeks.map((week, wIdx) => (
                <div
                  key={wIdx}
                  className="p-4 rounded-lg bg-white/30 backdrop-blur-md space-y-3"
                >
                  {/* Lesson title */}
                  <input
                    type="text"
                    placeholder="Lesson title (e.g., HTML Intro)"
                    value={week.lessonTitle}
                    onChange={(e) =>
                      handleWeekTitleChange(pIdx, mIdx, wIdx, e.target.value)
                    }
                    className="w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
                  />

                  {/* Rows */}
                  {week.rows.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-center"
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
                        className="rounded-lg px-3 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <label className="w-full flex items-center bg-white/70 rounded-lg px-3 py-2 cursor-pointer text-black truncate">
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
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
                        />
                        {row.notesFile ? row.notesFile.name : "Select PDF"}
                      </label>
                      <button
                        onClick={() => removeRow(pIdx, mIdx, wIdx, rIdx)}
                        className="rounded-xl bg-white text-[#0B0E48] px-3 py-2 hover:bg-white/80 transition flex items-center gap-1"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => addRow(pIdx, mIdx, wIdx)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B0E48] hover:underline"
                    >
                      <FaPlus /> Add Row
                    </button>

                    <button
                      onClick={() => uploadLesson(pIdx, mIdx, wIdx)}
                      className="inline-flex items-center gap-2 text-white bg-[#0B0E48] px-4 py-2 rounded-lg hover:bg-[#050728]/90"
                    >
                      Upload Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
