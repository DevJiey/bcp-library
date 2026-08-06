import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
    FaEdit,
    FaKey,
    FaSearch,
    FaUserPlus,
    FaUsersCog,
    FaUserTie,
    FaEnvelope,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import staffAccountsData from "../../data/staffAccounts";

function Staff() {
    const { showToast } = useToast();
    const [staffAccounts, setStaffAccounts] = useState(staffAccountsData);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [resetPasswordStaff, setResetPasswordStaff] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    const [newStaff, setNewStaff] = useState({
        name: "",
        email: "",
        username: "",
        role: "Librarian",
        status: "Active",
    });

    const filteredStaff = staffAccounts.filter((staff) => {
        const keyword = search.toLowerCase();

        const matchesSearch =
            staff.name.toLowerCase().includes(keyword) ||
            staff.email.toLowerCase().includes(keyword) ||
            staff.username.toLowerCase().includes(keyword);

        const matchesStatus =
            statusFilter === "All" ||
            staff.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const toggleStaffStatus = (id) => {
        setStaffAccounts(
            staffAccounts.map((staff) =>
                staff.id === id
                    ? {
                        ...staff,
                        status:
                            staff.status === "Active"
                                ? "Inactive"
                                : "Active",
                    }
                    : staff
            )
        );
    };
    const handleAddStaff = () => {
        if (
            !newStaff.name.trim() ||
            !newStaff.email.trim() ||
            !newStaff.username.trim()
        ) {
            showToast("Please complete all staff information.", "error");
            return;
        }

        const usernameExists = staffAccounts.some(
            (staff) =>
                staff.username.toLowerCase() ===
                newStaff.username.trim().toLowerCase()
        );

        if (usernameExists) {
            showToast("Username already exists.", "error");
            return;
        }

        setStaffAccounts([
            ...staffAccounts,
            {
                id: Date.now(),
                ...newStaff,
                name: newStaff.name.trim(),
                email: newStaff.email.trim(),
                username: newStaff.username.trim(),
            },
        ]);

        setNewStaff({
            name: "",
            email: "",
            username: "",
            role: "Librarian",
            status: "Active",
        });

        setShowAddModal(false);
    };
    const handleUpdateStaff = () => {
        if (
            !editingStaff.name.trim() ||
            !editingStaff.email.trim() ||
            !editingStaff.username.trim()
        ) {
            showToast("Please complete all staff information.", "error");
            return;
        }

        const usernameExists = staffAccounts.some(
            (staff) =>
                staff.id !== editingStaff.id &&
                staff.username.toLowerCase() ===
                editingStaff.username.trim().toLowerCase()
        );

        if (usernameExists) {
            showToast("Username already exists.", "error");
            return;
        }

        setStaffAccounts(
            staffAccounts.map((staff) =>
                staff.id === editingStaff.id
                    ? {
                        ...editingStaff,
                        name: editingStaff.name.trim(),
                        email: editingStaff.email.trim(),
                        username: editingStaff.username.trim(),
                    }
                    : staff
            )
        );

        setEditingStaff(null);
    };
    const handleResetPassword = () => {
        if (newPassword.trim().length < 6) {
            showToast("Password must contain at least 6 characters.", "error");
            return;
        }

        showToast(
            `Password reset successfully for ${resetPasswordStaff.name}.`,
            "success"
        );

        setResetPasswordStaff(null);
        setNewPassword("");
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        User Maintenance
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Staff Management
                    </h1>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-3 py-2 font-semibold text-white transition hover:bg-blue-800"
                >
                    <FaUserPlus />
                    Add Staff
                </button>
            </div>

            {/* Toolbar */}
            <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
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
                                {filteredStaff.length} account
                                {filteredStaff.length !== 1 ? "s" : ""} found
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex items-center rounded-xl border border-slate-300 px-3 focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
                            <FaSearch className="text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search name, email, or username..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 outline-none sm:w-72"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Table */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Staff Member
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Username
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Role
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStaff.map((staff) => (
                                <tr
                                    key={staff.id}
                                    className="border-t border-slate-100 transition hover:bg-blue-50/40"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                                {staff.name
                                                    .split(" ")
                                                    .map((word) => word[0])
                                                    .slice(0, 2)
                                                    .join("")}
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {staff.name}
                                                </p>

                                                <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                                                    <FaEnvelope />
                                                    {staff.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                                        {staff.username}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                                            <FaUserTie />
                                            {staff.role}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${staff.status === "Active"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-200 text-slate-600"
                                                }`}
                                        >
                                            {staff.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setEditingStaff({ ...staff })}
                                                className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                            >
                                                <FaEdit />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setResetPasswordStaff(staff);
                                                    setNewPassword("");
                                                }}
                                                className="flex items-center gap-2 rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
                                            >
                                                <FaKey />
                                                Reset Password
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleStaffStatus(staff.id)
                                                }
                                                className={`rounded-lg border px-3 py-2 text-sm font-semibold ${staff.status === "Active"
                                                    ? "border-red-200 text-red-700 hover:bg-red-50"
                                                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                    }`}
                                            >
                                                {staff.status === "Active"
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                                    User Maintenance
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    Add Staff Account
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:bg-white/15"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid gap-5 p-6 md:grid-cols-2">
                            <StaffField
                                label="Full Name"
                                value={newStaff.name}
                                onChange={(value) =>
                                    setNewStaff({
                                        ...newStaff,
                                        name: value,
                                    })
                                }
                            />

                            <StaffField
                                label="Email Address"
                                type="email"
                                value={newStaff.email}
                                onChange={(value) =>
                                    setNewStaff({
                                        ...newStaff,
                                        email: value,
                                    })
                                }
                            />

                            <StaffField
                                label="Username"
                                value={newStaff.username}
                                onChange={(value) =>
                                    setNewStaff({
                                        ...newStaff,
                                        username: value,
                                    })
                                }
                            />

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Role
                                </label>

                                <select
                                    value={newStaff.role}
                                    onChange={(e) =>
                                        setNewStaff({
                                            ...newStaff,
                                            role: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                >
                                    <option value="Librarian">
                                        Librarian
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Account Status
                                </label>

                                <select
                                    value={newStaff.status}
                                    onChange={(e) =>
                                        setNewStaff({
                                            ...newStaff,
                                            status: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleAddStaff}
                                className="rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                            >
                                Save Staff
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editingStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                                    User Maintenance
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    Edit Staff Account
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingStaff(null)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:bg-white/15"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Form */}
                        <div className="grid gap-5 p-6 md:grid-cols-2">
                            <StaffField
                                label="Full Name"
                                value={editingStaff.name}
                                onChange={(value) =>
                                    setEditingStaff({
                                        ...editingStaff,
                                        name: value,
                                    })
                                }
                            />

                            <StaffField
                                label="Email Address"
                                type="email"
                                value={editingStaff.email}
                                onChange={(value) =>
                                    setEditingStaff({
                                        ...editingStaff,
                                        email: value,
                                    })
                                }
                            />

                            <StaffField
                                label="Username"
                                value={editingStaff.username}
                                onChange={(value) =>
                                    setEditingStaff({
                                        ...editingStaff,
                                        username: value,
                                    })
                                }
                            />

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Role
                                </label>

                                <select
                                    value={editingStaff.role}
                                    onChange={(e) =>
                                        setEditingStaff({
                                            ...editingStaff,
                                            role: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                >
                                    <option value="Librarian">
                                        Librarian
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Account Status
                                </label>

                                <select
                                    value={editingStaff.status}
                                    onChange={(e) =>
                                        setEditingStaff({
                                            ...editingStaff,
                                            status: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                >
                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
                            <button
                                type="button"
                                onClick={() => setEditingStaff(null)}
                                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleUpdateStaff}
                                className="rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600"
                            >
                                Update Staff
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {resetPasswordStaff && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                                    Account Security
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    Reset Password
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setResetPasswordStaff(null);
                                    setNewPassword("");
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:bg-white/15"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                                <p className="text-sm text-amber-800">
                                    You are resetting the password for:
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    {resetPasswordStaff.name}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Username: {resetPasswordStaff.username}
                                </p>
                            </div>

                            <div className="mt-5">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    New Temporary Password
                                </label>

                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    placeholder="Minimum 6 characters"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />

                                <p className="mt-2 text-xs text-slate-400">
                                    The staff member should change this password after signing in.
                                </p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResetPasswordStaff(null);
                                        setNewPassword("");
                                    }}
                                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResetPassword}
                                    className="flex-[1.4] rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </div>
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
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
        </div>
    );
}

export default Staff;