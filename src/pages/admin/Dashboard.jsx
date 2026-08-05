import {
    FaBook,
    FaUsers,
    FaUserTie,
    FaExchangeAlt,
    FaArrowRight,
    FaClipboardList,
    FaPlus,
    FaCog,
    FaChartBar,
    FaDatabase,
    FaUserPlus,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaBan,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";

function AdminDashboard() {
    const navigate = useNavigate();
    const cards = [
        {
            title: "Total Books",
            value: "2,845",
            subtitle: "Library Catalog",
            icon: <FaBook />,
            color: "bg-blue-100 text-blue-700",
        },
        {
            title: "Borrowers",
            value: "1,236",
            subtitle: "Registered Users",
            icon: <FaUsers />,
            color: "bg-emerald-100 text-emerald-700",
        },
        {
            title: "Library Staff",
            value: "12",
            subtitle: "Active Employees",
            icon: <FaUserTie />,
            color: "bg-violet-100 text-violet-700",
        },
        {
            title: "Borrowed Books",
            value: "318",
            subtitle: "Currently Borrowed",
            icon: <FaExchangeAlt />,
            color: "bg-amber-100 text-amber-700",
        },
    ];
    const recentActivities = [
        {
            id: 1,
            title: "New book added",
            description: "Advanced Database Systems was added to the catalog.",
            time: "10 minutes ago",
            icon: <FaBook />,
            iconStyle: "bg-blue-100 text-blue-700",
        },
        {
            id: 2,
            title: "Staff account created",
            description: "A new librarian account was registered.",
            time: "35 minutes ago",
            icon: <FaUserPlus />,
            iconStyle: "bg-violet-100 text-violet-700",
        },
        {
            id: 3,
            title: "System settings updated",
            description: "Borrow duration was updated to 14 days.",
            time: "1 hour ago",
            icon: <FaCog />,
            iconStyle: "bg-amber-100 text-amber-700",
        },
        {
            id: 4,
            title: "Database backup completed",
            description: "A manual system backup was created successfully.",
            time: "2 hours ago",
            icon: <FaDatabase />,
            iconStyle: "bg-emerald-100 text-emerald-700",
        },
    ];

    const quickActions = [
        {
            label: "Add New Book",
            description: "Register a new title in the catalog",
            icon: <FaPlus />,
            path: "/admin/books",
        },
        {
            label: "Manage Staff",
            description: "Create or update librarian accounts",
            icon: <FaUserTie />,
            path: "/admin/staff",
        },
        {
            label: "View Reports",
            description: "Open library reports and summaries",
            icon: <FaChartBar />,
            path: "/admin/reports",
        },
        {
            label: "System Settings",
            description: "Update borrowing rules and fine rates",
            icon: <FaCog />,
            path: "/admin/settings",
        },
    ];
    const inventorySummary = [
        {
            label: "Available",
            value: 2180,
            total: 2845,
            icon: <FaCheckCircle />,
            iconStyle: "bg-emerald-100 text-emerald-700",
            barStyle: "bg-emerald-500",
        },
        {
            label: "Borrowed",
            value: 318,
            total: 2845,
            icon: <FaExchangeAlt />,
            iconStyle: "bg-blue-100 text-blue-700",
            barStyle: "bg-blue-500",
        },
        {
            label: "Reserved",
            value: 221,
            total: 2845,
            icon: <FaClock />,
            iconStyle: "bg-amber-100 text-amber-700",
            barStyle: "bg-amber-500",
        },
        {
            label: "Lost / Damaged",
            value: 126,
            total: 2845,
            icon: <FaExclamationTriangle />,
            iconStyle: "bg-red-100 text-red-700",
            barStyle: "bg-red-500",
        },
    ];

    return (
        <AdminLayout>
            <div className="mb-8">
                <p className="text-sm font-semibold text-blue-700">
                    System Administration
                </p>

                <div className="mt-1 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Welcome back, Administrator!
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Monitor library operations, inventory, and staff activities from one place.
                        </p>
                    </div>

                    <p className="text-sm text-slate-500">
                        August 5, 2026
                    </p>
                </div>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="flex items-start justify-between">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${card.color}`}
                            >
                                {card.icon}
                            </div>

                            <FaArrowRight className="text-slate-300 transition group-hover:text-blue-700" />
                        </div>

                        <p className="mt-5 text-sm text-slate-500">
                            {card.title}
                        </p>

                        <h2 className="mt-1 text-3xl font-bold text-slate-900">
                            {card.value}
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            {card.subtitle}
                        </p>
                    </div>
                ))}
            </section>
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
                {/* Recent Activities */}
                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <FaClipboardList />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Recent Activities
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Latest administrative and system actions
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/logs")}
                            className="flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                        >
                            View all
                            <FaArrowRight className="text-xs" />
                        </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {recentActivities.map((activity) => (
                            <article
                                key={activity.id}
                                className="flex gap-4 px-6 py-5 transition hover:bg-blue-50/40"
                            >
                                <div
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${activity.iconStyle}`}
                                >
                                    {activity.icon}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <h3 className="font-semibold text-slate-900">
                                            {activity.title}
                                        </h3>

                                        <span className="text-xs text-slate-400">
                                            {activity.time}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        {activity.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-slate-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Common administrative tasks
                        </p>
                    </div>

                    <div className="space-y-3">
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                type="button"
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

                                <FaArrowRight className="text-xs text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700" />
                            </button>
                        ))}
                    </div>
                </section>
            </div>
            <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Inventory Summary
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Current status of physical book copies in the library.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/copies")}
                        className="flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                    >
                        Manage copies
                        <FaArrowRight className="text-xs" />
                    </button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    {inventorySummary.map((item) => {
                        const percentage = Math.round(
                            (item.value / item.total) * 100
                        );

                        return (
                            <article
                                key={item.label}
                                className="rounded-xl border border-slate-100 p-5 transition hover:border-blue-200 hover:bg-blue-50/30"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconStyle}`}
                                        >
                                            {item.icon}
                                        </div>

                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                {item.label}
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {item.value.toLocaleString()} book copies
                                            </p>
                                        </div>
                                    </div>

                                    <span className="text-sm font-bold text-slate-700">
                                        {percentage}%
                                    </span>
                                </div>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full ${item.barStyle}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </AdminLayout>
    );
}

export default AdminDashboard;