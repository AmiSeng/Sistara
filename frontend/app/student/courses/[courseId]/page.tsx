"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "../../../src/lib/api";
import { FaPlayCircle, FaFilePdf, FaLock } from "react-icons/fa";

type Lesson = {
  id: number;
  title: string;
  videoLinks: string[];
  notesUrls: string[];
};

export default function CourseLearningPage() {
  const params = useParams();

  const searchParams = useSearchParams();

  const courseId = Number(params.courseId);

  const monthNum = Number(searchParams.get("month"));

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId || !monthNum) return;

    const loadLessons = async () => {
      try {
        const response = await api.get(
          `/api/student/course/${courseId}/month/${monthNum}`,
        );

        setLessons(response.data);
      } catch (err: unknown) {
        console.error(err);

        if (err && typeof err === "object" && "response" in err) {
          const errorResponse = (
            err as {
              response?: {
                status?: number;
                data?: {
                  message?: string;
                };
              };
            }
          ).response;

          if (errorResponse?.status === 403) {
            setError("You haven't paid yet for this month.");
          } else {
            setError(errorResponse?.data?.message || "Failed to load lessons.");
          }
        } else {
          setError("Failed to load lessons.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [courseId, monthNum]);

  if (loading) {
    return (
      <div
        className="
      min-h-screen
      bg-[#050728]
      flex
      items-center
      justify-center
      text-white
      "
      >
        Loading lessons...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
      min-h-screen
      bg-gradient-to-br
      from-[#050728]
      via-[#0B0E48]
      to-[#141866]
      p-8
      flex
      justify-center
      items-center
      "
      >
        <div
          className="
        bg-white/10
        backdrop-blur-xl
        border
        border-white/20
        rounded-3xl
        p-10
        text-center
        text-white
        "
        >
          <FaLock
            className="
          text-5xl
          mx-auto
          mb-5
          text-red-300
          "
          />

          <h1 className="text-2xl font-bold">Access Locked</h1>

          <p className="mt-3 text-gray-300">{error}</p>
        </div>
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
      <div
        className="
      max-w-6xl
      mx-auto
      space-y-8
      "
      >
        {/* HEADER */}

        <div
          className="
        bg-white/10
        backdrop-blur-xl
        border
        border-white/20
        rounded-3xl
        p-8
        text-white
        "
        >
          <h1
            className="
          text-4xl
          font-extrabold
          "
          >
            Month {monthNum}
          </h1>

          <p
            className="
          text-gray-300
          mt-2
          "
          >
            Lessons and learning materials
          </p>
        </div>

        {lessons.length === 0 && (
          <div
            className="
            bg-white/10
            rounded-3xl
            p-8
            text-white
            text-center
            "
          >
            No lessons available yet.
          </div>
        )}

        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="
              bg-white/10
              backdrop-blur-xl
              border
              border-white/20
              rounded-3xl
              p-8
              space-y-6
              "
          >
            <h2
              className="
              text-2xl
              font-bold
              text-white
              "
            >
              {lesson.title}
            </h2>

            {/* VIDEOS */}

            <div className="space-y-3">
              <h3
                className="
                text-white
                font-semibold
                flex
                items-center
                gap-2
                "
              >
                <FaPlayCircle />
                Videos
              </h3>

              {lesson.videoLinks.map((video, index) => (
                <a
                  key={index}
                  href={video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                      block
                      bg-black/30
                      rounded-xl
                      p-4
                      text-blue-300
                      hover:text-blue-100
                      transition
                      "
                >
                  Open Video {index + 1}
                </a>
              ))}
            </div>

            {/* NOTES */}

            <div className="space-y-3">
              <h3
                className="
                text-white
                font-semibold
                flex
                items-center
                gap-2
                "
              >
                <FaFilePdf />
                Notes
              </h3>

              {lesson.notesUrls.map((file, index) => (
                <a
                  key={index}
                  href={file}
                  target="_blank"
                  download
                  className="
                      block
                      bg-white/20
                      rounded-xl
                      p-4
                      text-white
                      hover:bg-white/30
                      transition
                      "
                >
                  Download Notes {index + 1}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
