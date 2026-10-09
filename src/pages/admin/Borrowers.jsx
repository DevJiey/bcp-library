
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FaEnvelope,
    FaEye,
    FaPlus,
    FaRedo,
    FaSearch,
    FaFilter,
    FaChevronRight,
    FaTimes,
    FaUsers,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import apiRequest from "../../services/api";

const emptyForm = {
    schoolId: "",
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    borrowerType: "student",
    program: "",
    yearLevel: "",
    section: "",
    departmentId: "",
    position: "",
    employmentStatus: "",
};

const getFullName = (borrower) =>
    [
        borrower.first_name ?? borrower.firstName,
        borrower.middle_name ?? borrower.middleName,
        borrower.last_name ?? borrower.lastName,
    ]
        .filter(Boolean)
        .join(" ");

const getSchoolId = (borrower) =>
    borrower.school_id ?? borrower.schoolId ?? "";

const getType = (borrower) =>
    borrower.borrower_type ?? borrower.borrowerType ?? "";

const getStatus = (borrower) =>
    borrower.account_status ?? borrower.accountStatus ?? "unknown";

function Borrowers() {
    const [borrowers, setBorrowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [resendingId, setResendingId] = useState(null);
    const [selectedBorrower, setSelectedBorrower] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const loadBorrowers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiRequest("/users");
            const records = response?.data;

            setBorrowers(
                Array.isArray(records)
                    ? records
                    : Array.isArray(records?.users)
                        ? records.users
                        : []
            );
        } catch (err) {
            setError(err.message || "Failed to load borrowers.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBorrowers();
    }, [loadBorrowers]);

    const filteredBorrowers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return borrowers.filter((borrower) => {
            const type = getType(borrower).toLowerCase();

            if (type !== "student" && type !== "faculty") {
                return false;
            }

            const matchesType =
                typeFilter === "all" || type === typeFilter;

            const matchesSearch =
                !keyword ||
                getFullName(borrower).toLowerCase().includes(keyword) ||
                getSchoolId(borrower).toLowerCase().includes(keyword) ||
                (borrower.email || "").toLowerCase().includes(keyword);

            const matchesStatus = statusFilter === "all" || getStatus(borrower).toLowerCase() === statusFilter;
            return matchesType && matchesSearch && matchesStatus;
        });
    }, [borrowers, search, typeFilter, statusFilter]);

    const updateForm = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleCreate = async (event) => {
        event.preventDefault();

        if (saving) return;

        setSaving(true);
        setError("");
        setNotice("");

        const payload = {
            schoolId: form.schoolId.trim(),
            email: form.email.trim(),
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            borrowerType: form.borrowerType,
        };

        if (form.middleName.trim()) {
            payload.middleName = form.middleName.trim();
        }

        if (form.borrowerType === "student") {
            payload.program = form.program.trim();
            payload.yearLevel = Number(form.yearLevel);

            if (form.section.trim()) {
                payload.section = form.section.trim();
            }
        } else {
            payload.departmentId = Number(form.departmentId);

            if (form.position.trim()) {
                payload.position = form.position.trim();
            }

            if (form.employmentStatus.trim()) {
                payload.employmentStatus =
                    form.employmentStatus.trim();
            }
        }

        try {
            await apiRequest("/borrower-invitations", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setFormOpen(false);
            setForm({ ...emptyForm });
            setNotice(
                "Borrower registration submitted. Check the invitation delivery status and ask the borrower to check their email."
            );

            await loadBorrowers();
        } catch (err) {
            setError(
                err.message || "Failed to create borrower invitation."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleResend = async (borrower) => {
        const userId = borrower.id;

        if (!userId || resendingId !== null) return;

        const confirmed = window.confirm(
            `Resend account invitation to ${borrower.email}?`
        );

        if (!confirmed) return;

        setResendingId(userId);
        setError("");
        setNotice("");

        try {
            await apiRequest(
                `/borrower-invitations/${encodeURIComponent(
                    userId
                )}/resend`,
                { method: "POST" }
            );

            setNotice(
                `Invitation resend requested for ${borrower.email}.`
            );

            await loadBorrowers();
        } catch (err) {
            setError(
                err.message || "Failed to resend invitation."
            );
        } finally {
            setResendingId(null);
        }
    };

    const openDetails = async (borrower) => {
        setDetailsLoading(true);
        setError("");

        try {
            const response = await apiRequest(
                `/users/${encodeURIComponent(borrower.id)}`
            );

            setSelectedBorrower(response?.data || borrower);
        } catch (err) {
            setError(
                err.message || "Failed to load borrower details."
            );
        } finally {
            setDetailsLoading(false);
        }
    };

    const fieldClass =
        "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

    return (
        <AdminLayout>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Library Accounts
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900">
                        Borrower Management
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Register student and faculty borrowers and manage
                        account invitations.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setError("");
                        setNotice("");
                        setForm({ ...emptyForm });
                        setFormOpen(true);
                    }}
                    className="hidden lg:flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
                >
                    <FaPlus />
                    Add Borrower
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            {notice && (
                <div
                    role="status"
                    className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                >
                    {notice}
                </div>
            )}

            {/* Compact mobile search, filters, and status tabs */}
            <section className="mb-5 lg:hidden">
                <div className="flex items-center gap-2">
                    <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-blue-500">
                        <FaSearch className="shrink-0 text-slate-400" />
                        <input
                            type="search"
                            aria-label="Search borrowers"
                            placeholder="Search borrowers..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="w-full min-w-0 bg-transparent text-sm outline-none"
                        />
                    </label>
                    <button
                        type="button"
                        aria-label="Filter borrower type"
                        aria-expanded={mobileFiltersOpen}
                        onClick={() => setMobileFiltersOpen((open) => !open)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
                    >
                        <FaFilter />
                    </button>
                </div>
                {mobileFiltersOpen && (
                    <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                        <label htmlFor="mobile-borrower-type" className="mb-2 block text-xs font-semibold text-slate-600">Borrower type</label>
                        <select
                            id="mobile-borrower-type"
                            value={typeFilter}
                            onChange={(event) => setTypeFilter(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                        >
                            <option value="all">All Types</option>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(false)}
                            className="mt-3 w-full rounded-xl bg-blue-700 py-2.5 text-sm font-semibold text-white"
                        >Apply Filter</button>
                    </div>
                )}
                <div role="group" aria-label="Borrower account status" className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {[
                        { value: "all", label: "All" },
                        { value: "pending", label: "Invited / Pending" },
                        { value: "active", label: "Active" },
                        { value: "inactive", label: "Inactive" },
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            aria-pressed={statusFilter === option.value}
                            onClick={() => setStatusFilter(option.value)}
                            className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold ${statusFilter === option.value ? "bg-blue-800 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
                        >{option.label}</button>
                    ))}
                </div>
                <p className="mt-2 px-1 text-xs text-slate-500">{loading ? "Loading..." : `${filteredBorrowers.length} borrower(s) found`}</p>
            </section>

            <section className="mb-6 hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:block">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <FaUsers className="text-xl text-blue-700" />
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Borrower Records
                            </h2>
                            <p className="text-sm text-slate-500">
                                {loading
                                    ? "Loading..."
                                    : `${filteredBorrowers.length} borrower(s) found`}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-3">
                            <FaSearch className="text-slate-400" />
                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search name, ID, email..."
                                className="w-56 py-2.5 outline-none"
                            />
                        </div>

                        <select
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(event.target.value)
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2.5"
                        >
                            <option value="all">All Types</option>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Mobile borrower cards */}
            <section className="space-y-3 lg:hidden">
                {!loading && filteredBorrowers.map((borrower) => {
                    const status = getStatus(borrower).toLowerCase();
                    const pending = status === "pending";
                    const name = getFullName(borrower) || "Unnamed Borrower";
                    return (
                        <article key={borrower.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                                    <FaUsers />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-slate-900">{name}</p>
                                    <p className="truncate text-xs text-slate-500">{borrower.email || getSchoolId(borrower)}</p>
                                    <p className="mt-1 text-xs capitalize text-slate-500">{getType(borrower)} · {getSchoolId(borrower) || "No school ID"}</p>
                                </div>
                                <button
                                    type="button"
                                    aria-label={`View ${name}`}
                                    disabled={detailsLoading}
                                    onClick={() => openDetails(borrower)}
                                    className="rounded-full p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                                ><FaChevronRight /></button>
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${status === "active" ? "bg-green-100 text-green-700" : pending ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                                    {pending ? "Invited / Pending" : status}
                                </span>
                                {pending && (
                                    <button
                                        type="button"
                                        disabled={resendingId !== null}
                                        onClick={() => handleResend(borrower)}
                                        className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800 disabled:opacity-50"
                                    ><FaRedo />{resendingId === borrower.id ? "Sending..." : "Resend"}</button>
                                )}
                            </div>
                        </article>
                    );
                })}
                {loading && <p className="py-8 text-center text-sm text-slate-500">Loading borrowers...</p>}
                {!loading && filteredBorrowers.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">No borrowers found.</p>}
            </section>

            {/* Desktop table preserved */}
            <section className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:block">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                        <thead className="bg-slate-50 text-sm text-slate-700">
                            <tr>
                                <th className="px-5 py-4">Borrower</th>
                                <th className="px-5 py-4">School ID</th>
                                <th className="px-5 py-4">Email</th>
                                <th className="px-5 py-4">Type</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {!loading &&
                                filteredBorrowers.map((borrower) => {
                                    const status = getStatus(borrower);
                                    const pending =
                                        status.toLowerCase() === "pending";

                                    return (
                                        <tr
                                            key={borrower.id}
                                            className="border-t border-slate-100 text-sm"
                                        >
                                            <td className="px-5 py-4 font-semibold text-slate-900">
                                                {getFullName(borrower) ||
                                                    "Unnamed Borrower"}
                                            </td>
                                            <td className="px-5 py-4">
                                                {getSchoolId(borrower) || "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                {borrower.email || "—"}
                                            </td>
                                            <td className="px-5 py-4 capitalize">
                                                {getType(borrower) || "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${status === "active"
                                                            ? "bg-green-100 text-green-700"
                                                            : pending
                                                                ? "bg-amber-100 text-amber-800"
                                                                : "bg-slate-100 text-slate-700"
                                                        }`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        disabled={detailsLoading}
                                                        onClick={() =>
                                                            openDetails(borrower)
                                                        }
                                                        className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                                                    >
                                                        <FaEye />
                                                        View
                                                    </button>

                                                    {pending && (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                resendingId !==
                                                                null
                                                            }
                                                            onClick={() =>
                                                                handleResend(
                                                                    borrower
                                                                )
                                                            }
                                                            className="flex items-center gap-2 rounded-lg border border-amber-200 px-3 py-2 font-semibold text-amber-800 hover:bg-amber-50 disabled:opacity-50"
                                                        >
                                                            <FaRedo />
                                                            {resendingId ===
                                                                borrower.id
                                                                ? "Sending..."
                                                                : "Resend"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <p className="p-10 text-center text-slate-500">
                        Loading borrowers...
                    </p>
                )}

                {!loading && filteredBorrowers.length === 0 && (
                    <p className="p-10 text-center text-slate-500">
                        No borrowers found.
                    </p>
                )}
            </section>

            {/* Mobile Invite Borrower action */}
            {!formOpen && !selectedBorrower && (
                <button
                    type="button"
                    aria-label="Invite borrower"
                    title="Invite borrower"
                    onClick={() => {
                        setError("");
                        setNotice("");
                        setForm({ ...emptyForm });
                        setFormOpen(true);
                    }}
                    className="fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-800 text-xl text-white shadow-lg hover:bg-blue-900 lg:hidden"
                    style={{ bottom: "calc(6.5rem + env(safe-area-inset-bottom))" }}
                ><FaPlus /></button>
            )}

            {formOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="borrower-form-title"
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
                    >
                        <div className="flex items-center justify-between bg-blue-800 px-6 py-5 text-white">
                            <h2
                                id="borrower-form-title"
                                className="text-xl font-bold"
                            >
                                Register Borrower
                            </h2>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => setFormOpen(false)}
                                aria-label="Close"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="text-sm font-medium">
                                    Borrower Type
                                    <select
                                        className={`${fieldClass} mt-1`}
                                        value={form.borrowerType}
                                        onChange={(event) =>
                                            updateForm(
                                                "borrowerType",
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="student">
                                            Student
                                        </option>
                                        <option value="faculty">
                                            Faculty
                                        </option>
                                    </select>
                                </label>

                                <label className="text-sm font-medium">
                                    School ID
                                    <input
                                        required
                                        maxLength={50}
                                        className={`${fieldClass} mt-1`}
                                        value={form.schoolId}
                                        onChange={(event) =>
                                            updateForm(
                                                "schoolId",
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <label className="text-sm font-medium">
                                    First Name
                                    <input
                                        required
                                        maxLength={100}
                                        className={`${fieldClass} mt-1`}
                                        value={form.firstName}
                                        onChange={(event) =>
                                            updateForm(
                                                "firstName",
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <label className="text-sm font-medium">
                                    Middle Name (Optional)
                                    <input
                                        maxLength={100}
                                        className={`${fieldClass} mt-1`}
                                        value={form.middleName}
                                        onChange={(event) =>
                                            updateForm(
                                                "middleName",
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <label className="text-sm font-medium">
                                    Last Name
                                    <input
                                        required
                                        maxLength={100}
                                        className={`${fieldClass} mt-1`}
                                        value={form.lastName}
                                        onChange={(event) =>
                                            updateForm(
                                                "lastName",
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                <label className="text-sm font-medium">
                                    Email Address
                                    <input
                                        type="email"
                                        required
                                        maxLength={255}
                                        className={`${fieldClass} mt-1`}
                                        value={form.email}
                                        onChange={(event) =>
                                            updateForm(
                                                "email",
                                                event.target.value
                                            )
                                        }
                                    />
                                </label>

                                {form.borrowerType === "student" ? (
                                    <>
                                        <label className="text-sm font-medium">
                                            Program
                                            <input
                                                required
                                                maxLength={100}
                                                placeholder="e.g. BSIT"
                                                className={`${fieldClass} mt-1`}
                                                value={form.program}
                                                onChange={(event) =>
                                                    updateForm(
                                                        "program",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </label>

                                        <label className="text-sm font-medium">
                                            Year Level
                                            <select
                                                required
                                                className={`${fieldClass} mt-1`}
                                                value={form.yearLevel}
                                                onChange={(event) =>
                                                    updateForm(
                                                        "yearLevel",
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select year
                                                </option>
                                                {[1, 2, 3, 4, 5, 6].map(
                                                    (year) => (
                                                        <option
                                                            key={year}
                                                            value={year}
                                                        >
                                                            Year {year}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </label>

                                        <label className="text-sm font-medium">
                                            Section (Optional)
                                            <input
                                                maxLength={100}
                                                className={`${fieldClass} mt-1`}
                                                value={form.section}
                                                onChange={(event) =>
                                                    updateForm(
                                                        "section",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </label>
                                    </>
                                ) : (
                                    <>
                                        <label className="text-sm font-medium">
                                            Department ID
                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                required
                                                className={`${fieldClass} mt-1`}
                                                value={form.departmentId}
                                                onChange={(event) =>
                                                    updateForm(
                                                        "departmentId",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </label>

                                        <label className="text-sm font-medium">
                                            Position (Optional)
                                            <input
                                                maxLength={150}
                                                className={`${fieldClass} mt-1`}
                                                value={form.position}
                                                onChange={(event) =>
                                                    updateForm(
                                                        "position",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </label>

                                        <label className="text-sm font-medium">
                                            Employment Status (Optional)
                                            <input
                                                maxLength={50}
                                                className={`${fieldClass} mt-1`}
                                                value={form.employmentStatus}
                                                onChange={(event) =>
                                                    updateForm(
                                                        "employmentStatus",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </label>
                                    </>
                                )}
                            </div>

                            <div className="mt-5 flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                                <FaEnvelope className="mt-1 shrink-0" />
                                <p>
                                    The borrower will receive an account
                                    invitation by email and create their own
                                    password. The administrator does not
                                    choose the borrower's password.
                                </p>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => setFormOpen(false)}
                                    className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                                >
                                    {saving
                                        ? "Submitting..."
                                        : "Create & Send Invitation"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedBorrower && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="borrower-details-title"
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <h2
                                id="borrower-details-title"
                                className="text-xl font-bold"
                            >
                                Borrower Details
                            </h2>
                            <button
                                type="button"
                                onClick={() => setSelectedBorrower(null)}
                                aria-label="Close"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="mt-5 space-y-3 text-sm">
                            <p>
                                <strong>Name:</strong>{" "}
                                {getFullName(selectedBorrower)}
                            </p>
                            <p>
                                <strong>School ID:</strong>{" "}
                                {getSchoolId(selectedBorrower)}
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                {selectedBorrower.email || "—"}
                            </p>
                            <p>
                                <strong>Type:</strong>{" "}
                                {getType(selectedBorrower)}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {getStatus(selectedBorrower)}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedBorrower(null)}
                            className="mt-6 w-full rounded-lg bg-blue-700 py-3 font-semibold text-white"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default Borrowers;
