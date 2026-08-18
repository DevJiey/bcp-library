import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";

import {
  FaBars,
  FaBell,
  FaChevronDown,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaArrowRight,
} from "react-icons/fa";

function Navbar({
  name = "Ronald Jay Cruz",
  email = "ronald.cruz@bcp.edu.ph",
  role = "Borrower",
  profilePath = "/borrower/profile",
  settingsPath = null,
  notificationsPath = null,
  notifications = [],
  onMenuClick,
}) {
  const navigate = useNavigate();

  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }

      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
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
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");

    setShowLogoutModal(false);
    setShowProfileMenu(false);
    setShowNotifications(false);

    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
        {/* Left side */}
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
            <h1 className="font-semibold">
              Dashboard
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              {role} Portal
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notification dropdown */}
          {notificationsPath && (
            <div
              className="relative"
              ref={notificationDropdownRef}
            >
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-blue-700"
                aria-label="Open notifications"
              >
                <FaBell />

                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="fixed left-4 right-4 top-[4.75rem] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-96">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                      <h2 className="font-bold text-slate-900">
                        Notifications
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        {unreadCount} unread notification
                        {unreadCount !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <FaBell />
                    </div>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto p-2">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => {
                            navigate(notificationsPath);
                            setShowNotifications(false);
                          }}
                          className={`flex w-full gap-3 rounded-xl p-3 text-left transition hover:bg-blue-50 ${!notification.is_read
                            ? "bg-blue-50/70"
                            : ""
                            }`}
                        >
                          <div
                            className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${!notification.is_read
                                ? "bg-blue-600"
                                : "bg-slate-300"
                              }`}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900">
                              {notification.title}
                            </p>

                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                              {notification.message}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                              {notification.date}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-10 text-center">
                        <FaBell className="mx-auto text-2xl text-slate-300" />

                        <p className="mt-3 font-semibold text-slate-700">
                          No notifications
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          You are all caught up.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigate(notificationsPath);
                      setShowNotifications(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-4 py-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    View all notifications
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Profile dropdown */}
          <div
            className="relative"
            ref={profileDropdownRef}
          >
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
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