"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) {
      router.push("/student/login");
    }
  }, []);

  return <div>Student Dashboard</div>;
}
