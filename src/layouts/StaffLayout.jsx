import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import PortalLayout from "./PortalLayout";
import ConfirmDialog from "../components/ConfirmDialog";
import apiRequest from "../services/api";
import { FaHome, FaBook, FaUsers, FaClipboardCheck, FaUndo, FaBell, FaBars, FaSignOutAlt } from "react-icons/fa";

const tabs = [
  { label: "Home", path: "/staff/dashboard", icon: FaHome },
  { label: "Books", path: "/staff/books", icon: FaBook },
  { label: "Circulation", path: "/staff/requests", icon: FaClipboardCheck },
  { label: "Returns", path: "/staff/returns", icon: FaUndo },
];

export default function StaffLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  
  const [confirmLogout, setConfirmLogout] = useState(false);
  let user = {};
  try { user = JSON.parse(localStorage.getItem("currentUser") || "{}"); } catch { /* invalid local user */ }
  const name = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ") || "Library Staff";
  useEffect(() => {
    let alive = true;
    apiRequest("/notifications/me").then((result) => {
      if (alive) setNotifications(Array.isArray(result?.data) ? result.data : []);
    }).catch(() => { if (alive) setNotifications([]); });
    return () => { alive = false; };
  }, [location.pathname]);
  const unread = notifications.filter((n) => !n.is_read).length;
  const links = [
    { label: "Dashboard", path: "/staff/dashboard", icon: <FaHome /> },
    { label: "Library Books", path: "/staff/books", icon: <FaBook /> },
    { label: "Borrow Requests", path: "/staff/requests", icon: <FaClipboardCheck /> },
    { label: "Borrowers", path: "/staff/borrowers", icon: <FaUsers /> },
    { label: "Returns", path: "/staff/returns", icon: <FaUndo /> },
  ];
  const logout = () => {
    ["token", "userRole", "currentUser"].forEach((key) => localStorage.removeItem(key));
    setConfirmLogout(false);
    navigate("/");
  };
  return <>
    <PortalLayout links={links} role="Library Staff" mobileBottomNav navbarProps={{
      name, email: user.email || user.schoolId || "", role: "Library Staff",
      profilePath: null, notificationsPath: "/staff/notifications", notifications,
    }}>
      <div className="pb-24 lg:pb-0">
        <button type="button" aria-label={unread ? `${unread} unread notifications` : "Notifications"}
          onClick={() => navigate("/staff/notifications")}
          className="fixed right-4 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full text-[#0F4C97] hover:bg-blue-50 lg:hidden">
          <FaBell className="text-lg" />
          {unread > 0 && <span className="absolute right-0 top-0 rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}
        </button>
        {children}
      </div>
    </PortalLayout>
    <nav aria-label="Staff mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 shadow-lg backdrop-blur lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto flex max-w-xl justify-around px-1 py-2">
        {tabs.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} className={({isActive}) => `flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold ${isActive ? "bg-blue-50 text-[#0F4C97]" : "text-slate-500"}`}><Icon className="text-lg" />{label}</NavLink>)}
        <button type="button" onClick={() => setConfirmLogout(true)} className="flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold text-red-600"><FaSignOutAlt className="text-lg" />Logout</button>
      </div>
    </nav>
    <ConfirmDialog open={confirmLogout} title="Confirm Logout" message="Are you sure you want to sign out?" icon={<FaSignOutAlt />} confirmText="Yes, Logout" onConfirm={logout} onCancel={() => setConfirmLogout(false)} />
  </>;
}
