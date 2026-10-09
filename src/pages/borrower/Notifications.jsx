import {
  useEffect,
  useState,
} from "react";

import {
  FaBell,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBullhorn,
  FaUnlock,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";
import apiRequest from "../../services/api";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [markingAll, setMarkingAll] =
    useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        notificationsResponse,
        unreadResponse,
      ] = await Promise.all([
        apiRequest(
          "/notifications/me"
        ),
        apiRequest(
          "/notifications/me/unread-count"
        ),
      ]);

      setNotifications(
        notificationsResponse?.data ||
          []
      );

      setUnreadCount(
        unreadResponse?.data
          ?.unreadCount || 0
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
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

  const getNotificationStyle = (
    type
  ) => {
    if (
      type ===
      "overdue_warning"
    ) {
      return {
        icon: (
          <FaExclamationTriangle />
        ),
        iconStyle:
          "bg-red-100 text-red-700",
        labelStyle:
          "bg-red-100 text-red-700",
        label: "Urgent",
      };
    }

    if (
      type ===
      "account_unlocked"
    ) {
      return {
        icon: <FaUnlock />,
        iconStyle:
          "bg-emerald-100 text-emerald-700",
        labelStyle:
          "bg-emerald-100 text-emerald-700",
        label: "Account",
      };
    }

    if (
      type === "announcement"
    ) {
      return {
        icon: <FaBullhorn />,
        iconStyle:
          "bg-blue-100 text-blue-700",
        labelStyle:
          "bg-blue-100 text-blue-700",
        label: "Announcement",
      };
    }

    if (
      type ===
      "due_date_reminder"
    ) {
      return {
        icon: <FaClock />,
        iconStyle:
          "bg-amber-100 text-amber-700",
        labelStyle:
          "bg-amber-100 text-amber-700",
        label: "Reminder",
      };
    }

    return {
      icon: <FaCheckCircle />,
      iconStyle:
        "bg-slate-100 text-slate-700",
      labelStyle:
        "bg-slate-100 text-slate-700",
      label: "Update",
    };
  };

  const markAsRead = async (
    notification
  ) => {
    if (notification.is_read) {
      return;
    }

    try {
      await apiRequest(
        `/notifications/${notification.id}/read`,
        {
          method: "PATCH",
        }
      );

      setNotifications(
        (current) =>
          current.map((item) =>
            String(item.id) ===
            String(
              notification.id
            )
              ? {
                  ...item,
                  is_read: true,
                  read_at:
                    new Date().toISOString(),
                }
              : item
          )
      );

      setUnreadCount(
        (count) =>
          Math.max(
            0,
            count - 1
          )
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to mark notification as read."
      );
    }
  };

  const markAllAsRead =
    async () => {
      try {
        setMarkingAll(true);
        setError("");

        await apiRequest(
          "/notifications/read-all",
          {
            method: "PATCH",
          }
        );

        const now =
          new Date().toISOString();

        setNotifications(
          (current) =>
            current.map(
              (item) => ({
                ...item,
                is_read: true,
                read_at:
                  item.read_at ||
                  now,
              })
            )
        );

        setUnreadCount(0);
      } catch (err) {
        setError(
          err.message ||
            "Failed to mark notifications as read."
        );
      } finally {
        setMarkingAll(false);
      }
    };

  return (
    <BorrowerLayout>
      {/* Compact mobile header; desktop heading preserved */}
      <div className="mb-4 sm:mb-7">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0F4C97] sm:text-sm sm:normal-case sm:tracking-normal">Library Updates</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-3xl">Notifications</h1>
          <button type="button" onClick={loadNotifications} disabled={loading} className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs font-bold text-[#0F4C97] shadow-sm hover:bg-blue-50 disabled:opacity-50 sm:hidden">Refresh</button>
        </div>
        <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">Announcements and important borrowing alerts.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* NOTIFICATION CONTAINER */}
      <section className="overflow-hidden rounded-2xl bg-transparent shadow-none ring-0 sm:bg-white sm:shadow-sm sm:ring-1 sm:ring-slate-200">

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm sm:rounded-none sm:border-x-0 sm:border-t-0 sm:px-6 sm:py-5">

          <div className="flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaBell />

              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-lg">
                Recent Notifications
              </h2>

              <p className="text-xs text-slate-500 sm:text-sm">
                {
                  notifications.length
                }{" "}
                notification
                {notifications.length !==
                1
                  ? "s"
                  : ""}
                {unreadCount > 0
                  ? ` • ${unreadCount} unread`
                  : ""}
              </p>
            </div>

          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              disabled={
                markingAll
              }
              onClick={
                markAllAsRead
              }
              className="shrink-0 rounded-xl border border-blue-200 px-2.5 py-2 text-[11px] font-semibold text-[#0F4C97] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
            >
              {markingAll
                ? "Marking..."
                : "Mark all as read"}
            </button>
          )}

        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-slate-400">
            Loading notifications...
          </div>
        ) : (
          <div className="mt-3 space-y-3 sm:mt-0 sm:divide-y sm:divide-slate-100 sm:space-y-0">

            {notifications.map(
              (item) => {
                const style =
                  getNotificationStyle(
                    item.type
                  );

                return (
                  <article
                    key={item.id}
                    onClick={() =>
                      markAsRead(
                        item
                      )
                    }
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-100 px-3 py-4 shadow-sm transition sm:rounded-none sm:border-0 sm:px-6 sm:py-5 ${
                      item.is_read
                        ? "bg-white hover:bg-slate-50"
                        : "bg-blue-50/40 hover:bg-blue-50"
                    }`}
                  >

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${style.iconStyle}`}
                    >
                      {style.icon}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                          <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                            {item.title}
                          </h3>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-xs ${style.labelStyle}`}
                          >
                            {
                              style.label
                            }
                          </span>

                          {!item.is_read && (
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                          )}

                        </div>

                        <time className="shrink-0 text-xs font-medium text-slate-400">
                          {formatDate(
                            item.created_at
                          )}
                        </time>

                      </div>

                      <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                        {item.message}
                      </p>

                      {!item.is_read && (
                        <p className="mt-2 text-xs font-semibold text-blue-600">
                          Tap to mark as read
                        </p>
                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

        {!loading &&
          notifications.length ===
            0 && (
            <div className="mt-3 rounded-2xl bg-white px-6 py-16 text-center sm:mt-0">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FaBell />
              </div>

              <h2 className="mt-4 font-semibold text-slate-800">
                No notifications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                New library updates will appear here.
              </p>

            </div>
          )}

      </section>
    </BorrowerLayout>
  );
}

export default Notifications;