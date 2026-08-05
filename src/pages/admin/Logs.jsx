import { useState } from "react";
import {
  FaClipboardList,
  FaSearch,
  FaUserShield,
  FaUserTie,
  FaBook,
  FaCog,
  FaDatabase,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

function Logs() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const logs = [
    {
      id: 1,
      user: "Administrator",
      role: "Admin",
      action: "Added a new book",
      details: "Advanced Database Systems",
      type: "Book",
      date: "2026-08-05",
      time: "10:35 AM",
    },
    {
      id: 2,
      user: "Angela Reyes",
      role: "Librarian",
      action: "Approved borrow request",
      details: "Juan Dela Cruz — Effective Java",
      type: "Transaction",
      date: "2026-08-05",
      time: "10:10 AM",
    },
    {
      id: 3,
      user: "Administrator",
      role: "Admin",
      action: "Updated system settings",
      details: "Student borrow duration changed to 7 days",
      type: "Settings",
      date: "2026-08-05",
      time: "9:40 AM",
    },
    {
      id: 4,
      user: "Mark Santos",
      role: "Librarian",
      action: "Processed book return",
      details: "Database Management Systems",
      type: "Transaction",
      date: "2026-08-05",
      time: "9:15 AM",
    },
    {
      id: 5,
      user: "Administrator",
      role: "Admin",
      action: "Created database backup",
      details: "Manual backup completed successfully",
      type: "Backup",
      date: "2026-08-05",
      time: "8:30 AM",
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      log.user.toLowerCase().includes(keyword) ||
      log.action.toLowerCase().includes(keyword) ||
      log.details.toLowerCase().includes(keyword);

    const matchesType =
      typeFilter === "All" || log.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const getLogStyle = (type) => {
    if (type === "Book") {
      return {
        icon: <FaBook />,
        style: "bg-blue-100 text-blue-700",
      };
    }

    if (type === "Transaction") {
      return {
        icon: <FaUserTie />,
        style: "bg-emerald-100 text-emerald-700",
      };
    }

    if (type === "Settings") {
      return {
        icon: <FaCog />,
        style: "bg-amber-100 text-amber-700",
      };
    }

    return {
      icon: <FaDatabase />,
      style: "bg-violet-100 text-violet-700",
    };
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">
          Audit and Activity
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          System Logs
        </h1>

        <p className="mt-2 text-slate-500">
          Review administrative, staff, transaction, and system activity records.
        </p>
      </div>

      {/* Toolbar */}
      <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaClipboardList />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Activity Records
              </h2>

              <p className="text-sm text-slate-500">
                {filteredLogs.length} log
                {filteredLogs.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
              <FaSearch className="text-slate-400" />

              <input
                type="text"
                placeholder="Search user, action, or details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 outline-none sm:w-72"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">All Types</option>
              <option value="Book">Book</option>
              <option value="Transaction">Transaction</option>
              <option value="Settings">Settings</option>
              <option value="Backup">Backup</option>
            </select>
          </div>
        </div>
      </section>

      {/* Logs Timeline */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="space-y-4">
          {filteredLogs.map((log) => {
            const logStyle = getLogStyle(log.type);

            return (
              <article
                key={log.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-100 p-5 transition hover:border-blue-200 hover:bg-blue-50/30 sm:flex-row"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${logStyle.style}`}
                >
                  {logStyle.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="font-bold text-slate-900">
                        {log.action}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {log.details}
                      </p>
                    </div>

                    <div className="text-left lg:text-right">
                      <p className="text-sm font-medium text-slate-600">
                        {log.date}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {log.time}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {log.role === "Admin" ? (
                        <FaUserShield />
                      ) : (
                        <FaUserTie />
                      )}

                      {log.user}
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {log.type}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="px-6 py-14 text-center">
            <FaClipboardList className="mx-auto text-3xl text-slate-300" />

            <h2 className="mt-4 font-semibold text-slate-800">
              No system logs found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search keyword or selected type.
            </p>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

export default Logs;