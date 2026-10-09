import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaBookOpen, FaClock, FaCheckCircle, FaExclamationCircle, FaArrowRight } from "react-icons/fa";
import BorrowerLayout from "../../layouts/BorrowerLayout";
import apiRequest from "../../services/api";

export default function BorrowerDashboard() {
  const navigate = useNavigate();
  const [borrowings, setBorrowings] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("currentUser") || "null"); }
    catch { return null; }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      const results = await Promise.allSettled([
        apiRequest("/borrowings/me"),
        apiRequest("/books/search"),
      ]);
      if (!active) return;
      if (results[0].status === "fulfilled") {
        setBorrowings(Array.isArray(results[0].value?.data) ? results[0].value.data : []);
      }
      if (results[1].status === "fulfilled") {
        setBooks(Array.isArray(results[1].value?.data) ? results[1].value.data : []);
      }
      if (results.some((result) => result.status === "rejected")) {
        setError("Some dashboard information could not be loaded. Please try again later.");
      }
      setLoading(false);
    };
    load();
    return () => { active = false; };
  }, []);

  const today = Date.now();
  const isOverdue = (item) => {
    const status = String(item.status || "").toLowerCase();
    if (status === "overdue") return true;
    if (status !== "borrowed" || !item.due_at) return false;
    const due = new Date(item.due_at).getTime();
    return Number.isFinite(due) && due < today;
  };
  const counts = {
    borrowed: borrowings.filter((item) => String(item.status).toLowerCase() === "borrowed").length,
    pending: borrowings.filter((item) => ["pending", "requested", "request_pending"].includes(String(item.status).toLowerCase())).length,
    returned: borrowings.filter((item) => String(item.status).toLowerCase() === "returned").length,
    overdue: borrowings.filter(isOverdue).length,
  };
  const stats = [
    { label: "Borrowed Books", value: counts.borrowed, icon: FaBookOpen, color: "text-blue-600" },
    { label: "Pending Requests", value: counts.pending, icon: FaClock, color: "text-amber-500" },
    { label: "Books Returned", value: counts.returned, icon: FaCheckCircle, color: "text-emerald-600" },
    { label: "Overdue Books", value: counts.overdue, icon: FaExclamationCircle, color: "text-red-500" },
  ];
  const featuredBooks = books.filter((book) => Number(book.available_copies || 0) > 0).slice(0, 4);

  return (
    <BorrowerLayout>
      <div className="mx-auto max-w-6xl pb-5">
        <div className="mb-5 sm:mb-7">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0F4C97]">Borrower Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back, {currentUser?.firstName || "Borrower"}!</h1>
        </div>

        {error && <div role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <Icon className={`mb-3 text-lg ${color}`} aria-hidden="true" />
              <p className="text-2xl font-bold tabular-nums text-slate-900">{loading ? "—" : String(value).padStart(2, "0")}</p>
              <p className="mt-2 text-xs font-medium text-slate-600 sm:text-sm">{label}</p>
            </div>
          ))}
        </div>

        <section className="mt-7 sm:mt-9">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Browse Books</h2>
            <button type="button" onClick={() => navigate("/borrower/books")} className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#0F4C97] hover:text-blue-800">
              View All <FaArrowRight className="text-xs" />
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading available books...</div>
          ) : featuredBooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <FaBook className="mx-auto mb-2 text-2xl text-slate-300" />
              <p className="font-semibold text-slate-700">No available books to display</p>
              <p className="mt-1 text-sm text-slate-500">Visit the catalog to explore all library books.</p>
              <button type="button" onClick={() => navigate("/borrower/books")} className="mt-3 text-sm font-semibold text-[#0F4C97]">Open Catalog →</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {featuredBooks.map((book) => (
                <button key={book.id} type="button" onClick={() => navigate("/borrower/books")} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-2.5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md sm:p-3">
                  <div className="flex aspect-[5/4] items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {book.cover_image_url ? (
                      <img src={book.cover_image_url} alt={`Cover of ${book.title}`} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <FaBookOpen className="text-4xl text-slate-400" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 text-slate-900">{book.title || "Untitled Book"}</h3>
                  <p className="mt-1 text-xs font-medium text-emerald-600">Available</p>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </BorrowerLayout>
  );
}
