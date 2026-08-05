import { useState } from "react";
import {
    FaChartBar,
    FaBook,
    FaExclamationTriangle,
    FaBoxOpen,
    FaExchangeAlt,
    FaUserTie,
    FaSearch,
    FaPrint,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

function Reports() {
    const [activeReport, setActiveReport] = useState("Most Borrowed");
    const [search, setSearch] = useState("");

    const reports = [
        {
            title: "Most Borrowed",
            description: "Frequently borrowed library books",
            icon: <FaBook />,
            iconStyle: "bg-blue-100 text-blue-700",
        },
        {
            title: "Overdue Books",
            description: "Books that are past their due date",
            icon: <FaExclamationTriangle />,
            iconStyle: "bg-red-100 text-red-700",
        },
        {
            title: "Lost Books",
            description: "Copies recorded as lost",
            icon: <FaBoxOpen />,
            iconStyle: "bg-orange-100 text-orange-700",
        },
        {
            title: "Borrowing Report",
            description: "Library borrowing transactions",
            icon: <FaExchangeAlt />,
            iconStyle: "bg-emerald-100 text-emerald-700",
        },
        {
            title: "Staff Activity",
            description: "Actions performed by library staff",
            icon: <FaUserTie />,
            iconStyle: "bg-violet-100 text-violet-700",
        },
        {
            title: "Inventory Report",
            description: "Current book-copy inventory status",
            icon: <FaChartBar />,
            iconStyle: "bg-amber-100 text-amber-700",
        },
    ];

    const reportData = {
        "Most Borrowed": [
            {
                id: 1,
                book: "Introduction to Cyber Security",
                category: "Security",
                total: 48,
            },
            {
                id: 2,
                book: "Database Management Systems",
                category: "Database",
                total: 39,
            },
            {
                id: 3,
                book: "Web Development Fundamentals",
                category: "Programming",
                total: 32,
            },
        ],

        "Overdue Books": [
            {
                id: 1,
                book: "Effective Java",
                borrower: "Juan Dela Cruz",
                dueDate: "2026-07-28",
            },
            {
                id: 2,
                book: "Learning React",
                borrower: "Maria Santos",
                dueDate: "2026-07-30",
            },
        ],

        "Lost Books": [
            {
                id: 1,
                book: "Cybersecurity Essentials",
                barcode: "BCP-000004",
                status: "Lost",
            },
        ],

        "Borrowing Report": [
            {
                id: 1,
                borrower: "Juan Dela Cruz",
                book: "Effective Java",
                date: "2026-08-01",
                status: "Borrowed",
            },
            {
                id: 2,
                borrower: "Maria Santos",
                book: "Learning React",
                date: "2026-08-02",
                status: "Returned",
            },
        ],

        "Staff Activity": [
            {
                id: 1,
                staff: "Angela Reyes",
                action: "Approved borrow request",
                date: "2026-08-05",
            },
            {
                id: 2,
                staff: "Mark Santos",
                action: "Processed book return",
                date: "2026-08-05",
            },
        ],

        "Inventory Report": [
            {
                id: 1,
                status: "Available",
                count: 2180,
            },
            {
                id: 2,
                status: "Borrowed",
                count: 318,
            },
            {
                id: 3,
                status: "Reserved",
                count: 221,
            },
            {
                id: 4,
                status: "Lost / Damaged",
                count: 126,
            },
        ],
    };

    const currentData = reportData[activeReport] || [];

    const filteredData = currentData.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Analytics and Reports
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        Library Reports
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Review borrowing, inventory, overdue, lost-book, and staff activity reports.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                    <FaPrint />
                    Print Report
                </button>
            </div>

            {/* Report Selection */}
            <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {reports.map((report) => (
                    <button
                        key={report.title}
                        type="button"
                        onClick={() => {
                            setActiveReport(report.title);
                            setSearch("");
                        }}
                        className={`flex items-center gap-4 rounded-2xl bg-white p-5 text-left shadow-sm ring-1 transition ${activeReport === report.title
                                ? "ring-2 ring-blue-600"
                                : "ring-slate-200 hover:ring-blue-300"
                            }`}
                    >
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg ${report.iconStyle}`}
                        >
                            {report.icon}
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">
                                {report.title}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {report.description}
                            </p>
                        </div>
                    </button>
                ))}
            </section>

            {/* Active Report */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {activeReport}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {filteredData.length} record
                            {filteredData.length !== 1 ? "s" : ""} found
                        </p>
                    </div>

                    <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
                        <FaSearch className="text-slate-400" />

                        <input
                            type="text"
                            placeholder="Search report..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 outline-none sm:w-72"
                        />
                    </div>
                </div>

                <ReportTable
                    reportName={activeReport}
                    data={filteredData}
                />
            </section>
        </AdminLayout>
    );
}

function ReportTable({ reportName, data }) {
    if (data.length === 0) {
        return (
            <div className="px-6 py-14 text-center">
                <FaChartBar className="mx-auto text-3xl text-slate-300" />

                <h2 className="mt-4 font-semibold text-slate-800">
                    No report records found
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Try changing your search keyword.
                </p>
            </div>
        );
    }

    if (reportName === "Most Borrowed") {
        return (
            <ReportTableWrapper
                headers={["Book", "Category", "Times Borrowed"]}
            >
                {data.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-5 py-4 font-semibold text-slate-900">
                            {item.book}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                            {item.category}
                        </td>
                        <td className="px-5 py-4 font-bold text-blue-700">
                            {item.total}
                        </td>
                    </tr>
                ))}
            </ReportTableWrapper>
        );
    }

    if (reportName === "Overdue Books") {
        return (
            <ReportTableWrapper
                headers={["Book", "Borrower", "Due Date"]}
            >
                {data.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-5 py-4 font-semibold text-slate-900">
                            {item.book}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                            {item.borrower}
                        </td>
                        <td className="px-5 py-4 font-semibold text-red-700">
                            {item.dueDate}
                        </td>
                    </tr>
                ))}
            </ReportTableWrapper>
        );
    }

    if (reportName === "Lost Books") {
        return (
            <ReportTableWrapper
                headers={["Book", "Barcode", "Status"]}
            >
                {data.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-5 py-4 font-semibold text-slate-900">
                            {item.book}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                            {item.barcode}
                        </td>
                        <td className="px-5 py-4">
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                {item.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </ReportTableWrapper>
        );
    }

    if (reportName === "Borrowing Report") {
        return (
            <ReportTableWrapper
                headers={["Borrower", "Book", "Date", "Status"]}
            >
                {data.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-5 py-4 font-semibold text-slate-900">
                            {item.borrower}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                            {item.book}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                            {item.date}
                        </td>
                        <td className="px-5 py-4">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Returned"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {item.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </ReportTableWrapper>
        );
    }

    if (reportName === "Staff Activity") {
        return (
            <ReportTableWrapper
                headers={["Staff", "Action", "Date"]}
            >
                {data.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                        <td className="px-5 py-4 font-semibold text-slate-900">
                            {item.staff}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                            {item.action}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                            {item.date}
                        </td>
                    </tr>
                ))}
            </ReportTableWrapper>
        );
    }

    return (
        <ReportTableWrapper
            headers={["Inventory Status", "Book Copies"]}
        >
            {data.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                        {item.status}
                    </td>
                    <td className="px-5 py-4 text-lg font-bold text-blue-700">
                        {item.count.toLocaleString()}
                    </td>
                </tr>
            ))}
        </ReportTableWrapper>
    );
}

function ReportTableWrapper({ headers, children }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
                <thead className="bg-slate-50">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                className="px-5 py-4 text-left text-sm font-semibold text-slate-700"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

export default Reports;