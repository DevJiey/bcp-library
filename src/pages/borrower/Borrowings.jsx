import {
  useEffect,
  useState,
} from "react";

import {
  FaBook,
  FaCalendarAlt,
  FaHistory,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";
import apiRequest from "../../services/api";

function Borrowings() {
  const [filter, setFilter] =
    useState("All");

  const [search, setSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [borrowings, setBorrowings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const filters = [
    "All",
    "Borrowed",
    "Due Soon",
    "Overdue",
    "Returned",
  ];

  useEffect(() => {
    const loadBorrowings = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await apiRequest(
            "/borrowings/me"
          );

        setBorrowings(
          response?.data || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load borrowing history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBorrowings();
  }, []);

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const getDisplayStatus = (
    item
  ) => {
    if (
      item.status === "returned"
    ) {
      return "Returned";
    }

    if (
      item.status === "overdue"
    ) {
      return "Overdue";
    }

    if (
      item.status === "borrowed"
    ) {
      const dueTime =
        new Date(
          item.due_at
        ).getTime();

      const now = Date.now();

      const oneDay =
        24 * 60 * 60 * 1000;

      const difference =
        dueTime - now;

      if (
        difference > 0 &&
        difference <= oneDay
      ) {
        return "Due Soon";
      }

      return "Borrowed";
    }

    return "Unknown";
  };

  const filteredBorrowings = borrowings.filter((item) => {
    const matchesStatus = filter === "All" || getDisplayStatus(item) === filter;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [item.title, item.accession_number, item.isbn]
      .some((value) => String(value ?? "").toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const getStatusStyle = (
    status
  ) => {
    if (status === "Borrowed") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Due Soon") {
      return "bg-amber-100 text-amber-700";
    }

    if (status === "Overdue") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Returned") {
      return "bg-emerald-100 text-emerald-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  return (
    <BorrowerLayout>

      {/* PAGE HEADER */}
      <div className="mb-5 sm:mb-8">
        <p className="text-sm font-semibold text-blue-700">
          My Library Activity
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Borrowing History
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View your active, overdue, and returned library books.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Mobile search and status filters */}
      <div className="mb-4 lg:hidden">
        <div className="flex items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-[#0F4C97]">
            <FaSearch className="shrink-0 text-slate-400" aria-hidden="true" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search my books..." aria-label="Search borrowing records" className="h-11 w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
          </label>
          <button type="button" aria-label="Filter borrowing status" aria-expanded={showMobileFilters} onClick={() => setShowMobileFilters((current) => !current)} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm ${showMobileFilters || filter !== "All" ? "border-[#0F4C97] bg-[#0F4C97] text-white" : "border-slate-200 bg-white text-[#0F4C97]"}`}>
            <FaFilter />
          </button>
        </div>
        {showMobileFilters && (
          <div className="mt-2 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            {filters.map((option) => (
              <button type="button" key={option} onClick={() => { setFilter(option); setShowMobileFilters(false); }} className={`rounded-lg px-3 py-2 text-xs font-semibold ${filter === option ? "bg-[#0F4C97] text-white" : "bg-slate-100 text-slate-600"}`}>{option}</button>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-slate-500">{filteredBorrowings.length} borrowing record{filteredBorrowings.length === 1 ? "" : "s"}{filter !== "All" ? ` · ${filter}` : ""}</p>
      </div>

      {/* Mobile borrowing cards */}
      <div className="space-y-3 lg:hidden">
        {!loading && filteredBorrowings.map((item) => {
          const status = getDisplayStatus(item);
          return (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0F4C97]"><FaBook className="text-lg" /></div>
                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-sm font-bold leading-5 text-slate-900">{item.title || "Untitled book"}</h2>
                  <p className="mt-1 break-all text-xs text-slate-500">{item.accession_number ? `Accession: ${item.accession_number}` : item.isbn ? `ISBN: ${item.isbn}` : "BCP Library Collection"}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${getStatusStyle(status)}`}>{status}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div><p className="text-[11px] text-slate-500">Borrowed</p><p className="mt-1 text-xs font-semibold text-slate-800">{formatDate(item.borrowed_at)}</p></div>
                <div><p className="text-[11px] text-slate-500">Due date</p><p className={`mt-1 text-xs font-semibold ${status === "Overdue" ? "text-red-600" : "text-slate-800"}`}>{formatDate(item.due_at)}</p></div>
                {item.returned_at && <div className="col-span-2"><p className="text-[11px] text-slate-500">Returned</p><p className="mt-1 text-xs font-semibold text-emerald-700">{formatDate(item.returned_at)}</p></div>}
              </div>
            </article>
          );
        })}
        {loading && <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500">Loading borrowing records...</div>}
        {!loading && filteredBorrowings.length === 0 && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center"><FaBook className="mx-auto text-2xl text-slate-400" /><p className="mt-3 text-sm font-semibold text-slate-800">No borrowing records found</p><p className="mt-1 text-xs text-slate-500">Try another search or status.</p></div>}
      </div>

      {/* TOOLBAR */}
      <div className="mb-6 hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:block">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaHistory />
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                Borrowing Records
              </p>

              <p className="text-sm text-slate-500">
                {filteredBorrowings.length} record
                {filteredBorrowings.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setFilter(item)
                }
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  filter === item
                    ? "bg-[#0F4C97] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:block">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[820px]">

            <thead className="bg-slate-50">
              <tr>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Book
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Borrow Date
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Due Date
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Returned
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {!loading &&
                filteredBorrowings.map(
                  (item) => {
                    const status =
                      getDisplayStatus(
                        item
                      );

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 transition hover:bg-blue-50/40"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                              <FaBook />
                            </div>

                            <div className="min-w-0">

                              <p className="font-semibold text-slate-900">
                                {item.title}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {item.accession_number
                                  ? `Accession: ${item.accession_number}`
                                  : item.isbn
                                  ? `ISBN: ${item.isbn}`
                                  : "BCP Library Collection"}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaCalendarAlt className="text-slate-400" />

                            {formatDate(
                              item.borrowed_at
                            )}
                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaCalendarAlt className="text-slate-400" />

                            {formatDate(
                              item.due_at
                            )}
                          </div>

                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.returned_at
                            ? formatDate(
                                item.returned_at
                              )
                            : "—"}
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )}

            </tbody>
          </table>

        </div>

        {loading && (
          <div className="px-6 py-14 text-center text-sm text-slate-400">
            Loading borrowing records...
          </div>
        )}

        {!loading &&
          filteredBorrowings.length ===
            0 && (
            <div className="px-6 py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FaBook />
              </div>

              <h2 className="mt-4 font-semibold text-slate-800">
                No borrowing records found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                There are no records under the selected status.
              </p>

            </div>
          )}

      </div>

    </BorrowerLayout>
  );
}

export default Borrowings;