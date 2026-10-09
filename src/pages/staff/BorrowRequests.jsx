import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaSearch,
  FaClipboardCheck,
  FaCheck,
  FaTimes,
  FaBarcode,
  FaUser,
  FaBook,
} from "react-icons/fa";

import BarcodeScanner from "../../components/BarcodeScanner";
import StaffLayout from "../../layouts/StaffLayout";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";

function BorrowRequests() {
  const { showToast } = useToast();

  const [requests, setRequests] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [modalType, setModalType] =
    useState(null);

  const [barcode, setBarcode] =
    useState("");

  const [showScanner, setShowScanner] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await apiRequest(
          "/staff/borrow-requests"
        );

      setRequests(
        response?.data || []
      );
    } catch (err) {
      setError(
        err.message ||
        "Failed to load borrow requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const getBorrowerName = (
    request
  ) => {
    const fullName = [
      request.first_name,
      request.middle_name,
      request.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      fullName ||
      request.borrower_name ||
      request.school_id ||
      "Library Borrower"
    );
  };

  const getBookTitle = (
    request
  ) => {
    return (
      request.title ||
      request.book_title ||
      "Library Book"
    );
  };

  const filteredRequests =
    useMemo(() => {
      const keyword =
        search.trim().toLowerCase();

      if (!keyword) {
        return requests;
      }

      return requests.filter(
        (request) => {
          const borrower =
            getBorrowerName(
              request
            ).toLowerCase();

          const book =
            getBookTitle(
              request
            ).toLowerCase();

          const schoolId =
            String(
              request.school_id ||
              ""
            ).toLowerCase();

          return (
            borrower.includes(
              keyword
            ) ||
            book.includes(
              keyword
            ) ||
            schoolId.includes(
              keyword
            )
          );
        }
      );
    }, [requests, search]);

  const formatDate = (
    value
  ) => {
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

  const openApproveModal = (
    request
  ) => {
    setSelectedRequest(
      request
    );

    setBarcode("");
    setModalType("approve");
  };

  const openRejectModal = (
    request
  ) => {
    setSelectedRequest(
      request
    );

    setRejectionReason("");
    setModalType("reject");
  };

  const closeModal = () => {
    if (processing) {
      return;
    }

    setSelectedRequest(null);
    setModalType(null);
    setBarcode("");
    setRejectionReason("");
    setShowScanner(false);
  };

  const handleApprove = async (
    event
  ) => {
    event.preventDefault();

    if (!barcode.trim()) {
      showToast(
        "Please enter or scan the book barcode.",
        "error"
      );

      return;
    }

    try {
      setProcessing(true);

      await apiRequest(
        `/staff/borrow-requests/${selectedRequest.id}/approve`,
        {
          method: "PATCH",

          body: JSON.stringify({
            barcode:
              barcode.trim(),
          }),
        }
      );

      showToast(
        "Borrow request approved successfully!",
        "success"
      );

      closeModal();

      await loadRequests();
    } catch (err) {
      showToast(
        err.message ||
        "Failed to approve borrow request.",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (
    event
  ) => {
    event.preventDefault();

    if (
      !rejectionReason.trim()
    ) {
      showToast(
        "Please provide a rejection reason.",
        "error"
      );

      return;
    }

    try {
      setProcessing(true);

      await apiRequest(
        `/staff/borrow-requests/${selectedRequest.id}/reject`,
        {
          method: "PATCH",

          body: JSON.stringify({
            rejectionReason:
              rejectionReason.trim(),
          }),
        }
      );

      showToast(
        "Borrow request rejected.",
        "success"
      );

      closeModal();

      await loadRequests();
    } catch (err) {
      showToast(
        err.message ||
        "Failed to reject borrow request.",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <StaffLayout>
      {/* PAGE HEADER */}
      <div className="mb-5 sm:mb-8">

        <p className="text-sm font-semibold text-blue-700">
          Borrow Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Borrow Requests
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review pending borrower requests and assign an available physical book copy.
        </p>

      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* TOOLBAR */}
      <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:mb-6 sm:p-5">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 sm:h-12 sm:w-12">
              <FaClipboardCheck />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Pending Requests
              </h2>

              <p className="text-sm text-slate-500">
                {filteredRequests.length} request
                {filteredRequests.length !==
                  1
                  ? "s"
                  : ""}{" "}
                waiting for processing
              </p>
            </div>

          </div>

          <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">

            <FaSearch className="text-slate-400" />

            <input
              type="text"
              placeholder="Search borrower, ID, or book..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="min-w-0 w-full bg-transparent px-3 py-2 text-sm outline-none sm:w-72"
            />

          </div>

        </div>

      </div>

      {/* MOBILE REQUEST CARDS — desktop table remains unchanged */}
      <div className="space-y-3 lg:hidden">
        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 ring-1 ring-slate-200">Loading borrow requests...</div>
        )}
        {!loading && filteredRequests.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
            <FaClipboardCheck className="mx-auto mb-3 text-3xl text-slate-300" />
            <p className="font-semibold text-slate-800">No pending borrow requests</p>
            <p className="mt-1 text-sm text-slate-500">New requests will appear here.</p>
          </div>
        )}
        {!loading && filteredRequests.map((request) => (
          <article key={request.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#0F4C97]"><FaUser /></div>
                <div className="min-w-0">
                  <h3 className="break-words font-bold text-slate-900">{getBorrowerName(request)}</h3>
                  <p className="text-xs text-slate-500">{request.school_id || "Registered borrower"}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">Pending</span>
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <div className="flex items-start gap-2 text-sm font-semibold text-slate-800"><FaBook className="mt-1 shrink-0 text-[#0F4C97]" /><span className="break-words">{getBookTitle(request)}</span></div>
              {request.isbn && <p className="mt-1 pl-5 text-xs text-slate-500">ISBN: {request.isbn}</p>}
              <p className="mt-2 text-xs text-slate-500">Requested: {formatDate(request.created_at || request.requested_at)}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => openApproveModal(request)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white active:scale-[.98]"><FaCheck /> Approve</button>
              <button type="button" onClick={() => openRejectModal(request)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 active:scale-[.98]"><FaTimes /> Reject</button>
            </div>
          </article>
        ))}
      </div>

      {/* TABLE */}
      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:block">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[980px]">

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
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {!loading &&
                filteredRequests.map(
                  (request) => (
                    <tr
                      key={
                        request.id
                      }
                      className="border-t border-slate-100 transition hover:bg-blue-50/40"
                    >

                      {/* BORROWER */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                            <FaUser />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {getBorrowerName(
                                request
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {request.school_id ||
                                "Registered borrower"}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* BOOK */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <FaBook />
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {getBookTitle(
                                request
                              )}
                            </p>

                            {request.isbn && (
                              <p className="mt-1 text-xs text-slate-400">
                                ISBN:{" "}
                                {
                                  request.isbn
                                }
                              </p>
                            )}
                          </div>

                        </div>

                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(
                          request.created_at ||
                          request.requested_at
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          Pending
                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openApproveModal(
                                request
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                          >
                            <FaCheck />

                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openRejectModal(
                                request
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <FaTimes />

                            Reject
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

            </tbody>

          </table>

        </div>

        {loading && (
          <div className="px-6 py-14 text-center text-sm text-slate-400">
            Loading borrow requests...
          </div>
        )}

        {!loading &&
          filteredRequests.length ===
          0 && (
            <div className="px-6 py-14 text-center">

              <FaClipboardCheck className="mx-auto text-3xl text-slate-300" />

              <h2 className="mt-4 font-semibold text-slate-800">
                No pending borrow requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                New borrower requests will appear here.
              </p>

            </div>
          )}

      </div>

      {/* APPROVE MODAL */}
      {selectedRequest &&
        modalType ===
        "approve" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 py-8 backdrop-blur-sm sm:p-4">

            <form
              onSubmit={
                handleApprove
              }
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >

              <div className="bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Borrow Processing
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Approve Request
                </h2>

              </div>

              <div className="p-6">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="font-semibold text-slate-900">
                    {getBorrowerName(
                      selectedRequest
                    )}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {getBookTitle(
                      selectedRequest
                    )}
                  </p>

                </div>

                <label className="mt-5 block text-sm font-semibold text-slate-700">
                  Book Barcode
                </label>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row">

                  {/* BARCODE INPUT */}
                  <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-300 px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">

                    <FaBarcode className="shrink-0 text-slate-400" />

                    <input
                      type="text"
                      value={barcode}
                      onChange={(event) =>
                        setBarcode(
                          event.target.value
                        )
                      }
                      placeholder="Scan or enter barcode"
                      autoFocus
                      className="min-w-0 w-full px-3 py-3 outline-none"
                    />

                  </div>

                  {/* CAMERA BUTTON */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowScanner(true)
                    }
                    className="shrink-0 rounded-xl bg-[#0F4C97] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 sm:w-auto"
                  >
                    Scan Camera
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
                  Scan using the device camera, USB barcode scanner, or enter the barcode manually.
                </p>

                <div className="mt-6 flex gap-3">

                  <button
                    type="button"
                    disabled={
                      processing
                    }
                    onClick={
                      closeModal
                    }
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      processing
                    }
                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {processing
                      ? "Processing..."
                      : "Approve"}
                  </button>

                </div>

              </div>

            </form>

          </div>
        )}

      {/* REJECT MODAL */}
      {selectedRequest &&
        modalType ===
        "reject" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 py-8 backdrop-blur-sm sm:p-4">

            <form
              onSubmit={
                handleReject
              }
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >

              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 text-white">

                <p className="text-xs font-semibold uppercase tracking-wider text-red-100">
                  Borrow Processing
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Reject Request
                </h2>

              </div>

              <div className="p-6">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="font-semibold text-slate-900">
                    {getBorrowerName(
                      selectedRequest
                    )}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {getBookTitle(
                      selectedRequest
                    )}
                  </p>

                </div>

                <label className="mt-5 block text-sm font-semibold text-slate-700">
                  Rejection Reason
                </label>

                <textarea
                  value={
                    rejectionReason
                  }
                  onChange={(
                    event
                  ) =>
                    setRejectionReason(
                      event.target
                        .value
                    )
                  }
                  rows={4}
                  placeholder="Enter the reason for rejecting this request..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                />

                <div className="mt-6 flex gap-3">

                  <button
                    type="button"
                    disabled={
                      processing
                    }
                    onClick={
                      closeModal
                    }
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      processing
                    }
                    className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {processing
                      ? "Processing..."
                      : "Reject"}
                  </button>

                </div>

              </div>

            </form>

          </div>
        )}
      <BarcodeScanner
        open={showScanner}
        onClose={() =>
          setShowScanner(false)
        }
        onDetected={(value) => {
          setBarcode(value);
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

export default BorrowRequests;