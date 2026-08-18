import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaBook,
  FaUsers,
  FaUserTie,
  FaExchangeAlt,
  FaArrowRight,
  FaClipboardList,
  FaPlus,
  FaCog,
  FaChartBar,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCopy,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import apiRequest from "../../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [books, setBooks] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [copies, setCopies] =
    useState([]);

  const [activities, setActivities] =
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
    const loadDashboard =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            booksResponse,
            usersResponse,
            copiesResponse,
            logsResponse,
          ] = await Promise.all([
            apiRequest(
              "/books"
            ),

            apiRequest(
              "/users"
            ),

            apiRequest(
              "/book-copies"
            ),

            apiRequest(
              "/audit-logs?page=1&limit=5"
            ),
          ]);

          setBooks(
            booksResponse?.data ||
              []
          );

          setUsers(
            usersResponse?.data ||
              []
          );

          setCopies(
            copiesResponse?.data ||
              []
          );

          setActivities(
            logsResponse?.data
              ?.logs || []
          );
        } catch (err) {
          setError(
            err.message ||
              "Failed to load admin dashboard."
          );
        } finally {
          setLoading(false);
        }
      };

    loadDashboard();
  }, []);

  const borrowers =
    users.filter(
      (user) =>
        user.role === "borrower"
    );

  const staff =
    users.filter(
      (user) =>
        user.role === "staff"
    );

  const availableCopies =
    copies.filter(
      (copy) =>
        copy.status ===
        "available"
    ).length;

  const borrowedCopies =
    copies.filter(
      (copy) =>
        copy.status ===
          "borrowed" ||
        copy.status ===
          "overdue"
    ).length;

  const unavailableCopies =
    copies.filter(
      (copy) =>
        copy.status !==
          "available" &&
        copy.status !==
          "borrowed" &&
        copy.status !==
          "overdue"
    ).length;

  const damagedOrLostCopies =
    copies.filter(
      (copy) =>
        copy.condition ===
          "damaged" ||
        copy.condition ===
          "lost" ||
        copy.status ===
          "damaged" ||
        copy.status ===
          "lost"
    ).length;

  const cards = [
    {
      title: "Total Books",
      value: books.length,
      subtitle:
        "Library Catalog",
      icon: <FaBook />,
      color:
        "bg-blue-100 text-blue-700",
      path: "/admin/books",
    },
    {
      title: "Borrowers",
      value:
        borrowers.length,
      subtitle:
        "Registered Users",
      icon: <FaUsers />,
      color:
        "bg-emerald-100 text-emerald-700",
      path: "/admin/staff",
    },
    {
      title: "Library Staff",
      value: staff.length,
      subtitle:
        "Staff Accounts",
      icon: <FaUserTie />,
      color:
        "bg-violet-100 text-violet-700",
      path: "/admin/staff",
    },
    {
      title:
        "Borrowed Copies",
      value:
        borrowedCopies,
      subtitle:
        "Currently Checked Out",
      icon: <FaExchangeAlt />,
      color:
        "bg-amber-100 text-amber-700",
      path: "/admin/copies",
    },
  ];

  const quickActions = [
    {
      label: "Add New Book",
      description:
        "Register a new title in the catalog",
      icon: <FaPlus />,
      path: "/admin/books",
    },
    {
      label: "Manage Staff",
      description:
        "Manage librarian accounts",
      icon: <FaUserTie />,
      path: "/admin/staff",
    },
    {
      label: "View Reports",
      description:
        "Open library reports and summaries",
      icon: <FaChartBar />,
      path: "/admin/reports",
    },
    {
      label:
        "System Settings",
      description:
        "Update borrowing limits and periods",
      icon: <FaCog />,
      path: "/admin/settings",
    },
  ];

  const inventorySummary = [
    {
      label: "Available",
      value:
        availableCopies,
      icon:
        <FaCheckCircle />,
      iconStyle:
        "bg-emerald-100 text-emerald-700",
      barStyle:
        "bg-emerald-500",
    },
    {
      label: "Borrowed",
      value:
        borrowedCopies,
      icon:
        <FaExchangeAlt />,
      iconStyle:
        "bg-blue-100 text-blue-700",
      barStyle:
        "bg-blue-500",
    },
    {
      label: "Unavailable",
      value:
        unavailableCopies,
      icon: <FaCopy />,
      iconStyle:
        "bg-amber-100 text-amber-700",
      barStyle:
        "bg-amber-500",
    },
    {
      label:
        "Lost / Damaged",
      value:
        damagedOrLostCopies,
      icon:
        <FaExclamationTriangle />,
      iconStyle:
        "bg-red-100 text-red-700",
      barStyle:
        "bg-red-500",
    },
  ];

  const getActivityIcon = (
    action = ""
  ) => {
    const value =
      action.toUpperCase();

    if (
      value.includes("BOOK")
    ) {
      return {
        icon: <FaBook />,
        style:
          "bg-blue-100 text-blue-700",
      };
    }

    if (
      value.includes(
        "BACKUP"
      ) ||
      value.includes(
        "RESTORE"
      )
    ) {
      return {
        icon:
          <FaDatabase />,
        style:
          "bg-emerald-100 text-emerald-700",
      };
    }

    if (
      value.includes(
        "SETTING"
      )
    ) {
      return {
        icon: <FaCog />,
        style:
          "bg-amber-100 text-amber-700",
      };
    }

    if (
      value.includes(
        "USER"
      ) ||
      value.includes(
        "STAFF"
      )
    ) {
      return {
        icon:
          <FaUserTie />,
        style:
          "bg-violet-100 text-violet-700",
      };
    }

    return {
      icon:
        <FaClipboardList />,
      style:
        "bg-slate-100 text-slate-700",
    };
  };

  const formatAction = (
    action
  ) => {
    if (!action) {
      return "System Activity";
    }

    return action
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word
            .charAt(0)
            .toUpperCase() +
          word.slice(1)
      )
      .join(" ");
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

  const adminName = [
    currentUser.firstName,
    currentUser.middleName,
    currentUser.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const totalCopies =
    copies.length;

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-5 sm:mb-8">

        <p className="text-sm font-semibold text-blue-700">
          System Administration
        </p>

        <div className="mt-1 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome back,{" "}
              {currentUser.firstName ||
                "Administrator"}
              !
            </h1>

            {adminName && (
              <p className="mt-1 text-sm text-slate-500">
                {adminName}
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

      {/* CARDS */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map(
          (card) => (
            <button
              type="button"
              key={card.title}
              onClick={() =>
                navigate(
                  card.path
                )
              }
              className="group rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${card.color}`}
                >
                  {card.icon}
                </div>

                <FaArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700" />

              </div>

              <p className="mt-5 text-sm text-slate-500">
                {card.title}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {loading
                  ? "—"
                  : card.value.toLocaleString()}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {card.subtitle}
              </p>

            </button>
          )
        )}

      </section>

      {/* ACTIVITY + ACTIONS */}
      <div className="mt-6 grid gap-4 sm:gap-6 xl:grid-cols-[1.5fr_0.9fr]">

        {/* RECENT ACTIVITIES */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

          <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">

            <div className="flex min-w-0 items-start gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <FaClipboardList />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Recent Activities
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest administrative and system actions
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/logs"
                )
              }
              className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View all
              <FaArrowRight className="text-xs" />
            </button>

          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              Loading system activity...
            </div>
          ) : activities.length ===
            0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              No system activity recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {activities.map(
                (activity) => {
                  const activityIcon =
                    getActivityIcon(
                      activity.action
                    );

                  return (
                    <article
                      key={activity.id}
                      className="flex gap-3 px-4 py-4 transition hover:bg-blue-50/40 sm:gap-4 sm:px-6 sm:py-5"
                    >

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${activityIcon.style}`}
                      >
                        {activityIcon.icon}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                          <h3 className="font-semibold text-slate-900">
                            {formatAction(
                              activity.action
                            )}
                          </h3>

                          <span className="shrink-0 text-xs text-slate-400">
                            {formatDate(
                              activity.created_at
                            )}
                          </span>

                        </div>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {activity.description ||
                            `${activity.module || "System"} activity`}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {[
                            activity.first_name,
                            activity.last_name,
                          ]
                            .filter(Boolean)
                            .join(" ") ||
                            activity.school_id ||
                            "System"}
                        </p>

                      </div>

                    </article>
                  );
                }
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
            Common administrative tasks
          </p>

          <div className="mt-5 space-y-3">

            {quickActions.map(
              (action) => (
                <button
                  key={
                    action.label
                  }
                  type="button"
                  onClick={() =>
                    navigate(
                      action.path
                    )
                  }
                  className="flex w-full items-center gap-4 rounded-xl border border-slate-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    {action.icon}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="font-semibold text-slate-800">
                      {
                        action.label
                      }
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {
                        action.description
                      }
                    </p>

                  </div>

                  <FaArrowRight className="shrink-0 text-slate-300" />

                </button>
              )
            )}

          </div>

        </section>

      </div>

      {/* INVENTORY */}
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Inventory Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current status of physical book copies in the library.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/copies"
              )
            }
            className="flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
          >
            Manage copies
            <FaArrowRight className="text-xs" />
          </button>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {inventorySummary.map(
            (item) => {
              const percentage =
                totalCopies > 0
                  ? Math.round(
                      (item.value /
                        totalCopies) *
                        100
                    )
                  : 0;

              return (
                <article
                  key={item.label}
                  className="rounded-xl border border-slate-100 p-5 transition hover:border-blue-200 hover:bg-blue-50/30"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconStyle}`}
                      >
                        {item.icon}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {
                            item.label
                          }
                        </p>

                        <p className="text-sm text-slate-500">
                          {loading
                            ? "Loading..."
                            : `${item.value.toLocaleString()} book copies`}
                        </p>
                      </div>

                    </div>

                    <span className="text-sm font-bold text-slate-700">
                      {loading
                        ? "—"
                        : `${percentage}%`}
                    </span>

                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={`h-full rounded-full ${item.barStyle}`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </article>
              );
            }
          )}

        </div>

      </section>

    </AdminLayout>
  );
}

export default AdminDashboard;