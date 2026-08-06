import { useState } from "react";
import {
  FaSearch,
  FaClipboardCheck,
} from "react-icons/fa";

import StaffLayout from "../../layouts/StaffLayout";
import borrowRequests from "../../data/borrowRequests";

function BorrowRequests() {
  const [requests, setRequests] = useState(borrowRequests);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.borrower
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      request.book
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || request.status === status;

    return matchesSearch && matchesStatus;
  });

  const approveRequest = (id) => {
    setRequests(
      requests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "Approved",
            }
          : request
      )
    );
  };

  return (
    <StaffLayout>
      {/* Header muna */}
      <div className="mb-5 sm:mb-8">
        <p className="text-sm font-semibold text-blue-700">
          Borrow Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Borrow Requests
        </h1>
      </div>

      {/* Toolbar pagkatapos ng header */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaClipboardCheck />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Borrow Requests
              </h2>

              <p className="text-sm text-slate-500">
                Review pending borrower requests.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center rounded-xl border border-slate-300 px-3 focus-within:border-blue-700">
              <FaSearch className="text-slate-400" />

              <input
                type="text"
                placeholder="Search borrower or book..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 outline-none"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-700"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Borrower
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Book
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Request Date
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-t border-slate-100 transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    {request.borrower}
                  </td>

                  <td className="px-5 py-4">
                    {request.book}
                  </td>

                  <td className="px-5 py-4">
                    {request.requestDate}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        request.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : request.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {request.status === "Pending" && (
                      <button
                        onClick={() => approveRequest(request.id)}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRequests.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">
          <FaClipboardCheck className="mx-auto text-3xl text-slate-300" />

          <h2 className="mt-4 font-semibold text-slate-800">
            No borrow requests found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing the search keyword or status filter.
          </p>
        </div>
      )}
    </StaffLayout>
  );
}

export default BorrowRequests;