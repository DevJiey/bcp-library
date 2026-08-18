import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaCheckCircle,
  FaLock,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";

function Profile() {
  const { showToast } = useToast();

  const [profile, setProfile] =
    useState(null);

  const [form, setForm] =
    useState({
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",

      program: "",
      yearLevel: "",
      section: "",

      departmentId: "",
      position: "",
      employmentStatus: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [error, setError] =
    useState("");

  const applyProfileToForm = (
    data
  ) => {
    const user =
      data?.user || {};

    const student =
      data?.studentProfile ||
      null;

    const faculty =
      data?.facultyProfile ||
      null;

    setForm({
      email:
        user.email || "",

      firstName:
        user.first_name || "",

      middleName:
        user.middle_name || "",

      lastName:
        user.last_name || "",

      program:
        student?.program || "",

      yearLevel:
        student?.year_level || "",

      section:
        student?.section || "",

      departmentId:
        faculty?.department_id || "",

      position:
        faculty?.position || "",

      employmentStatus:
        faculty?.employment_status ||
        "",
    });
  };

  const saveCurrentUserToStorage = (
    user
  ) => {
    if (!user) {
      return;
    }

    const currentStoredUser = (() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "currentUser"
          ) || "{}"
        );
      } catch {
        return {};
      }
    })();

    const updatedUser = {
      ...currentStoredUser,

      id: user.id,

      schoolId:
        user.school_id,

      email:
        user.email,

      firstName:
        user.first_name,

      middleName:
        user.middle_name,

      lastName:
        user.last_name,

      role:
        user.role,

      borrowerType:
        user.borrower_type,

      accountStatus:
        user.account_status,

      isFirstLogin:
        user.is_first_login,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(
        updatedUser
      )
    );

    if (user.role) {
      localStorage.setItem(
        "userRole",
        user.role
      );
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await apiRequest(
          "/users/me/profile"
        );

      const data =
        response?.data || null;

      setProfile(data);

      applyProfileToForm(
        data
      );

      saveCurrentUserToStorage(
        data?.user
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const user =
    profile?.user || null;

  const studentProfile =
    profile?.studentProfile ||
    null;

  const facultyProfile =
    profile?.facultyProfile ||
    null;

  const isStudent =
    user?.borrower_type ===
    "student";

  const isFaculty =
    user?.borrower_type ===
    "faculty";

  const fullName = useMemo(() => {
    if (!user) {
      return "";
    }

    return [
      user.first_name,
      user.middle_name,
      user.last_name,
    ]
      .filter(Boolean)
      .join(" ");
  }, [user]);

  const initials = useMemo(() => {
    if (!user) {
      return "BC";
    }

    return [
      user.first_name,
      user.last_name,
    ]
      .filter(Boolean)
      .map((name) =>
        name.charAt(0)
      )
      .join("")
      .toUpperCase();
  }, [user]);

  const borrowerType =
    user?.borrower_type
      ? user.borrower_type
          .charAt(0)
          .toUpperCase() +
        user.borrower_type.slice(
          1
        )
      : "Borrower";

  const accountStatus =
    user?.account_status
      ? user.account_status
          .charAt(0)
          .toUpperCase() +
        user.account_status.slice(
          1
        )
      : "Unknown";

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const cancelEdit = () => {
    applyProfileToForm(
      profile
    );

    setEditing(false);
    setError("");
  };

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        email:
          form.email.trim(),

        firstName:
          form.firstName.trim(),

        middleName:
          form.middleName.trim() ||
          null,

        lastName:
          form.lastName.trim(),
      };

      if (isStudent) {
        payload.program =
          form.program.trim();

        payload.yearLevel =
          Number(
            form.yearLevel
          );

        payload.section =
          form.section.trim() ||
          null;
      }

      if (isFaculty) {
        payload.departmentId =
          Number(
            form.departmentId
          );

        payload.position =
          form.position.trim() ||
          null;

        payload.employmentStatus =
          form.employmentStatus.trim();
      }

      const response =
        await apiRequest(
          "/users/me/profile",
          {
            method: "PATCH",

            body: JSON.stringify(
              payload
            ),
          }
        );

      const updatedProfile =
        response?.data;

      setProfile(
        updatedProfile
      );

      applyProfileToForm(
        updatedProfile
      );

      saveCurrentUserToStorage(
        updatedProfile?.user
      );

      setEditing(false);

      showToast(
        "Profile updated successfully!",
        "success"
      );
    } catch (err) {
      const message =
        err.message ||
        "Failed to update profile.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BorrowerLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-slate-400">
            Loading profile...
          </p>
        </div>
      </BorrowerLayout>
    );
  }

  return (
    <BorrowerLayout>
      {/* PAGE HEADER */}
      <div className="mb-5 sm:mb-8">

        <p className="text-sm font-semibold text-blue-700">
          Account Information
        </p>

        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View and manage your registered library information.
            </p>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              <FaEdit />

              Edit Profile
            </button>
          )}

        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {profile && (
        <div className="grid gap-6 xl:grid-cols-[340px_1fr]">

          {/* PROFILE SUMMARY */}
          <aside className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

            <div className="bg-gradient-to-br from-[#0F4C97] to-blue-700 px-6 py-8 text-center text-white">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-3xl font-bold ring-4 ring-white/20">
                {initials}
              </div>

              <h2 className="mt-5 text-xl font-bold">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                {user.email}
              </p>

              <span
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                  user.account_status ===
                  "locked"
                    ? "bg-red-500/30 text-red-50"
                    : "bg-white/15 text-white"
                }`}
              >
                {user.account_status ===
                "locked" ? (
                  <FaLock />
                ) : (
                  <FaCheckCircle />
                )}

                {accountStatus}{" "}
                {borrowerType}
              </span>
            </div>

            <div className="space-y-4 p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <FaIdCard />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    School ID
                  </p>

                  <p className="font-semibold text-slate-800">
                    {user.school_id}
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
                    {borrowerType}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <FaEnvelope />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">
                    Email
                  </p>

                  <p className="truncate font-semibold text-slate-800">
                    {user.email}
                  </p>
                </div>

              </div>

              {isStudent &&
                studentProfile && (
                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Student Profile
                    </p>

                    <p className="mt-2 font-semibold text-slate-800">
                      {
                        studentProfile.program
                      }
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Year{" "}
                      {
                        studentProfile.year_level
                      }
                      {studentProfile.section
                        ? ` • ${studentProfile.section}`
                        : ""}
                    </p>

                  </div>
                )}

              {isFaculty &&
                facultyProfile && (
                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Faculty Profile
                    </p>

                    <p className="mt-2 font-semibold text-slate-800">
                      {facultyProfile.department_name ||
                        `Department ${facultyProfile.department_id}`}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {facultyProfile.position ||
                        "Faculty Member"}
                    </p>

                  </div>
                )}

            </div>

          </aside>

          {/* EDIT FORM */}
          <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

            <div className="border-b border-slate-100 px-6 py-5">

              <h2 className="text-xl font-bold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editing
                  ? "Update the information you are allowed to manage."
                  : "Your registered BCP Library account information."}
              </p>

            </div>

            <form
              onSubmit={
                handleSave
              }
              className="p-6"
            >

              <div className="grid gap-5 md:grid-cols-2">

                {/* SCHOOL ID */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    School ID
                  </label>

                  <input
                    type="text"
                    value={
                      user.school_id
                    }
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                  />

                </div>

                {/* BORROWER TYPE */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Borrower Type
                  </label>

                  <input
                    type="text"
                    value={
                      borrowerType
                    }
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                  />

                </div>

                {/* FIRST */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={
                      form.firstName
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editing
                    }
                    required
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      editing
                        ? "border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  />

                </div>

                {/* MIDDLE */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Middle Name
                  </label>

                  <input
                    type="text"
                    name="middleName"
                    value={
                      form.middleName
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editing
                    }
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      editing
                        ? "border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  />

                </div>

                {/* LAST */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={
                      form.lastName
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editing
                    }
                    required
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      editing
                        ? "border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  />

                </div>

                {/* EMAIL */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !editing
                    }
                    required
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      editing
                        ? "border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  />

                </div>

                {/* STUDENT */}
                {isStudent && (
                  <>
                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Program
                      </label>

                      <input
                        type="text"
                        name="program"
                        value={
                          form.program
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          !editing
                        }
                        required
                        className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                          editing
                            ? "border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Year Level
                      </label>

                      <select
                        name="yearLevel"
                        value={
                          form.yearLevel
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          !editing
                        }
                        required
                        className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                          editing
                            ? "border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        <option value="">
                          Select year
                        </option>

                        {[1, 2, 3, 4, 5, 6].map(
                          (
                            year
                          ) => (
                            <option
                              key={
                                year
                              }
                              value={
                                year
                              }
                            >
                              Year{" "}
                              {
                                year
                              }
                            </option>
                          )
                        )}
                      </select>

                    </div>

                    <div className="md:col-span-2">

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Section
                      </label>

                      <input
                        type="text"
                        name="section"
                        value={
                          form.section
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          !editing
                        }
                        className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                          editing
                            ? "border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      />

                    </div>
                  </>
                )}

                {/* FACULTY */}
                {isFaculty && (
                  <>
                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Department ID
                      </label>

                      <input
                        type="number"
                        min="1"
                        name="departmentId"
                        value={
                          form.departmentId
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          !editing
                        }
                        required
                        className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                          editing
                            ? "border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      />

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Position
                      </label>

                      <input
                        type="text"
                        name="position"
                        value={
                          form.position
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          !editing
                        }
                        className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                          editing
                            ? "border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      />

                    </div>

                    <div className="md:col-span-2">

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Employment Status
                      </label>

                      <input
                        type="text"
                        name="employmentStatus"
                        value={
                          form.employmentStatus
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          !editing
                        }
                        required
                        className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                          editing
                            ? "border-slate-300 bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      />

                    </div>
                  </>
                )}

              </div>

              {/* ACTIONS */}
              {editing && (
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    disabled={
                      saving
                    }
                    onClick={
                      cancelEdit
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <FaTimes />

                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FaSave />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>
              )}

            </form>

          </section>

        </div>
      )}
    </BorrowerLayout>
  );
}

export default Profile;