import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
    FaCog,
    FaMoneyBillWave,
    FaClock,
    FaBookReader,
    FaUniversity,
    FaSave,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

function Settings() {
    const { showToast } = useToast();
    const [settings, setSettings] = useState({
        fineRate: 5,
        studentBorrowLimit: 3,
        facultyBorrowLimit: 5,
        studentBorrowDuration: 7,
        facultyBorrowDuration: 14,
        libraryName: "BCP Library",
        schoolName: "Bestlink College of the Philippines",
        address: "Quezon City, Metro Manila",
        contactEmail: "library@bcp.edu.ph",
        contactNumber: "0912-345-6789",
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setSettings({
            ...settings,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    const handleSave = () => {
        if (settings.fineRate < 0) {
            showToast(
                "Fine rate cannot be negative.",
                "error"
            );
            return;
        }

        if (
            settings.studentBorrowLimit < 1 ||
            settings.facultyBorrowLimit < 1
        ) {
            showToast(
                "Borrow limit must be at least 1.",
                "error"
            );
            return;
        }

        if (
            settings.studentBorrowDuration < 1 ||
            settings.facultyBorrowDuration < 1
        ) {
            showToast(
                "Borrow duration must be at least 1 day.",
                "error"
            );
            return;
        }

        showToast(
            "System settings saved successfully.",
            "success"
        );
    };

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-5 sm:mb-8">
                <p className="text-sm font-semibold text-blue-700">
                    System Configuration
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    System Settings
                </h1>
            </div>

            <div className="space-y-6">
                {/* Fine Settings */}
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-700">
                            <FaMoneyBillWave />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Fine Settings
                            </h2>

                            <p className="text-sm text-slate-500">
                                Set the daily overdue fine amount.
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="max-w-md">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Fine Rate Per Overdue Day
                            </label>

                            <div className="flex items-center rounded-xl border border-slate-300 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                                <span className="border-r border-slate-200 px-4 font-semibold text-slate-500">
                                    ₱
                                </span>

                                <input
                                    type="number"
                                    name="fineRate"
                                    min="0"
                                    value={settings.fineRate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 outline-none"
                                />
                            </div>

                            <p className="mt-2 text-xs text-slate-400">
                                This amount will be charged for every overdue day.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Borrow Limits */}
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <FaBookReader />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Borrow Limits
                            </h2>

                            <p className="text-sm text-slate-500">
                                Set the maximum number of books per borrower type.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 p-6 md:grid-cols-2">
                        <SettingField
                            label="Student Borrow Limit"
                            name="studentBorrowLimit"
                            type="number"
                            min="1"
                            value={settings.studentBorrowLimit}
                            onChange={handleChange}
                            description="Maximum active books allowed for students."
                        />

                        <SettingField
                            label="Faculty Borrow Limit"
                            name="facultyBorrowLimit"
                            type="number"
                            min="1"
                            value={settings.facultyBorrowLimit}
                            onChange={handleChange}
                            description="Maximum active books allowed for faculty members."
                        />
                    </div>
                </section>

                {/* Borrow Duration */}
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <FaClock />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Borrow Duration
                            </h2>

                            <p className="text-sm text-slate-500">
                                Set how many days each borrower type may keep a book.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 p-6 md:grid-cols-2">
                        <SettingField
                            label="Student Borrow Duration"
                            name="studentBorrowDuration"
                            type="number"
                            min="1"
                            value={settings.studentBorrowDuration}
                            onChange={handleChange}
                            description="Number of borrowing days for students."
                            suffix="days"
                        />

                        <SettingField
                            label="Faculty Borrow Duration"
                            name="facultyBorrowDuration"
                            type="number"
                            min="1"
                            value={settings.facultyBorrowDuration}
                            onChange={handleChange}
                            description="Number of borrowing days for faculty members."
                            suffix="days"
                        />
                    </div>
                </section>

                {/* Library Information */}
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                            <FaUniversity />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Library Information
                            </h2>

                            <p className="text-sm text-slate-500">
                                Maintain the information displayed across the library system.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 p-6 md:grid-cols-2">
                        <SettingField
                            label="Library Name"
                            name="libraryName"
                            value={settings.libraryName}
                            onChange={handleChange}
                        />

                        <SettingField
                            label="School Name"
                            name="schoolName"
                            value={settings.schoolName}
                            onChange={handleChange}
                        />

                        <SettingField
                            label="Contact Email"
                            name="contactEmail"
                            type="email"
                            value={settings.contactEmail}
                            onChange={handleChange}
                        />

                        <SettingField
                            label="Contact Number"
                            name="contactNumber"
                            value={settings.contactNumber}
                            onChange={handleChange}
                        />

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Library Address
                            </label>

                            <textarea
                                name="address"
                                value={settings.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>
                </section>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center gap-2 rounded-xl bg-[#0F4C97] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800"
                    >
                        <FaSave />
                        Save System Settings
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}

function SettingField({
    label,
    name,
    value,
    onChange,
    type = "text",
    min,
    description,
    suffix,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <div className="flex items-center rounded-xl border border-slate-300 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                <input
                    type={type}
                    name={name}
                    min={min}
                    value={value}
                    onChange={onChange}
                    className="w-full rounded-xl px-4 py-3 outline-none"
                />

                {suffix && (
                    <span className="border-l border-slate-200 px-4 text-sm font-medium text-slate-500">
                        {suffix}
                    </span>
                )}
            </div>

            {description && (
                <p className="mt-2 text-xs text-slate-400">
                    {description}
                </p>
            )}
        </div>
    );
}

export default Settings;