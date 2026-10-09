import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaSearch,
  FaFilter,
  FaChevronRight,
  FaUserPlus,
  FaUsersCog,
  FaUserTie,
  FaEnvelope,
  FaIdCard,
  FaTimes,
  FaUserCheck,
  FaUserSlash,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";

function Staff() {
  const { showToast } = useToast();

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedMobileStaff, setSelectedMobileStaff] = useState(null);

  const [newStaff, setNewStaff] =
    useState({
      schoolId: "",
      email: "",
      password: "",
      firstName: "",
      middleName: "",
      lastName: "",
    });

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await apiRequest(
          "/users"
        );

      setUsers(
        response?.data || []
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load staff accounts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const staffAccounts =
    useMemo(() => {
      return users.filter(
        (user) =>
          user.role === "staff"
      );
    }, [users]);

  const getFullName = (
    staff
  ) => {
    return [
      staff.first_name,
      staff.middle_name,
      staff.last_name,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const getInitials = (
    staff
  ) => {
    return [
      staff.first_name,
      staff.last_name,
    ]
      .filter(Boolean)
      .map((name) =>
        name.charAt(0)
      )
      .join("")
      .toUpperCase();
  };

  const filteredStaff =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return staffAccounts.filter(
        (staff) => {
          const name =
            getFullName(
              staff
            ).toLowerCase();

          const email =
            String(
              staff.email || ""
            ).toLowerCase();

          const schoolId =
            String(
              staff.school_id || ""
            ).toLowerCase();

          const status =
            String(
              staff.account_status ||
                ""
            ).toLowerCase();

          const matchesSearch =
            !keyword ||
            name.includes(keyword) ||
            email.includes(keyword) ||
            schoolId.includes(keyword);

          const matchesStatus =
            statusFilter === "All" ||
            status ===
              statusFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      staffAccounts,
      search,
      statusFilter,
    ]);

  const resetForm = () => {
    setNewStaff({
      schoolId: "",
      email: "",
      password: "",
      firstName: "",
      middleName: "",
      lastName: "",
    });
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleAddStaff = async (
    event
  ) => {
    event.preventDefault();

    if (
      !newStaff.schoolId.trim() ||
      !newStaff.email.trim() ||
      !newStaff.password ||
      !newStaff.firstName.trim() ||
      !newStaff.lastName.trim()
    ) {
      showToast(
        "Please complete all required staff information.",
        "error"
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      await apiRequest(
        "/users",
        {
          method: "POST",

          body: JSON.stringify({
            schoolId:
              newStaff.schoolId.trim(),

            email:
              newStaff.email.trim(),

            password:
              newStaff.password,

            firstName:
              newStaff.firstName.trim(),

            middleName:
              newStaff.middleName.trim() ||
              null,

            lastName:
              newStaff.lastName.trim(),

            role: "staff",
          }),
        }
      );

      showToast(
        "Staff account created successfully!",
        "success"
      );

      setShowAddModal(false);
      resetForm();

      await loadUsers();
    } catch (err) {
      const message =
        err.message ||
        "Failed to create staff account.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (
    staff,
    newStatus
  ) => {
    try {
      setUpdatingId(
        staff.id
      );

      setError("");

      await apiRequest(
        `/users/${staff.id}/status`,
        {
          method: "PATCH",

          body: JSON.stringify({
            accountStatus:
              newStatus,
          }),
        }
      );

      showToast(
        `Staff account ${
          newStatus === "active"
            ? "activated"
            : newStatus === "inactive"
            ? "deactivated"
            : "updated"
        } successfully.`,
        "success"
      );

      await loadUsers();
    } catch (err) {
      const message =
        err.message ||
        "Failed to update staff account status.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (
    status
  ) => {
    if (status === "active") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "suspended") {
      return "bg-amber-100 text-amber-700";
    }

    if (status === "locked") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "—";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="text-sm font-semibold text-blue-700">
            User Maintenance
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Staff Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create and manage library staff accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowAddModal(
              true
            )
          }
          className="hidden lg:flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800"
        >
          <FaUserPlus />
          Add Staff
        </button>

      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* TOOLBAR */}
      <section className="mb-6 hidden lg:block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaUsersCog />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Staff Accounts
              </h2>

              <p className="text-sm text-slate-500">
                {loading
                  ? "Loading..."
                  : `${filteredStaff.length} account${
                      filteredStaff.length !==
                      1
                        ? "s"
                        : ""
                    } found`}
              </p>
            </div>

          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">

              <FaSearch className="text-slate-400" />

              <input
                type="text"
                placeholder="Search name, ID, or email..."
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                className="w-full px-3 py-2 outline-none sm:w-72"
              />

            </div>

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target
                    .value
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

              <option value="Suspended">
                Suspended
              </option>
            </select>

          </div>

        </div>

      </section>

      {/* MOBILE SEARCH & FILTER */}
      <section className="mb-4 lg:hidden">
        <div className="flex items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-blue-600">
            <FaSearch className="shrink-0 text-slate-400" />
            <input aria-label="Search staff" type="search" placeholder="Search members..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full min-w-0 bg-transparent text-sm outline-none" />
          </label>
          <button type="button" aria-label="Filter staff by status" aria-expanded={mobileFiltersOpen} onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"><FaFilter /></button>
        </div>
        {mobileFiltersOpen && (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <label htmlFor="mobile-staff-status" className="mb-2 block text-xs font-semibold text-slate-600">Account status</label>
            <select id="mobile-staff-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
              <option value="All">All Status</option><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Suspended">Suspended</option>
            </select>
            <button type="button" onClick={() => setMobileFiltersOpen(false)} className="mt-3 w-full rounded-xl bg-[#0F4C97] px-4 py-2 text-sm font-semibold text-white">Apply Filter</button>
          </div>
        )}
        <p className="mt-2 px-1 text-xs text-slate-500">{loading ? "Loading..." : `${filteredStaff.length} staff account${filteredStaff.length === 1 ? "" : "s"} found`}</p>
      </section>

      {/* MOBILE STAFF CARDS */}
      <section className="space-y-2 lg:hidden">
        {!loading && filteredStaff.map((staff) => (
          <button key={staff.id} type="button" onClick={() => setSelectedMobileStaff(staff)} className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-4 text-left shadow-sm">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{getInitials(staff) || "LS"}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-900">{getFullName(staff) || "Library Staff"}</span>
              <span className="block truncate text-xs text-slate-500">{staff.school_id || staff.email || "Library Staff"}</span>
            </span>
            <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${getStatusStyle(staff.account_status)}`}>{staff.account_status || "Unknown"}</span>
            <FaChevronRight className="shrink-0 text-xs text-slate-400" />
          </button>
        ))}
        {loading && <p className="py-8 text-center text-sm text-slate-500">Loading staff accounts...</p>}
        {!loading && filteredStaff.length === 0 && <p className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500">No staff accounts found.</p>}
      </section>

      {/* MOBILE STAFF DETAILS AND EXISTING STATUS ACTIONS */}
      {selectedMobileStaff && (
        <div className="fixed inset-0 z-[55] flex items-end justify-center bg-slate-950/50 p-3 lg:hidden" onClick={() => setSelectedMobileStaff(null)}>
          <section role="dialog" aria-modal="true" aria-label="Staff details" onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-xl" style={{paddingBottom: "calc(20px + env(safe-area-inset-bottom))"}}>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Staff Details</h2><button type="button" aria-label="Close staff details" onClick={() => setSelectedMobileStaff(null)}><FaTimes /></button></div>
            <p className="font-semibold text-slate-900">{getFullName(selectedMobileStaff) || "Library Staff"}</p>
            <p className="mt-1 break-all text-sm text-slate-500">{selectedMobileStaff.school_id || "No School ID"}</p>
            <p className="mt-1 break-all text-sm text-slate-500">{selectedMobileStaff.email || "No email"}</p>
            <p className="mt-2 text-sm capitalize text-slate-600">Status: {selectedMobileStaff.account_status || "Unknown"}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" disabled={String(updatingId) === String(selectedMobileStaff.id)} onClick={async () => {await updateStatus(selectedMobileStaff, selectedMobileStaff.account_status === "active" ? "inactive" : "active"); setSelectedMobileStaff(null);}} className="rounded-xl bg-[#0F4C97] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{selectedMobileStaff.account_status === "active" ? "Deactivate" : "Activate"}</button>
              {selectedMobileStaff.account_status !== "suspended" && <button type="button" disabled={String(updatingId) === String(selectedMobileStaff.id)} onClick={async () => {await updateStatus(selectedMobileStaff, "suspended"); setSelectedMobileStaff(null);}} className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-700 disabled:opacity-50">Suspend</button>}
            </div>
          </section>
        </div>
      )}

      {/* MOBILE ADD STAFF */}
      <button type="button" aria-label="Add staff" onClick={() => setShowAddModal(true)} className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4C97] text-2xl text-white shadow-xl lg:hidden" style={{bottom: "calc(6.5rem + env(safe-area-inset-bottom))"}}><FaUserPlus /></button>

      {/* TABLE */}
      <section className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:block">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead className="bg-slate-50">
              <tr>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Staff Member
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  School ID
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Registered
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {!loading &&
                filteredStaff.map(
                  (staff) => (
                    <tr
                      key={
                        staff.id
                      }
                      className="border-t border-slate-100 transition hover:bg-blue-50/40"
                    >

                      {/* NAME */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {getInitials(
                              staff
                            ) ||
                              "LS"}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {getFullName(
                                staff
                              ) ||
                                "Library Staff"}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                              <FaUserTie />
                              Library Staff
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* SCHOOL ID */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaIdCard className="text-slate-400" />

                          {staff.school_id ||
                            "—"}
                        </div>

                      </td>

                      {/* EMAIL */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaEnvelope className="text-slate-400" />

                          {staff.email ||
                            "—"}
                        </div>

                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                            staff.account_status
                          )}`}
                        >
                          {staff.account_status ||
                            "Unknown"}
                        </span>

                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(
                          staff.created_at
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          {staff.account_status !==
                          "active" ? (
                            <button
                              type="button"
                              disabled={
                                String(
                                  updatingId
                                ) ===
                                String(
                                  staff.id
                                )
                              }
                              onClick={() =>
                                updateStatus(
                                  staff,
                                  "active"
                                )
                              }
                              className="flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                            >
                              <FaUserCheck />

                              Activate
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                String(
                                  updatingId
                                ) ===
                                String(
                                  staff.id
                                )
                              }
                              onClick={() =>
                                updateStatus(
                                  staff,
                                  "inactive"
                                )
                              }
                              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              <FaUserSlash />

                              Deactivate
                            </button>
                          )}

                          {staff.account_status !==
                            "suspended" && (
                            <button
                              type="button"
                              disabled={
                                String(
                                  updatingId
                                ) ===
                                String(
                                  staff.id
                                )
                              }
                              onClick={() =>
                                updateStatus(
                                  staff,
                                  "suspended"
                                )
                              }
                              className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
                            >
                              Suspend
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  )
                )}

            </tbody>

          </table>

        </div>

        {loading && (
          <div className="px-6 py-14 text-center text-sm text-slate-400">
            Loading staff accounts...
          </div>
        )}

        {!loading &&
          filteredStaff.length ===
            0 && (
            <div className="px-6 py-14 text-center">

              <FaUsersCog className="mx-auto text-3xl text-slate-300" />

              <h2 className="mt-4 font-semibold text-slate-800">
                No staff accounts found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the search keyword or account status.
              </p>

            </div>
          )}

      </section>

      {/* ADD STAFF */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <form
            onSubmit={
              handleAddStaff
            }
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >

            {/* HEADER */}
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Staff Registration
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Add Staff Account
                </h2>
              </div>

              <button
                type="button"
                disabled={
                  saving
                }
                onClick={
                  closeModal
                }
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 disabled:opacity-50"
              >
                <FaTimes />
              </button>

            </div>

            {/* BODY */}
            <div className="overflow-y-auto p-6">

              <div className="grid gap-5 md:grid-cols-2">

                <StaffField
                  label="School ID *"
                  value={
                    newStaff.schoolId
                  }
                  onChange={(
                    value
                  ) =>
                    setNewStaff({
                      ...newStaff,
                      schoolId:
                        value,
                    })
                  }
                  placeholder="e.g. STAFF-002"
                />

                <StaffField
                  label="Email Address *"
                  type="email"
                  value={
                    newStaff.email
                  }
                  onChange={(
                    value
                  ) =>
                    setNewStaff({
                      ...newStaff,
                      email:
                        value,
                    })
                  }
                  placeholder="staff@example.com"
                />

                <StaffField
                  label="First Name *"
                  value={
                    newStaff.firstName
                  }
                  onChange={(
                    value
                  ) =>
                    setNewStaff({
                      ...newStaff,
                      firstName:
                        value,
                    })
                  }
                />

                <StaffField
                  label="Middle Name"
                  value={
                    newStaff.middleName
                  }
                  onChange={(
                    value
                  ) =>
                    setNewStaff({
                      ...newStaff,
                      middleName:
                        value,
                    })
                  }
                />

                <StaffField
                  label="Last Name *"
                  value={
                    newStaff.lastName
                  }
                  onChange={(
                    value
                  ) =>
                    setNewStaff({
                      ...newStaff,
                      lastName:
                        value,
                    })
                  }
                />

                <StaffField
                  label="Temporary Password *"
                  type="password"
                  value={
                    newStaff.password
                  }
                  onChange={(
                    value
                  ) =>
                    setNewStaff({
                      ...newStaff,
                      password:
                        value,
                    })
                  }
                  placeholder="Minimum 8 characters"
                />

              </div>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
                This account will be created as a
                <strong> Library Staff </strong>
                account. Role and account type are controlled by the system.
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white px-6 py-5">

              <button
                type="button"
                disabled={
                  saving
                }
                onClick={
                  closeModal
                }
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  saving
                }
                className="rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Creating..."
                  : "Create Staff"}
              </button>

            </div>

          </form>

        </div>
      )}

    </AdminLayout>
  );
}

function StaffField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={
          placeholder
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

export default Staff;