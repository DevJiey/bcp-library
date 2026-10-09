import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaClipboardCheck, FaClock, FaExclamationTriangle, FaArrowRight, FaCalendarAlt, FaHistory } from "react-icons/fa";
import StaffLayout from "../../layouts/StaffLayout";
import apiRequest from "../../services/api";

const asArray = (response) => Array.isArray(response?.data) ? response.data : [];
const lower = (value) => String(value ?? "").toLowerCase();
const dateText = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
};

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("currentUser") || "{}"); }
    catch { return {}; }
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [requestResponse, copyResponse] = await Promise.all([
          apiRequest("/staff/borrow-requests"),
          apiRequest("/book-copies"),
        ]);
        if (active) {
          setRequests(asArray(requestResponse));
          setCopies(asArray(copyResponse));
          setError("");
        }
      } catch (err) {
        if (active) setError(err?.message || "Unable to load staff dashboard.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const pending = requests.filter((request) => !request.status || lower(request.status) === "pending");
  const borrowed = copies.filter((copy) => lower(copy.status) === "borrowed");
  // Book-copy records do not establish due dates or an overdue count.
  // Do not fabricate overdue statistics from copy status alone.
  const stats = [
    { title: "Total Book Copies", value: copies.length, icon: <FaBookOpen />, style: "bg-blue-100 text-blue-700", path: "/staff/books" },
    { title: "Pending Requests", value: pending.length, icon: <FaClipboardCheck />, style: "bg-amber-100 text-amber-700", path: "/staff/requests" },
    { title: "Currently Borrowed", value: borrowed.length, icon: <FaBookOpen />, style: "bg-violet-100 text-violet-700", path: "/staff/returns" },
    { title: "Overdue Books", value: "—", icon: <FaExclamationTriangle />, style: "bg-rose-100 text-rose-700", path: "/staff/returns", description: "Requires borrowing due-date data" },
  ];
  const recent = [...requests].sort((a, b) => new Date(b.created_at || b.requested_at || 0) - new Date(a.created_at || a.requested_at || 0)).slice(0, 4);

  return (
    <StaffLayout>
      <div className="mx-auto max-w-7xl space-y-5 pb-24 lg:space-y-7 lg:pb-8">
        <header>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0F4C97]">Staff Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back, {currentUser?.firstName || "Librarian"}!</h1>
          <p className="mt-1 text-sm text-slate-500">Library operations overview</p>
        </header>
        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <section aria-label="Library statistics" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map((stat) => (
            <button key={stat.title} type="button" onClick={() => navigate(stat.path)} className="rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-5">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.style}`}>{stat.icon}</span>
              <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{loading ? "—" : stat.value}</p>
              <p className="mt-1 text-xs font-semibold leading-snug text-slate-600 sm:text-sm">{stat.title}</p>
              {stat.description && <p className="mt-1 text-[10px] leading-snug text-slate-400">{stat.description}</p>}
            </button>
          ))}
        </section>
        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div><h2 className="flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg"><FaHistory className="text-[#0F4C97]" /> Recent Request Activity</h2><p className="mt-1 text-xs text-slate-500">Latest borrowing requests received by staff</p></div>
              <button type="button" onClick={() => navigate("/staff/requests")} className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0F4C97]">View All <FaArrowRight /></button>
            </div>
            {loading ? <p className="py-8 text-center text-sm text-slate-400">Loading activity...</p> : recent.length === 0 ? <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">No recent requests.</p> : (
              <div className="space-y-3">{recent.map((request, index) => (
                <div key={request.id ?? index} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0F4C97]"><FaBookOpen /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{request.title || request.book_title || "Book request"}</p><p className="mt-0.5 truncate text-xs text-slate-500">{request.borrower_name || [request.first_name, request.last_name].filter(Boolean).join(" ") || request.school_id || "Borrower"}</p><p className="mt-1 text-xs text-slate-400">{dateText(request.created_at || request.requested_at)}</p></div>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold capitalize text-[#0F4C97]">{request.status || "Pending"}</span>
                </div>
              ))}</div>
            )}
          </section>
          <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2"><div><h2 className="flex items-center gap-2 text-base font-bold text-slate-900 sm:text-lg"><FaCalendarAlt className="text-[#0F4C97]" /> Books Due Soon</h2><p className="mt-1 text-xs text-slate-500">Upcoming returns</p></div><button type="button" onClick={() => navigate("/staff/returns")} className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0F4C97]">Returns <FaArrowRight /></button></div>
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center"><FaClock className="mx-auto text-2xl text-[#0F4C97]" /><p className="mt-3 text-sm font-semibold text-slate-700">Due-date information not available yet</p><p className="mt-2 text-xs leading-5 text-slate-500">The current staff dashboard APIs provide book-copy status and borrowing requests, but not a confirmed list of active loans with due dates. This section will show upcoming returns once a permitted due-date endpoint is connected.</p></div>
          </section>
        </div>
      </div>
    </StaffLayout>
  );
}
