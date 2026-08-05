import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";

import {
    FaBars,
    FaChevronDown,
    FaCog,
    FaSignOutAlt,
    FaUser,
} from "react-icons/fa";

function Navbar({
    name = "Ronald Jay Cruz",
    email = "ronald.cruz@bcp.edu.ph",
    role = "Borrower",
    profilePath = "/borrower/profile",
    settingsPath = null,
    onMenuClick,
}) {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const initials = name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        setShowLogoutModal(false);
        setShowProfileMenu(false);
        navigate("/");
    };

    return (
        <>
            <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
                {/* Left Side */}
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
                        aria-label="Open navigation menu"
                    >
                        <FaBars />
                    </button>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            BCP Library Management System
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            {role} Portal
                        </p>
                    </div>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() =>
                            setShowProfileMenu(!showProfileMenu)
                        }
                        className="flex items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-slate-100 sm:px-3"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F4C97] text-sm font-bold text-white">
                            {initials}
                        </div>

                        <div className="hidden sm:block">
                            <p className="max-w-44 truncate text-sm font-semibold text-slate-900">
                                {name}
                            </p>

                            <p className="max-w-44 truncate text-xs text-slate-400">
                                {email}
                            </p>
                        </div>

                        <FaChevronDown
                            className={`hidden text-xs text-slate-400 transition-transform sm:block ${showProfileMenu ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
                            <div className="border-b border-slate-100 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                        {initials}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-900">
                                            {name}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-slate-400">
                                            {email}
                                        </p>

                                        <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2">
                                {profilePath && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate(profilePath);
                                            setShowProfileMenu(false);
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        <FaUser />
                                        My Profile
                                    </button>
                                )}

                                {settingsPath && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate(settingsPath);
                                            setShowProfileMenu(false);
                                        }}
                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        <FaCog />
                                        System Settings
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        setShowLogoutModal(true);
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                >
                                    <FaSignOutAlt />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <ConfirmDialog
                open={showLogoutModal}
                title="Confirm Logout"
                message="Are you sure you want to sign out of the BCP Library Management System?"
                icon={<FaSignOutAlt />}
                confirmText="Yes, Logout"
                confirmColor="bg-red-600 hover:bg-red-700"
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutModal(false)}
            />
        </>
    );
}

export default Navbar;