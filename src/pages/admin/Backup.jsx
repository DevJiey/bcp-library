import {
    useEffect,
    useState,
} from "react";

import {
    FaDatabase,
    FaHistory,
    FaCloudDownloadAlt,
    FaUndoAlt,
    FaExclamationTriangle,
    FaSyncAlt,
    FaCloud,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";

function Backup() {
    const { showToast } = useToast();

    const isProduction = import.meta.env.PROD;

    const [backups, setBackups] =
        useState([]);

    const [loading, setLoading] =
        useState(!isProduction);

    const [creating, setCreating] =
        useState(false);

    const [restoringFile, setRestoringFile] =
        useState(null);

    const [downloadingFile, setDownloadingFile] =
        useState(null);

    const [error, setError] =
        useState("");

    const loadBackups = async () => {
        if (isProduction) {
            setBackups([]);
            setLoading(false);
            setError("");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await apiRequest(
                    "/backups"
                );

            setBackups(
                response?.data || []
            );
        } catch (err) {
            setError(
                err.message ||
                    "Failed to load database backups."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBackups();
    }, []);

    const handleCreateBackup =
        async () => {
            if (isProduction) {
                showToast(
                    "Production database recovery is managed through Neon.",
                    "error"
                );
                return;
            }

            try {
                setCreating(true);
                setError("");

                await apiRequest(
                    "/backup",
                    {
                        method: "POST",
                    }
                );

                showToast(
                    "Database backup created successfully!",
                    "success"
                );

                await loadBackups();
            } catch (err) {
                const message =
                    err.message ||
                    "Failed to create database backup.";

                setError(message);

                showToast(
                    message,
                    "error"
                );
            } finally {
                setCreating(false);
            }
        };

    const getToken = () => {
        return (
            localStorage.getItem(
                "token"
            ) || ""
        );
    };

    const handleDownload =
        async (backup) => {
            if (isProduction) {
                return;
            }

            const fileName =
                backup.fileName ||
                backup.file_name ||
                backup.name;

            if (!fileName) {
                showToast(
                    "Backup filename is missing.",
                    "error"
                );

                return;
            }

            try {
                setDownloadingFile(
                    fileName
                );

                const baseUrl =
                    import.meta.env
                        .VITE_API_URL ||
                    "http://localhost:5000/api/v1";

                const response =
                    await fetch(
                        `${baseUrl}/backups/${encodeURIComponent(
                            fileName
                        )}/download`,
                        {
                            headers: {
                                Authorization: `Bearer ${getToken()}`,
                            },
                        }
                    );

                if (!response.ok) {
                    let message =
                        "Failed to download database backup.";

                    try {
                        const data =
                            await response.json();

                        message =
                            data.message ||
                            message;
                    } catch {
                        // Response is not JSON.
                    }

                    throw new Error(
                        message
                    );
                }

                const blob =
                    await response.blob();

                const url =
                    window.URL.createObjectURL(
                        blob
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href = url;
                link.download =
                    fileName;

                document.body.appendChild(
                    link
                );

                link.click();

                link.remove();

                window.URL.revokeObjectURL(
                    url
                );

                showToast(
                    "Backup downloaded successfully!",
                    "success"
                );
            } catch (err) {
                showToast(
                    err.message ||
                        "Failed to download backup.",
                    "error"
                );
            } finally {
                setDownloadingFile(
                    null
                );
            }
        };

    const handleRestore =
        async (backup) => {
            if (isProduction) {
                return;
            }

            const fileName =
                backup.fileName ||
                backup.file_name ||
                backup.name;

            if (!fileName) {
                showToast(
                    "Backup filename is missing.",
                    "error"
                );

                return;
            }

            const confirmed =
                window.confirm(
                    `Restore database using "${fileName}"?\n\nThis will replace the current database data with the selected backup.`
                );

            if (!confirmed) {
                return;
            }

            try {
                setRestoringFile(
                    fileName
                );

                setError("");

                await apiRequest(
                    "/restore",
                    {
                        method: "POST",

                        body: JSON.stringify({
                            fileName,
                        }),
                    }
                );

                showToast(
                    "Database restored successfully!",
                    "success"
                );

                await loadBackups();
            } catch (err) {
                const message =
                    err.message ||
                    "Failed to restore database backup.";

                setError(
                    message
                );

                showToast(
                    message,
                    "error"
                );
            } finally {
                setRestoringFile(
                    null
                );
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

    const formatFileSize = (
        bytes
    ) => {
        const value =
            Number(bytes);

        if (
            !Number.isFinite(
                value
            ) ||
            value <= 0
        ) {
            return "—";
        }

        const units = [
            "B",
            "KB",
            "MB",
            "GB",
        ];

        let size = value;
        let unitIndex = 0;

        while (
            size >= 1024 &&
            unitIndex <
                units.length - 1
        ) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(
            size >= 10 ||
                unitIndex === 0
                ? 0
                : 1
        )} ${units[unitIndex]}`;
    };

    return (
        <AdminLayout>
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Database Maintenance
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Backup & Restore
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {isProduction
                            ? "Production database recovery is managed through Neon."
                            : "Create, download, and restore PostgreSQL database backups."}
                    </p>
                </div>

                {!isProduction && (
                    <button
                        type="button"
                        disabled={
                            creating
                        }
                        onClick={
                            handleCreateBackup
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FaDatabase />

                        {creating
                            ? "Creating Backup..."
                            : "Create Backup"}
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <FaExclamationTriangle className="mt-0.5 shrink-0" />

                    <span>
                        {error}
                    </span>
                </div>
            )}

            {isProduction ? (
                <>
                    {/* PRODUCTION RECOVERY */}
                    <section className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <FaCloud />
                            </div>

                            <div>
                                <h2 className="font-bold text-blue-900">
                                    Cloud Database Recovery
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-blue-700">
                                    The production database is hosted on Neon.
                                    Production recovery is managed using the
                                    database provider&apos;s recovery and
                                    restore capabilities instead of storing
                                    backup files on the application server.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="px-6 py-10 text-center">
                            <FaCloud className="mx-auto text-4xl text-blue-300" />

                            <h2 className="mt-4 text-lg font-bold text-slate-900">
                                Production Protection Active
                            </h2>

                            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Local SQL backup, download, and restore
                                controls are disabled in the deployed
                                application because the production backend
                                runs in a serverless environment. Database
                                recovery is handled through the Neon
                                production database platform.
                            </p>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    {/* WARNING */}
                    <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                <FaExclamationTriangle />
                            </div>

                            <div>
                                <h2 className="font-bold text-amber-900">
                                    Restore with caution
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-amber-700">
                                    Restoring a backup replaces the current
                                    database contents with the selected
                                    backup. Create a recent backup first
                                    before restoring older data.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* BACKUP LIST */}
                    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                    <FaHistory />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Available Backups
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        {loading
                                            ? "Loading..."
                                            : `${backups.length} backup${
                                                  backups.length !==
                                                  1
                                                      ? "s"
                                                      : ""
                                              } available`}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    loadBackups
                                }
                                disabled={
                                    loading
                                }
                                className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
                            >
                                <FaSyncAlt
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                            Backup File
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                            Created
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                            Size
                                        </th>

                                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {!loading &&
                                        backups.map(
                                            (
                                                backup,
                                                index
                                            ) => {
                                                const fileName =
                                                    backup.fileName ||
                                                    backup.file_name ||
                                                    backup.name ||
                                                    `Backup ${
                                                        index +
                                                        1
                                                    }`;

                                                const createdAt =
                                                    backup.createdAt ||
                                                    backup.created_at ||
                                                    backup.modifiedAt ||
                                                    backup.modified_at;

                                                const fileSize =
                                                    backup.size ||
                                                    backup.fileSize ||
                                                    backup.file_size;

                                                return (
                                                    <tr
                                                        key={
                                                            fileName
                                                        }
                                                        className="border-t border-slate-100 transition hover:bg-blue-50/40"
                                                    >
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                                    <FaDatabase />
                                                                </div>

                                                                <div>
                                                                    <p className="font-semibold text-slate-900">
                                                                        {
                                                                            fileName
                                                                        }
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-slate-400">
                                                                        PostgreSQL
                                                                        backup
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-4 text-sm text-slate-600">
                                                            {formatDate(
                                                                createdAt
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-4 text-sm text-slate-600">
                                                            {formatFileSize(
                                                                fileSize
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        downloadingFile ===
                                                                        fileName
                                                                    }
                                                                    onClick={() =>
                                                                        handleDownload(
                                                                            backup
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
                                                                >
                                                                    <FaCloudDownloadAlt />

                                                                    {downloadingFile ===
                                                                    fileName
                                                                        ? "Downloading..."
                                                                        : "Download"}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        restoringFile !==
                                                                        null
                                                                    }
                                                                    onClick={() =>
                                                                        handleRestore(
                                                                            backup
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-2 rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
                                                                >
                                                                    <FaUndoAlt />

                                                                    {restoringFile ===
                                                                    fileName
                                                                        ? "Restoring..."
                                                                        : "Restore"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                </tbody>
                            </table>
                        </div>

                        {loading && (
                            <div className="px-6 py-14 text-center text-sm text-slate-400">
                                Loading database backups...
                            </div>
                        )}

                        {!loading &&
                            backups.length ===
                                0 && (
                                <div className="px-6 py-14 text-center">
                                    <FaDatabase className="mx-auto text-3xl text-slate-300" />

                                    <h2 className="mt-4 font-semibold text-slate-800">
                                        No backups available
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Create your first database backup
                                        using the button above.
                                    </p>
                                </div>
                            )}
                    </section>
                </>
            )}
        </AdminLayout>
    );
}

export default Backup;