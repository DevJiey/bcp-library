import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaBullhorn,
  FaArrowRight,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";

function BorrowerDashboard() {
  const navigate = useNavigate();

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

  return (
    <BorrowerLayout>
      {/* Parent wrapper controls responsive order */}
      <div className="flex flex-col gap-6">
        {/* Account and recent borrowings:
            second on mobile, first on desktop */}
        <div className="order-2 grid gap-6 lg:order-1 lg:grid-cols-[0.85fr_1.55fr]">
          {/* Borrower account - desktop only */}
          <section className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:block">
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
                type="button"
                onClick={() => navigate("/borrower/profile")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                View My Profile
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </section>

          {/* Recently borrowed */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Recently Borrowed
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest borrowing transactions
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/borrower/borrowings")}
                className="flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
              >
                View all
                <FaArrowRight className="text-xs" />
              </button>
            </div>

            <div className="space-y-3">
              {recentBorrowings.map((book) => (
                <article
                  key={book.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-slate-50 sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <FaBook />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 sm:truncate">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
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
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Announcements:
            first on mobile, second on desktop */}
        <section className="order-1 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6 lg:order-2">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaBullhorn />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
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
                className="flex gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/40 sm:gap-4"
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

                    <span className="shrink-0 text-xs text-slate-400">
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
    </BorrowerLayout>
  );
}

export default BorrowerDashboard;