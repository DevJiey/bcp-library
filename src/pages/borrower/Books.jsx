import { useState } from "react";
import BorrowerLayout from "../../layouts/BorrowerLayout";
import books from "../../data/books";
import { useToast } from "../../context/ToastContext";

function Books() {
    const { showToast } = useToast();
    const [search, setSearch] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const filteredBooks = books.filter((book) => {
        const keyword = search.toLowerCase();

        return (
            book.title.toLowerCase().includes(keyword) ||
            book.author.toLowerCase().includes(keyword) ||
            book.category.toLowerCase().includes(keyword)
        );
    });

    return (
        <BorrowerLayout>
            <div className="mb-8">

                <p className="text-sm font-semibold text-blue-700">
                    Library Catalog
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Search Books
                </h1>

                <p className="mt-2 text-slate-500">
                    Browse the BCP Library collection and request available books.
                </p>
            </div>

            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <input
                    type="text"
                    placeholder="Search by title, author, or category..."
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Author</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredBooks.map((book) => (
                            <tr
                                key={book.id}
                                className="border-t border-slate-100 transition hover:bg-blue-50/40"
                            >
                                <td className="p-3">{book.title}</td>
                                <td className="p-3">{book.author}</td>
                                <td className="p-3">{book.category}</td>
                                <td className="p-3">{book.status}</td>

                                <td className="p-4">
                                    <button
                                        onClick={() => setSelectedBook(book)}
                                        className="rounded-lg bg-[#0F4C97] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-blue-100">
                                    BCP Library Catalog
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    Book Details
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedBook(null)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-xl transition hover:bg-white/15"
                                aria-label="Close book details"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-blue-700">
                                        Library Book
                                    </p>

                                    <h3 className="mt-1 text-2xl font-bold leading-tight text-slate-900">
                                        {selectedBook.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                    <span className="text-sm text-slate-500">
                                        Author
                                    </span>

                                    <span className="text-sm font-semibold text-slate-800">
                                        {selectedBook.author}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                    <span className="text-sm text-slate-500">
                                        Category
                                    </span>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {selectedBook.category}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-slate-500">
                                        Availability
                                    </span>

                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${selectedBook.status === "Available"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${selectedBook.status === "Available"
                                                    ? "bg-emerald-500"
                                                    : "bg-amber-500"
                                                }`}
                                        />

                                        {selectedBook.status}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedBook(null)}
                                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    disabled={selectedBook.status !== "Available"}
                                    onClick={() => {
                                        showToast("Request sent successfully!", "success");
                                        setSelectedBook(null);
                                    }}
                                    className={`flex-[1.5] rounded-xl px-4 py-3 font-semibold text-white transition ${selectedBook.status === "Available"
                                            ? "bg-[#0F4C97] hover:bg-blue-800"
                                            : "cursor-not-allowed bg-slate-300"
                                        }`}
                                >
                                    {selectedBook.status === "Available"
                                        ? "Request to Borrow"
                                        : "Currently Unavailable"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </BorrowerLayout>

    );
}

export default Books;