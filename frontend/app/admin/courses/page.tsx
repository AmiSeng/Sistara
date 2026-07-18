"use client";
import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaLayerGroup } from "react-icons/fa";
import { api } from "../../src/lib/api";

type Course = {
  id: number;
  title: string;
  phases: Phase[];
};

type Phase = {
  id: number;
  name: string;
  months: Month[];
};

type Month = {
  id: number;
  monthNum: number;
  weeks: Week[];
};

type Lesson = {
  id?: number;
  title: string;
  rows: Row[];
  savedVideos?: string[];
  savedNotes?: string[];
};

type Week = {
  id: number;
  weekNum: number;
  lessons: Lesson[];
};

type Row = {
  videoLink: string;
  notesFile: File | null;
};

type CurriculumLessonResponse = {
  id: number;
  title: string;
  videoLinks: string[];
  notesUrls: string[];
};

type CurriculumWeekResponse = {
  id: number;
  weekNum: number;
  lessons: CurriculumLessonResponse[];
};

type CurriculumMonthResponse = {
  id: number;
  monthNum: number;
  weeks: CurriculumWeekResponse[];
};

type CurriculumPhaseResponse = {
  id: number;
  name: string;
  months: CurriculumMonthResponse[];
};

type CurriculumResponse = {
  id: number;
  title: string;
  phases: CurriculumPhaseResponse[];
};

// const createMonths = (num: number, startId = 1): Month[] =>
//   Array.from({ length: num }, (_, i) => ({
//     id: startId + i,
//     name: `Month ${i + 1}`,
//     weeks: Array.from({ length: 4 }, (_, wi) => ({
//       id: (startId + i) * 10 + (wi + 1), // temporary unique ID
//       lessonTitle: "",
//       rows: [{ videoLink: "", notesFile: null }],
//     })),
//   }));

// const createPhases = (course: CourseName, startId = 1): Phase[] => {
//   switch (course) {
//     case "Beginner":
//       return [{ id: startId, name: "Beginner", months: createMonths(4) }];
//     case "Frontend":
//       return [
//         { id: startId + 1, name: "Intermediate", months: createMonths(1) },
//         { id: startId + 2, name: "Advanced", months: createMonths(1) },
//       ];
//     case "Backend":
//       return [
//         { id: startId + 3, name: "Intermediate", months: createMonths(2) },
//         { id: startId + 4, name: "Advanced", months: createMonths(1) },
//       ];
//     case "Fullstack":
//       return [
//         { id: startId + 5, name: "Intermediate", months: createMonths(3) },
//         { id: startId + 6, name: "Advanced", months: createMonths(2) },
//       ];
//     default:
//       return [];
//   }
// };

// const initialCourses: Course[] = [
//   { id: 1, name: "Beginner", phases: createPhases("Beginner") },
//   { id: 2, name: "Frontend", phases: createPhases("Frontend") },
//   { id: 3, name: "Backend", phases: createPhases("Backend") },
//   { id: 4, name: "Fullstack", phases: createPhases("Fullstack") },
// ];

