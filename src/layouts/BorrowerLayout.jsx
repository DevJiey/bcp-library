import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import PortalLayout from "./PortalLayout";
import ConfirmDialog from "../components/ConfirmDialog";
import apiRequest from "../services/api";
import { FaHome, FaBook, FaClipboardList, FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";

const tabs = [
  { label: "Home", path: "/borrower/dashboard", icon: FaHome },
  { label: "Catalog", path: "/borrower/books", icon: FaBook },
  { label: "My Books", path: "/borrower/borrowings", icon: FaClipboardList },
  { label: "Profile", path: "/borrower/profile", icon: FaUser },
];

function BorrowerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  } catch {
    currentUser = {};
  }

  const fullName = [currentUser.firstName, currentUser.middleName, currentUser.lastName]
    .filter(Boolean).join(" ");

  useEffect(() => {
    let active = true;
    async function loadNotifications() {
      try {
        const response = await apiRequest("/notifications/me");
        if (active) setNotifications(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to load navbar notifications:", error);
        if (active) setNotifications([]);
      }
    }
    loadNotifications();
    return () => { active = false; };
  }, [location.pathname]);


  const unreadCount = notifications.filter((notification) => !notification.is_read).length;
  const links = [
    { label: "Dashboard", path: "/borrower/dashboard", icon: <FaHome /> },
    { label: "Books", path: "/borrower/books", icon: <FaBook /> },
    { label: "Borrowings", path: "/borrower/borrowings", icon: <FaClipboardList /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("currentUser");
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <>
      <PortalLayout
        links={links}
        role="Borrower"
        mobileBottomNav
        navbarProps={{
          name: fullName || "Library Borrower",
          email: currentUser.email || currentUser.schoolId || "",
          role: currentUser.borrowerType === "faculty" ? "Faculty" : "Student",
          profilePath: "/borrower/profile",
          notificationsPath: "/borrower/notifications",
          notifications,
        }}
      >
        <div className="relative pb-24 lg:pb-0">
          {/* The shared PortalLayout already renders the centered BCP logo on mobile. */}
          <button
            type="button"
            aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
            onClick={() => navigate("/borrower/notifications")}
            className="fixed right-4 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full text-[#0F4C97] hover:bg-blue-50 lg:hidden"
          >
            <FaBell className="text-lg" />
            {unreadCount > 0 && (
              <span className="absolute right-0 top-0 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {children}
        </div>
      </PortalLayout>

      <nav aria-label="Borrower mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto flex max-w-xl items-center justify-around px-1 py-2">
          {tabs.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition ${isActive ? "bg-blue-50 text-[#0F4C97]" : "text-slate-500 hover:text-[#0F4C97]"}`}>
              <Icon className="text-lg" />
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
          <button type="button" onClick={() => setShowLogoutModal(true)} aria-label="Logout" className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold text-red-600 transition hover:bg-red-50">
            <FaSignOutAlt className="text-lg" /><span>Logout</span>
          </button>
        </div>
      </nav>

      <ConfirmDialog open={showLogoutModal} title="Confirm Logout" message="Are you sure you want to sign out of the BCP Library Management System?" icon={<FaSignOutAlt />} confirmText="Yes, Logout" confirmColor="bg-red-600 hover:bg-red-700" onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />
    </>
  );
}

export default BorrowerLayout;
