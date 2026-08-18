import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaChartBar,
    FaBook,
    FaExclamationTriangle,
    FaExchangeAlt,
    FaClipboardCheck,
    FaSearch,
    FaPrint,
    FaUsers,
    FaCopy,
    FaCheckCircle,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import apiRequest from "../../services/api";

function Reports() {
    const [activeReport, setActiveReport] =
        useState("overview");

    const [search, setSearch] =
        useState("");

    const [reports, setReports] =
        useState({
            overview: null,
            borrowingSummary: [],
            requestSummary: [],
            mostBorrowed: [],
            overdue: [],
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const reportOptions = [
        {
            id: "overview",
            title: "Library Overview",
            description:
                "General library system statistics",
            icon: <FaChartBar />,
            iconStyle:
                "bg-blue-100 text-blue-700",
        },
        {
            id: "mostBorrowed",
            title: "Most Borrowed",
            description:
                "Most frequently borrowed books",
            icon: <FaBook />,
            iconStyle:
                "bg-emerald-100 text-emerald-700",
        },
        {
            id: "overdue",
            title: "Overdue Books",
            description:
                "Current overdue borrowing records",
            icon:
                <FaExclamationTriangle />,
            iconStyle:
                "bg-red-100 text-red-700",
        },
        {
            id: "borrowingSummary",
            title: "Borrowing Summary",
            description:
                "Borrowing transactions grouped by status",
            icon: <FaExchangeAlt />,
            iconStyle:
                "bg-violet-100 text-violet-700",
        },
        {
            id: "requestSummary",
            title: "Borrow Request Summary",
            description:
                "Borrow requests grouped by status",
            icon: <FaClipboardCheck />,
            iconStyle:
                "bg-amber-100 text-amber-700",
        },
    ];

    const normalizeArray = (
        value
    ) => {
        if (
            Array.isArray(value)
        ) {
            return value;
        }

        if (
            Array.isArray(
                value?.rows
            )
        ) {
            return value.rows;
        }

        if (
            Array.isArray(
                value?.results
            )
        ) {
            return value.results;
        }

        return [];
    };

    const loadReports =
        async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    overviewResponse,
                    borrowingResponse,
                    requestResponse,
                    popularResponse,
                    overdueResponse,
                ] = await Promise.all([
                    apiRequest(
                        "/reports/overview"
                    ),

                    apiRequest(
                        "/reports/borrowings"
                    ),

                    apiRequest(
                        "/reports/borrow-requests"
                    ),

                    apiRequest(
                        "/reports/popular-books?limit=10"
                    ),

                    apiRequest(
                        "/reports/overdue"
                    ),
                ]);

                setReports({
                    overview:
                        overviewResponse?.data ||
                        null,

                    borrowingSummary:
                        normalizeArray(
                            borrowingResponse?.data
                        ),

                    requestSummary:
                        normalizeArray(
                            requestResponse?.data
                        ),

                    mostBorrowed:
                        normalizeArray(
                            popularResponse?.data
                        ),

                    overdue:
                        normalizeArray(
                            overdueResponse?.data
                        ),
                });
            } catch (err) {
                setError(
                    err.message ||
                    "Failed to load library reports."
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadReports();
    }, []);

    const currentData =
        reports[
        activeReport
        ];

    const filteredData =
        useMemo(() => {
            if (
                !Array.isArray(
                    currentData
                )
            ) {
                return [];
            }

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return currentData;
            }

            return currentData.filter(
                (item) =>
                    Object.values(
                        item || {}
                    )
                        .filter(
                            (value) =>
                                value !==
                                null &&
                                value !==
                                undefined
                        )
                        .join(" ")
                        .toLowerCase()
                        .includes(
                            keyword
                        )
            );
        }, [
            currentData,
            search,
        ]);

    const handlePrint = () => {
        window.print();
    };

    const getActiveTitle =
        () =>
            reportOptions.find(
                (report) =>
                    report.id ===
                    activeReport
            )?.title ||
            "Library Report";

    return (
        <AdminLayout>
            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Analytics and Reports
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Library Reports
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        View current library statistics and circulation reports.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        handlePrint
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800 print:hidden"
                >
                    <FaPrint />

                    Print Report
                </button>

            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* REPORT TYPES */}
            <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5 print:hidden">

                {reportOptions.map(
                    (report) => (
                        <button
                            key={
                                report.id
                            }
                            type="button"
                            onClick={() => {
                                setActiveReport(
                                    report.id
                                );

                                setSearch(
                                    ""
                                );
                            }}
                            className={`rounded-2xl bg-white p-5 text-left shadow-sm ring-1 transition ${activeReport ===
                                    report.id
                                    ? "ring-2 ring-blue-600"
                                    : "ring-slate-200 hover:ring-blue-300"
                                }`}
                        >

                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${report.iconStyle}`}
                            >
                                {
                                    report.icon
                                }
                            </div>

                            <h2 className="mt-4 font-bold text-slate-900">
                                {
                                    report.title
                                }
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                {
                                    report.description
                                }
                            </p>

                        </button>
                    )
                )}

            </section>

            {loading ? (
                <div className="rounded-2xl bg-white px-6 py-16 text-center text-sm text-slate-400 shadow-sm ring-1 ring-slate-200">
                    Loading library reports...
                </div>
            ) : activeReport ===
                "overview" ? (
                <OverviewReport
                    data={
                        reports.overview
                    }
                />
            ) : (
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    {/* REPORT HEADER */}
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {getActiveTitle()}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {
                                    filteredData.length
                                }{" "}
                                record
                                {filteredData.length !==
                                    1
                                    ? "s"
                                    : ""}{" "}
                                found
                            </p>
                        </div>

                        <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100 print:hidden">

                            <FaSearch className="text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search report..."
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
                                className="w-full px-3 py-2 outline-none sm:w-72"
                            />

                        </div>

                    </div>

                    <ReportTable
                        type={
                            activeReport
                        }
                        data={
                            filteredData
                        }
                    />

                </section>
            )}
        </AdminLayout>
    );
}

/* ================================
   OVERVIEW
================================ */

function OverviewReport({
    data,
}) {
    if (!data) {
        return (
            <div className="rounded-2xl bg-white px-6 py-14 text-center text-sm text-slate-400 shadow-sm ring-1 ring-slate-200">
                No overview report available.
            </div>
        );
    }

    const getValue = (
        ...keys
    ) => {
        for (const key of keys) {
            if (
                data[key] !==
                undefined &&
                data[key] !==
                null
            ) {
                return Number(
                    data[key]
                );
            }
        }

        return 0;
    };

    const cards = [
        {
            label:
                "Book Titles",
            value: getValue(
                "total_books",
                "totalBooks"
            ),
            icon: <FaBook />,
            style:
                "bg-blue-100 text-blue-700",
        },
        {
            label:
                "Book Copies",
            value: getValue(
                "total_copies",
                "totalCopies"
            ),
            icon: <FaCopy />,
            style:
                "bg-violet-100 text-violet-700",
        },
        {
            label:
                "Borrowers",
            value: getValue(
                "total_borrowers",
                "totalBorrowers"
            ),
            icon: <FaUsers />,
            style:
                "bg-emerald-100 text-emerald-700",
        },
        {
            label:
                "Active Borrowings",
            value: getValue(
                "active_borrowings",
                "activeBorrowings",
                "borrowed_count"
            ),
            icon:
                <FaExchangeAlt />,
            style:
                "bg-amber-100 text-amber-700",
        },
        {
            label:
                "Available Copies",
            value: getValue(
                "available_copies",
                "availableCopies"
            ),
            icon:
                <FaCheckCircle />,
            style:
                "bg-cyan-100 text-cyan-700",
        },
        {
            label:
                "Overdue",
            value: getValue(
                "overdue_count",
                "overdueCount",
                "overdue_borrowings"
            ),
            icon:
                <FaExclamationTriangle />,
            style:
                "bg-red-100 text-red-700",
        },
    ];

    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                    Library Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Current system-wide library statistics.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                {cards.map(
                    (card) => (
                        <article
                            key={
                                card.label
                            }
                            className="rounded-xl border border-slate-100 p-5"
                        >

                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.style}`}
                            >
                                {
                                    card.icon
                                }
                            </div>

                            <p className="mt-4 text-sm text-slate-500">
                                {
                                    card.label
                                }
                            </p>

                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {Number.isFinite(
                                    card.value
                                )
                                    ? card.value.toLocaleString()
                                    : "0"}
                            </p>

                        </article>
                    )
                )}

            </div>

        </section>
    );
}

