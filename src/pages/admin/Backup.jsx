import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
    FaDatabase,
    FaDownload,
    FaUpload,
    FaHistory,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

function Backup() {
    const { showToast } = useToast();
    const [backups, setBackups] = useState([
        {
            id: 1,
            fileName: "bcp_library_backup_2026-08-05.sql",
            createdAt: "August 5, 2026 — 8:30 AM",
            size: "12.4 MB",
            type: "Manual",
            status: "Completed",
        },
        {
            id: 2,
            fileName: "bcp_library_backup_2026-08-04.sql",
            createdAt: "August 4, 2026 — 6:00 PM",
            size: "12.1 MB",
            type: "Automatic",
            status: "Completed",
        },
    ]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [showRestoreModal, setShowRestoreModal] = useState(false);

    const createBackup = () => {
        const newBackup = {
            id: Date.now(),
            fileName: `bcp_library_backup_${new Date()
                .toISOString()
                .slice(0, 10)}.sql`,
            createdAt: new Date().toLocaleString(),
            size: "12.6 MB",
            type: "Manual",
            status: "Completed",
        };

        setBackups([newBackup, ...backups]);

        showToast("Database backup created successfully.", "success");
    };

    const handleRestore = () => {
        if (!selectedFile) {
            showToast("Please select a backup file first.", "error");
            return;
        }

        setShowRestoreModal(false);
        setSelectedFile(null);

        showToast("Database restored successfully.", "success");
    };

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-8">
                <p className="text-sm font-semibold text-blue-700">
                    System Maintenance
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Backup & Restore
                </h1>

                <p className="mt-2 text-slate-500">
                    Create database backups and restore the library system from a backup file.
                </p>
            </div>

            {/* Main Actions */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Create Backup */}
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-700">
                            <FaDatabase />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Create Database Backup
                            </h2>

                            <p className="mt-2 leading-6 text-slate-500">
                                Generate a backup copy of the current library database and system records.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-sm font-semibold text-blue-800">
                            Recommended before major system changes
                        </p>

                        <p className="mt-1 text-sm leading-6 text-blue-700">
                            Creating a backup protects book, borrower, transaction, fine, and account records.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={createBackup}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                    >
                        <FaDownload />
                        Create Backup
                    </button>
                </section>

                {/* Restore Backup */}
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl text-amber-700">
                            <FaUpload />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Restore Database
                            </h2>

                            <p className="mt-2 leading-6 text-slate-500">
                                Restore system records using a previously generated SQL backup file.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Select Backup File
                        </label>

                        <input
                            type="file"
                            accept=".sql,.zip"
                            onChange={(e) =>
                                setSelectedFile(e.target.files[0] || null)
                            }
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-200"
                        />

                        {selectedFile && (
                            <p className="mt-3 text-sm text-slate-500">
                                Selected file:{" "}
                                <span className="font-semibold text-slate-800">
                                    {selectedFile.name}
                                </span>
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (!selectedFile) {
                                alert("Please select a backup file first.");
                                return;
                            }

                            setShowRestoreModal(true);
                        }}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600"
                    >
                        <FaUpload />
                        Restore Database
                    </button>
                </section>
            </div>

            {/* Warning */}
            <section className="mt-6 flex gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="mt-1 text-red-600">
                    <FaExclamationTriangle />
                </div>

                <div>
                    <h2 className="font-bold text-red-800">
                        Restore operation warning
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-red-700">
                        Restoring a backup may replace current system records. Always create a new backup before continuing.
                    </p>
                </div>
            </section>

            {/* Backup History */}
            <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                        <FaHistory />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Backup History
                        </h2>

                        <p className="text-sm text-slate-500">
                            {backups.length} backup record
                            {backups.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Backup File
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Created At
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Size
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Type
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {backups.map((backup) => (
                                <tr
                                    key={backup.id}
                                    className="border-t border-slate-100 transition hover:bg-blue-50/40"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                <FaDatabase />
                                            </div>

                                            <p className="font-semibold text-slate-900">
                                                {backup.fileName}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {backup.createdAt}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {backup.size}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {backup.type}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            <FaCheckCircle />
                                            {backup.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Restore Confirmation Modal */}
            {showRestoreModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 text-white">
                            <p className="text-xs font-semibold uppercase tracking-wider text-red-100">
                                Critical System Action
                            </p>

                            <h2 className="mt-1 text-xl font-bold">
                                Confirm Database Restore
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="flex gap-4 rounded-xl border border-red-100 bg-red-50 p-4">
                                <FaExclamationTriangle className="mt-1 shrink-0 text-red-600" />

                                <p className="text-sm leading-6 text-red-700">
                                    This operation may replace the current database contents using{" "}
                                    <strong>{selectedFile?.name}</strong>.
                                </p>
                            </div>

                            <p className="mt-5 text-sm leading-6 text-slate-500">
                                Confirm only when the selected file is a valid backup created for this system.
                            </p>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRestoreModal(false)}
                                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleRestore}
                                    className="flex-[1.4] rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
                                >
                                    Confirm Restore
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default Backup;