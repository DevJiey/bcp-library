import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaSearch,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaEnvelope,
  FaIdCard,
  FaEye,
  FaTimes,
} from "react-icons/fa";

import StaffLayout from "../../layouts/StaffLayout";
import apiRequest from "../../services/api";

function Borrowers() {
  const [borrowers, setBorrowers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedBorrower, setSelectedBorrower] =
    useState(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  useEffect(() => {
    const loadBorrowers = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await apiRequest("/users");

        setBorrowers(
          response?.data || []
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load borrowers."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBorrowers();
  }, []);

  const getFullName = (borrower) => {
    return [
      borrower.first_name,
      borrower.middle_name,
      borrower.last_name,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const getInitials = (borrower) => {
    const name =
      getFullName(borrower);

    if (!name) {
      return "LB";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const filteredBorrowers =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return borrowers.filter(
        (borrower) => {
          const name =
            getFullName(
              borrower
            ).toLowerCase();

          const email =
            (
              borrower.email || ""
            ).toLowerCase();

          const schoolId =
            String(
              borrower.school_id || ""
            ).toLowerCase();

          const type =
            borrower.borrower_type;

          const matchesSearch =
            !keyword ||
            name.includes(keyword) ||
            email.includes(keyword) ||
            schoolId.includes(keyword);

          const matchesType =
            typeFilter === "All" ||
            type ===
              typeFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesType
          );
        }
      );
    }, [
      borrowers,
      search,
      typeFilter,
    ]);

  const openBorrower = async (
    borrower
  ) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response =
        await apiRequest(
          `/users/${borrower.id}`
        );

      setSelectedBorrower(
        response?.data ||
          borrower
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to retrieve borrower details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatDate = (value) => {
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

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <StaffLayout>
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">
          Borrower Records
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Borrower Management
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Search and view registered student and faculty borrowers.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* TOOLBAR */}
      <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaUsers />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Registered Borrowers
              </h2>

              <p className="text-sm text-slate-500">
                {loading
                  ? "Loading..."
                  : `${filteredBorrowers.length} borrower${
                      filteredBorrowers.length !== 1
                        ? "s"
                        : ""
                    } found`}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
              <FaSearch className="text-slate-400" />

              <input
                type="text"
                placeholder="Search name, ID, or email..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 outline-none sm:w-72"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">
                All Types
              </option>

              <option value="Student">
                Student
              </option>

              <option value="Faculty">
                Faculty
              </option>
            </select>

          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Borrower
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  School ID
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Type
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
              {!loading &&
                filteredBorrowers.map(
                  (borrower) => (
                    <tr
                      key={borrower.id}
                      className="border-t border-slate-100 transition hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {getInitials(
                              borrower
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {getFullName(
                                borrower
                              ) ||
                                "Unnamed Borrower"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Registered library borrower
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaIdCard className="text-slate-400" />

                          {borrower.school_id ||
                            "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaEnvelope className="text-slate-400" />

                          {borrower.email ||
                            "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                            borrower.borrower_type ===
                            "student"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-violet-100 text-violet-700"
                          }`}
                        >
                          {borrower.borrower_type ===
                          "student" ? (
                            <FaUserGraduate />
                          ) : (
                            <FaChalkboardTeacher />
                          )}

                          {borrower.borrower_type ===
                          "student"
                            ? "Student"
                            : "Faculty"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            borrower.account_status ===
                            "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : borrower.account_status ===
                                  "locked"
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {borrower.account_status ||
                            "Unknown"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          disabled={
                            detailsLoading
                          }
                          onClick={() =>
                            openBorrower(
                              borrower
                            )
                          }
                          className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
                        >
                          <FaEye />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                )}
            </tbody>

          </table>
        </div>

        {loading && (
          <div className="px-6 py-14 text-center text-sm text-slate-400">
            Loading borrowers...
          </div>
        )}

        {!loading &&
          filteredBorrowers.length ===
            0 && (
            <div className="px-6 py-14 text-center">
              <FaUsers className="mx-auto text-3xl text-slate-300" />

              <h2 className="mt-4 font-semibold text-slate-800">
                No borrowers found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the search keyword or borrower type.
              </p>
            </div>
          )}

      </section>

      {/* DETAILS MODAL */}
      {selectedBorrower && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Borrower Record
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Borrower Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedBorrower(
                    null
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
              >
                <FaTimes />
              </button>

            </div>

            <div className="p-6">

              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                  {getInitials(
                    selectedBorrower
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {getFullName(
                      selectedBorrower
                    )}
                  </h3>

                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {selectedBorrower.borrower_type} Borrower
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-4">

                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm text-slate-500">
                    School ID
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {selectedBorrower.school_id ||
                      "—"}
                  </span>
                </div>

                <div className="flex justify-between gap-5 border-b border-slate-100 pb-3">
                  <span className="text-sm text-slate-500">
                    Email
                  </span>

                  <span className="break-all text-right text-sm font-semibold text-slate-800">
                    {selectedBorrower.email ||
                      "—"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm text-slate-500">
                    Borrower Type
                  </span>

                  <span className="text-sm font-semibold capitalize text-slate-800">
                    {selectedBorrower.borrower_type ||
                      "—"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm text-slate-500">
                    Account Status
                  </span>

                  <span className="text-sm font-semibold capitalize text-slate-800">
                    {selectedBorrower.account_status ||
                      "—"}
                  </span>
                </div>

                <div className="flex justify-between pb-1">
                  <span className="text-sm text-slate-500">
                    Registered
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {formatDate(
                      selectedBorrower.created_at
                    )}
                  </span>
                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedBorrower(
                    null
                  )
                }
                className="mt-6 w-full rounded-xl bg-[#0F4C97] px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}

export default Borrowers;