/* ================================
   TABLES
================================ */

function ReportTable({
    type,
    data,
}) {
    if (data.length === 0) {
        return (
            <div className="px-6 py-14 text-center">

                <FaChartBar className="mx-auto text-3xl text-slate-300" />

                <h3 className="mt-4 font-semibold text-slate-800">
                    No records found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    There are currently no records for this report.
                </p>

            </div>
        );
    }

    if (
        type ===
        "mostBorrowed"
    ) {
        return (
            <MostBorrowedTable
                data={data}
            />
        );
    }

    if (
        type === "overdue"
    ) {
        return (
            <OverdueTable
                data={data}
            />
        );
    }

    if (
        type ===
        "borrowingSummary"
    ) {
        return (
            <SummaryTable
                data={data}
                label="Borrowing Status"
            />
        );
    }

    return (
        <SummaryTable
            data={data}
            label="Request Status"
        />
    );
}

function MostBorrowedTable({
    data,
}) {
    return (
        <div className="overflow-x-auto">

            <table className="w-full min-w-[720px]">

                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            Rank
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            Book
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            ISBN
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            Times Borrowed
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {data.map(
                        (
                            item,
                            index
                        ) => (
                            <tr
                                key={
                                    item.id ||
                                    item.book_id ||
                                    index
                                }
                                className="border-t border-slate-100"
                            >

                                <td className="px-5 py-4">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                        {index +
                                            1}
                                    </span>
                                </td>

                                <td className="px-5 py-4 font-semibold text-slate-900">
                                    {item.title ||
                                        item.book_title ||
                                        item.book ||
                                        "Library Book"}
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                    {item.isbn ||
                                        "—"}
                                </td>

                                <td className="px-5 py-4">

                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                                        {item.borrow_count ??
                                            item.total_borrows ??
                                            item.total ??
                                            0}
                                    </span>

                                </td>

                            </tr>
                        )
                    )}

                </tbody>

            </table>

        </div>
    );
}

