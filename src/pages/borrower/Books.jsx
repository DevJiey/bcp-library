import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    FaSearch,
    FaTimes,
    FaBookOpen,
    FaBook,
} from "react-icons/fa";

import BorrowerLayout from "../../layouts/BorrowerLayout";

import { useToast } from "../../context/ToastContext";

import apiRequest from "../../services/api";

function Books() {
    const { showToast } = useToast();

    const [search, setSearch] =
        useState("");

    const [books, setBooks] =
        useState([]);

    const [selectedBook, setSelectedBook] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [requestingBookId, setRequestingBookId] =
        useState(null);

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

    const loadBooks = async (
        keyword = ""
    ) => {
        try {
            setLoading(true);
            setError("");

            const query =
                keyword.trim()
                    ? `?search=${encodeURIComponent(
                        keyword.trim()
                    )}`
                    : "";

            const response =
                await apiRequest(
                    `/books/search${query}`
                );

            setBooks(
                response?.data || []
            );
        } catch (err) {
            setError(
                err.message ||
                "Failed to load books."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(
            () => {
                loadBooks(search);
            },
            300
        );

        return () =>
            clearTimeout(delay);
    }, [search]);

    const getAuthorNames = (
        authors = []
    ) => {
        if (
            !Array.isArray(authors) ||
            authors.length === 0
        ) {
            return "Unknown Author";
        }

        return authors
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
    };

    const getAvailability = (
        book
    ) => {
        const availableCopies =
            Number(
                book.available_copies ||
                0
            );

        return {
            availableCopies,
            totalCopies:
                Number(
                    book.total_copies ||
                    0
                ),
            label:
                availableCopies > 0
                    ? "Available"
                    : "Unavailable",
        };
    };

    const handleBorrowRequest =
        async (book) => {
            try {
                setRequestingBookId(
                    book.id
                );

                await apiRequest(
                    "/borrow-requests",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            bookId:
                                Number(
                                    book.id
                                ),
                        }),
                    }
                );

                showToast(
                    "Borrow request submitted successfully!",
                    "success"
                );

                setSelectedBook(null);

                await loadBooks(
                    search
                );
            } catch (err) {
                showToast(
                    err.message ||
                    "Failed to submit borrow request.",
                    "error"
                );
            } finally {
                setRequestingBookId(
                    null
                );
            }
        };

    return (
        <BorrowerLayout>
            <div className="mb-5 sm:mb-8">
                <p className="text-sm font-semibold text-blue-700">
                    Library Catalog
                </p>

                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Search Books
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Browse available books and submit a borrow request.
                </p>
            </div>

            {currentUser?.accountStatus ===
                "locked" && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                        Your borrowing account is currently locked due to an overdue book.
                        You can still browse the catalog, but new borrow requests are disabled.
                    </div>
                )}

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <input
                    type="text"
                    placeholder="Search by title, ISBN, author, or category..."
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />
            </div>

            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-slate-700">
                                Title
                            </th>

                            <th className="p-4 text-left text-sm font-semibold text-slate-700">
                                Author
                            </th>

                            <th className="p-4 text-left text-sm font-semibold text-slate-700">
                                Category
                            </th>

                            <th className="p-4 text-left text-sm font-semibold text-slate-700">
                                Availability
                            </th>

                            <th className="p-4 text-left text-sm font-semibold text-slate-700">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {!loading &&
                            books.map(
                                (book) => {
                                    const availability =
                                        getAvailability(
                                            book
                                        );

                                    return (
                                        <tr
                                            key={
                                                book.id
                                            }
                                            className="border-t border-slate-100 transition hover:bg-blue-50/40"
                                        >
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {
                                                            book.title
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        ISBN:{" "}
                                                        {book.isbn ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="p-4 text-sm text-slate-600">
                                                {getAuthorNames(
                                                    book.authors
                                                )}
                                            </td>

                                            <td className="p-4">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {book.category_name ||
                                                        "Uncategorized"}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <div>
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${availability.availableCopies >
                                                            0
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-amber-100 text-amber-700"
                                                            }`}
                                                    >
                                                        {
                                                            availability.label
                                                        }
                                                    </span>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {
                                                            availability.availableCopies
                                                        }{" "}
                                                        of{" "}
                                                        {
                                                            availability.totalCopies
                                                        }{" "}
                                                        copies
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="p-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedBook(
                                                            book
                                                        )
                                                    }
                                                    className="rounded-lg bg-[#0F4C97] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                    </tbody>
                </table>

                {loading && (
                    <div className="px-6 py-14 text-center text-sm text-slate-400">
                        Loading books...
                    </div>
                )}

                {!loading &&
                    books.length ===
                    0 && (
                        <div className="px-6 py-14 text-center">
                            <h2 className="font-semibold text-slate-800">
                                No books found
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Try another title, author, ISBN, or category.
                            </p>
                        </div>
                    )}
            </div>

            {selectedBook && (() => {
                const availability =
                    getAvailability(selectedBook);

                const canRequest =
                    availability.availableCopies > 0 &&
                    currentUser?.accountStatus !== "locked";

                const isSubmitting =
                    String(requestingBookId) ===
                    String(selectedBook.id);

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

                        <div className="flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                            {/* HEADER */}
                            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-4 text-white">

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-100">
                                        BCP Library Catalog
                                    </p>

                                    <h2 className="mt-0.5 text-lg font-bold">
                                        Book Details
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        setSelectedBook(null)
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-white/15 disabled:opacity-50"
                                    aria-label="Close book details"
                                >
                                    ×
                                </button>
                            </div>

                            {/* SCROLLABLE CONTENT */}
                            <div className="overflow-y-auto p-5">

                                {/* BOOK */}
                                <div className="flex items-start gap-4">

                                    <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">

                                        {selectedBook.cover_image_url ? (
                                            <img
                                                src={
                                                    selectedBook.cover_image_url
                                                }
                                                alt={
                                                    selectedBook.title
                                                }
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <FaBook className="text-xl text-blue-600" />
                                        )}

                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <p className="text-xs font-semibold text-blue-600">
                                            Library Book
                                        </p>

                                        <h3 className="mt-1 text-xl font-bold leading-snug text-slate-900">
                                            {selectedBook.title}
                                        </h3>

                                        <p className="mt-2 text-xs text-slate-500">
                                            ISBN:{" "}
                                            {selectedBook.isbn ||
                                                "N/A"}
                                        </p>

                                    </div>
                                </div>

                                {/* DETAILS */}
                                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">

                                    <div className="flex items-start justify-between gap-5 border-b border-slate-100 px-4 py-2.5">
                                        <span className="text-sm text-slate-500">
                                            Author
                                        </span>

                                        <span className="text-right text-sm font-semibold text-slate-800">
                                            {getAuthorNames(
                                                selectedBook.authors
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-5 border-b border-slate-100 px-4 py-2.5">
                                        <span className="text-sm text-slate-500">
                                            Category
                                        </span>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {selectedBook.category_name ||
                                                "Uncategorized"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-5 border-b border-slate-100 px-4 py-2.5">
                                        <span className="text-sm text-slate-500">
                                            Publisher
                                        </span>

                                        <span className="text-right text-sm font-semibold text-slate-800">
                                            {selectedBook.publisher_name ||
                                                "Not specified"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-5 border-b border-slate-100 px-4 py-2.5">
                                        <span className="text-sm text-slate-500">
                                            Publication Year
                                        </span>

                                        <span className="text-sm font-semibold text-slate-800">
                                            {selectedBook.publication_year ||
                                                "N/A"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-5 px-4 py-2.5">

                                        <span className="text-sm text-slate-500">
                                            Availability
                                        </span>

                                        <div className="text-right">

                                            <span
                                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${availability.availableCopies >
                                                    0
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                                    }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-full ${availability.availableCopies >
                                                        0
                                                        ? "bg-emerald-500"
                                                        : "bg-amber-500"
                                                        }`}
                                                />

                                                {availability.label}
                                            </span>

                                            <p className="mt-1 text-[11px] text-slate-400">
                                                {
                                                    availability.availableCopies
                                                }{" "}
                                                available
                                            </p>

                                        </div>
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                {selectedBook.description && (
                                    <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">

                                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                            Description
                                        </p>

                                        <p className="mt-1.5 line-clamp-3 text-sm leading-5 text-slate-600">
                                            {
                                                selectedBook.description
                                            }
                                        </p>

                                    </div>
                                )}

                            </div>

                            {/* ACTIONS */}
                            <div className="flex shrink-0 gap-3 border-t border-slate-100 bg-white px-5 py-4">

                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        setSelectedBook(null)
                                    }
                                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        !canRequest ||
                                        isSubmitting
                                    }
                                    onClick={() =>
                                        handleBorrowRequest(
                                            selectedBook
                                        )
                                    }
                                    className={`flex-[1.4] rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${canRequest &&
                                        !isSubmitting
                                        ? "bg-[#0F4C97] hover:bg-blue-800"
                                        : "cursor-not-allowed bg-slate-300"
                                        }`}
                                >
                                    {isSubmitting
                                        ? "Submitting..."
                                        : currentUser?.accountStatus ===
                                            "locked"
                                            ? "Account Locked"
                                            : availability.availableCopies >
                                                0
                                                ? "Request to Borrow"
                                                : "Currently Unavailable"}
                                </button>

                            </div>

                        </div>
                    </div>
                );
            })()}
        </BorrowerLayout>
    );
}

export default Books;