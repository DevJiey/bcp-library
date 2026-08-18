import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaClipboardList,
  FaSearch,
  FaUserShield,
  FaUserTie,
  FaBook,
  FaCog,
  FaDatabase,
  FaExchangeAlt,
  FaBullhorn,
  FaUsers,
  FaSyncAlt,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import apiRequest from "../../services/api";

function Logs() {
  const [logs, setLogs] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [moduleFilter, setModuleFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await apiRequest(
          "/audit-logs?page=1&limit=100"
        );

      const data =
        response?.data;

      if (Array.isArray(data)) {
        setLogs(data);
      } else if (
        Array.isArray(data?.logs)
      ) {
        setLogs(data.logs);
      } else if (
        Array.isArray(data?.results)
      ) {
        setLogs(data.results);
      } else {
        setLogs([]);
      }
    } catch (err) {
      setError(
        err.message ||
          "Failed to load system logs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getUserName = (log) => {
    const fullName = [
      log.first_name,
      log.middle_name,
      log.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      fullName ||
      log.user_name ||
      log.school_id ||
      "System"
    );
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

  const modules =
    useMemo(() => {
      const values =
        logs
          .map(
            (log) =>
              log.module
          )
          .filter(Boolean);

      return [
        "All",
        ...new Set(values),
      ];
    }, [logs]);

  const filteredLogs =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return logs.filter(
        (log) => {
          const searchable =
            [
              getUserName(log),
              log.school_id,
              log.action,
              log.module,
              log.description,
              log.entity_type,
              log.entity_id,
              log.ip_address,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          const matchesSearch =
            !keyword ||
            searchable.includes(
              keyword
            );

          const matchesModule =
            moduleFilter ===
              "All" ||
            log.module ===
              moduleFilter;

          return (
            matchesSearch &&
            matchesModule
          );
        }
      );
    }, [
      logs,
      search,
      moduleFilter,
    ]);

  const getLogStyle = (
    log
  ) => {
    const module =
      String(
        log.module || ""
      ).toLowerCase();

    const action =
      String(
        log.action || ""
      ).toLowerCase();

    if (
      module.includes(
        "catalog"
      ) ||
      action.includes(
        "book"
      )
    ) {
      return {
        icon: <FaBook />,
        style:
          "bg-blue-100 text-blue-700",
      };
    }

    if (
      module.includes(
        "borrowing"
      ) ||
      module.includes(
        "return"
      ) ||
      action.includes(
        "borrow"
      ) ||
      action.includes(
        "return"
      )
    ) {
      return {
        icon:
          <FaExchangeAlt />,
        style:
          "bg-emerald-100 text-emerald-700",
      };
    }

    if (
      module.includes(
        "setting"
      ) ||
      action.includes(
        "setting"
      )
    ) {
      return {
        icon: <FaCog />,
        style:
          "bg-amber-100 text-amber-700",
      };
    }

    if (
      module.includes(
        "backup"
      ) ||
      action.includes(
        "backup"
      ) ||
      action.includes(
        "restore"
      )
    ) {
      return {
        icon:
          <FaDatabase />,
        style:
          "bg-violet-100 text-violet-700",
      };
    }

    if (
      module.includes(
        "announcement"
      )
    ) {
      return {
        icon:
          <FaBullhorn />,
        style:
          "bg-cyan-100 text-cyan-700",
      };
    }

    if (
      module.includes(
        "user"
      ) ||
      action.includes(
        "user"
      ) ||
      action.includes(
        "staff"
      )
    ) {
      return {
        icon: <FaUsers />,
        style:
          "bg-indigo-100 text-indigo-700",
      };
    }

    return {
      icon:
        <FaClipboardList />,
      style:
        "bg-slate-100 text-slate-700",
    };
  };

  const formatDate = (
    value
  ) => {
    if (!value) {
      return {
        date: "—",
        time: "",
      };
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return {
        date: value,
        time: "",
      };
    }

    return {
      date:
        date.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        ),

      time:
        date.toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
          }
        ),
    };
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-5 sm:mb-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-semibold text-blue-700">
              Audit and Activity
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              System Logs
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review recorded administrative and library system activities.
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadLogs
            }
            disabled={
              loading
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
          >
            <FaSyncAlt
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

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
              <FaClipboardList />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Activity Records
              </h2>

              <p className="text-sm text-slate-500">
                {loading
                  ? "Loading..."
                  : `${filteredLogs.length} log${
                      filteredLogs.length !==
                      1
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
                placeholder="Search user, action, or details..."
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                className="w-full px-3 py-2 outline-none sm:w-72"
              />

            </div>

            <select
              value={
                moduleFilter
              }
              onChange={(
                event
              ) =>
                setModuleFilter(
                  event.target
                    .value
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              {modules.map(
                (module) => (
                  <option
                    key={
                      module
                    }
                    value={
                      module
                    }
                  >
                    {module ===
                    "All"
                      ? "All Modules"
                      : module}
                  </option>
                )
              )}
            </select>

          </div>

        </div>

      </section>

      {/* LOGS */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">

        {loading ? (
          <div className="px-6 py-14 text-center text-sm text-slate-400">
            Loading system logs...
          </div>
        ) : (
          <div className="space-y-3">

            {filteredLogs.map(
              (log) => {
                const logStyle =
                  getLogStyle(
                    log
                  );

                const date =
                  formatDate(
                    log.created_at
                  );

                return (
                  <article
                    key={
                      log.id
                    }
                    className="flex flex-col gap-4 rounded-xl border border-slate-100 p-5 transition hover:border-blue-200 hover:bg-blue-50/30 sm:flex-row"
                  >

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${logStyle.style}`}
                    >
                      {
                        logStyle.icon
                      }
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">

                        <div>

                          <h2 className="font-bold text-slate-900">
                            {formatAction(
                              log.action
                            )}
                          </h2>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {log.description ||
                              "System activity recorded."}
                          </p>

                        </div>

                        <div className="shrink-0 lg:text-right">

                          <p className="text-sm font-medium text-slate-600">
                            {
                              date.date
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {
                              date.time
                            }
                          </p>

                        </div>

                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">

                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">

                          {log.role ===
                          "admin" ? (
                            <FaUserShield />
                          ) : (
                            <FaUserTie />
                          )}

                          {getUserName(
                            log
                          )}

                        </span>

                        {log.module && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {
                              log.module
                            }
                          </span>
                        )}

                        {log.entity_type && (
                          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                            {
                              log.entity_type
                            }
                            {log.entity_id
                              ? ` #${log.entity_id}`
                              : ""}
                          </span>
                        )}

                      </div>

                      {(log.ip_address ||
                        log.school_id) && (
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">

                          {log.school_id && (
                            <span>
                              School ID:{" "}
                              {
                                log.school_id
                              }
                            </span>
                          )}

                          {log.ip_address && (
                            <span>
                              IP:{" "}
                              {
                                log.ip_address
                              }
                            </span>
                          )}

                        </div>
                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

        {!loading &&
          filteredLogs.length ===
            0 && (
            <div className="px-6 py-14 text-center">

              <FaClipboardList className="mx-auto text-3xl text-slate-300" />

              <h2 className="mt-4 font-semibold text-slate-800">
                No system logs found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the search keyword or selected module.
              </p>

            </div>
          )}

      </section>

    </AdminLayout>
  );
}

export default Logs;