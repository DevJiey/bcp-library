import { useState } from "react";
import {
  FaSearch,
  FaMoneyBillWave,
  FaReceipt,
  FaUser,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

import StaffLayout from "../../layouts/StaffLayout";
import fineCollectionsData from "../../data/fineCollections";

function FineCollection() {
  const [fines, setFines] = useState(fineCollectionsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedFine, setSelectedFine] = useState(null);

  const filteredFines = fines.filter((fine) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      fine.borrower.toLowerCase().includes(keyword) ||
      fine.reason.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "All" ||
      fine.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const collectPayment = (id) => {
    setFines(
      fines.map((fine) =>
        fine.id === id
          ? {
              ...fine,
              status: "Paid",
            }
          : fine
      )
    );

    setSelectedFine(null);
  };

  const outstandingBalance = fines
    .filter((fine) => fine.status === "Unpaid")
    .reduce((total, fine) => total + fine.amount, 0);

  return (
    <StaffLayout>
      {/* Page Header */}
      <div className="mb-5 sm:mb-8">
        <p className="text-sm font-semibold text-blue-700">
          Payment Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Fine Collection
        </h1>
      </div>

      {/* Outstanding Balance */}
      <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-700">
              <FaMoneyBillWave />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Outstanding Fines
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                ₱{outstandingBalance}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Across all unpaid borrower records
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            Payments are recorded at the library counter.
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaReceipt />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Fine Records
              </h2>

              <p className="text-sm text-slate-500">
                {filteredFines.length} record
                {filteredFines.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
              <FaSearch className="text-slate-400" />

              <input
                type="text"
                placeholder="Search borrower or reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 outline-none sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">All Status</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>
      </section>

      {/* Fine Table */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Borrower
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Reason
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Amount
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
              {filteredFines.map((fine) => (
                <tr
                  key={fine.id}
                  className="border-t border-slate-100 transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <FaUser />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {fine.borrower}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Registered borrower
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {fine.reason}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Library fine record
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-lg font-bold text-slate-900">
                      ₱{fine.amount}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        fine.status === "Paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {fine.status === "Paid" && (
                        <FaCheckCircle />
                      )}

                      {fine.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {fine.status === "Unpaid" ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFine(fine)
                        }
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Collect Payment
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-slate-400">
                        Payment completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Empty State */}
      {filteredFines.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">
          <FaReceipt className="mx-auto text-3xl text-slate-300" />

          <h2 className="mt-4 font-semibold text-slate-800">
            No fine records found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing the search keyword or status filter.
          </p>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {selectedFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                  Fine Payment
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Confirm Collection
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedFine(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              <div className="rounded-xl border border-slate-200">
                <div className="flex justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Borrower
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    {selectedFine.borrower}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Reason
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    {selectedFine.reason}
                  </span>
                </div>

                <div className="flex justify-between px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Amount Received
                  </span>

                  <span className="text-lg font-bold text-emerald-700">
                    ₱{selectedFine.amount}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Confirm that the payment has been received before marking this fine as paid.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedFine(null)
                  }
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    collectPayment(selectedFine.id)
                  }
                  className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  <FaCheckCircle />
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}

export default FineCollection;