function OverdueTable({
    data,
}) {
    const formatDate = (
        value
    ) => {
        if (!value) {
            return "—";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    return (
        <div className="overflow-x-auto">

            <table className="w-full min-w-[920px]">

                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            Borrower
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            Book
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            Barcode
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            Due Date
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {data.map(
                        (
                            item,
                            index
                        ) => {
                            const borrowerName =
                                [
                                    item.first_name,
                                    item.middle_name,
                                    item.last_name,
                                ]
                                    .filter(
                                        Boolean
                                    )
                                    .join(
                                        " "
                                    );

                            return (
                                <tr
                                    key={
                                        item.id ||
                                        item.borrow_transaction_id ||
                                        index
                                    }
                                    className="border-t border-slate-100"
                                >

                                    <td className="px-5 py-4">

                                        <p className="font-semibold text-slate-900">
                                            {borrowerName ||
                                                item.borrower_name ||
                                                "Borrower"}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {item.school_id ||
                                                ""}
                                        </p>

                                    </td>

                                    <td className="px-5 py-4 text-sm font-medium text-slate-800">
                                        {item.title ||
                                            item.book_title ||
                                            "Library Book"}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {item.barcode ||
                                            "—"}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-red-600">
                                        {formatDate(
                                            item.due_at ||
                                            item.due_date
                                        )}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                            Overdue
                                        </span>
                                    </td>

                                </tr>
                            );
                        }
                    )}

                </tbody>

            </table>

        </div>
    );
}

function SummaryTable({
    data,
    label,
}) {
    return (
        <div className="overflow-x-auto">

            <table className="w-full min-w-[600px]">

                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            {label}
                        </th>

                        <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                            Total Records
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {data.map(
                        (
                            item,
                            index
                        ) => (
                            <tr
                                key={
                                    item.status ||
                                    index
                                }
                                className="border-t border-slate-100"
                            >

                                <td className="px-5 py-4">

                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold capitalize text-blue-700">
                                        {item.status ||
                                            item.borrow_status ||
                                            item.request_status ||
                                            "Unknown"}
                                    </span>

                                </td>

                                <td className="px-5 py-4 text-lg font-bold text-slate-900">
                                    {item.count ??
                                        item.total ??
                                        item.total_count ??
                                        0}
                                </td>

                            </tr>
                        )
                    )}

                </tbody>

            </table>

        </div>
    );
}

export default Reports;