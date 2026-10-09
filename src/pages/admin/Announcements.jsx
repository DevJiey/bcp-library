import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaBullhorn,
    FaPlus,
    FaSearch,
    FaEdit,
    FaTimes,
    FaFilter,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";

function Announcements() {
    const { showToast } = useToast();

    const [announcements, setAnnouncements] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [editingAnnouncement, setEditingAnnouncement] =
        useState(null);

    const [form, setForm] =
        useState({
            title: "",
            message: "",
            audience: "all",
            status: "published",
        });

    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await apiRequest(
                    "/announcements/admin"
                );

            setAnnouncements(
                response?.data || []
            );
        } catch (err) {
            setError(
                err.message ||
                    "Failed to load announcements."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const filteredAnnouncements =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            return announcements.filter(
                (announcement) => {
                    const searchable =
                        [
                            announcement.title,
                            announcement.message,
                            announcement.audience,
                            announcement.status,
                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();

                    const matchesSearch =
                        !keyword ||
                        searchable.includes(
                            keyword
                        );

                    const matchesStatus =
                        statusFilter === "All" ||
                        announcement.status ===
                            statusFilter.toLowerCase();

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            announcements,
            search,
            statusFilter,
        ]);

    const resetForm = () => {
        setForm({
            title: "",
            message: "",
            audience: "all",
            status: "published",
        });
    };

    const openAddModal = () => {
        resetForm();

        setShowAddModal(
            true
        );
    };

    const openEditModal = (
        announcement
    ) => {
        setEditingAnnouncement(
            announcement
        );

        setForm({
            title:
                announcement.title ||
                "",

            message:
                announcement.message ||
                "",

            audience:
                announcement.audience ||
                "all",

            status:
                announcement.status ||
                "published",
        });
    };

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowAddModal(false);
        setEditingAnnouncement(null);

        resetForm();
    };

    const handleCreate = async (
        event
    ) => {
        event.preventDefault();

        if (
            !form.title.trim() ||
            !form.message.trim()
        ) {
            showToast(
                "Title and message are required.",
                "error"
            );

            return;
        }

        try {
            setSaving(true);
            setError("");

            await apiRequest(
                "/announcements",
                {
                    method: "POST",

                    body: JSON.stringify({
                        title:
                            form.title.trim(),

                        message:
                            form.message.trim(),

                        audience:
                            form.audience,

                        status:
                            form.status,
                    }),
                }
            );

            showToast(
                "Announcement created successfully!",
                "success"
            );

            setShowAddModal(
                false
            );

            resetForm();

            await loadAnnouncements();
        } catch (err) {
            const message =
                err.message ||
                "Failed to create announcement.";

            setError(
                message
            );

            showToast(
                message,
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (
        event
    ) => {
        event.preventDefault();

        if (
            !form.title.trim() ||
            !form.message.trim()
        ) {
            showToast(
                "Title and message are required.",
                "error"
            );

            return;
        }

        try {
            setSaving(true);
            setError("");

            await apiRequest(
                `/announcements/${editingAnnouncement.id}`,
                {
                    method: "PATCH",

                    body: JSON.stringify({
                        title:
                            form.title.trim(),

                        message:
                            form.message.trim(),

                        audience:
                            form.audience,

                        status:
                            form.status,
                    }),
                }
            );

            showToast(
                "Announcement updated successfully!",
                "success"
            );

            setEditingAnnouncement(
                null
            );

            resetForm();

            await loadAnnouncements();
        } catch (err) {
            const message =
                err.message ||
                "Failed to update announcement.";

            setError(
                message
            );

            showToast(
                message,
                "error"
            );
        } finally {
            setSaving(false);
        }
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
            return value;
        }

        return date.toLocaleString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    const getStatusStyle = (
        status
    ) => {
        if (
            status ===
            "published"
        ) {
            return "bg-emerald-100 text-emerald-700";
        }

        if (
            status ===
            "draft"
        ) {
            return "bg-amber-100 text-amber-700";
        }

        return "bg-slate-100 text-slate-600";
    };

    return (
        <AdminLayout>
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Library Communication
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Announcements
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Create and manage announcements for borrowers, students, faculty, and staff.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        openAddModal
                    }
                    className="hidden lg:flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800"
                >
                    <FaPlus />
                    New Announcement
                </button>

            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* TOOLBAR */}
            <section className="mb-4 lg:mb-6 rounded-2xl bg-white p-3 sm:p-5 shadow-sm ring-1 ring-slate-200">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="hidden lg:flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <FaBullhorn />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">
                                Announcement Records
                            </h2>

                            <p className="text-sm text-slate-500">
                                {loading
                                    ? "Loading..."
                                    : `${filteredAnnouncements.length} announcement${
                                          filteredAnnouncements.length !==
                                          1
                                              ? "s"
                                              : ""
                                      } found`}
                            </p>
                        </div>

                    </div>

                    <div className="hidden lg:flex flex-col gap-3 sm:flex-row">

                        <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">

                            <FaSearch className="text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search announcement..."
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
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none"
                        >
                            <option value="All">
                                All Status
                            </option>

                            <option value="Published">
                                Published
                            </option>

                            <option value="Draft">
                                Draft
                            </option>

                            <option value="Archived">
                                Archived
                            </option>
                        </select>

                    </div>

                </div>

                {/* Mobile search + filter, aligned in one row */}
                <div className="mt-3 lg:hidden">
                    <div className="flex items-center gap-2">
                        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                            <FaSearch className="shrink-0 text-slate-400" />
                            <input
                                type="search"
                                aria-label="Search announcements"
                                placeholder="Search announcements..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="h-11 w-full min-w-0 bg-transparent text-sm outline-none"
                            />
                        </label>
                        <button
                            type="button"
                            aria-label="Filter announcements by status"
                            aria-expanded={mobileFiltersOpen}
                            onClick={() => setMobileFiltersOpen((open) => !open)}
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${mobileFiltersOpen || statusFilter !== "All" ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-300 bg-white text-blue-700"}`}
                        >
                            <FaFilter />
                        </button>
                    </div>
                    {mobileFiltersOpen && (
                        <div className="mt-3 rounded-xl bg-slate-50 p-3">
                            <label htmlFor="announcement-mobile-status" className="mb-1 block text-xs font-semibold text-slate-600">Status</label>
                            <select
                                id="announcement-mobile-status"
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none"
                            >
                                <option value="All">All Status</option>
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                                <option value="Archived">Archived</option>
                            </select>
                        </div>
                    )}
                </div>
            </section>

            {/* Mobile announcement cards */}
            <section className="space-y-3 lg:hidden">
                {!loading && filteredAnnouncements.map((announcement) => (
                    <article key={announcement.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                                <FaBullhorn />
                            </span>
                            <div className="min-w-0 flex-1">
                                <h3 className="break-words text-sm font-bold text-slate-900">{announcement.title}</h3>
                                <p className="mt-1 text-xs text-slate-500">{formatDate(announcement.created_at || announcement.createdAt)}</p>
                            </div>
                            <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold capitalize ${getStatusStyle(announcement.status)}`}>
                                {announcement.status}
                            </span>
                        </div>
                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{announcement.message}</p>
                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                                {announcement.audience === "all" ? "Everyone" : announcement.audience}
                            </span>
                            <button
                                type="button"
                                onClick={() => openEditModal(announcement)}
                                className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700"
                            >
                                <FaEdit /> Edit
                            </button>
                        </div>
                    </article>
                ))}
                {loading && <div className="rounded-2xl bg-white px-5 py-12 text-center text-sm text-slate-500">Loading announcements...</div>}
                {!loading && filteredAnnouncements.length === 0 && (
                    <div className="rounded-2xl bg-white px-5 py-12 text-center text-sm text-slate-500">No announcements found.</div>
                )}
            </section>

            {/* Desktop table */}
            <section className="hidden lg:block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1000px]">

                        <thead className="bg-slate-50">
                            <tr>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Announcement
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Audience
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Created
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {!loading &&
                                filteredAnnouncements.map(
                                    (
                                        announcement
                                    ) => (
                                        <tr
                                            key={
                                                announcement.id
                                            }
                                            className="border-t border-slate-100 transition hover:bg-blue-50/40"
                                        >

                                            <td className="px-5 py-4">

                                                <div className="flex gap-3">

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                        <FaBullhorn />
                                                    </div>

                                                    <div className="max-w-md">

                                                        <p className="font-semibold text-slate-900">
                                                            {
                                                                announcement.title
                                                            }
                                                        </p>

                                                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                                                            {
                                                                announcement.message
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="px-5 py-4">

                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                                                    {
                                                        announcement.audience
                                                    }
                                                </span>

                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                                        announcement.status
                                                    )}`}
                                                >
                                                    {
                                                        announcement.status
                                                    }
                                                </span>

                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {formatDate(
                                                    announcement.created_at ||
                                                        announcement.createdAt
                                                )}
                                            </td>

                                            <td className="px-5 py-4">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(
                                                            announcement
                                                        )
                                                    }
                                                    className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                                >
                                                    <FaEdit />
                                                    Edit
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                        </tbody>

                    </table>

                </div>

                {loading && (
                    <div className="px-6 py-14 text-center text-sm text-slate-400">
                        Loading announcements...
                    </div>
                )}

                {!loading &&
                    filteredAnnouncements.length ===
                        0 && (
                        <div className="px-6 py-14 text-center">

                            <FaBullhorn className="mx-auto text-3xl text-slate-300" />

                            <h2 className="mt-4 font-semibold text-slate-800">
                                No announcements found
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                New announcements will appear here.
                            </p>

                        </div>
                    )}

            </section>

            {/* Mobile add button (above bottom navigation) */}
            <button
                type="button"
                onClick={openAddModal}
                aria-label="New announcement"
                className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4C97] text-xl text-white shadow-lg lg:hidden"
            >
                <FaPlus />
            </button>

            {/* ADD */}
            {showAddModal && (
                <AnnouncementModal
                    title="New Announcement"
                    form={form}
                    setForm={
                        setForm
                    }
                    saving={
                        saving
                    }
                    onCancel={
                        closeModal
                    }
                    onSubmit={
                        handleCreate
                    }
                    allowArchived={
                        false
                    }
                    submitLabel="Publish Announcement"
                />
            )}

            {/* EDIT */}
            {editingAnnouncement && (
                <AnnouncementModal
                    title="Edit Announcement"
                    form={form}
                    setForm={
                        setForm
                    }
                    saving={
                        saving
                    }
                    onCancel={
                        closeModal
                    }
                    onSubmit={
                        handleUpdate
                    }
                    allowArchived
                    submitLabel="Update Announcement"
                />
            )}

        </AdminLayout>
    );
}

function AnnouncementModal({
    title,
    form,
    setForm,
    saving,
    onCancel,
    onSubmit,
    allowArchived,
    submitLabel,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

            <form
                onSubmit={
                    onSubmit
                }
                className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >

                <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                            Library Communication
                        </p>

                        <h2 className="mt-1 text-xl font-bold">
                            {title}
                        </h2>
                    </div>

                    <button
                        type="button"
                        disabled={
                            saving
                        }
                        onClick={
                            onCancel
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
                    >
                        <FaTimes />
                    </button>

                </div>

                <div className="space-y-5 overflow-y-auto p-6">

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Title *
                        </label>

                        <input
                            type="text"
                            value={
                                form.title
                            }
                            onChange={(
                                event
                            ) =>
                                setForm({
                                    ...form,
                                    title:
                                        event.target
                                            .value,
                                })
                            }
                            required
                            placeholder="Announcement title"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Message *
                        </label>

                        <textarea
                            value={
                                form.message
                            }
                            onChange={(
                                event
                            ) =>
                                setForm({
                                    ...form,
                                    message:
                                        event.target
                                            .value,
                                })
                            }
                            required
                            rows={6}
                            placeholder="Write the library announcement..."
                            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Audience
                            </label>

                            <select
                                value={
                                    form.audience
                                }
                                onChange={(
                                    event
                                ) =>
                                    setForm({
                                        ...form,
                                        audience:
                                            event
                                                .target
                                                .value,
                                    })
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="all">
                                    Everyone
                                </option>

                                <option value="borrowers">
                                    All Borrowers
                                </option>

                                <option value="students">
                                    Students
                                </option>

                                <option value="faculty">
                                    Faculty
                                </option>

                                <option value="staff">
                                    Library Staff
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Status
                            </label>

                            <select
                                value={
                                    form.status
                                }
                                onChange={(
                                    event
                                ) =>
                                    setForm({
                                        ...form,
                                        status:
                                            event
                                                .target
                                                .value,
                                    })
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="published">
                                    Published
                                </option>

                                <option value="draft">
                                    Draft
                                </option>

                                {allowArchived && (
                                    <option value="archived">
                                        Archived
                                    </option>
                                )}
                            </select>
                        </div>

                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
                        Published announcements are shown only to users who match the selected audience.
                        Draft and archived announcements remain visible to administrators only.
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                        <button
                            type="button"
                            disabled={
                                saving
                            }
                            onClick={
                                onCancel
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
                            className="rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : submitLabel}
                        </button>

                    </div>

                </div>

            </form>

        </div>
    );
}

export default Announcements;