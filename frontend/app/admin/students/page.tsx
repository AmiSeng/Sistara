"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaUserGraduate } from "react-icons/fa";
import { api } from "../../src/lib/api";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type Week = boolean;
type Month = { paid: boolean; weeks: Week[] };
type CourseName = "BEGINNER" | "FRONTEND" | "BACKEND" | "FULLSTACK";
type PhaseName = "Beginner" | "Intermediate" | "Advanced";
type CoursePhase =
  | "BEGINNER"
  | "FRONTEND-Intermediate"
  | "FRONTEND-Advanced"
  | "BACKEND-Intermediate"
  | "BACKEND-Advanced"
  | "FULLSTACK-Intermediate"
  | "FULLSTACK-Advanced";

type Subscription = { courseId: number; month: number; paid: boolean };

type Student = {
  id: number;
  username: string;
  password?: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: "ACTIVE" | "INACTIVE";
  specialization: CourseName | null;
  access: Record<CoursePhase, Month[]>;
  subscriptions?: Subscription[];
};
type Course = { id: number; title: CourseName; phases: PhaseName[] };

type FormFields =
  | "username"
  | "password"
  | "name"
  | "email"
  | "phoneNumber"
  | "status";

/* ================= HELPERS ================= */
const createMonths = (num: number): Month[] =>
  Array.from({ length: num }, () => ({
    paid: false,
    weeks: [false, false, false, false],
  }));

const mapSubscriptionsToAccess = (
  subscriptions: Subscription[] = [],
  courses: Course[] = [],
  studentCourses: CourseName[] = [],
): Record<CoursePhase, Month[]> => {
  const access: Record<CoursePhase, Month[]> = {
    BEGINNER: createMonths(4),
    "FRONTEND-Intermediate": [],
    "FRONTEND-Advanced": [],
    "BACKEND-Intermediate": [],
    "BACKEND-Advanced": [],
    "FULLSTACK-Intermediate": [],
    "FULLSTACK-Advanced": [],
  };

  // Assign months for each specialization phase
  studentCourses.forEach((c) => {
    if (c === "FRONTEND") {
      access["FRONTEND-Intermediate"] = createMonths(1);
      access["FRONTEND-Advanced"] = createMonths(1);
    }

    if (c === "BACKEND") {
      access["BACKEND-Intermediate"] = createMonths(2);
      access["BACKEND-Advanced"] = createMonths(1);
    }

    if (c === "FULLSTACK") {
      access["FULLSTACK-Intermediate"] = createMonths(3);
      access["FULLSTACK-Advanced"] = createMonths(2);
    }
  });

  // Map subscriptions to access
  subscriptions.forEach((sub) => {
    const course = courses.find((c) => c.id === sub.courseId);
    if (!course) return;

    if (course.title.toUpperCase() === "BEGINNER") {
      if (access["BEGINNER"]?.[sub.month - 1]) {
        access["BEGINNER"][sub.month - 1].paid = sub.paid;
      }
      return;
    }

    const key =
      `${course.title.toUpperCase()}-${course.phases[0]}` as CoursePhase;

    if (access[key]?.[sub.month - 1]) {
      access[key][sub.month - 1].paid = sub.paid;
    }
  });

  return access;
};

