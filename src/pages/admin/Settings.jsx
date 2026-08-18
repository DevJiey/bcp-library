import {
    useEffect,
    useState,
} from "react";

import {
    FaCog,
    FaClock,
    FaBookReader,
    FaSave,
    FaGraduationCap,
    FaChalkboardTeacher,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";

function Settings() {
    const { showToast } = useToast();

    const [settings, setSettings] =
        useState({
            studentBorrowLimit: "",
            facultyBorrowLimit: "",
            borrowingPeriodDays: "",
        });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadSettings = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await apiRequest(
                    "/settings"
                );

            const data =
                response?.data || [];

            const settingMap = {};

            data.forEach((setting) => {
                settingMap[
                    setting.setting_key
                ] =
                    setting.setting_value;
            });

            setSettings({
                studentBorrowLimit:
                    settingMap.student_borrow_limit ??
                    "",

                facultyBorrowLimit:
                    settingMap.faculty_borrow_limit ??
                    "",

                borrowingPeriodDays:
                    settingMap.borrowing_period_days ??
                    "",
            });
        } catch (err) {
            setError(
                err.message ||
                    "Failed to load library settings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setSettings(
            (current) => ({
                ...current,
                [name]: value,
            })
        );
    };

    const handleSave = async () => {
        const studentLimit =
            Number(
                settings.studentBorrowLimit
            );

        const facultyLimit =
            Number(
                settings.facultyBorrowLimit
            );

        const borrowingDays =
            Number(
                settings.borrowingPeriodDays
            );

        if (
            !Number.isInteger(
                studentLimit
            ) ||
            studentLimit < 1 ||
            studentLimit > 20
        ) {
            showToast(
                "Student borrow limit must be between 1 and 20.",
                "error"
            );

            return;
        }

        if (
            !Number.isInteger(
                facultyLimit
            ) ||
            facultyLimit < 1 ||
            facultyLimit > 20
        ) {
            showToast(
                "Faculty borrow limit must be between 1 and 20.",
                "error"
            );

            return;
        }

        if (
            !Number.isInteger(
                borrowingDays
            ) ||
            borrowingDays < 1 ||
            borrowingDays > 30
        ) {
            showToast(
                "Borrowing period must be between 1 and 30 days.",
                "error"
            );

            return;
        }

        try {
            setSaving(true);
            setError("");

            await Promise.all([
                apiRequest(
                    "/settings/student_borrow_limit",
                    {
                        method: "PATCH",

                        body: JSON.stringify({
                            settingValue:
                                studentLimit,
                        }),
                    }
                ),

                apiRequest(
                    "/settings/faculty_borrow_limit",
                    {
                        method: "PATCH",

                        body: JSON.stringify({
                            settingValue:
                                facultyLimit,
                        }),
                    }
                ),

                apiRequest(
                    "/settings/borrowing_period_days",
                    {
                        method: "PATCH",

                        body: JSON.stringify({
                            settingValue:
                                borrowingDays,
                        }),
                    }
                ),
            ]);

            showToast(
                "Library settings updated successfully!",
                "success"
            );

            await loadSettings();
        } catch (err) {
            const message =
                err.message ||
                "Failed to update library settings.";

            setError(message);

            showToast(
                message,
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            {/* HEADER */}
            <div className="mb-8">

                <p className="text-sm font-semibold text-blue-700">
                    System Configuration
                </p>

                <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    System Settings
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Configure the borrowing rules used by the library system.
                </p>

            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="rounded-2xl bg-white px-6 py-16 text-center text-sm text-slate-400 shadow-sm ring-1 ring-slate-200">
                    Loading library settings...
                </div>
            ) : (
                <div className="space-y-6">

                    {/* BORROW LIMITS */}
                    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                        <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <FaBookReader />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Borrowing Limits
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Maximum number of active books a borrower may have.
                                </p>
                            </div>

                        </div>

                        <div className="grid gap-5 p-6 md:grid-cols-2">

                            <SettingField
                                icon={
                                    <FaGraduationCap />
                                }
                                label="Student Borrow Limit"
                                name="studentBorrowLimit"
                                value={
                                    settings.studentBorrowLimit
                                }
                                onChange={
                                    handleChange
                                }
                                min="1"
                                max="20"
                                suffix="books"
                                description="Maximum active borrowings allowed for a student."
                            />

                            <SettingField
                                icon={
                                    <FaChalkboardTeacher />
                                }
                                label="Faculty Borrow Limit"
                                name="facultyBorrowLimit"
                                value={
                                    settings.facultyBorrowLimit
                                }
                                onChange={
                                    handleChange
                                }
                                min="1"
                                max="20"
                                suffix="books"
                                description="Maximum active borrowings allowed for a faculty member."
                            />

                        </div>

                    </section>

                    {/* BORROWING PERIOD */}
                    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                        <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                <FaClock />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Borrowing Period
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Default number of days before a borrowed book becomes due.
                                </p>
                            </div>

                        </div>

                        <div className="p-6">

                            <div className="max-w-xl">

                                <SettingField
                                    icon={
                                        <FaClock />
                                    }
                                    label="Borrowing Period"
                                    name="borrowingPeriodDays"
                                    value={
                                        settings.borrowingPeriodDays
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="1"
                                    max="30"
                                    suffix="days"
                                    description="Applied when staff approves a borrow request and the system calculates the due date."
                                />

                            </div>

                        </div>

                    </section>

                    {/* INFO */}
                    <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

                        <div className="flex gap-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <FaCog />
                            </div>

                            <div>
                                <h3 className="font-semibold text-blue-900">
                                    Automatic Library Rules
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-blue-700">
                                    These values are used directly by the borrowing process.
                                    Borrow limits are checked when borrowers submit requests,
                                    while the borrowing period is used to calculate due dates
                                    when staff approves a request.
                                </p>
                            </div>

                        </div>

                    </section>

                    {/* SAVE */}
                    <div className="flex justify-end">

                        <button
                            type="button"
                            disabled={
                                saving
                            }
                            onClick={
                                handleSave
                            }
                            className="flex items-center gap-2 rounded-xl bg-[#0F4C97] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FaSave />

                            {saving
                                ? "Saving..."
                                : "Save System Settings"}
                        </button>

                    </div>

                </div>
            )}
        </AdminLayout>
    );
}

function SettingField({
    icon,
    label,
    name,
    value,
    onChange,
    min,
    max,
    description,
    suffix,
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <div className="flex items-center rounded-xl border border-slate-300 bg-white transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">

                {icon && (
                    <span className="pl-4 text-slate-400">
                        {icon}
                    </span>
                )}

                <input
                    type="number"
                    name={name}
                    min={min}
                    max={max}
                    value={value}
                    onChange={
                        onChange
                    }
                    className="w-full bg-transparent px-4 py-3 outline-none"
                />

                {suffix && (
                    <span className="border-l border-slate-200 px-4 text-sm font-medium text-slate-500">
                        {suffix}
                    </span>
                )}

            </div>

            {description && (
                <p className="mt-2 text-xs leading-5 text-slate-400">
                    {description}
                </p>
            )}

        </div>
    );
}

export default Settings;