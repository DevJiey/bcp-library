import {
  FaBell,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";
import notifications from "../../data/notifications";

function Notifications() {
  const getNotificationStyle = (type) => {
    if (type === "Due Date Reminder") {
      return {
        icon: <FaClock />,
        iconStyle: "bg-amber-100 text-amber-700",
        labelStyle: "bg-amber-100 text-amber-700",
      };
    }

    if (type === "Overdue Notice") {
      return {
        icon: <FaExclamationTriangle />,
        iconStyle: "bg-red-100 text-red-700",
        labelStyle: "bg-red-100 text-red-700",
      };
    }

    return {
      icon: <FaCheckCircle />,
      iconStyle: "bg-emerald-100 text-emerald-700",
      labelStyle: "bg-emerald-100 text-emerald-700",
    };
  };

  return (
    <BorrowerLayout>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">
          Library Updates
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Notifications
        </h1>

        <p className="mt-2 text-slate-500">
          View due-date reminders, overdue notices, and reservation updates.
        </p>
      </div>

      {/* Notification Container */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaBell />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Notifications
              </h2>

              <p className="text-sm text-slate-500">
                {notifications.length} notification
                {notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.map((item) => {
            const style = getNotificationStyle(item.type);

            return (
              <article
                key={item.id}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-blue-50/40 sm:flex-row sm:items-start"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.iconStyle}`}
                >
                  {style.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-bold text-slate-900">
                        {item.type}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${style.labelStyle}`}
                      >
                        {item.type === "Reservation Ready"
                          ? "Ready"
                          : item.type === "Overdue Notice"
                          ? "Urgent"
                          : "Reminder"}
                      </span>
                    </div>

                    <time className="text-xs font-medium text-slate-400">
                      {item.date}
                    </time>
                  </div>

                  <p className="mt-2 leading-6 text-slate-600">
                    {item.message}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="px-6 py-16 text-center">
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