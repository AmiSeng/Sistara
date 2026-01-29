"use client";
import { useState, useEffect } from "react";
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

type Profile = {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
};

type Passwords = {
  current: string;
  new: string;
  confirm: string;
};

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    role: "ADMIN",
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

  const [focusedInput, setFocusedInput] = useState<
    keyof Profile | keyof Passwords | null
  >(null);

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Please login");
        window.location.href = "/admin-login";
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Error fetching profile",
          );
        } else {
          toast.error("Unexpected error");
        }
      }
    };
    fetchProfile();
  }, []);

  // Handle profile field change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof Profile;
    setProfile({ ...profile, [key]: e.target.value });
  };

  // Save profile
  const saveProfile = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return toast.error("Unauthorized");

    try {
      const res = await axios.put(
        "http://localhost:5000/api/admin/profile",
        {
          name: profile.name,
          username: profile.username,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setProfile(res.data);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error updating profile");
      } else {
        toast.error("Unexpected error");
      }
    }
  };

  // Update password
  const updatePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      return toast.error("Passwords do not match!");
    }

    const token = localStorage.getItem("adminToken");
    if (!token) return toast.error("Unauthorized");

    try {
      await axios.put(
        "http://localhost:5000/api/admin/password",
        { currentPassword: passwords.current, newPassword: passwords.new },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setPasswords({ current: "", new: "", confirm: "" });
      toast.success("Password updated successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error updating password");
      } else {
        toast.error("Unexpected error");
      }
    }
  };

  const togglePassword = (key: keyof typeof showPassword) => {
    setShowPassword({ ...showPassword, [key]: !showPassword[key] });
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AD";

  // Classes
  const inputClass =
    "peer w-full rounded-2xl border border-gray-200 bg-white/70 px-4 pt-5 pb-3 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#0B0E48]/60 transition backdrop-blur-sm";

  const labelClass = (filled: boolean) =>
    `absolute left-4 text-gray-400 text-sm transition-all ${
      filled ? "top-1 text-[#0B0E48] text-sm" : "top-3 text-gray-400 text-sm"
    } peer-focus:top-1 peer-focus:text-[#0B0E48] peer-focus:text-sm capitalize`;

  const cardClass =
    "relative rounded-3xl bg-white/20 backdrop-blur-xl shadow-[0_25px_100px_rgba(11,14,72,0.35)] hover:shadow-[0_35px_120px_rgba(11,14,72,0.4)] transition p-10 space-y-8 w-full max-w-6xl mx-auto transform hover:scale-[1.05] motion-safe:duration-300 hover:bg-white/30";

  const buttonClass =
    "rounded-2xl bg-gradient-to-r from-[#0B0E48] to-[#141866] px-10 py-4 text-white font-semibold shadow-[0_10px_40px_rgba(11,14,72,0.5)] hover:shadow-[0_15px_50px_rgba(11,14,72,0.7)] hover:brightness-110 hover:scale-[1.05] motion-safe:duration-300 transition";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050728] via-[#0B0E48] to-[#141866] p-8 space-y-10">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 w-full mx-auto">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3f46ff] opacity-20 blur-3xl rounded-full pointer-events-none" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-white text-4xl font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Admin Profile
            </h1>
            <p className="mt-2 text-gray-300">
              Manage your personal information & security settings
            </p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className={cardClass}>
        <div className="flex items-center gap-4">
          <FaUserShield className="text-2xl text-[#0B0E48]" />
          <h2 className="text-2xl font-bold text-[#0B0E48]">
            Profile Information
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {(
            ["name", "username", "email", "phoneNumber"] as (keyof Profile)[]
          ).map((key) => (
            <div key={key} className="relative">
              <input
                type="text"
                name={key}
                value={profile[key]}
                onChange={handleProfileChange}
                placeholder=" "
                onFocus={() => setFocusedInput(key)}
                onBlur={() => setFocusedInput(null)}
                className={inputClass}
              />
              <label
                className={labelClass(
                  profile[key] !== "" || focusedInput === key,
                )}
              >
                {key}
              </label>
            </div>
          ))}
          {/* Role */}
          <div className="relative">
            <input
              value={profile.role}
              disabled
              placeholder=""
              className="peer w-full rounded-2xl border border-gray-300 bg-gray-100 px-4 pt-5 pb-3 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        <button onClick={saveProfile} className={buttonClass}>
          Save Profile Changes
        </button>
      </div>

      {/* Password Card */}
      <div className={cardClass}>
        <div className="flex items-center gap-4">
          <FaLock className="text-xl text-[#0B0E48]" />
          <h2 className="text-2xl font-bold text-[#0B0E48]">Change Password</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(["current", "new", "confirm"] as (keyof Passwords)[]).map((key) => (
            <div key={key} className="relative">
              <input
                type={showPassword[key] ? "text" : "password"}
                value={passwords[key]}
                onChange={(e) =>
                  setPasswords({ ...passwords, [key]: e.target.value })
                }
                placeholder=" "
                onFocus={() => setFocusedInput(key)}
                onBlur={() => setFocusedInput(null)}
                className={inputClass}
              />
              <label
                className={labelClass(
                  passwords[key] !== "" || focusedInput === key,
                )}
              >
                {key}
              </label>
              <span
                onClick={() => togglePassword(key)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
              >
                {showPassword[key] ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          ))}
        </div>

        <button onClick={updatePassword} className={buttonClass}>
          Update Password
        </button>
      </div>
    </div>
  );
}
