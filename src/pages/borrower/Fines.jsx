import {
  FaMoneyBillWave,
  FaReceipt,
  FaCalendarAlt,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";
import fines from "../../data/fines";

function Fines() {
  const totalBalance = fines
    .filter((fine) => fine.status === "Unpaid")
    .reduce((sum, fine) => sum + fine.amount, 0);

  const unpaidRecords = fines.filter(
    (fine) => fine.status === "Unpaid"
  ).length;

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return "bg-emerald-100 text-emerald-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <BorrowerLayout>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">
          Account Charges
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          My Fines
        </h1>

        <p className="mt-2 text-slate-500">
          Review your outstanding balance and previous fine records.
        </p>
      </div>

      {/* Balance Summary */}
      <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-700">
              <FaMoneyBillWave />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Outstanding Balance
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                ₱{totalBalance}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {unpaidRecords} unpaid record
                {unpaidRecords !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              totalBalance > 0
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {totalBalance > 0
              ? "Please settle your balance at the library counter."
              : "Your account has no outstanding balance."}
          </div>
        </div>
      </section>

      {/* Fine History */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <FaReceipt />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Fine History
            </h2>

            <p className="text-sm text-slate-500">
              {fines.length} total fine record
              {fines.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Date
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
              </tr>
            </thead>

            <tbody>
              {fines.map((fine) => (
                <tr
                  key={fine.id}
                  className="border-t border-slate-100 transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaCalendarAlt className="text-slate-400" />
                      {fine.date}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {fine.reason}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      BCP Library fine record
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-900">
                      ₱{fine.amount}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        fine.status
                      )}`}
                    >
                      {fine.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {fines.length === 0 && (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FaReceipt />
            </div>

            <h2 className="mt-4 font-semibold text-slate-800">
              No fine records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your account currently has no recorded fines.
            </p>
          </div>
        )}
      </section>
    </BorrowerLayout>
  );
}

export default Fines;