/* ================= PAGE ================= */
export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true); // <-- added
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Student, "id" | "access">>({
    username: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
    status: "ACTIVE",
    specialization: null,
  });

  /* ================= API ================= */
  const loadData = async () => {
    try {
      const courseRes = await api.get<Course[]>("/api/admin/courses");
      setCourses(courseRes.data);
      const studentRes = await api.get<Student[]>("/api/admin/students");

      const mappedStudents = studentRes.data.map((stu) => ({
        ...stu,
        access: mapSubscriptionsToAccess(
          stu.subscriptions ?? [],
          courseRes.data,
          stu.specialization ? [stu.specialization] : [], // ✅ convert single value to array
        ),
      }));

      setStudents(mappedStudents);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);

    return () => clearTimeout(id); // cleanup
  }, []);
  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;
    const init = async () => {
      const token = localStorage.getItem("adminToken");
      const role = localStorage.getItem("role");

      if (!token || role !== "ADMIN") {
        console.warn("No token or not ADMIN, data might fail to load");
      }
      try {
        const courseRes = await api.get<Course[]>("/api/admin/courses");
        const studentRes = await api.get<Student[]>("/api/admin/students");

        if (cancelled) return;

        setCourses(courseRes.data);

        const mappedStudents = studentRes.data.map((stu) => ({
          ...stu,
          access: mapSubscriptionsToAccess(
            stu.subscriptions ?? [],
            courseRes.data,
            stu.specialization ? [stu.specialization] : [], // ✅ convert single value to array
          ),
        }));

        setStudents(mappedStudents);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        if (!cancelled) {
          setLoading(false); // <-- set loading to false after data is loaded
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  if (loading) return <p className="p-8">Loading...</p>;

  /* ================= HANDLERS ================= */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = async () => {
    if (!form.username || !form.name || !form.email) return;
    try {
      if (editingId) {
        await api.put(`/api/admin/students/${editingId}`, form);
      } else {
        await api.post("/api/admin/students", form);
      }
      setForm({
        username: "",
        password: "",
        name: "",
        email: "",
        phoneNumber: "",
        status: "ACTIVE",
        specialization: null,
      });
      setEditingId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to save student", err);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);

    setForm({
      username: student.username,
      password: "",
      name: student.name,
      email: student.email,
      phoneNumber: student.phoneNumber ?? "",
      status: student.status,
      specialization: student.specialization ?? null,
    });
  };

  const handleDisable = async (id: number) => {
    if (!confirm("Disable this student?")) return;

    try {
      await api.patch(`/api/admin/students/${id}/disable`);
      await loadData();
    } catch (err) {
      console.error("Failed to disable student", err);
    }
  };

  const toggleMonthAccess = async (
    userId: number,
    coursePhase: CoursePhase,
    monthIndex: number,
  ) => {
    const student = students.find((s) => s.id === userId);
    if (!student) return;

    const currentPaid = student.access[coursePhase][monthIndex].paid;
    const newPaid = !currentPaid; // toggled
    // Toggle locally
    setStudents((prev) =>
      prev.map((s) =>
        s.id === userId
          ? {
              ...s,
              access: {
                ...s.access,
                [coursePhase]: s.access[coursePhase].map((m, i) =>
                  i === monthIndex ? { ...m, paid: !m.paid } : m,
                ),
              },
            }
          : s,
      ),
    );

    // Persist
    let courseId: number | null = null;
    if (coursePhase === "BEGINNER") {
      const beginnerCourse = courses.find(
        (c) => c.title.toUpperCase() === "BEGINNER",
      );
      if (!beginnerCourse) return console.error("Beginner course not found");
      courseId = beginnerCourse.id;
    } else {
      const [courseName] = coursePhase.split("-") as [CourseName];
      const course = courses.find((c) => c.title.toUpperCase() === courseName);
      if (!course) return console.error("Course not found for", coursePhase);
      courseId = course.id;
    }

    try {
      await api.patch(`/api/admin/students/subscriptions/${userId}`, {
        courseId,
        month: monthIndex + 1,
        paid: newPaid,
      });
    } catch (err) {
      console.error("Failed to update subscription", err);
    }
  };

  /* ================= UI ================= */
  const renderCoursePhases = (student: Student) => {
    const rows: CoursePhase[] = ["BEGINNER"];

    const spec = student.specialization;

    if (spec === "FRONTEND")
      rows.push("FRONTEND-Intermediate", "FRONTEND-Advanced");

    if (spec === "BACKEND")
      rows.push("BACKEND-Intermediate", "BACKEND-Advanced");

    if (spec === "FULLSTACK")
      rows.push("FULLSTACK-Intermediate", "FULLSTACK-Advanced");

    return rows.map((phase) => (
      <div key={phase} className="mb-3">
        <p className="text-xs font-semibold text-[#0B0E48] mb-1">{phase}</p>
        <div className="flex flex-wrap gap-2">
          {student.access[phase]?.map((m, i) => (
            <button
              key={i}
              onClick={() => toggleMonthAccess(student.id, phase, i)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                m.paid
                  ? "bg-[#0B0E48] text-white shadow-[0_0_20px_rgba(11,14,72,0.6)] hover:brightness-110 hover:scale-[1.05]"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-[1.05]"
              }`}
            >
              {m.paid ? `M${i + 1} ✓` : `M${i + 1}`}
            </button>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050728] via-[#0B0E48] to-[#141866] p-8 space-y-10">
      {/* ===== HEADER ===== */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3f46ff] opacity-20 blur-3xl rounded-full" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Student Management
            </h1>
            <p className="text-gray-300 mt-1">
              Control enrollment, access & progress
            </p>
          </div>
          <FaUserGraduate className="text-5xl opacity-80" />
        </div>
      </div>

      {/* ===== FORM ===== */}
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-[0_25px_100px_rgba(11,14,72,0.35)] border border-white/20 p-8 mx-auto max-w-8xl transform hover:scale-[1.03] transition motion-safe:duration-300">
        <h2 className="text-xl font-bold mb-4 text-[#0B0E48]">
          {editingId ? "Edit Student" : "Add New Student"}
        </h2>
        <div className="grid md:grid-cols-6 gap-4">
          {(
            [
              "username",
              "password",
              "name",
              "email",
              "phoneNumber",
            ] as FormFields[]
          ).map((field) => (
            <input
              key={field}
              name={field}
              type={field === "password" ? "password" : "text"}
              value={form[field] || ""}
              onChange={handleInputChange}
              placeholder={field.toUpperCase()}
              className="bg-white/70 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B0E48]/60 transition text-[#0B0E48]"
            />
          ))}
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            className="bg-white/70 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B0E48]/60 transition text-[#0B0E48]"
          >
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>
          {/* Specialization checkboxes */}
          <div className="col-span-full">
            <p className="font-semibold text-white/80 mb-2">Specializations:</p>
            <div className="flex gap-4">
              {(["FRONTEND", "BACKEND", "FULLSTACK"] as const).map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-1 text-white/80"
                >
                  <input
                    type="radio"
                    name="specialization"
                    value={c}
                    checked={form.specialization === c}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        specialization: c,
                      }))
                    }
                    className="accent-[#0B0E48]"
                  />
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={handleAddOrUpdate}
          className="mt-6 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#0B0E48] to-[#141866] shadow-[0_10px_30px_rgba(11,14,72,0.45)] hover:scale-[1.02] hover:brightness-110 transition"
        >
          {editingId ? "Update Student" : "Add Student"}
        </button>
      </div>

      {/* ===== STUDENT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-center">
        {students.map((s) => (
          <div
            key={s.id}
            className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-[0_25px_100px_rgba(11,14,72,0.35)] border border-white/20 hover:scale-[1.05] hover:shadow-[0_35px_120px_rgba(11,14,72,0.5)] hover:bg-white/30 transition transform motion-safe:duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg sm:text-base md:text-lg text-gray-300">
                  {s.name}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-400">
                  @{s.username}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  s.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {s.status}
              </span>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-300">
              {s.email}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-3">
              {s.phoneNumber}
            </p>
            <p className="text-sm text-gray-300 mb-3">
              Specializations: {s.specialization ?? "None"}
            </p>

            {/* Access Rows */}
            <div className="space-y-3 mt-4">{renderCoursePhases(s)}</div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => handleEdit(s)}
                className="text-[#0B0E48] hover:scale-110 hover:brightness-125 transition"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDisable(s.id)}
                title="Disable Student"
                className="text-[#0B0E48] hover:scale-110 transition"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
