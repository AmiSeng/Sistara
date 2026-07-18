"use client";

import { useEffect, useState } from "react";
import { api } from "../../src/lib/api";
import Link from "next/link";
import { FaLock, FaUnlock } from "react-icons/fa";

type Month = {
  id: number;
  monthNum: number;
  accessible: boolean;
};

type Phase = {
  id: number;
  name: string;
  months: Month[];
};

type Course = {
  id: number;
  title: string;
  phases: Phase[];
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/api/student/courses");

        setCourses(res.data);
      } catch (error) {
        console.error("Failed to load courses", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050728] text-white">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050728] via-[#0B0E48] to-[#141866] p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <h1 className="text-4xl font-extrabold text-white">
            My Learning Courses
          </h1>

          <p className="text-gray-300 mt-2">
            Access your paid courses and track your learning progress.
          </p>
        </div>

        {courses.length === 0 && (
          <div className="bg-white/10 rounded-3xl p-8 text-white text-center">
            No courses assigned yet.
          </div>
        )}

        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 space-y-8"
          >
            <h2 className="text-3xl font-bold text-white">{course.title}</h2>

            {course.phases.map((phase) => (
              <div key={phase.id} className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  {phase.name} Phase
                </h3>

                <div className="grid md:grid-cols-4 gap-5">
                  {phase.months.map((month) =>
                    month.accessible ? (
                      <Link
                        key={month.id}
                        href={`/student/courses/${course.id}?month=${month.monthNum}`}
                      >
                        <div
                          className="
                          cursor-pointer
                          bg-green-500/20
                          border
                          border-green-400/40
                          rounded-2xl
                          p-6
                          text-white
                          hover:scale-105
                          transition
                          "
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-lg">
                              Month {month.monthNum}
                            </h4>

                            <FaUnlock className="text-green-300" />
                          </div>

                          <p className="text-sm text-gray-200 mt-3">
                            Click to continue learning
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div
                        key={month.id}
                        onClick={() =>
                          alert("You haven't paid yet for this course")
                        }
                        className="
                        cursor-not-allowed
                        bg-white/10
                        border
                        border-white/20
                        rounded-2xl
                        p-6
                        text-white
                        opacity-70
                        "
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-lg">
                            Month {month.monthNum}
                          </h4>

                          <FaLock className="text-red-300" />
                        </div>

                        <p className="text-sm text-gray-300 mt-3">
                          You haven&apos;t paid yet
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
