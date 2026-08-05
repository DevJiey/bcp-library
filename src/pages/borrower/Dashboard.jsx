import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaBell,
  FaClock,
  FaMoneyBillWave,
  FaUser,
  FaBullhorn,
  FaArrowRight,
  FaHistory,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";

function BorrowerDashboard() {
  const navigate = useNavigate();

  const statistics = [
    {
      title: "Borrowed Books",
      value: "3",
      description: "Active borrowings",
      icon: <FaBook />,
      iconStyle: "bg-blue-100 text-blue-700",
      path: "/borrower/borrowings",
    },
    {
      title: "Due Soon",
      value: "1",
      description: "Book due this week",
      icon: <FaClock />,
      iconStyle: "bg-amber-100 text-amber-700",
      path: "/borrower/borrowings",
    },
    {
      title: "Outstanding Fines",
      value: "₱50",
      description: "Unpaid balance",
      icon: <FaMoneyBillWave />,
      iconStyle: "bg-red-100 text-red-700",
      path: "/borrower/fines",
    },
    {
      title: "Notifications",
      value: "2",
      description: "Unread notifications",
      icon: <FaBell />,
      iconStyle: "bg-emerald-100 text-emerald-700",
      path: "/borrower/notifications",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "New books are now available",
      message:
        "Explore the newest programming, cybersecurity, and database books.",
      date: "August 5, 2026",
      style: "bg-blue-100 text-blue-700",
    },
    {
      id: 2,
      title: "Library schedule reminder",
      message:
        "The library will close at 5:00 PM on Friday for maintenance.",
      date: "August 4, 2026",
      style: "bg-amber-100 text-amber-700",
    },
    {
      id: 3,
      title: "Return reminder",
      message:
        "Please return borrowed books on or before their due dates.",
      date: "August 3, 2026",
      style: "bg-red-100 text-red-700",
    },
  ];

  const recentBorrowings = [
    {
      id: 1,
      title: "Introduction to Cyber Security",
      author: "John Smith",
      dueDate: "August 15, 2026",
      status: "Borrowed",
    },
    {
      id: 2,
      title: "Web Development Fundamentals",
      author: "James Wilson",
      dueDate: "August 17, 2026",
      status: "Due Soon",
    },
    {
      id: 3,
      title: "Database Management Systems",
      author: "Maria Cruz",
      dueDate: "Returned",
      status: "Returned",
    },
  ];

  const quickActions = [
    {
      label: "Browse Books",
      description: "Search the library catalog",
      icon: <FaBook />,
      path: "/borrower/books",
    },
    {
      label: "Borrowing History",
      description: "View borrowed and returned books",
      icon: <FaHistory />,
      path: "/borrower/borrowings",
    },
    {
      label: "My Profile",
      description: "Update personal information",
      icon: <FaUser />,
      path: "/borrower/profile",
    },
    {
      label: "Notifications",
      description: "View library reminders",
      icon: <FaBell />,
      path: "/borrower/notifications",
    },
  ];

  return (
    <BorrowerLayout>
      {/* Page heading */}
      <div className="mb-7">
        <p className="text-sm font-semibold text-blue-700">
          Dashboard
        </p>

        <div className="mt-1 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, Ronald!
            </h1>

            <p className="mt-1 text-slate-500">
              Here is your latest library account summary.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            Wednesday, August 5, 2026
          </p>
        </div>
      </div>

      {/* Profile and announcements */}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.6fr]">
        {/* Borrower profile */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="bg-gradient-to-r from-[#0F4C97] to-blue-700 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold ring-4 ring-white/10">
                RC
              </div>

              <div>
                <p className="text-sm text-blue-100">
                  Borrower Account
                </p>

                <h2 className="text-xl font-bold">
                  Ronald Jay Cruz
                </h2>

                <span className="mt-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                  Active Student
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">
                Student ID
              </span>

              <span className="text-sm font-semibold text-slate-800">
                240116136
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">
                Borrower Type
              </span>

              <span className="text-sm font-semibold text-slate-800">
                Student
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-100 pb-3">
              <span className="text-sm text-slate-500">
                Program
              </span>

              <span className="text-right text-sm font-semibold text-slate-800">
                BS Information Technology
              </span>
            </div>

            <button
              onClick={() => navigate("/borrower/profile")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              View My Profile
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </section>

        {/* Announcements */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaBullhorn />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Library Announcements
              </h2>

              <p className="text-sm text-slate-500">
                Important news and reminders
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="flex gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${announcement.style}`}
                >
                  <FaBullhorn className="text-sm" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-slate-900">
                      {announcement.title}
                    </h3>

                    <span className="text-xs text-slate-400">
                      {announcement.date}
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {announcement.message}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Account overview */}
      <section className="mt-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Account Overview
          </h2>

          <p className="text-sm text-slate-500">
            Quick summary of your library activity
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => (
            <button
              key={item.title}
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

      {/* Recently borrowed and quick actions */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recently Borrowed
              </h2>

              <p className="text-sm text-slate-500">
                Your latest borrowing transactions
              </p>
            </div>

            <button
              onClick={() => navigate("/borrower/borrowings")}
              className="flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View all
              <FaArrowRight className="text-xs" />
            </button>
          </div>

          <div className="space-y-3">
            {recentBorrowings.map((book) => (
              <div
                key={book.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-slate-50 sm:flex-row sm:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <FaBook />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-slate-900">
                    {book.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {book.author}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      book.status === "Returned"
                        ? "bg-emerald-100 text-emerald-700"
                        : book.status === "Due Soon"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {book.status}
                  </span>

                  <p className="mt-2 text-xs text-slate-400">
                    {book.status === "Returned"
                      ? book.dueDate
                      : `Due: ${book.dueDate}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="text-sm text-slate-500">
              Common borrower tasks
            </p>
          </div>

          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="group flex w-full items-center gap-4 rounded-xl border border-slate-100 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                  {action.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">
                    {action.label}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {action.description}
                  </p>
                </div>

                <FaArrowRight className="text-xs text-slate-300 group-hover:text-blue-700" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </BorrowerLayout>
  );
}

export default BorrowerDashboard;