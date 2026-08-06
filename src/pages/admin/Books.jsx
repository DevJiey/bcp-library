import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import {
    FaBook,
    FaPlus,
    FaSearch,
    FaEdit,
    FaArchive,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import adminBooksData from "../../data/adminBooks";

function AdminBooks() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const [books, setBooks] = useState(adminBooksData);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    const [newBook, setNewBook] = useState({
        isbn: "",
        title: "",
        author: "",
        category: "",
        publisher: "",
        copies: 1,
        availableCopies: 1,
        status: "Active",
    });

    const categories = [
        "All",
        ...new Set(
            books.map((book) => book.category)
        ),
    ];

    const filteredBooks = books.filter((book) => {
        const keyword = search.toLowerCase();

        const matchesSearch =
            book.title.toLowerCase().includes(keyword) ||
            book.author.toLowerCase().includes(keyword) ||
            book.isbn.toLowerCase().includes(keyword);

        const matchesCategory =
            categoryFilter === "All" ||
            book.category === categoryFilter;

        const matchesStatus =
            statusFilter === "All" ||
            book.status === statusFilter;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
        );
    });
    const handleAddBook = () => {
        if (
            !newBook.isbn.trim() ||
            !newBook.title.trim() ||
            !newBook.author.trim() ||
            !newBook.category.trim() ||
            !newBook.publisher.trim()
        ) {
            showToast("Please complete all book information.", "error");
            return;
        }

        const book = {
            id: Date.now(),
            ...newBook,
            copies: Number(newBook.copies),
            availableCopies: Number(newBook.availableCopies),
        };

        setBooks([...books, book]);
        setShowAddModal(false);

        setNewBook({
            isbn: "",
            title: "",
            author: "",
            category: "",
            publisher: "",
            copies: 1,
            availableCopies: 1,
            status: "Active",
        });
    };

    const handleUpdateBook = () => {
        if (
            !editingBook.isbn.trim() ||
            !editingBook.title.trim() ||
            !editingBook.author.trim() ||
            !editingBook.category.trim() ||
            !editingBook.publisher.trim()
        ) {
            showToast("Please complete all book information.", "error");
            return;
        }

        setBooks(
            books.map((book) =>
                book.id === editingBook.id
                    ? {
                        ...editingBook,
                        copies: Number(editingBook.copies),
                        availableCopies: Number(editingBook.availableCopies),
                    }
                    : book
            )
        );

        setEditingBook(null);
    };

    const toggleArchive = (id) => {
        setBooks(
            books.map((book) =>
                book.id === id
                    ? {
                        ...book,
                        status:
                            book.status === "Active"
                                ? "Archived"
                                : "Active",
                    }
                    : book
            )
        );
    };

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Library Catalog
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Book Management
                    </h1>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-3 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-800"
                >
                    <FaPlus />
                    Add New Book
                </button>
            </div>

            {/* Search and Filters */}
            <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <FaBook />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">
                                Library Books
                            </h2>

                            <p className="text-sm text-slate-500">
                                {filteredBooks.length} book
                                {filteredBooks.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                found
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row">
                        <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
                            <FaSearch className="text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search title, author, or ISBN..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full px-3 py-2 outline-none md:w-64"
                            />
                        </div>

                        <select
                            value={categoryFilter}
                            onChange={(e) =>
                                setCategoryFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                        >
                            {categories.map((category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category === "All"
                                        ? "All Categories"
                                        : category}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="All">
                                All Status
                            </option>

                            <option value="Active">
                                Active
                            </option>

                            <option value="Archived">
                                Archived
                            </option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Books Table */}
            {loading ? (
                <LoadingSkeleton
                    rows={5}
                    columns={6}
                />
            ) : (
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px]">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        Book
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        ISBN
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        Category
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        Copies
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBooks.map((book) => (
                                    <tr
                                        key={book.id}
                                        className="border-t border-slate-100 transition hover:bg-blue-50/40"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                    <FaBook />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {book.title}
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {book.author}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {book.publisher}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-600">
                                            {book.isbn}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                {book.category}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-900">
                                                {book.availableCopies} available
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {book.copies} total copies
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${book.status === "Active"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-200 text-slate-600"
                                                    }`}
                                            >
                                                {book.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingBook({ ...book })}
                                                    className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                                >
                                                    <FaEdit />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => toggleArchive(book.id)}
                                                    className="flex items-center gap-2 rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
                                                >
                                                    <FaArchive />
                                                    {book.status === "Active" ? "Archive" : "Restore"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
            {/* Empty State */}
            {loading ? (
                <LoadingSkeleton rows={5} columns={6} />
            ) : filteredBooks.length > 0 ? (
                <section>
                    {/* table */}
                </section>
            ) : (
                <EmptyState
                    icon={<FaBook />}
                    title="No books found"
                    message="Try changing your search keyword or selected filters."
                    actionLabel="Add New Book"
                    onAction={() => setShowAddModal(true)}
                />
            )}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                                    Library Catalog
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    Add New Book
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid gap-5 p-6 md:grid-cols-2">
                            <BookField
                                label="ISBN"
                                value={newBook.isbn}
                                onChange={(value) =>
                                    setNewBook({ ...newBook, isbn: value })
                                }
                            />

                            <BookField
                                label="Book Title"
                                value={newBook.title}
                                onChange={(value) =>
                                    setNewBook({ ...newBook, title: value })
                                }
                            />

                            <BookField
                                label="Author"
                                value={newBook.author}
                                onChange={(value) =>
                                    setNewBook({ ...newBook, author: value })
                                }
                            />

                            <BookField
                                label="Category"
                                value={newBook.category}
                                onChange={(value) =>
                                    setNewBook({ ...newBook, category: value })
                                }
                            />

                            <BookField
                                label="Publisher"
                                value={newBook.publisher}
                                onChange={(value) =>
                                    setNewBook({ ...newBook, publisher: value })
                                }
                            />

                            <BookField
                                label="Total Copies"
                                type="number"
                                value={newBook.copies}
                                onChange={(value) =>
                                    setNewBook({
                                        ...newBook,
                                        copies: value,
                                        availableCopies: value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleAddBook}
                                className="rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                            >
                                Save Book
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editingBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                                    Catalog Record
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    Edit Book
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingBook(null)}
                                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid gap-5 p-6 md:grid-cols-2">
                            <BookField
                                label="ISBN"
                                value={editingBook.isbn}
                                onChange={(value) =>
                                    setEditingBook({
                                        ...editingBook,
                                        isbn: value,
                                    })
                                }
                            />

                            <BookField
                                label="Book Title"
                                value={editingBook.title}
                                onChange={(value) =>
                                    setEditingBook({
                                        ...editingBook,
                                        title: value,
                                    })
                                }
                            />

                            <BookField
                                label="Author"
                                value={editingBook.author}
                                onChange={(value) =>
                                    setEditingBook({
                                        ...editingBook,
                                        author: value,
                                    })
                                }
                            />

                            <BookField
                                label="Category"
                                value={editingBook.category}
                                onChange={(value) =>
                                    setEditingBook({
                                        ...editingBook,
                                        category: value,
                                    })
                                }
                            />

                            <BookField
                                label="Publisher"
                                value={editingBook.publisher}
                                onChange={(value) =>
                                    setEditingBook({
                                        ...editingBook,
                                        publisher: value,
                                    })
                                }
                            />

                            <BookField
                                label="Total Copies"
                                type="number"
                                value={editingBook.copies}
                                onChange={(value) =>
                                    setEditingBook({
                                        ...editingBook,
                                        copies: value,
                                    })
                                }
                            />

                            <BookField
                                label="Available Copies"
                                type="number"
                                value={editingBook.availableCopies}
                                onChange={(value) =>
                                    setEditingBook({
                                        ...editingBook,
                                        availableCopies: value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
                            <button
                                type="button"
                                onClick={() => setEditingBook(null)}
                                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleUpdateBook}
                                className="rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600"
                            >
                                Update Book
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
function BookField({
    label,
    value,
    onChange,
    type = "text",
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <input
                type={type}
                min={type === "number" ? 0 : undefined}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
        </div>
    );
}

export default AdminBooks;