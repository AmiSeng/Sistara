"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserGraduate, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Footer from "../../src/components/layout/Footer";
import { api } from "../../src/lib/api";

type Profile = {
  name: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  currentPhase: string;
  specialization: string | null;
  status: string;
};

type Passwords = {
  current: string;
  new: string;
  confirm: string;
};

export default function StudentProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    currentPhase: "",
    specialization: "",
    status: "",
  });

  const [passwords, setPasswords] = useState<Passwords>({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("studentToken");

    if (!token) {
      router.push("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await api.get("/api/student/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to load profile",
          );
        }

        localStorage.removeItem("studentToken");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const saveUsername = async () => {
    try {
      setSavingUsername(true);

      const token = localStorage.getItem("studentToken");

      await api.put(
        "/api/student/profile/username",
        {
          username: profile.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Username updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update username",
        );
      }
    } finally {
      setSavingUsername(false);
    }
  };

  const updatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return toast.error("Please fill all password fields");
    }

    if (passwords.new !== passwords.confirm) {
      return toast.error("Passwords do not match");
    }

    try {
      setChangingPassword(true);

      const token = localStorage.getItem("studentToken");

      await api.put(
        "/api/student/profile/password",
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPasswords({
        current: "",
        new: "",
        confirm: "",
      });

      toast.success("Password updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Password update failed");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const togglePassword = (key: keyof typeof showPassword) => {
    setShowPassword({
      ...showPassword,
      [key]: !showPassword[key],
    });
  };

  if (loading) return null;

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "ST";

  const inputClass =
    "peer w-full rounded-2xl border border-gray-200 bg-white/70 px-4 pt-5 pb-3 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#0B0E48]/60 transition backdrop-blur-sm";

  const disabledInputClass =
    "w-full rounded-2xl border border-gray-300 bg-gray-100 px-4 pt-5 pb-3 text-sm text-gray-500 cursor-not-allowed";

  const labelClass = (filled: boolean) =>
    `absolute left-4 text-gray-400 text-sm transition-all ${
      filled ? "top-1 text-[#0B0E48] text-sm" : "top-3 text-gray-400 text-sm"
    } peer-focus:top-1 peer-focus:text-[#0B0E48]`;

  const cardClass =
    "relative rounded-3xl bg-white/20 backdrop-blur-xl shadow-[0_25px_100px_rgba(11,14,72,0.35)] hover:shadow-[0_35px_120px_rgba(11,14,72,0.4)] transition p-10 space-y-8 w-full max-w-6xl mx-auto";

  const buttonClass =
    "rounded-2xl bg-gradient-to-r from-[#0B0E48] to-[#141866] px-10 py-4 text-white font-semibold shadow-[0_10px_40px_rgba(11,14,72,0.5)] hover:brightness-110 transition disabled:opacity-50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050728] via-[#0B0E48] to-[#141866] p-8 space-y-10">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3f46ff] opacity-20 blur-3xl rounded-full" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-white text-4xl font-bold">
            {initials}
          </div>

          <div>
            <h1 className="text-3xl font-extrabold">Student Profile</h1>

            <p className="mt-2 text-gray-300">
              Manage your account and security settings
            </p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className={cardClass}>
        <div className="flex items-center gap-4">
          <FaUserGraduate className="text-2xl text-[#0B0E48]" />
          <h2 className="text-2xl font-bold text-[#0B0E48]">
            Profile Information
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <input value={profile.name} disabled className={disabledInputClass} />

          <div className="relative">
            <input
              value={profile.username}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  username: e.target.value,
                })
              }
              className={inputClass}
              placeholder=" "
              onFocus={() => setFocusedInput("username")}
              onBlur={() => setFocusedInput(null)}
            />

            <label
              className={labelClass(
                profile.username !== "" || focusedInput === "username",
              )}
            >
              Username
            </label>
          </div>

          <input
            value={profile.email}
            disabled
            className={disabledInputClass}
          />

          <input
            value={profile.phoneNumber || "Not Provided"}
            disabled
            className={disabledInputClass}
          />

          <input
            value={profile.currentPhase}
            disabled
            className={disabledInputClass}
          />

          <input
            value={profile.specialization || "Not Assigned"}
            disabled
            className={disabledInputClass}
          />

          <input
            value={profile.status}
            disabled
            className={disabledInputClass}
          />
        </div>

        <button
          onClick={saveUsername}
          disabled={savingUsername}
          className={buttonClass}
        >
          {savingUsername ? "Saving..." : "Update Username"}
        </button>
      </div>

      {/* Password Card */}
      <div className={cardClass}>
        <div className="flex items-center gap-4">
          <FaLock className="text-xl text-[#0B0E48]" />

          <h2 className="text-2xl font-bold text-[#0B0E48]">Change Password</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(["current", "new", "confirm"] as const).map((key) => (
            <div key={key} className="relative">
              <input
                type={showPassword[key] ? "text" : "password"}
                value={passwords[key]}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    [key]: e.target.value,
                  })
                }
                className={inputClass}
                placeholder=" "
              />

              <label className={labelClass(passwords[key] !== "")}>
                {key === "current"
                  ? "Current Password"
                  : key === "new"
                    ? "New Password"
                    : "Confirm Password"}
              </label>

              <span
                onClick={() => togglePassword(key)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              >
                {showPassword[key] ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={updatePassword}
          disabled={changingPassword}
          className={buttonClass}
        >
          {changingPassword ? "Updating..." : "Update Password"}
        </button>
      </div>

      <Footer />
    </div>
  );
}
