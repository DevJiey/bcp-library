import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaClipboardCheck,
  FaBookOpen,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaBullhorn,
} from "react-icons/fa";

import StaffLayout from "../../layouts/StaffLayout";
import apiRequest from "../../services/api";

function StaffDashboard() {
  const navigate = useNavigate();

  const [pendingRequests, setPendingRequests] =
    useState([]);

  const [borrowers, setBorrowers] =
    useState([]);

  const [bookCopies, setBookCopies] =
    useState([]);

  const [announcements, setAnnouncements] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "currentUser"
        ) || "{}"
      );
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          requestsResponse,
          borrowersResponse,
          copiesResponse,
          announcementsResponse,
        ] = await Promise.all([
          apiRequest(
            "/staff/borrow-requests"
          ),

          apiRequest(
            "/users"
          ),

          apiRequest(
            "/book-copies"
          ),

          apiRequest(
            "/announcements/me"
          ),
        ]);

        setPendingRequests(
          requestsResponse?.data || []
        );

        setBorrowers(
          borrowersResponse?.data || []
        );

        setBookCopies(
          copiesResponse?.data || []
        );

        setAnnouncements(
          (
            announcementsResponse?.data ||
            []
          ).slice(0, 5)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load staff dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const availableCopies =
    bookCopies.filter(
      (copy) =>
        copy.status === "available"
    ).length;

  const borrowedCopies =
    bookCopies.filter(
      (copy) =>
        copy.status === "borrowed"
    ).length;

  const statistics = [
    {
      title: "Pending Requests",
      value: pendingRequests.length,
      description:
        "Waiting for staff action",
      icon: <FaClipboardCheck />,
      iconStyle:
        "bg-amber-100 text-amber-700",
      path: "/staff/requests",
    },
    {
      title: "Registered Borrowers",
      value: borrowers.length,
      description:
        "Student and faculty accounts",
      icon: <FaUsers />,
      iconStyle:
        "bg-blue-100 text-blue-700",
      path: "/staff/borrowers",
    },
    {
      title: "Available Copies",
      value: availableCopies,
      description:
        "Ready for borrowing",
      icon: <FaCheckCircle />,
      iconStyle:
        "bg-emerald-100 text-emerald-700",
      path: "/staff/requests",
    },
    {
      title: "Borrowed Copies",
      value: borrowedCopies,
      description:
        "Currently checked out",
      icon: <FaBookOpen />,
      iconStyle:
        "bg-violet-100 text-violet-700",
      path: "/staff/returns",
    },
  ];

  const formatDate = (value) => {
    if (!value) {
      return "Recently";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Recently";
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

  const today =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

  const staffName = [
    currentUser?.firstName,
    currentUser?.middleName,
    currentUser?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <StaffLayout>
      {/* PAGE HEADER */}
      <div className="mb-5 sm:mb-8">

        <p className="text-sm font-semibold text-blue-700">
          Staff Dashboard
        </p>

        <div className="mt-1 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome back,{" "}
              {currentUser?.firstName ||
                "Librarian"}
              !
            </h1>

            {staffName && (
              <p className="mt-1 text-sm text-slate-500">
                {staffName}
              </p>
            )}
          </div>

          <p className="text-sm text-slate-500">
            {today}
          </p>

        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* STATISTICS */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {statistics.map(
            (item) => (
              <button
                key={item.title}
                type="button"
                onClick={() =>
                  navigate(
                    item.path
                  )
                }
                className="group rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-start justify-between">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${item.iconStyle}`}
                  >
                    {item.icon}
                  </div>

                  <FaArrowRight className="text-sm text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700" />

                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {loading
                    ? "—"
                    : item.value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {item.description}
                </p>

              </button>
            )
          )}

        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">

        {/* ANNOUNCEMENTS */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaBullhorn />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Library Announcements
              </h2>

              <p className="text-sm text-slate-500">
                Important library updates for staff
              </p>
            </div>

          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">
              Loading announcements...
            </div>
          ) : announcements.length ===
            0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-5 py-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <FaBullhorn />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                No announcements
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                New library announcements will appear here.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {announcements.map(
                (announcement) => (
                  <article
                    key={
                      announcement.id
                    }
                    className="flex gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/40 sm:gap-4"
                  >

                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <FaBullhorn className="text-sm" />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {
                              announcement.title
                            }
                          </h3>

                          <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold capitalize text-blue-700">
                            {announcement.audience ===
                            "all"
                              ? "Everyone"
                              : announcement.audience}
                          </span>
                        </div>

                        <span className="shrink-0 text-xs text-slate-400">
                          {formatDate(
                            announcement.published_at ||
                              announcement.created_at
                          )}
                        </span>

                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {
                          announcement.message
                        }
                      </p>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        </section>

        {/* QUICK ACTIONS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

          <h2 className="text-xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Common library staff tasks
          </p>

          <div className="mt-5 space-y-3">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/staff/requests"
                )
              }
              className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <FaClipboardCheck />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  Process Requests
                </p>

                <p className="text-xs text-slate-500">
                  Approve or reject borrow requests
                </p>
              </div>

              <FaArrowRight className="text-slate-300" />

            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/staff/returns"
                )
              }
              className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FaBookOpen />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  Process Return
                </p>

                <p className="text-xs text-slate-500">
                  Return borrowed books by barcode
                </p>
              </div>

              <FaArrowRight className="text-slate-300" />

            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/staff/borrowers"
                )
              }
              className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FaUsers />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  Find Borrower
                </p>

                <p className="text-xs text-slate-500">
                  Search registered library borrowers
                </p>
              </div>

              <FaArrowRight className="text-slate-300" />

            </button>

          </div>

        </section>

      </div>
    </StaffLayout>
  );
}

export default StaffDashboard;