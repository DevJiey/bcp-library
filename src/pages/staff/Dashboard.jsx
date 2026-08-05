import { useNavigate } from "react-router-dom";
import {
  FaClipboardCheck,
  FaBookOpen,
  FaUndo,
  FaExclamationTriangle,
  FaArrowRight,
  FaUser,
  FaClock,
  FaReceipt,
} from "react-icons/fa";

import StaffLayout from "../../layouts/StaffLayout";

function StaffDashboard() {
  const navigate = useNavigate();

  const statistics = [
    {
      title: "Pending Requests",
      value: "12",
      description: "Waiting for approval",
      icon: <FaClipboardCheck />,
      iconStyle: "bg-amber-100 text-amber-700",
      path: "/staff/requests",
    },
    {
      title: "Borrowed Today",
      value: "25",
      description: "Books issued today",
      icon: <FaBookOpen />,
      iconStyle: "bg-blue-100 text-blue-700",
      path: "/staff/requests",
    },
    {
      title: "Returned Today",
      value: "18",
      description: "Books returned today",
      icon: <FaUndo />,
      iconStyle: "bg-emerald-100 text-emerald-700",
      path: "/staff/returns",
    },
    {
      title: "Overdue Books",
      value: "6",
      description: "Require attention",
      icon: <FaExclamationTriangle />,
      iconStyle: "bg-red-100 text-red-700",
      path: "/staff/returns",
    },
  ];

  const recentRequests = [
    {
      id: 1,
      borrower: "Juan Dela Cruz",
      book: "Introduction to Cyber Security",
      time: "8:15 AM",
      status: "Pending",
    },
    {
      id: 2,
      borrower: "Maria Santos",
      book: "Database Management Systems",
      time: "9:20 AM",
      status: "Pending",
    },
    {
      id: 3,
      borrower: "Carlo Reyes",
      book: "Web Development Fundamentals",
      time: "10:05 AM",
      status: "Approved",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Book returned",
      description: "Database Management Systems",
      time: "10 minutes ago",
      icon: <FaUndo />,
      iconStyle: "bg-emerald-100 text-emerald-700",
    },
    {
      id: 2,
      title: "Borrow request approved",
      description: "Introduction to Cyber Security",
      time: "25 minutes ago",
      icon: <FaClipboardCheck />,
      iconStyle: "bg-blue-100 text-blue-700",
    },
    {
      id: 3,
      title: "Fine payment collected",
      description: "₱50 from Juan Dela Cruz",
      time: "1 hour ago",
      icon: <FaReceipt />,
      iconStyle: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <StaffLayout>
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-700">
          Staff Dashboard
        </p>

        <div className="mt-1 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, Librarian!
            </h1>

            <p className="mt-2 text-slate-500">
              Monitor today&apos;s library transactions and pending tasks.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            Wednesday, August 5, 2026
          </p>
        </div>
      </div>

      {/* Statistics */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(item.path)}
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
                {item.value}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        {/* Recent Borrow Requests */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Borrow Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest book requests from borrowers
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/staff/requests")}
              className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View all
              <FaArrowRight className="text-xs" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-blue-50/40 sm:flex-row sm:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <FaUser />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">
                    {request.borrower}
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {request.book}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      request.status === "Approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {request.status}
                  </span>

                  <p className="mt-2 flex items-center gap-1 text-xs text-slate-400 sm:justify-end">
                    <FaClock />
                    {request.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest staff transactions
            </p>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 rounded-xl border border-slate-100 p-4"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${activity.iconStyle}`}
                >
                  {activity.icon}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {activity.description}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </StaffLayout>
  );
}

export default StaffDashboard;