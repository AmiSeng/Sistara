"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaUserGraduate } from "react-icons/fa";
import { api } from "../../src/lib/api";

/* ================= TYPES ================= */
type Week = boolean;
type Month = { paid: boolean; weeks: Week[] };
type CourseName = "Frontend" | "Backend" | "Fullstack";

type PhaseName = "Beginner" | "Intermediate" | "Advanced";
type CoursePhase = `${CourseName}-${PhaseName}` | "Beginner";

type Subscription = { courseId: number; month: number; paid: boolean };

type Student = {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  courses: CourseName[];
  access: Record<CoursePhase, Month[]>;
  subscriptions?: Subscription[];
};

type FormFields =
  | "username"
  | "password"
  | "name"
  | "email"
  | "phone"
  | "status";

/* ================= HELPERS ================= */
const createMonths = (num: number): Month[] =>
  Array.from({ length: num }, () => ({
    paid: false,
    weeks: [false, false, false, false],
  }));

const coursePhaseMap: Record<string, CoursePhase> = {
  BEGINNER: "Beginner",
  FRONTEND_INTERMEDIATE: "Frontend-Intermediate",
  FRONTEND_ADVANCED: "Frontend-Advanced",
  BACKEND_INTERMEDIATE: "Backend-Intermediate",
  BACKEND_ADVANCED: "Backend-Advanced",
  FULLSTACK_INTERMEDIATE: "Fullstack-Intermediate",
  FULLSTACK_ADVANCED: "Fullstack-Advanced",
};

const mapSubscriptionsToAccess = (
  subscriptions: Subscription[],
  courses: { id: number; phase: string; course: CourseName }[],
  studentCourses: CourseName[], // <-- pass selected courses
): Record<CoursePhase, Month[]> => {
  // Initialize access with Beginner
  const access: Record<CoursePhase, Month[]> = {
    Beginner: createMonths(4),

    "Frontend-Beginner": [],
    "Frontend-Intermediate": [],
    "Frontend-Advanced": [],

    "Backend-Beginner": [],
    "Backend-Intermediate": [],
    "Backend-Advanced": [],

    "Fullstack-Beginner": [],
    "Fullstack-Intermediate": [],
    "Fullstack-Advanced": [],
  };

  // Add only the tracks the student selected
  studentCourses.forEach((c) => {
    if (c === "Frontend") {
      access["Frontend-Intermediate"] = createMonths(1);
      access["Frontend-Advanced"] = createMonths(1);
    }
    if (c === "Backend") {
      access["Backend-Intermediate"] = createMonths(1);
      access["Backend-Advanced"] = createMonths(1);
    }
    if (c === "Fullstack") {
      access["Fullstack-Intermediate"] = createMonths(3);
      access["Fullstack-Advanced"] = createMonths(2);
    }
  });

  // Map actual subscription payments
  subscriptions.forEach((sub) => {
    const course = courses.find((c) => c.id === sub.courseId);
    if (!course) return;

    const key =
      course.phase === "BEGINNER"
        ? "Beginner"
        : (`${course.course}-${course.phase}` as CoursePhase);

    if (key && access[key]?.[sub.month - 1]) {
      access[key][sub.month - 1].paid = sub.paid;
    }
  });

  return access;
};

/* ================= PAGE ================= */
export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<
    { id: number; phase: PhaseName; course: CourseName }[]
  >([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Student, "id" | "access">>({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    status: "Active",
    courses: ["Fullstack"],
  });

  /* ================= API ================= */
  const fetchCourses = async () => {
    try {
      const res =
        await api.get<{ id: number; phase: string; course: CourseName }[]>(
          "/api/admin/courses",
        );
      // Map backend string to PhaseName
      const mapped = res.data.map((c) => ({
        ...c,
        phase: c.phase as PhaseName,
      }));
      setCourses(mapped);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get<Student[]>("/api/admin/students");
      const mapped = res.data.map((stu) => ({
        ...stu,
        access: mapSubscriptionsToAccess(
          stu.subscriptions ?? [],
          courses,
          stu.courses, // <-- selected courses only
        ),
      }));
      setStudents(mapped);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCourses(); // ✅ fetch courses first
      await fetchStudents();
    };
    loadData();
  }, []);

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
        await api.put(`/api/admin/students?id=${editingId}`, form);
      } else {
        await api.post("/api/admin/students", form);
      }
      setForm({
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        status: "Active",
        courses: ["Fullstack"],
      });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error("Failed to save student", err);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setExpandedId(student.id);
    setForm({ ...student });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this student?")) return;

    try {
      await api.delete(`/admin/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  const toggleMonthAccess = async (
    userId: number,
    coursePhase: CoursePhase,
    monthIndex: number,
  ) => {
    const student = students.find((s) => s.id === userId);
    if (!student) return;

    const paid = !student.access[coursePhase][monthIndex].paid;

    // Find the course ID
    const phaseParts = coursePhase.split("-");
    const courseName = phaseParts[0] as CourseName;
    const phaseName = phaseParts[1] || "BEGINNER";
    const course = courses.find(
      (c) => c.course === courseName && c.phase === phaseName.toUpperCase(),
    );

    if (!course) return console.error("Course not found for", coursePhase);
    try {
      await api.patch(`/api/admin/subscriptions/${userId}`, {
        courseId: course.id,
        month: monthIndex + 1,
        paid,
      });
      fetchStudents();
    } catch (err) {
      console.error("Failed to update subscription", err);
    }
  };

  /* ================= UI ================= */
  const renderCoursePhases = (student: Student) => {
    const rows: CoursePhase[] = ["Beginner"];

    (student.courses || []).forEach((c) => {
      if (c === "Frontend")
        rows.push("Frontend-Intermediate", "Frontend-Advanced");
      if (c === "Backend")
        rows.push("Backend-Intermediate", "Backend-Advanced");
      if (c === "Fullstack")
        rows.push("Fullstack-Intermediate", "Fullstack-Advanced");
    });
    return rows.map((phase) => (
      <div key={phase} className="mb-3">
        <p className="text-xs font-semibold text-gray-400 mb-1">{phase}</p>
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
              M{i + 1}
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
            ["username", "password", "name", "email", "phone"] as FormFields[]
          ).map((field) => (
            <input
              key={field}
              name={field}
              type={field === "password" ? "password" : "text"}
              value={form[field] || ""}
              onChange={handleInputChange}
              placeholder={field.toUpperCase()}
              className="bg-white/70 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B0E48]/60 transition"
            />
          ))}

          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            className="bg-white/70 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B0E48]/60 transition"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
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
                className={`px-3 py-1 rounded-full text-xs font-semibold ${s.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {s.status}
              </span>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-gray-300">
              {s.email}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-3">
              {s.phone}
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
                onClick={() => handleDelete(s.id)}
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
