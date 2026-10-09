import { useEffect, useMemo, useState } from "react";
import { FaBookOpen, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import StaffLayout from "../../layouts/StaffLayout";
import apiRequest from "../../services/api";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    apiRequest("/books/search").then((res) => { if (active) setBooks(Array.isArray(res?.data) ? res.data : []); })
      .catch(() => { if (active) setError("Unable to load the book catalog."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const count = (b) => Number(b.available_copies ?? b.availableCopies ?? b.available_count ?? 0);
  const visible = useMemo(() => books.filter((b) => {
    const term = search.trim().toLowerCase();
    const matches = [b.title, b.author, b.isbn, b.category, b.author_name].some((v) => String(v || "").toLowerCase().includes(term));
    return matches && (filter === "all" || (filter === "available" ? count(b) > 0 : count(b) <= 0));
  }), [books, search, filter]);
  return <StaffLayout><div className="mx-auto max-w-6xl space-y-5">
    <div><h1 className="text-2xl font-bold text-slate-900">Library Books</h1><p className="text-sm text-slate-500">Browse the library collection and check book availability.</p></div>
    <div className="flex gap-2"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm"><FaSearch className="text-slate-400" /><input aria-label="Search books" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search books..." className="w-full min-w-0 bg-transparent text-sm outline-none" /></label><button type="button" onClick={() => setShowFilters((x) => !x)} aria-label="Filter books" className="rounded-xl border border-slate-200 bg-white px-4 text-[#0F4C97]"><FaFilter /></button></div>
    {showFilters && <div className="flex gap-2">{["all", "available", "unavailable"].map((value) => <button key={value} onClick={() => setFilter(value)} className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize ${filter === value ? "bg-[#0F4C97] text-white" : "bg-white text-slate-600"}`}>{value}</button>)}</div>}
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {loading ? <p className="text-slate-500">Loading books...</p> : visible.length === 0 ? <p className="rounded-xl bg-white p-6 text-center text-slate-500">No matching books found.</p> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visible.map((book, i) => <article key={book.id || book.book_id || i} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex h-28 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-50">{book.cover_image || book.coverImage ? <img src={book.cover_image || book.coverImage} alt="Book cover" className="h-full w-full object-cover" /> : <FaBookOpen className="text-3xl text-[#0F4C97]" />}</div><div className="min-w-0 flex-1"><h2 className="line-clamp-2 text-sm font-bold text-slate-900">{book.title || "Untitled"}</h2><p className="mt-1 truncate text-xs text-slate-500">{book.author_name || book.author || "Author not listed"}</p><p className={`mt-2 text-xs font-semibold ${count(book) > 0 ? "text-green-700" : "text-red-600"}`}>{count(book) > 0 ? `${count(book)} available` : "Unavailable"}</p><button type="button" onClick={() => setSelected(book)} className="mt-2 rounded-lg bg-[#0F4C97] px-3 py-2 text-xs font-semibold text-white">View Details</button></div></article>)}</div>}
    {selected && <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}><section role="dialog" aria-modal="true" aria-label="Book details" onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"><div className="flex justify-between gap-3"><h2 className="text-lg font-bold text-slate-900">{selected.title}</h2><button onClick={() => setSelected(null)} aria-label="Close"><FaTimes /></button></div><div className="mt-4 space-y-2 text-sm text-slate-600"><p><strong>Author:</strong> {selected.author_name || selected.author || "Not listed"}</p><p><strong>ISBN:</strong> {selected.isbn || "Not listed"}</p><p><strong>Category:</strong> {selected.category_name || selected.category || "Not listed"}</p><p><strong>Available copies:</strong> {count(selected)}</p>{selected.description && <p>{selected.description}</p>}</div><button onClick={() => setSelected(null)} className="mt-5 w-full rounded-xl bg-[#0F4C97] py-3 font-semibold text-white">Close</button></section></div>}
  </div></StaffLayout>;
}
