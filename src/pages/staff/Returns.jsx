import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
  FaSearch,
  FaUndo,
  FaBook,
  FaCalendarAlt,
  FaSyncAlt,
} from "react-icons/fa";

import StaffLayout from "../../layouts/StaffLayout";
import returnsData from "../../data/returns";

function Returns() {
  const [records, setRecords] = useState(returnsData);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredRecords = records.filter((item) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      item.borrower.toLowerCase().includes(keyword) ||
      item.book.toLowerCase().includes(keyword);

    const matchesStatus =
      status === "All" || item.status === status;

    return matchesSearch && matchesStatus;
  });

  const processReturn = (id) => {
    setRecords(
      records.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Returned",
            }
          : item
      )
    );
  };

  const renewBook = (id) => {
    setRecords(
      records.map((item) =>
        item.id === id
          ? {
              ...item,
              dueDate: "2026-08-29",
              status: "Borrowed",
            }
          : item
      )
    );

    showToast("Book renewed successfully!", "success");
  };

  const getStatusStyle = (recordStatus) => {
    if (recordStatus === "Returned") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (recordStatus === "Overdue") {
      return "bg-red-100 text-red-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  return (
    <StaffLayout>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">
          Circulation Management
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Process Returns
        </h1>

        <p className="mt-2 text-slate-500">
          Process returned books and renew active borrowing transactions.
        </p>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaUndo />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Borrowing Transactions
              </h2>

              <p className="text-sm text-slate-500">
                {filteredRecords.length} transaction
                {filteredRecords.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
              <FaSearch className="text-slate-400" />

              <input
                type="text"
                placeholder="Search borrower or book..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 outline-none sm:w-64"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">All Status</option>
              <option value="Borrowed">Borrowed</option>
              <option value="Overdue">Overdue</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Borrower
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Book
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Due Date
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">
                      {item.borrower}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Registered borrower
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <FaBook />
                      </div>

                      <p className="font-medium text-slate-900">
                        {item.book}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaCalendarAlt className="text-slate-400" />
                      {item.dueDate}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {item.status !== "Returned" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => processReturn(item.id)}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Process Return
                        </button>

                        <button
                          type="button"
                          onClick={() => renewBook(item.id)}
                          className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                        >
                          <FaSyncAlt className="text-xs" />
                          Renew
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-slate-400">
                        Transaction completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">
          <FaUndo className="mx-auto text-3xl text-slate-300" />

          <h2 className="mt-4 font-semibold text-slate-800">
            No borrowing transactions found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing the search keyword or selected status.
          </p>
        </div>
      )}
    </StaffLayout>
  );
}

export default Returns;