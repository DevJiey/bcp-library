import { useState } from "react";
import {
    Navigate,
    useNavigate,
} from "react-router-dom";
import {
    FaLock,
    FaSpinner,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

import logo from "../../assets/bcp-logo.png";
import apiRequest from "../../services/api";

function ChangePassword() {
    const navigate = useNavigate();

    const token =
        localStorage.getItem("token");

    const storedUser =
        localStorage.getItem(
            "currentUser"
        );

    if (!token || !storedUser) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setError(
                "Please complete all password fields."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(
                "New passwords do not match."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            await apiRequest(
                "/auth/change-password",
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );

            const storedUser =
                localStorage.getItem(
                    "currentUser"
                );

            const user = storedUser
                ? JSON.parse(storedUser)
                : null;

            if (!user) {
                localStorage.clear();
                navigate("/", {
                    replace: true,
                });
                return;
            }

            const updatedUser = {
                ...user,
                isFirstLogin: false,
            };

            localStorage.setItem(
                "currentUser",
                JSON.stringify(updatedUser)
            );

            if (user.role === "admin") {
                navigate(
                    "/admin/dashboard",
                    {
                        replace: true,
                    }
                );
                return;
            }

            if (user.role === "staff") {
                navigate(
                    "/staff/dashboard",
                    {
                        replace: true,
                    }
                );
                return;
            }

            if (user.role === "borrower") {
                navigate(
                    "/borrower/dashboard",
                    {
                        replace: true,
                    }
                );
                return;
            }

            localStorage.clear();

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            setError(
                error.message ||
                "Failed to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <div className="text-center">
                    <img
                        src={logo}
                        alt="BCP Logo"
                        className="w-20 mx-auto mb-5"
                    />

                    <h1 className="text-2xl font-bold text-blue-900">
                        Change Your Password
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm">
                        For security, please create a new password before continuing.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >
                    <div>
                        <label className="text-sm font-medium">
                            Current Password
                        </label>

                        <div className="flex items-center border border-gray-300 rounded-xl mt-2 px-3">
                            <FaLock className="text-gray-400" />

                            <input
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                value={currentPassword}
                                onChange={(event) => {
                                    setCurrentPassword(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                                autoComplete="current-password"
                                disabled={loading}
                                className="w-full p-3 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        (current) => !current
                                    )
                                }
                                className="p-2 text-gray-400 hover:text-blue-700 transition"
                                aria-label={
                                    showCurrentPassword
                                        ? "Hide current password"
                                        : "Show current password"
                                }
                            >
                                {showCurrentPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            New Password
                        </label>

                        <div className="flex items-center border border-gray-300 rounded-xl mt-2 px-3">
                            <FaLock className="text-gray-400" />

                            <input
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={newPassword}
                                onChange={(event) => {
                                    setNewPassword(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                                autoComplete="new-password"
                                disabled={loading}
                                className="w-full p-3 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(
                                        (current) => !current
                                    )
                                }
                                className="p-2 text-gray-400 hover:text-blue-700 transition"
                                aria-label={
                                    showNewPassword
                                        ? "Hide new password"
                                        : "Show new password"
                                }
                            >
                                {showNewPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 mt-2">
                            Minimum 8 characters with uppercase,
                            lowercase, and a number.
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Confirm New Password
                        </label>

                        <div className="flex items-center border border-gray-300 rounded-xl mt-2 px-3">
                            <FaLock className="text-gray-400" />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(event) => {
                                    setConfirmPassword(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                                autoComplete="new-password"
                                disabled={loading}
                                className="w-full p-3 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (current) => !current
                                    )
                                }
                                className="p-2 text-gray-400 hover:text-blue-700 transition"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-[#0F4C97] hover:bg-blue-800 text-white p-4 rounded-xl font-semibold transition disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Changing Password...
                            </>
                        ) : (
                            "Change Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;