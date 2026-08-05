import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
  FaUser,
  FaEnvelope,
  FaGraduationCap,
  FaIdCard,
  FaCheckCircle,
  FaCamera,
  FaSave,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";

function Profile() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState({
    fullName: "Ronald Jay Cruz",
    studentId: "240116136",
    email: "240116136@bcp.edu.ph",
    borrowerType: "Student",
    department: "BS Information Technology",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    showToast("Profile updated successfully!", "success");
  };

  return (
    <BorrowerLayout>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">
          Account Settings
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Review and update your personal borrower information.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        {/* Profile Summary */}
        <aside className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="bg-gradient-to-br from-[#0F4C97] to-blue-700 px-6 py-8 text-center text-white">
            <div className="relative mx-auto w-fit">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-3xl font-bold ring-4 ring-white/20">
                RC
              </div>

              <button
                type="button"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-700 shadow-lg transition hover:bg-blue-50"
                aria-label="Change profile picture"
              >
                <FaCamera className="text-sm" />
              </button>
            </div>

            <h2 className="mt-5 text-xl font-bold">
              {profile.fullName}
            </h2>

            <p className="mt-1 text-sm text-blue-100">
              {profile.email}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
              <FaCheckCircle />
              Active Borrower
            </span>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FaIdCard />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Student ID
                </p>

                <p className="font-semibold text-slate-800">
                  {profile.studentId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FaUser />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Borrower Type
                </p>

                <p className="font-semibold text-slate-800">
                  {profile.borrowerType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <FaGraduationCap />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Program
                </p>

                <p className="font-semibold text-slate-800">
                  {profile.department}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Personal Information Form */}
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the information associated with your borrower account.
            </p>
          </div>

          <div className="p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                  <FaUser className="text-slate-400" />

                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />
                </div>
              </div>

              {/* Student ID */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Student ID
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 px-4">
                  <FaIdCard className="text-slate-400" />

                  <input
                    type="text"
                    value={profile.studentId}
                    disabled
                    className="w-full cursor-not-allowed bg-transparent px-3 py-3 text-slate-500 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Student ID cannot be edited.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                  <FaEnvelope className="text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />
                </div>
              </div>

              {/* Borrower Type */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Borrower Type
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 px-4">
                  <FaUser className="text-slate-400" />

                  <input
                    type="text"
                    value={profile.borrowerType}
                    disabled
                    className="w-full cursor-not-allowed bg-transparent px-3 py-3 text-slate-500 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Borrower type is managed by library staff.
                </p>
              </div>

              {/* Department */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Program / Department
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                  <FaGraduationCap className="text-slate-400" />

                  <input
                    type="text"
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-[#0F4C97] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800"
              >
                <FaSave />
                Save Changes
              </button>
            </div>
          </div>
        </section>
      </div>
    </BorrowerLayout>
  );
}

export default Profile;