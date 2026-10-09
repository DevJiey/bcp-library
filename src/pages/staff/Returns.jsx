import {
  useState,
} from "react";

import {
  FaUndo,
  FaBarcode,
  FaBook,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import BarcodeScanner from "../../components/BarcodeScanner";
import StaffLayout from "../../layouts/StaffLayout";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";

function Returns() {
  const { showToast } = useToast();

  const [barcode, setBarcode] =
    useState("");
  const [showScanner, setShowScanner] =
    useState(false);

  const [conditionOnReturn, setConditionOnReturn] =
    useState("good");

  const [remarks, setRemarks] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const [lastReturn, setLastReturn] =
    useState(null);

  const [error, setError] =
    useState("");

  const handleReturn = async (
    event
  ) => {
    event.preventDefault();

    if (!barcode.trim()) {
      showToast(
        "Please scan or enter a book barcode.",
        "error"
      );

      return;
    }

    try {
      setProcessing(true);
      setError("");

      const response =
        await apiRequest(
          "/returns",
          {
            method: "POST",

            body: JSON.stringify({
              barcode:
                barcode.trim(),

              conditionOnReturn,

              remarks:
                remarks.trim() ||
                null,
            }),
          }
        );

      setLastReturn(
        response?.data || null
      );

      showToast(
        "Book return processed successfully!",
        "success"
      );

      setBarcode("");
      setConditionOnReturn(
        "good"
      );
      setRemarks("");
    } catch (err) {
      const message =
        err.message ||
        "Failed to process book return.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "—";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }

    return date.toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  return (
    <StaffLayout>
      {/* PAGE HEADER */}
      <div className="mb-4 sm:mb-8">

        <p className="text-sm font-semibold text-blue-700">
          Circulation Management
        </p>

        <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-3xl">
          Process Book Return
        </h1>

        <p className="mt-1 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm">
          Scan the physical book barcode and record its condition upon return.
        </p>

      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

          <FaExclamationTriangle className="mt-0.5 shrink-0" />

          <span>
            {error}
          </span>

        </div>
      )}

      <div className="grid gap-4 pb-24 sm:gap-6 sm:pb-0 xl:grid-cols-[1.1fr_0.9fr]">

        {/* RETURN FORM */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

          <div className="bg-gradient-to-r from-[#0F4C97] to-blue-700 px-4 py-4 text-white sm:px-6 sm:py-5">

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg sm:h-12 sm:w-12 sm:text-xl">
                <FaUndo />
              </div>

              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  Return Processing
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  Enter the returned book information
                </p>
              </div>

            </div>

          </div>

          <form
            onSubmit={
              handleReturn
            }
            className="p-4 sm:p-6"
          >

            {/* BARCODE */}
            <label className="block text-sm font-semibold text-slate-700">
              Book Barcode
            </label>

            <div className="mt-2 flex flex-row gap-2 sm:gap-3">

              <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-300 px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">

                <FaBarcode className="shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={barcode}
                  onChange={(event) => {
                    setBarcode(
                      event.target.value
                    );

                    setError("");
                  }}
                  placeholder="Scan or enter barcode"
                  autoFocus
                  disabled={processing}
                  className="min-w-0 w-full bg-transparent px-2 py-3 text-sm outline-none sm:px-3"
                />

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowScanner(true)
                }
                disabled={processing}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-3 py-3 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-sm"
              >
                <FaBarcode className="sm:hidden" />
                <span className="sm:hidden">Scan</span>
                <span className="hidden sm:inline">Scan Camera</span>
              </button>

            </div>

            {barcode && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Barcode Ready
                </p>

                <p className="mt-1 break-all font-mono text-sm font-bold text-emerald-800">
                  {barcode}
                </p>

              </div>
            )}

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Scan using the device camera, USB barcode scanner, or enter the barcode manually. The barcode must belong to a currently borrowed physical book copy.
            </p>

            {/* CONDITION */}
            <label className="mt-5 block text-sm font-semibold text-slate-700 sm:mt-6">
              Condition on Return
            </label>

            <select
              value={
                conditionOnReturn
              }
              onChange={(
                event
              ) =>
                setConditionOnReturn(
                  event.target
                    .value
                )
              }
              disabled={
                processing
              }
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              <option value="excellent">
                Excellent
              </option>

              <option value="good">
                Good
              </option>

              <option value="fair">
                Fair
              </option>

              <option value="poor">
                Poor
              </option>

              <option value="damaged">
                Damaged
              </option>
            </select>

            {/* REMARKS */}
            <label className="mt-5 block text-sm font-semibold text-slate-700 sm:mt-6">
              Remarks
            </label>

            <textarea
              value={
                remarks
              }
              onChange={(
                event
              ) =>
                setRemarks(
                  event.target
                    .value
                )
              }
              disabled={
                processing
              }
              rows={4}
              placeholder="Optional notes about the returned book..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={
                processing
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6 sm:bg-emerald-600 sm:hover:bg-emerald-700"
            >
              <FaCheckCircle />

              {processing
                ? "Processing Return..."
                : "Process Return"}
            </button>

          </form>

        </section>

        {/* RESULT / GUIDE */}
        <div className="space-y-4 sm:space-y-6">

          {lastReturn ? (
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-emerald-200">

              <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-4 sm:px-6 sm:py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <h2 className="font-bold text-emerald-900">
                      Return Completed
                    </h2>

                    <p className="text-sm text-emerald-700">
                      The borrowing transaction has been updated.
                    </p>
                  </div>

                </div>

              </div>

              <div className="space-y-4 p-4 sm:p-6">

                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">

                  <span className="text-sm text-slate-500">
                    Transaction ID
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {lastReturn
                      ?.returnRecord
                      ?.borrow_transaction_id ||
                      "—"}
                  </span>

                </div>

                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">

                  <span className="text-sm text-slate-500">
                    Returned At
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-800">
                    {formatDate(
                      lastReturn
                        ?.returnRecord
                        ?.returned_at
                    )}
                  </span>

                </div>

                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">

                  <span className="text-sm text-slate-500">
                    Condition
                  </span>

                  <span className="text-sm font-semibold capitalize text-slate-800">
                    {lastReturn
                      ?.returnRecord
                      ?.condition_on_return ||
                      "—"}
                  </span>

                </div>

                {lastReturn?.accountUpdate && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm ${lastReturn
                      .accountUpdate
                      .unlocked
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                      }`}
                  >
                    {lastReturn
                      .accountUpdate
                      .unlocked
                      ? "The borrower account was automatically unlocked because all overdue books were cleared."
                      : `${lastReturn.accountUpdate.remainingOverdue} overdue borrowing(s) remain on this account.`}
                  </div>
                )}

              </div>

            </section>
          ) : (
            <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FaBook />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                Return Workflow
              </h2>

              <div className="mt-5 space-y-4">

                <div className="flex gap-3">

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    1
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    Scan or enter the barcode printed on the physical book copy.
                  </p>

                </div>

                <div className="flex gap-3">

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    2
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    Inspect the book and select its condition upon return.
                  </p>

                </div>

                <div className="flex gap-3">

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    3
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    Submit the return. The copy becomes available again unless it is damaged.
                  </p>

                </div>

                <div className="flex gap-3">

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    4
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    If this clears all overdue books, the borrower account is automatically unlocked.
                  </p>

                </div>

              </div>

            </section>
          )}

        </div>

      </div>
      <BarcodeScanner
        open={showScanner}
        onClose={() =>
          setShowScanner(false)
        }
        onDetected={(value) => {
          setBarcode(value);
          setError("");
          setShowScanner(false);

          showToast(
            `Barcode scanned: ${value}`,
            "success"
          );
        }}
      />
    </StaffLayout>
  );
}

export default Returns;