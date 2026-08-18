import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUser,
    FaLock,
    FaSpinner,
} from "react-icons/fa";

import logo from "../../assets/bcp-logo.png";
import apiRequest from "../../services/api";

function Login() {
    const navigate = useNavigate();

    const [schoolId, setSchoolId] =
        useState("");
    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);
    const [error, setError] =
        useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        if (
            !schoolId.trim() ||
            !password
        ) {
            setError(
                "Please enter your School ID and password."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await apiRequest(
                    "/auth/login",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            schoolId:
                                schoolId.trim(),
                            password,
                        }),
                    }
                );

            const {
                token,
                user,
            } = response.data;

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "userRole",
                user.role
            );

            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );

            if (
                user.role === "admin"
            ) {
                navigate(
                    "/admin/dashboard",
                    {
                        replace: true,
                    }
                );
                return;
            }

            if (
                user.role === "staff"
            ) {
                navigate(
                    "/staff/dashboard",
                    {
                        replace: true,
                    }
                );
                return;
            }

            if (
                user.role === "borrower"
            ) {
                navigate(
                    "/borrower/dashboard",
                    {
                        replace: true,
                    }
                );
                return;
            }

            localStorage.removeItem(
                "token"
            );
            localStorage.removeItem(
                "userRole"
            );
            localStorage.removeItem(
                "currentUser"
            );

            setError(
                "Your account role is not supported."
            );
        } catch (error) {
            setError(
                error.message ||
                "Login failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">

            {/* LEFT */}
            <div className="relative hidden lg:flex overflow-hidden bg-[#0F4C97] items-center justify-center flex-col gap-5 p-10">

                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-800/40"></div>

                <div className="absolute top-40 right-[-120px] w-80 h-80 rounded-full bg-blue-700/30"></div>

                <div className="absolute bottom-[-120px] left-40 w-96 h-96 rounded-full bg-blue-900/30"></div>

                <div className="relative z-10 text-white w-full max-w-xl px-6">
                    <h1 className="text-5xl font-bold leading-tight">
                        <span className="whitespace-nowrap">
                            Library Management
                        </span>

                        <br />

                        <span>
                            System
                        </span>
                    </h1>
                </div>

            </div>

            {/* RIGHT */}
            <div className="bg-white flex items-center justify-center">

                <div className="w-full max-w-md p-10">

                    <div className="text-center">

                        <img
                            src={logo}
                            alt="BCP Logo"
                            className="w-20 mx-auto mb-5"
                        />

                        <h1 className="text-3xl font-bold text-blue-900 mt-4">
                            Welcome Back
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Sign in to continue
                        </p>

                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="mt-8 space-y-5"
                    >

                        <div>
                            <label className="text-sm font-medium">
                                School ID
                            </label>

                            <div className="flex items-center border border-gray-300 rounded-xl mt-2 px-3 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">

                                <FaUser className="text-gray-400" />

                                <input
                                    type="text"
                                    value={schoolId}
                                    onChange={(event) => {
                                        setSchoolId(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    placeholder="Enter School ID"
                                    autoComplete="username"
                                    disabled={loading}
                                    className="w-full p-3 outline-none disabled:bg-transparent"
                                />

                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Password
                            </label>

                            <div className="flex items-center border border-gray-300 rounded-xl mt-2 px-3 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">

                                <FaLock className="text-gray-400" />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(
                                            event.target.value
                                        );
                                        setError("");
                                    }}
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    className="w-full p-3 outline-none disabled:bg-transparent"
                                />

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
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0F4C97] to-blue-700 hover:from-blue-800 hover:to-blue-600 active:scale-[0.99] transition-all duration-200 text-white p-4 rounded-xl font-semibold shadow-lg shadow-blue-900/20 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <p className="mt-8 text-center text-xs text-gray-400">
                            © 2026 Bestlink College of the Philippines
                            <br />
                            BCP Library Management System
                        </p>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Login;