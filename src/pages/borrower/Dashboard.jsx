import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaBook,
  FaBullhorn,
  FaArrowRight,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";
import apiRequest from "../../services/api";

function BorrowerDashboard() {
  const navigate = useNavigate();

  const [borrowings, setBorrowings] =
    useState([]);

  const [announcements, setAnnouncements] =
    useState([]);

  const [bookAuthors, setBookAuthors] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const currentUser = useMemo(() => {
    try {
      const storedUser =
        localStorage.getItem(
          "currentUser"
        );

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          borrowingsResponse,
          announcementsResponse,
        ] = await Promise.all([
          apiRequest(
            "/borrowings/me"
          ),
          apiRequest(
            "/announcements/me"
          ),
        ]);

        const borrowingData =
          borrowingsResponse?.data || [];

        const announcementData =
          announcementsResponse?.data ||
          [];

        setBorrowings(
          borrowingData.slice(0, 3)
        );

        setAnnouncements(
          announcementData.slice(0, 5)
        );

        const uniqueBookIds = [
          ...new Set(
            borrowingData
              .slice(0, 3)
              .map(
                (borrowing) =>
                  borrowing.book_id
              )
              .filter(Boolean)
          ),
        ];

        if (
          uniqueBookIds.length > 0
        ) {
          const bookResponses =
            await Promise.all(
              uniqueBookIds.map(
                async (bookId) => {
                  try {
                    const response =
                      await apiRequest(
                        `/books/${bookId}`
                      );

                    return [
                      String(bookId),
                      response?.data,
                    ];
                  } catch {
                    return [
                      String(bookId),
                      null,
                    ];
                  }
                }
              )
            );

          const authorMap = {};

          bookResponses.forEach(
            ([bookId, book]) => {
              if (
                !book ||
                !Array.isArray(
                  book.authors
                )
              ) {
                return;
              }

              const names =
                book.authors
                  .map((author) =>
                    [
                      author.firstName,
                      author.middleName,
                      author.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")
                  )
                  .filter(Boolean)
                  .join(", ");

              authorMap[bookId] =
                names;
            }
          );

          setBookAuthors(authorMap);
        }
      } catch (err) {
        setError(
          err.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatDate = (value) => {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Not available";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const getBorrowingStatus = (
    borrowing
  ) => {
    if (
      borrowing.status === "returned"
    ) {
      return "Returned";
    }

    if (
      borrowing.status === "overdue"
    ) {
      return "Overdue";
    }

    if (
      borrowing.status === "borrowed"
    ) {
      const dueDate =
        new Date(
          borrowing.due_at
        ).getTime();

      const now = Date.now();

      const difference =
        dueDate - now;

      const oneDay =
        24 * 60 * 60 * 1000;

      if (
        difference > 0 &&
        difference <= oneDay
      ) {
        return "Due Soon";
      }

      return "Borrowed";
    }

    return borrowing.status
      ? borrowing.status
          .charAt(0)
          .toUpperCase() +
          borrowing.status.slice(1)
      : "Unknown";
  };

  const getStatusStyle = (
    status
  ) => {
    if (status === "Returned") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Overdue") {
      return "bg-red-100 text-red-700";
    }

    if (
      status === "Due Soon"
    ) {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  const getAnnouncementStyle = (
    index
  ) => {
    const styles = [
      "bg-blue-100 text-blue-700",
      "bg-amber-100 text-amber-700",
      "bg-emerald-100 text-emerald-700",
    ];

    return styles[
      index % styles.length
    ];
  };

  const fullName = [
    currentUser?.firstName,
    currentUser?.middleName,
    currentUser?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const initials = [
    currentUser?.firstName,
    currentUser?.lastName,
  ]
    .filter(Boolean)
    .map((name) =>
      name.charAt(0)
    )
    .join("")
    .toUpperCase();

  const borrowerLabel =
    currentUser?.borrowerType ===
    "faculty"
      ? "Faculty"
      : "Student";

  const accountStatus =
    currentUser?.accountStatus
      ? currentUser.accountStatus
          .charAt(0)
          .toUpperCase() +
        currentUser.accountStatus.slice(
          1
        )
      : "Unknown";

  return (
    <BorrowerLayout>
      <div className="mb-5 sm:mb-8">
        <p className="text-sm font-semibold text-blue-700">
          Borrower Dashboard
        </p>

        <div className="mt-1 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome back,{" "}
              {currentUser?.firstName ||
                "Borrower"}
              !
            </h1>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">

        {/* ACCOUNT + RECENT BORROWINGS */}
        <div className="order-2 grid gap-6 lg:order-1 lg:grid-cols-[0.85fr_1.55fr]">

          {/* BORROWER ACCOUNT */}
          <section className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:block">

            <div className="bg-gradient-to-r from-[#0F4C97] to-blue-700 p-6 text-white">
              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold ring-4 ring-white/10">
                  {initials || "BC"}
                </div>

                <div>
                  <p className="text-sm text-blue-100">
                    Borrower Account
                  </p>

                  <h2 className="text-xl font-bold">
                    {fullName ||
                      "Library Borrower"}
                  </h2>

                  <span className="mt-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                    {accountStatus}{" "}
                    {borrowerLabel}
                  </span>
                </div>

              </div>
            </div>

            <div className="space-y-4 p-6">

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  School ID
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {currentUser?.schoolId ||
                    "Not available"}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Borrower Type
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {borrowerLabel}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">
                  Account Status
                </span>

                <span
                  className={`text-sm font-semibold ${
                    currentUser?.accountStatus ===
                    "locked"
                      ? "text-red-600"
                      : "text-emerald-600"
                  }`}
                >
                  {accountStatus}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/borrower/profile"
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                View My Profile

                <FaArrowRight className="text-xs" />
              </button>
            </div>

          </section>

          {/* RECENT BORROWINGS */}
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
                onClick={() =>
                  navigate(
                    "/borrower/borrowings"
                  )
                }
                className="flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
              >
                View all

                <FaArrowRight className="text-xs" />
              </button>

            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-slate-400">
                Loading borrowing history...
              </div>
            ) : borrowings.length ===
              0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
                <FaBook className="mx-auto mb-3 text-2xl text-slate-300" />

                <p className="font-medium text-slate-600">
                  No borrowing history yet
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Books you borrow will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">

                {borrowings.map(
                  (book) => {
                    const status =
                      getBorrowingStatus(
                        book
                      );

                    return (
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
                            {bookAuthors[
                              String(
                                book.book_id
                              )
                            ] ||
                              book.isbn ||
                              book.accession_number ||
                              "Library Book"}
                          </p>

                        </div>

                        <div className="sm:text-right">

                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              status
                            )}`}
                          >
                            {status}
                          </span>

                          <p className="mt-2 text-xs text-slate-400">
                            {status ===
                            "Returned"
                              ? `Returned: ${formatDate(
                                  book.returned_at
                                )}`
                              : `Due: ${formatDate(
                                  book.due_at
                                )}`}
                          </p>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </section>
        </div>

        {/* ANNOUNCEMENTS */}
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

          {loading ? (
            <div className="py-10 text-center text-sm text-slate-400">
              Loading announcements...
            </div>
          ) : announcements.length ===
            0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
              <FaBullhorn className="mx-auto mb-3 text-2xl text-slate-300" />

              <p className="font-medium text-slate-600">
                No announcements
              </p>

              <p className="mt-1 text-sm text-slate-400">
                New library announcements will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">

              {announcements.map(
                (
                  announcement,
                  index
                ) => (
                  <article
                    key={
                      announcement.id
                    }
                    className="flex gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/40 sm:gap-4"
                  >

                    <div
                      className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getAnnouncementStyle(
                        index
                      )}`}
                    >
                      <FaBullhorn className="text-sm" />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                        <h3 className="font-semibold text-slate-900">
                          {
                            announcement.title
                          }
                        </h3>

                        <span className="shrink-0 text-xs text-slate-400">
                          {formatDate(
                            announcement.published_at ||
                              announcement.created_at
                          )}
                        </span>

                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
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

      </div>
    </BorrowerLayout>
  );
}

export default BorrowerDashboard;