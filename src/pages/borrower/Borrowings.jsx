import { useState } from "react";
import {
  FaBook,
  FaCalendarAlt,
  FaHistory,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";
import borrowings from "../../data/borrowings";

function Borrowings() {
  const [filter, setFilter] = useState("All");

  const filters = [
    "All",
    "Borrowed",
    "Due Soon",
    "Returned",
  ];

  const filteredBorrowings =
    filter === "All"
      ? borrowings
      : borrowings.filter(
          (item) => item.status === filter
        );

  const getStatusStyle = (status) => {
    if (status === "Borrowed") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Due Soon") {
      return "bg-amber-100 text-amber-700";
    }

    if (status === "Returned") {
      return "bg-emerald-100 text-emerald-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  return (
    <BorrowerLayout>
      {/* Page Header */}
      <div className="mb-5 sm:mb-8">
        <p className="text-sm font-semibold text-blue-700">
          My Library Activity
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Borrowing History
        </h1>
      </div>

      {/* Toolbar */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
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
                onClick={() => setFilter(item)}
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

      {/* Borrowing Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
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
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBorrowings.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                        <FaBook />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          BCP Library Collection
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaCalendarAlt className="text-slate-400" />
                      {item.borrowDate}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBorrowings.length === 0 && (
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