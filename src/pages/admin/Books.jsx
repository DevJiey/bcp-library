import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaBook,
    FaPlus,
    FaSearch,
    FaFilter,
    FaTimes,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";

function AdminBooks() {
    const { showToast } = useToast();

    const [books, setBooks] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [authors, setAuthors] =
        useState([]);

    const [publishers, setPublishers] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [categoryFilter, setCategoryFilter] =
        useState("All");

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [newBook, setNewBook] =
        useState({
            isbn: "",
            title: "",
            categoryId: "",
            publisherId: "",
            publicationYear: "",
            edition: "",
            description: "",
            coverImageUrl: "",
            authorIds: [],
        });

    const loadBooks = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await apiRequest(
                    "/books"
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

    const loadFormOptions = async () => {
        try {
            const [
                categoriesResponse,
                authorsResponse,
                publishersResponse,
            ] = await Promise.all([
                apiRequest(
                    "/categories"
                ),
                apiRequest(
                    "/authors"
                ),
                apiRequest(
                    "/publishers"
                ),
            ]);

            setCategories(
                categoriesResponse?.data ||
                    []
            );

            setAuthors(
                authorsResponse?.data ||
                    []
            );

            setPublishers(
                publishersResponse?.data ||
                    []
            );
        } catch (err) {
            setError(
                err.message ||
                    "Failed to load catalog options."
            );
        }
    };

    useEffect(() => {
        Promise.all([
            loadBooks(),
            loadFormOptions(),
        ]);
    }, []);

    const getAuthorName = (
        author
    ) =>
        [
            author.first_name ??
                author.firstName,
            author.middle_name ??
                author.middleName,
            author.last_name ??
                author.lastName,
        ]
            .filter(Boolean)
            .join(" ");

    const getBookAuthors = (
        book
    ) => {
        if (
            Array.isArray(
                book.authors
            ) &&
            book.authors.length > 0
        ) {
            return book.authors
                .map(
                    getAuthorName
                )
                .filter(Boolean)
                .join(", ");
        }

        return (
            book.author_names ||
            book.authors_name ||
            "No author assigned"
        );
    };

    const getCategoryName = (
        book
    ) =>
        book.category_name ||
        book.category?.name ||
        "Uncategorized";

    const getPublisherName = (
        book
    ) =>
        book.publisher_name ||
        book.publisher?.name ||
        "Not specified";

    const filteredBooks =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            return books.filter(
                (book) => {
                    const title =
                        String(
                            book.title ||
                                ""
                        ).toLowerCase();

                    const isbn =
                        String(
                            book.isbn ||
                                ""
                        ).toLowerCase();

                    const author =
                        getBookAuthors(
                            book
                        ).toLowerCase();

                    const category =
                        getCategoryName(
                            book
                        );

                    const matchesSearch =
                        !keyword ||
                        title.includes(
                            keyword
                        ) ||
                        isbn.includes(
                            keyword
                        ) ||
                        author.includes(
                            keyword
                        );

                    const matchesCategory =
                        categoryFilter ===
                            "All" ||
                        category ===
                            categoryFilter;

                    return (
                        matchesSearch &&
                        matchesCategory
                    );
                }
            );
        }, [
            books,
            search,
            categoryFilter,
        ]);

    const resetForm = () => {
        setNewBook({
            isbn: "",
            title: "",
            categoryId: "",
            publisherId: "",
            publicationYear: "",
            edition: "",
            description: "",
            coverImageUrl: "",
            authorIds: [],
        });
    };

    const closeAddModal = () => {
        if (saving) {
            return;
        }

        setShowAddModal(false);
        resetForm();
    };

    const toggleAuthor = (
        authorId
    ) => {
        setNewBook(
            (current) => {
                const id =
                    String(
                        authorId
                    );

                const exists =
                    current.authorIds.some(
                        (
                            selectedId
                        ) =>
                            String(
                                selectedId
                            ) ===
                            id
                    );

                return {
                    ...current,

                    authorIds:
                        exists
                            ? current.authorIds.filter(
                                  (
                                      selectedId
                                  ) =>
                                      String(
                                          selectedId
                                      ) !==
                                      id
                              )
                            : [
                                  ...current.authorIds,
                                  Number(
                                      authorId
                                  ),
                              ],
                };
            }
        );
    };

    const handleAddBook =
        async (event) => {
            event.preventDefault();

            if (
                !newBook.title.trim()
            ) {
                showToast(
                    "Book title is required.",
                    "error"
                );

                return;
            }

            try {
                setSaving(true);
                setError("");

                const payload = {
                    isbn:
                        newBook.isbn.trim() ||
                        null,

                    title:
                        newBook.title.trim(),

                    categoryId:
                        newBook.categoryId
                            ? Number(
                                  newBook.categoryId
                              )
                            : null,

                    publisherId:
                        newBook.publisherId
                            ? Number(
                                  newBook.publisherId
                              )
                            : null,

                    publicationYear:
                        newBook.publicationYear
                            ? Number(
                                  newBook.publicationYear
                              )
                            : null,

                    edition:
                        newBook.edition.trim() ||
                        null,

                    description:
                        newBook.description.trim() ||
                        null,

                    coverImageUrl:
                        newBook.coverImageUrl.trim() ||
                        null,

                    authorIds:
                        newBook.authorIds,
                };

                await apiRequest(
                    "/books",
                    {
                        method: "POST",

                        body: JSON.stringify(
                            payload
                        ),
                    }
                );

                showToast(
                    "Book created successfully!",
                    "success"
                );

                closeAddModal();

                await loadBooks();
            } catch (err) {
                const message =
                    err.message ||
                    "Failed to create book.";

                setError(
                    message
                );

                showToast(
                    message,
                    "error"
                );
            } finally {
                setSaving(false);
            }
        };

    const categoryOptions = [
        "All",
        ...categories.map(
            (category) =>
                category.name
        ),
    ];

    return (
        <AdminLayout>
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Library Catalog
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Book Management
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage titles in the library catalog.
                        Physical copies are managed separately under Book Copies.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowAddModal(
                            true
                        )
                    }
                    className="hidden lg:flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-800"
                >
                    <FaPlus />
                    Add New Book
                </button>

            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* MOBILE SEARCH - compact like the reference */}
            <section className="mb-4 lg:hidden">
                <div className="flex items-center gap-2">
                    <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-blue-600">
                        <FaSearch className="shrink-0 text-sm text-slate-400" />
                        <input
                            type="search"
                            aria-label="Search books"
                            placeholder="Search books..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="min-w-0 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />
                    </label>
                    <button
                        type="button"
                        aria-label="Filter books by category"
                        aria-expanded={showMobileFilters}
                        onClick={() => setShowMobileFilters((value) => !value)}
                        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm ${
                            showMobileFilters || categoryFilter !== "All"
                                ? "border-blue-300 text-blue-700"
                                : "border-slate-200 text-slate-600"
                        }`}
                    >
                        <FaFilter />
                        {categoryFilter !== "All" && (
                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-600" />
                        )}
                    </button>
                </div>
                {showMobileFilters && (
                    <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                        <label htmlFor="mobile-book-category" className="mb-2 block text-xs font-semibold text-slate-600">
                            Filter by category
                        </label>
                        <select
                            id="mobile-book-category"
                            value={categoryFilter}
                            onChange={(event) => setCategoryFilter(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                        >
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category === "All" ? "All Categories" : category}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setShowMobileFilters(false)}
                            className="mt-3 w-full rounded-xl bg-[#0F4C97] px-4 py-2 text-sm font-semibold text-white"
                        >
                            Apply Filter
                        </button>
                    </div>
                )}
                <p className="mt-2 px-1 text-xs text-slate-500">
                    {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} found
                </p>
            </section>

            {/* DESKTOP SEARCH - preserve original layout */}
            <div className="hidden lg:block">
            {/* SEARCH */}
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
                                {
                                    filteredBooks.length
                                }{" "}
                                book
                                {filteredBooks.length !==
                                1
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
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="w-full px-3 py-2 outline-none md:w-64"
                            />

                        </div>

                        <select
                            value={
                                categoryFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setCategoryFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                        >
                            {categoryOptions.map(
                                (
                                    category
                                ) => (
                                    <option
                                        key={
                                            category
                                        }
                                        value={
                                            category
                                        }
                                    >
                                        {category ===
                                        "All"
                                            ? "All Categories"
                                            : category}
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                </div>

            </section>

            </div>

            {/* TABLE */}
            {loading ? (
                <LoadingSkeleton
                    rows={5}
                    columns={6}
                />
            ) : (
                <section className="hidden lg:block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1050px]">

                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        Book
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        ISBN
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        Author
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        Category
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        Publisher
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredBooks.map(
                                    (book) => (
                                        <tr
                                            key={
                                                book.id
                                            }
                                            className="border-t border-slate-100 transition hover:bg-blue-50/40"
                                        >

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                        <FaBook />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {
                                                                book.title
                                                            }
                                                        </p>

                                                        {book.edition && (
                                                            <p className="mt-1 text-xs text-slate-400">
                                                                Edition:{" "}
                                                                {
                                                                    book.edition
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                </div>

                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {book.isbn ||
                                                    "—"}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {getBookAuthors(
                                                    book
                                                )}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                    {getCategoryName(
                                                        book
                                                    )}
                                                </span>

                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {getPublisherName(
                                                    book
                                                )}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        book.is_active ===
                                                        false
                                                            ? "bg-slate-100 text-slate-600"
                                                            : "bg-emerald-100 text-emerald-700"
                                                    }`}
                                                >
                                                    {book.is_active ===
                                                    false
                                                        ? "Inactive"
                                                        : "Active"}
                                                </span>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                    {filteredBooks.length ===
                        0 && (
                        <div className="px-6 py-14 text-center">

                            <FaBook className="mx-auto text-3xl text-slate-300" />

                            <h2 className="mt-4 font-semibold text-slate-800">
                                No books found
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Try changing the search or category filter.
                            </p>

                        </div>
                    )}

                </section>
            )}

            {/* MOBILE BOOK CARDS */}
            {!loading && (
                <div className="space-y-3 lg:hidden">
                    {filteredBooks.length === 0 ? (
                        <div className="rounded-2xl bg-white px-5 py-10 text-center shadow-sm ring-1 ring-slate-200">
                            <FaBook className="mx-auto text-3xl text-slate-300" />
                            <p className="mt-3 font-semibold text-slate-800">No books found</p>
                            <p className="mt-1 text-sm text-slate-500">Try another search or category.</p>
                        </div>
                    ) : (
                        filteredBooks.map((book) => (
                            <article key={book.id} className="flex gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200">
                                <div className="flex h-24 w-17 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-700" style={{ width: '4.25rem' }}>
                                    {book.cover_image_url || book.coverImageUrl ? (
                                        <img
                                            src={book.cover_image_url || book.coverImageUrl}
                                            alt={`Cover of ${book.title}`}
                                            className="h-full w-full object-cover"
                                            onError={(event) => { event.currentTarget.style.display = 'none'; }}
                                        />
                                    ) : (
                                        <FaBook className="text-2xl" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="line-clamp-2 text-sm font-bold text-slate-900">{book.title}</h3>
                                    <p className="mt-1 truncate text-xs text-slate-500">{getBookAuthors(book)}</p>
                                    <p className="mt-1 text-xs text-slate-500">{getCategoryName(book)}</p>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${book.is_active === false ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'}`}>
                                            {book.is_active === false ? 'Inactive' : 'Active'}
                                        </span>
                                        {book.isbn && <span className="truncate text-[11px] text-slate-400">ISBN {book.isbn}</span>}
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            )}

            {/* MOBILE ADD BOOK BUTTON - stays above the bottom navigation */}
            {!showAddModal && (
                <button
                    type="button"
                    aria-label="Add new book"
                    onClick={() => setShowAddModal(true)}
                    className="fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4C97] text-white shadow-xl transition hover:bg-blue-800 lg:hidden"
                    style={{ bottom: 'calc(6.5rem + env(safe-area-inset-bottom))' }}
                >
                    <FaPlus className="text-xl" />
                </button>
            )}

            {/* ADD BOOK MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

                    <form
                        onSubmit={
                            handleAddBook
                        }
                        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >

                        {/* HEADER */}
                        <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                                    Catalog Record
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    Add New Book
                                </h2>
                            </div>

                            <button
                                type="button"
                                disabled={
                                    saving
                                }
                                onClick={
                                    closeAddModal
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 disabled:opacity-50"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        {/* FORM */}
                        <div className="overflow-y-auto p-6">

                            <div className="grid gap-5 md:grid-cols-2">

                                <BookField
                                    label="ISBN"
                                    value={
                                        newBook.isbn
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setNewBook({
                                            ...newBook,
                                            isbn: value,
                                        })
                                    }
                                    placeholder="Optional ISBN"
                                />

                                <BookField
                                    label="Book Title *"
                                    value={
                                        newBook.title
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setNewBook({
                                            ...newBook,
                                            title: value,
                                        })
                                    }
                                    placeholder="Enter book title"
                                />

                                {/* CATEGORY */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Category
                                    </label>

                                    <select
                                        value={
                                            newBook.categoryId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setNewBook({
                                                ...newBook,
                                                categoryId:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="">
                                            No category
                                        </option>

                                        {categories
                                            .filter(
                                                (
                                                    category
                                                ) =>
                                                    category.is_active !==
                                                    false
                                            )
                                            .map(
                                                (
                                                    category
                                                ) => (
                                                    <option
                                                        key={
                                                            category.id
                                                        }
                                                        value={
                                                            category.id
                                                        }
                                                    >
                                                        {
                                                            category.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                    </select>
                                </div>

                                {/* PUBLISHER */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Publisher
                                    </label>

                                    <select
                                        value={
                                            newBook.publisherId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setNewBook({
                                                ...newBook,
                                                publisherId:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="">
                                            No publisher
                                        </option>

                                        {publishers
                                            .filter(
                                                (
                                                    publisher
                                                ) =>
                                                    publisher.is_active !==
                                                    false
                                            )
                                            .map(
                                                (
                                                    publisher
                                                ) => (
                                                    <option
                                                        key={
                                                            publisher.id
                                                        }
                                                        value={
                                                            publisher.id
                                                        }
                                                    >
                                                        {
                                                            publisher.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                    </select>
                                </div>

                                <BookField
                                    label="Publication Year"
                                    type="number"
                                    value={
                                        newBook.publicationYear
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setNewBook({
                                            ...newBook,
                                            publicationYear:
                                                value,
                                        })
                                    }
                                    placeholder="2026"
                                />

                                <BookField
                                    label="Edition"
                                    value={
                                        newBook.edition
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setNewBook({
                                            ...newBook,
                                            edition:
                                                value,
                                        })
                                    }
                                    placeholder="e.g. 3rd Edition"
                                />

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Authors
                                    </label>

                                    <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 p-3">

                                        {authors.length ===
                                        0 ? (
                                            <p className="p-2 text-sm text-slate-400">
                                                No authors available.
                                            </p>
                                        ) : (
                                            <div className="grid gap-2 sm:grid-cols-2">

                                                {authors
                                                    .filter(
                                                        (
                                                            author
                                                        ) =>
                                                            author.is_active !==
                                                            false
                                                    )
                                                    .map(
                                                        (
                                                            author
                                                        ) => {
                                                            const checked =
                                                                newBook.authorIds.some(
                                                                    (
                                                                        id
                                                                    ) =>
                                                                        String(
                                                                            id
                                                                        ) ===
                                                                        String(
                                                                            author.id
                                                                        )
                                                                );

                                                            return (
                                                                <label
                                                                    key={
                                                                        author.id
                                                                    }
                                                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                                                                        checked
                                                                            ? "border-blue-300 bg-blue-50 text-blue-800"
                                                                            : "border-slate-100 hover:bg-slate-50"
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            checked
                                                                        }
                                                                        onChange={() =>
                                                                            toggleAuthor(
                                                                                author.id
                                                                            )
                                                                        }
                                                                    />

                                                                    <span className="font-medium">
                                                                        {getAuthorName(
                                                                            author
                                                                        )}
                                                                    </span>
                                                                </label>
                                                            );
                                                        }
                                                    )}

                                            </div>
                                        )}

                                    </div>
                                </div>

                                <BookField
                                    label="Cover Image URL"
                                    value={
                                        newBook.coverImageUrl
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setNewBook({
                                            ...newBook,
                                            coverImageUrl:
                                                value,
                                        })
                                    }
                                    placeholder="Optional image URL"
                                />

                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            newBook.description
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setNewBook({
                                                ...newBook,
                                                description:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        }
                                        rows={4}
                                        placeholder="Optional book description..."
                                        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>

                            </div>

                            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
                                After creating the book title, add its physical copies from the
                                <strong> Book Copies </strong>
                                page where the accession number, barcode, shelf location, and condition are recorded.
                            </div>

                        </div>

                        {/* ACTIONS */}
                        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white px-6 py-5">

                            <button
                                type="button"
                                disabled={
                                    saving
                                }
                                onClick={
                                    closeAddModal
                                }
                                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    saving
                                }
                                className="rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Book"}
                            </button>

                        </div>

                    </form>
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
    placeholder = "",
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <input
                type={type}
                min={
                    type === "number"
                        ? 0
                        : undefined
                }
                value={value}
                placeholder={placeholder}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
        </div>
    );
}

export default AdminBooks;