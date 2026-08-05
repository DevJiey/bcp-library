import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import logo from "../../assets/bcp-logo.png";

function Login() {
    const navigate = useNavigate();

    const [role, setRole] = useState("borrower");

    const handleLogin = () => {
        localStorage.setItem("userRole", role);
        if (role === "borrower") navigate("/borrower/dashboard");
        if (role === "staff") navigate("/staff/dashboard");
        if (role === "admin") navigate("/admin/dashboard");
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">

            {/* LEFT */}

            <div className="relative hidden lg:flex overflow-hidden bg-[#0F4C97] items-center justify-center flex-col gap-5 p-10">

                {/* Background circles */}
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-800/40"></div>

                <div className="absolute top-40 right-[-120px] w-80 h-80 rounded-full bg-blue-700/30"></div>

                <div className="absolute bottom-[-120px] left-40 w-96 h-96 rounded-full bg-blue-900/30"></div>

                <div className="relative z-10 text-white w-full max-w-xl px-6">
                    <h1 className="text-5xl font-bold leading-tight">
                        <span className="whitespace-nowrap">
                            Library Management
                        </span>
                        <br />
                        <span>System</span>
                    </h1>
                </div>

            </div>

            {/* RIGHT */}

            <div className="bg-white flex items-center justify-center">

                <div className="w-full max-w-md p-10">

                    <div className="text-center">

                        {/* LOGO */}

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

                    <div className="mt-8 space-y-5">

                        <div>

                            <label className="text-sm font-medium">
                                Username
                            </label>

                            <div className="flex items-center border border-gray-300 rounded-xl mt-2 px-3 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">

                                <FaUser className="text-gray-400" />

                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    className="w-full p-3 outline-none"
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
                                    placeholder="Enter password"
                                    className="w-full p-3 outline-none"
                                />

                            </div>

                        </div>

                        <div>

                            <label className="text-sm font-medium">
                                Login As
                            </label>

                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl p-3 mt-2 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            >

                                <option value="borrower">
                                    Borrower
                                </option>

                                <option value="staff">
                                    Staff
                                </option>

                                <option value="admin">
                                    Admin
                                </option>

                            </select>

                        </div>

                        <button
                            onClick={handleLogin}
                            className="w-full bg-gradient-to-r from-[#0F4C97] to-blue-700 hover:from-blue-800 hover:to-blue-600 active:scale-[0.99] transition-all duration-200 text-white p-4 rounded-xl font-semibold shadow-lg shadow-blue-900/20"
                        >
                            Sign In
                        </button>
                        <p className="mt-8 text-center text-xs text-gray-400">
                            © 2026 Bestlink College of the Philippines
                            <br />
                            BCP Library Management System
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;