export default function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingLesson, setUploadingLesson] = useState<string | null>(null);

  const addLesson = (p: number, m: number, w: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id !== selectedCourse
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
                                      lessons: [
                                        ...week.lessons,
                                        {
                                          title: "",
                                          rows: [
                                            {
                                              videoLink: "",
                                              notesFile: null,
                                            },
                                          ],
                                        },
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
  const handleRowChange = (
    p: number,
    m: number,
    w: number,
    l: number,
    r: number,
    field: keyof Row,
    value: string | File | null,
  ) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id !== selectedCourse
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

                                      lessons: week.lessons.map((lesson, li) =>
                                        li !== l
                                          ? lesson
                                          : {
                                              ...lesson,

                                              rows: lesson.rows.map(
                                                (row, ri) =>
                                                  ri !== r
                                                    ? row
                                                    : {
                                                        ...row,
                                                        [field]: value,
                                                      },
                                              ),
                                            },
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

  const handleLessonTitleChange = (
    p: number,
    m: number,
    w: number,
    l: number,
    value: string,
  ) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id !== selectedCourse
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
                                      lessons: week.lessons.map((lesson, li) =>
                                        li !== l
                                          ? lesson
                                          : {
                                              ...lesson,
                                              title: value,
                                            },
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

  const addRow = (p: number, m: number, w: number, l: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id !== selectedCourse
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

                                      lessons: week.lessons.map((lesson, li) =>
                                        li !== l
                                          ? lesson
                                          : {
                                              ...lesson,

                                              rows: [
                                                ...lesson.rows,
                                                {
                                                  videoLink: "",
                                                  notesFile: null,
                                                },
                                              ],
                                            },
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

  const removeRow = (p: number, m: number, w: number, l: number, r: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id !== selectedCourse
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

                                      lessons: week.lessons.map((lesson, li) =>
                                        li !== l
                                          ? lesson
                                          : {
                                              ...lesson,

                                              rows: lesson.rows.filter(
                                                (_, index) => index !== r,
                                              ),
                                            },
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

  const uploadLesson = async (p: number, m: number, w: number, l: number) => {
    const courseObj = courses.find((course) => course.id === selectedCourse);

    if (!courseObj) {
      return;
    }

    const lessonObj = courseObj.phases[p]?.months[m]?.weeks[w]?.lessons[l];

    if (!lessonObj) {
      return;
    }

    if (!lessonObj.title) {
      alert("Lesson title required");
      return;
    }

    const formData = new FormData();

    formData.append("title", lessonObj.title);
    const weekObj = courseObj.phases[p]?.months[m]?.weeks[w];

    if (!weekObj) {
      alert("Week not found");
      return;
    }

    formData.append("weekId", String(weekObj.id));
    formData.append("courseId", String(courseObj.id));

    const videoLinks = lessonObj.rows
      .filter((row) => row.videoLink.trim() !== "")
      .map((row) => row.videoLink);

    formData.append("videoLinks", JSON.stringify(videoLinks));

    lessonObj.rows.forEach((row) => {
      if (row.notesFile) {
        formData.append("notesFiles", row.notesFile);
      }
    });

    try {
      setUploadingLesson(`${p}-${m}-${w}-${l}`);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Admin not logged in");
        return;
      }

      await api.post("/api/admin/lessons", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await loadCurriculum();

      alert("Lesson uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload error");
    } finally {
      setUploadingLesson(null);
    }
  };
  const deleteLesson = async (lessonId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this lesson?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Admin not logged in");
        return;
      }

      await api.delete(`/api/admin/lessons/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await loadCurriculum();

      alert("Lesson deleted successfully");
    } catch (error) {
      console.error("Lesson deletion failed", error);
      alert("Failed to delete lesson");
    }
  };

  useEffect(() => {
    loadCurriculum();
  }, []);

  const loadCurriculum = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Admin not logged in");

        return;
      }

      const response = await api.get<CurriculumResponse[]>(
        "/api/admin/curriculum",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formattedCourses: Course[] = response.data.map((course) => ({
        id: course.id,

        title: course.title,

        phases: course.phases.map((phase) => ({
          id: phase.id,

          name: phase.name,

          months: phase.months.map((month) => ({
            id: month.id,

            monthNum: month.monthNum,

            weeks: month.weeks.map((week) => ({
              id: week.id,
              weekNum: week.weekNum,

              lessons: week.lessons.length
                ? week.lessons.map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    rows: lesson.videoLinks.map((video, index) => ({
                      videoLink: video,
                      notesFile: null,
                    })),
                  }))
                : [
                    {
                      title: "",
                      rows: [
                        {
                          videoLink: "",
                          notesFile: null,
                        },
                      ],
                    },
                  ],
            })),
          })),
        })),
      }));
      setCourses(formattedCourses);

      if (formattedCourses.length > 0) {
        setSelectedCourse(formattedCourses[0].id);
      }
    } catch (error) {
      console.error("Curriculum loading failed", error);

      alert("Failed to load curriculum");
    } finally {
      setLoading(false);
    }
  };

  const currentCourse = courses.find((course) => course.id === selectedCourse);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050728] text-white">
        Loading curriculum...
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050728] text-white">
        No course available
      </div>
    );
  }

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
            value={selectedCourse ?? ""}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
            className="mt-4 bg-white text-black rounded-lg px-4 py-2 w-56"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
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
          <h2>
            {phase.name.charAt(0) + phase.name.slice(1).toLowerCase()} Phase
          </h2>

          {phase.months.map((month, mIdx) => (
            <div
              key={month.monthNum}
              className="rounded-xl bg-white/20 p-5 space-y-4 border border-white/30"
            >
              <h3 className="text-lg font-semibold text-white">
                Month {month.monthNum}
              </h3>

              {month.weeks.map((week, wIdx) => (
                <div
                  key={week.id}
                  className="p-4 rounded-lg bg-white/30 backdrop-blur-md space-y-3"
                >
                  {/* Lesson title */}
                  {week.lessons.map((lesson, lIdx) => (
                    <div key={lIdx} className="border rounded-lg p-4 space-y-3">
                      <input
                        type="text"
                        placeholder="Lesson title"
                        value={lesson.title}
                        onChange={(e) =>
                          handleLessonTitleChange(
                            pIdx,
                            mIdx,
                            wIdx,
                            lIdx,
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg px-3 py-2 text-black"
                      />
                      {lesson.id && (
                        <button
                          onClick={() => deleteLesson(lesson.id!)}
                          className="inline-flex items-center gap-2 bg-[#0B0E48] text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          <FaTrash />
                          Delete Lesson
                        </button>
                      )}
                      {/* Rows */}
                      {lesson.rows.map((row, rIdx) => (
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
                                lIdx,
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
                              onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (!file) return;

                                if (file.type !== "application/pdf") {
                                  alert("Only PDF files are allowed");
                                  return;
                                }

                                if (file.size > 10 * 1024 * 1024) {
                                  alert("PDF must be smaller than 10MB");
                                  return;
                                }

                                handleRowChange(
                                  pIdx,
                                  mIdx,
                                  wIdx,
                                  lIdx,
                                  rIdx,
                                  "notesFile",
                                  file,
                                );
                              }}
                            />
                            {row.notesFile ? row.notesFile.name : "Select PDF"}
                          </label>
                          <button
                            onClick={() =>
                              removeRow(pIdx, mIdx, wIdx, lIdx, rIdx)
                            }
                            className="rounded-xl bg-white text-[#0B0E48] px-3 py-2 hover:bg-white/80 transition flex items-center gap-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => addRow(pIdx, mIdx, wIdx, lIdx)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B0E48] hover:underline"
                      >
                        <FaPlus /> Add Row
                      </button>

                      <button
                        disabled={
                          uploadingLesson === `${pIdx}-${mIdx}-${wIdx}-${lIdx}`
                        }
                        onClick={() => uploadLesson(pIdx, mIdx, wIdx, lIdx)}
                        className="inline-flex items-center gap-2 text-white bg-[#0B0E48] px-4 py-2 rounded-lg disabled:opacity-50"
                      >
                        {uploadingLesson === `${pIdx}-${mIdx}-${wIdx}-${lIdx}`
                          ? "Uploading..."
                          : "Upload Lesson"}
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addLesson(pIdx, mIdx, wIdx)}
                    className="inline-flex items-center gap-2 text-white bg-[#0B0E48] px-4 py-2 rounded-lg"
                  >
                    <FaPlus />
                    Add Lesson
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
