import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import JsBarcode from "jsbarcode";

import {
    FaBarcode,
    FaCopy,
    FaPlus,
    FaSearch,
    FaBook,
    FaTimes,
    FaFilter,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";

function BookCopies() {
    const { showToast } = useToast();

    const [copies, setCopies] =
        useState([]);

    const [books, setBooks] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [selectedCopy, setSelectedCopy] =
        useState(null);

    const barcodeRef =
        useRef(null);

    const [newCopy, setNewCopy] =
        useState({
            bookId: "",
            accessionNumber: "",
            barcode: "",
            shelfLocation: "",
            condition: "good",
            acquiredAt: "",
        });

    const loadCopies = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await apiRequest(
                    "/book-copies"
                );

            setCopies(
                response?.data || []
            );
        } catch (err) {
            setError(
                err.message ||
                "Failed to load book copies."
            );
        } finally {
            setLoading(false);
        }
    };

    const loadBooks = async () => {
        try {
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
        }
    };

    useEffect(() => {
        loadCopies();
        loadBooks();
    }, []);

    useEffect(() => {
        if (
            selectedCopy?.barcode &&
            barcodeRef.current
        ) {
            JsBarcode(
                barcodeRef.current,
                selectedCopy.barcode,
                {
                    format: "CODE128",
                    width: 2,
                    height: 80,
                    displayValue: true,
                    fontSize: 16,
                    margin: 10,
                }
            );
        }
    }, [selectedCopy]);

    const getBookTitle = (
        copy
    ) => {
        return (
            copy.title ||
            copy.book_title ||
            copy.book?.title ||
            "Library Book"
        );
    };

    const getStatus = (
        copy
    ) => {
        return (
            copy.status ||
            "available"
        ).toLowerCase();
    };

    const getCondition = (
        copy
    ) => {
        return (
            copy.condition ||
            "good"
        ).toLowerCase();
    };

    const getStatusStyle = (
        status
    ) => {
        if (
            status ===
            "available"
        ) {
            return "bg-emerald-100 text-emerald-700";
        }

        if (
            status ===
            "borrowed"
        ) {
            return "bg-blue-100 text-blue-700";
        }

        if (
            status ===
            "overdue"
        ) {
            return "bg-red-100 text-red-700";
        }

        if (
            status ===
            "damaged"
        ) {
            return "bg-orange-100 text-orange-700";
        }

        if (
            status ===
            "lost"
        ) {
            return "bg-red-100 text-red-700";
        }

        return "bg-slate-100 text-slate-700";
    };

    const getConditionStyle = (
        condition
    ) => {
        if (
            condition ===
            "excellent"
        ) {
            return "bg-emerald-100 text-emerald-700";
        }

        if (
            condition === "good"
        ) {
            return "bg-blue-100 text-blue-700";
        }

        if (
            condition === "fair"
        ) {
            return "bg-amber-100 text-amber-700";
        }

        if (
            condition ===
            "poor" ||
            condition ===
            "damaged"
        ) {
            return "bg-red-100 text-red-700";
        }

        return "bg-slate-100 text-slate-700";
    };

    const filteredCopies =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            return copies.filter(
                (copy) => {
                    const barcode =
                        String(
                            copy.barcode ||
                            ""
                        ).toLowerCase();

                    const accession =
                        String(
                            copy.accession_number ||
                            copy.accessionNumber ||
                            ""
                        ).toLowerCase();

                    const title =
                        getBookTitle(
                            copy
                        ).toLowerCase();

                    const status =
                        getStatus(
                            copy
                        );

                    const matchesSearch =
                        !keyword ||
                        barcode.includes(
                            keyword
                        ) ||
                        accession.includes(
                            keyword
                        ) ||
                        title.includes(
                            keyword
                        );

                    const matchesStatus =
                        statusFilter ===
                        "All" ||
                        status ===
                        statusFilter.toLowerCase();

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            copies,
            search,
            statusFilter,
        ]);

    const resetForm = () => {
        setNewCopy({
            bookId: "",
            accessionNumber: "",
            barcode: "",
            shelfLocation: "",
            condition: "good",
            acquiredAt: "",
        });
    };

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowAddModal(false);
        resetForm();
    };

    const handleAddCopy =
        async (event) => {
            event.preventDefault();

            if (
                !newCopy.bookId ||
                !newCopy.accessionNumber.trim() ||
                !newCopy.barcode.trim()
            ) {
                showToast(
                    "Book, accession number, and barcode are required.",
                    "error"
                );

                return;
            }

            try {
                setSaving(true);
                setError("");

                const payload = {
                    bookId:
                        Number(
                            newCopy.bookId
                        ),

                    accessionNumber:
                        newCopy.accessionNumber.trim(),

                    barcode:
                        newCopy.barcode.trim(),

                    shelfLocation:
                        newCopy.shelfLocation.trim() ||
                        null,

                    condition:
                        newCopy.condition,

                    acquiredAt:
                        newCopy.acquiredAt ||
                        null,
                };

                await apiRequest(
                    "/book-copies",
                    {
                        method: "POST",

                        body: JSON.stringify(
                            payload
                        ),
                    }
                );

                showToast(
                    "Book copy created successfully!",
                    "success"
                );

                setShowAddModal(
                    false
                );

                resetForm();

                await loadCopies();
            } catch (err) {
                const message =
                    err.message ||
                    "Failed to create book copy.";

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

    return (
        <AdminLayout>
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Library Inventory
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Book Copies Management
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage physical copies, accession numbers,
                        barcodes, shelf locations, and conditions.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowAddModal(
                            true
                        )
                    }
                    className="hidden lg:flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800"
                >
                    <FaPlus />
                    Add Book Copy
                </button>

            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* TOOLBAR */}
            <section className="mb-4 lg:mb-6 hidden lg:block rounded-2xl bg-white p-3 lg:p-5 shadow-sm ring-1 ring-slate-200">

                <div className="flex flex-col gap-3 lg:gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="hidden lg:flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <FaCopy />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">
                                Physical Book Copies
                            </h2>

                            <p className="text-sm text-slate-500">
                                {loading
                                    ? "Loading..."
                                    : `${filteredCopies.length} ${filteredCopies.length ===
                                        1
                                        ? "copy"
                                        : "copies"
                                    } found`}
                            </p>
                        </div>

                    </div>

                    <div className="flex items-center gap-2 lg:gap-3">

                        <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">

                            <FaSearch className="text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search barcode, accession no., or book..."
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
                                className="min-w-0 w-full bg-transparent px-3 py-2 outline-none lg:w-72"
                            />

                        </div>

                        <select
                            value={
                                statusFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setStatusFilter(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="hidden lg:block rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="All">
                                All Status
                            </option>

                            <option value="Available">
                                Available
                            </option>

                            <option value="Borrowed">
                                Borrowed
                            </option>

                            <option value="Overdue">
                                Overdue
                            </option>

                            <option value="Damaged">
                                Damaged
                            </option>

                            <option value="Lost">
                                Lost
                            </option>
                        </select>

                    </div>

                </div>

            </section>

            {/* Mobile: compact search and filter in one row */}
            <section className="mb-4 lg:hidden" aria-label="Search and filter book copies">
                <div className="mb-2 flex items-center justify-between px-1">
                    <div className="min-w-0">
                        <h2 className="text-sm font-bold text-slate-900">Physical Book Copies</h2>
                        <p className="text-xs text-slate-500">
                            {loading ? "Loading..." : `${filteredCopies.length} ${filteredCopies.length === 1 ? "copy" : "copies"} found`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                        <FaSearch className="shrink-0 text-sm text-slate-400" />
                        <input
                            type="search"
                            aria-label="Search book copies"
                            placeholder="Search copies..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-11 min-w-0 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => setMobileFiltersOpen((open) => !open)}
                        aria-label="Filter book copies by status"
                        aria-expanded={mobileFiltersOpen}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm transition ${mobileFiltersOpen || statusFilter !== "All" ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-blue-800"}`}
                    >
                        <FaFilter />
                    </button>
                </div>
                {mobileFiltersOpen && (
                    <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <label htmlFor="mobile-copy-status" className="mb-2 block text-xs font-semibold text-slate-600">Filter by status</label>
                        <select
                            id="mobile-copy-status"
                            value={statusFilter}
                            onChange={(event) => { setStatusFilter(event.target.value); setMobileFiltersOpen(false); }}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-600"
                        >
                            {["All", "Available", "Borrowed", "Overdue", "Damaged", "Lost"].map((status) => (
                                <option key={status} value={status}>{status === "All" ? "All Status" : status}</option>
                            ))}
                        </select>
                    </div>
                )}
            </section>

            {/* MOBILE COPY CARDS */}
            <section className="space-y-3 lg:hidden" aria-label="Book copies">
                {loading ? (
                    <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">Loading book copies...</div>
                ) : filteredCopies.length === 0 ? (
                    <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">No book copies found.</div>
                ) : filteredCopies.map((copy) => {
                    const status = getStatus(copy);
                    const condition = getCondition(copy);
                    return (
                        <article key={copy.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800"><FaBook /></div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words text-sm font-bold text-slate-900">{getBookTitle(copy)}</h3>
                                    <p className="mt-1 break-all text-xs text-slate-500">{copy.barcode || "No barcode"}</p>
                                </div>
                                <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${getStatusStyle(status)}`}>{status}</span>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs">
                                <div><p className="text-slate-400">Accession No.</p><p className="mt-1 break-all font-semibold text-slate-800">{copy.accession_number || copy.accessionNumber || "—"}</p></div>
                                <div><p className="text-slate-400">Shelf</p><p className="mt-1 font-semibold text-slate-800">{copy.shelf_location || copy.shelfLocation || "—"}</p></div>
                                <div><p className="text-slate-400">Condition</p><span className={`mt-1 inline-block rounded-full px-2 py-1 font-semibold capitalize ${getConditionStyle(condition)}`}>{condition}</span></div>
                            </div>
                            <button type="button" onClick={() => setSelectedCopy(copy)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-800"><FaBarcode /> View Barcode</button>
                        </article>
                    );
                })}
            </section>

            <button type="button" aria-label="Add book copy" onClick={() => setShowAddModal(true)} className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F4C97] text-xl text-white shadow-lg shadow-blue-900/20 lg:hidden"><FaPlus /></button>

            {/* TABLE */}
            <section className="hidden lg:block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1100px]">

                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Barcode
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Book
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Accession No.
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Shelf
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Condition
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {!loading &&
                                filteredCopies.map(
                                    (copy) => {
                                        const status =
                                            getStatus(
                                                copy
                                            );

                                        const condition =
                                            getCondition(
                                                copy
                                            );

                                        return (
                                            <tr
                                                key={
                                                    copy.id
                                                }
                                                className="border-t border-slate-100 transition hover:bg-blue-50/40"
                                            >

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2 font-semibold text-slate-900">

                                                        <FaBarcode className="text-slate-400" />

                                                        {copy.barcode ||
                                                            "—"}

                                                    </div>

                                                </td>

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                            <FaBook />
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-slate-900">
                                                                {getBookTitle(
                                                                    copy
                                                                )}
                                                            </p>

                                                            {copy.book_id && (
                                                                <p className="mt-1 text-xs text-slate-400">
                                                                    Book ID:{" "}
                                                                    {
                                                                        copy.book_id
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {copy.accession_number ||
                                                        copy.accessionNumber ||
                                                        "—"}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {copy.shelf_location ||
                                                        copy.shelfLocation ||
                                                        "Not assigned"}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getConditionStyle(
                                                            condition
                                                        )}`}
                                                    >
                                                        {
                                                            condition
                                                        }
                                                    </span>

                                                </td>

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                                            status
                                                        )}`}
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </span>

                                                </td>
                                                <td className="px-5 py-4">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedCopy(copy)
                                                        }
                                                        className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                                    >
                                                        <FaBarcode />
                                                        View Barcode
                                                    </button>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                        </tbody>

                    </table>

                </div>

                {loading && (
                    <div className="px-6 py-14 text-center text-sm text-slate-400">
                        Loading book copies...
                    </div>
                )}

                {!loading &&
                    filteredCopies.length ===
                    0 && (
                        <div className="px-6 py-14 text-center">

                            <FaCopy className="mx-auto text-3xl text-slate-300" />

                            <h2 className="mt-4 font-semibold text-slate-800">
                                No book copies found
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Try changing the search keyword or status filter.
                            </p>

                        </div>
                    )}

            </section>
            {/* BARCODE MODAL */}
            {selectedCopy && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* HEADER */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                                    Book Copy Barcode
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    {getBookTitle(selectedCopy)}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedCopy(null)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        {/* BODY */}
                        <div className="p-6">

                            <div
                                id="barcode-print-area"
                                className="rounded-xl border border-slate-200 bg-white p-6 text-center"
                            >

                                <p className="mb-2 text-sm font-semibold text-slate-900">
                                    {getBookTitle(selectedCopy)}
                                </p>

                                <p className="mb-5 text-xs text-slate-500">
                                    Accession No:{" "}
                                    {selectedCopy.accession_number ||
                                        selectedCopy.accessionNumber ||
                                        "—"}
                                </p>

                                <div className="overflow-x-auto">
                                    <svg
                                        ref={barcodeRef}
                                        className="mx-auto"
                                    />
                                </div>

                                <p className="mt-4 text-xs text-slate-400">
                                    BCP Library Management System
                                </p>

                            </div>

                            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
                                Print this barcode and attach it to the corresponding physical book copy.
                                Staff can scan it during borrowing and return processing.
                            </div>

                            {/* ACTIONS */}
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedCopy(null)
                                    }
                                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const printContent =
                                            document.getElementById(
                                                "barcode-print-area"
                                            );

                                        if (!printContent) {
                                            return;
                                        }

                                        const printWindow =
                                            window.open(
                                                "",
                                                "_blank",
                                                "width=700,height=600"
                                            );

                                        if (!printWindow) {
                                            return;
                                        }

                                        printWindow.document.write(`
                                <!doctype html>
                                <html>
                                    <head>
                                        <title>Print Barcode</title>

                                        <style>
                                            body {
                                                font-family: Arial, sans-serif;
                                                margin: 0;
                                                padding: 30px;
                                                text-align: center;
                                            }

                                            .barcode-label {
                                                display: inline-block;
                                                border: 1px solid #d1d5db;
                                                border-radius: 12px;
                                                padding: 24px;
                                            }

                                            svg {
                                                max-width: 100%;
                                            }

                                            @media print {
                                                body {
                                                    padding: 0;
                                                }
                                            }
                                        </style>
                                    </head>

                                    <body>

                                        <div class="barcode-label">
                                            ${printContent.innerHTML}
                                        </div>

                                        <script>
                                            window.onload = function () {
                                                window.print();
                                                window.close();
                                            };
                                        </script>

                                    </body>
                                </html>
                            `);

                                        printWindow.document.close();
                                    }}
                                    className="rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                                >
                                    Print Barcode
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* ADD COPY MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

                    <form
                        onSubmit={
                            handleAddCopy
                        }
                        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >

                        {/* HEADER */}
                        <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                                    Library Inventory
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    Add Book Copy
                                </h2>
                            </div>

                            <button
                                type="button"
                                disabled={
                                    saving
                                }
                                onClick={
                                    closeModal
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 disabled:opacity-50"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        <div className="overflow-y-auto p-6">

                            <div className="grid gap-5 md:grid-cols-2">

                                {/* BOOK */}
                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Book *
                                    </label>

                                    <select
                                        value={
                                            newCopy.bookId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setNewCopy({
                                                ...newCopy,
                                                bookId:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        }
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="">
                                            Select book
                                        </option>

                                        {books
                                            .filter(
                                                (
                                                    book
                                                ) =>
                                                    book.is_active !==
                                                    false
                                            )
                                            .map(
                                                (
                                                    book
                                                ) => (
                                                    <option
                                                        key={
                                                            book.id
                                                        }
                                                        value={
                                                            book.id
                                                        }
                                                    >
                                                        {
                                                            book.title
                                                        }
                                                        {book.isbn
                                                            ? ` — ${book.isbn}`
                                                            : ""}
                                                    </option>
                                                )
                                            )}
                                    </select>

                                </div>

                                <CopyField
                                    label="Accession Number *"
                                    value={
                                        newCopy.accessionNumber
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setNewCopy({
                                            ...newCopy,
                                            accessionNumber:
                                                value,
                                        })
                                    }
                                    placeholder="e.g. ACC-0001"
                                />

                                <CopyField
                                    label="Barcode *"
                                    value={
                                        newCopy.barcode
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setNewCopy({
                                            ...newCopy,
                                            barcode:
                                                value,
                                        })
                                    }
                                    placeholder="e.g. BCP-BOOK-0001"
                                />

                                <CopyField
                                    label="Shelf Location"
                                    value={
                                        newCopy.shelfLocation
                                    }
                                    onChange={(
                                        value
                                    ) =>
                                        setNewCopy({
                                            ...newCopy,
                                            shelfLocation:
                                                value,
                                        })
                                    }
                                    placeholder="e.g. Shelf A-01"
                                />

                                {/* CONDITION */}
                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Condition
                                    </label>

                                    <select
                                        value={
                                            newCopy.condition
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setNewCopy({
                                                ...newCopy,
                                                condition:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                    >
                                        <option value="excellent">
                                            Excellent
                                        </option>

                                        <option value="good">
                                            Good
                                        </option>

                                        <option value="fair">
                                            Fair
                                        </option>

                                        <option value="poor">
                                            Poor
                                        </option>

                                        <option value="damaged">
                                            Damaged
                                        </option>
                                    </select>

                                </div>

                                {/* ACQUIRED DATE */}
                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Acquired Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            newCopy.acquiredAt
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setNewCopy({
                                                ...newCopy,
                                                acquiredAt:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-700">
                                Status is managed automatically by the circulation process.
                                A new usable copy starts as available and changes when it is borrowed,
                                returned, overdue, damaged, or lost.
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
                                    closeModal
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
                                    : "Save Copy"}
                            </button>

                        </div>

                    </form>

                </div>
            )}

        </AdminLayout>
    );
}

function CopyField({
    label,
    value,
    onChange,
    placeholder = "",
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <input
                type="text"
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

export default BookCopies;