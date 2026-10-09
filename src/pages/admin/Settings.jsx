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
            <div className="mb-5 sm:mb-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 sm:text-sm">System Configuration</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">System Settings</h1>
                <p className="mt-1 text-sm text-slate-500">Manage library borrowing rules.</p>
            </div>

            {error && (
                <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            {loading ? (
                <div className="rounded-2xl bg-white px-5 py-14 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">Loading library settings...</div>
            ) : (
                <div className="space-y-4 pb-24 lg:space-y-6 lg:pb-0">
                    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><FaBookReader /></div>
                            <div className="min-w-0">
                                <h2 className="font-bold text-slate-900 sm:text-lg">Borrowing Limits</h2>
                                <p className="text-xs text-slate-500 sm:text-sm">Maximum active books per borrower</p>
                            </div>
                        </div>
                        <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-2">
                            <SettingField icon={<FaGraduationCap />} label="Student Borrow Limit" name="studentBorrowLimit" value={settings.studentBorrowLimit} onChange={handleChange} min="1" max="20" suffix="books" description="Maximum active borrowings allowed for a student." />
                            <SettingField icon={<FaChalkboardTeacher />} label="Faculty Borrow Limit" name="facultyBorrowLimit" value={settings.facultyBorrowLimit} onChange={handleChange} min="1" max="20" suffix="books" description="Maximum active borrowings allowed for a faculty member." />
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><FaClock /></div>
                            <div className="min-w-0">
                                <h2 className="font-bold text-slate-900 sm:text-lg">Borrowing Period</h2>
                                <p className="text-xs text-slate-500 sm:text-sm">Default due-date calculation</p>
                            </div>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="max-w-xl">
                                <SettingField icon={<FaClock />} label="Borrowing Period" name="borrowingPeriodDays" value={settings.borrowingPeriodDays} onChange={handleChange} min="1" max="30" suffix="days" description="Used to calculate the due date when staff approves a borrow request." />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
                        <div className="flex gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><FaCog /></div>
                            <div>
                                <h3 className="font-semibold text-blue-900">Automatic Library Rules</h3>
                                <p className="mt-1 text-xs leading-5 text-blue-800 sm:text-sm sm:leading-6">Borrow limits are checked when requests are submitted. The borrowing period determines due dates when staff approves requests.</p>
                            </div>
                        </div>
                    </section>

                    <div className="hidden justify-end lg:flex">
                        <button type="button" disabled={saving} onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-[#0F4C97] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                            <FaSave />{saving ? "Saving..." : "Save System Settings"}
                        </button>
                    </div>

                    {/* Positioned below AI Assistant and above the bottom navigation */}
                    <button type="button" disabled={saving} onClick={handleSave} aria-label={saving ? "Saving settings" : "Save system settings"} title="Save System Settings" className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4C97] text-xl text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 lg:hidden">
                        <FaSave />
                    </button>
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