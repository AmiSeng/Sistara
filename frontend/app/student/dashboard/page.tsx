"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaBookOpen,
  FaUserGraduate,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import Footer from "../../src/components/layout/Footer";
import { api } from "../../src/lib/api";
import Link from "next/link";

type Student = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type Course = {
  id: number;
  title: string;
  phases: {
    id: number;
    name: string;
    months: {
      id: number;
      monthNum: number;
      accessible: boolean;
    }[];
  }[];
};

export default function StudentDashboard() {
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("studentToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const profile = await api.get("/api/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStudent(profile.data);

        const courseRes = await api.get("/api/student/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(courseRes.data);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050728] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
min-h-screen
bg-gradient-to-br 
from-[#050728]
via-[#0B0E48]
to-[#141866]
p-8
"
    >
      <div className="space-y-10">
        {/* HEADER */}

        <div
          className="
rounded-3xl
bg-white/10
backdrop-blur-xl
border border-white/20
p-8
text-white
shadow-2xl
"
        >
          <h1 className="text-4xl font-extrabold">
            Welcome back, {student?.name} 👋
          </h1>

          <p className="text-white/70 mt-2">Continue your learning journey.</p>
        </div>

        {/* CARDS */}

        <div
          className="
grid
grid-cols-1
md:grid-cols-3
gap-6
"
        >
          <Link href="/student/courses">
            <div className="bg-white/20 rounded-3xl p-6 text-white backdrop-blur-xl hover:scale-105 transition">
              <FaBookOpen className="text-4xl mb-4" />
              <h2 className="text-xl font-bold">My Courses</h2>
              <p className="text-white/70">{courses.length} enrolled courses</p>
            </div>
          </Link>

          <Link href="/student/profile">
            <div className="bg-white/20 rounded-3xl p-6 text-white backdrop-blur-xl hover:scale-105 transition">
              <FaUserGraduate className="text-4xl mb-4" />
              <h2 className="text-xl font-bold">Profile</h2>
              <p className="text-white/70">Manage your information</p>
            </div>
          </Link>

          <Link href="/student/courses">
            <div className="bg-white/20 rounded-3xl p-6 text-white backdrop-blur-xl hover:scale-105 transition">
              <FaCheckCircle className="text-4xl mb-4" />
              <h2 className="text-xl font-bold">Learning Progress</h2>
              <p className="text-white/70">Track completed lessons</p>
            </div>
          </Link>
        </div>

        {/* COURSES */}

        <div>
          <h2 className="text-3xl font-extrabold text-white mb-6">
            My Courses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="
        bg-white/20
        backdrop-blur-xl
        rounded-3xl
        p-8
        text-white
        "
              >
                <h3 className="text-2xl font-bold">{course.title}</h3>

                <p className="mt-3 text-white/70">Your learning progress</p>

                {course.phases.map((phase) => (
                  <div key={phase.id} className="mt-5">
                    <h4 className="font-bold text-lg">{phase.name}</h4>

                    <div className="flex flex-wrap gap-3 mt-3">
                      {phase.months.map((month) => (
                        <Link
                          key={month.id}
                          href={
                            month.accessible
                              ? `/student/courses/${course.id}?month=${month.monthNum}`
                              : "#"
                          }
                          className={`
                    px-4
                    py-2
                    rounded-xl
                    font-bold
                    transition
                    ${
                      month.accessible
                        ? "bg-white text-[#0B0E48] hover:scale-105"
                        : "bg-gray-500/40 text-gray-300 cursor-not-allowed"
                    }
                  `}
                          onClick={(e) => {
                            if (!month.accessible) {
                              e.preventDefault();
                            }
                          }}
                        >
                          Month {month.monthNum}
                          {month.accessible ? " ✓" : " 🔒"}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
