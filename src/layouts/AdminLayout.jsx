

import { useState } from "react";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

import ConfirmDialog from "../components/ConfirmDialog";

import PortalLayout from "./PortalLayout";



import {

    FaHome,

    FaBook,

    FaCopy,

    FaTags,

    FaUserEdit,

    FaBuilding,

    FaUsers,

    FaUsersCog,

    FaCog,

    FaChartBar,

    FaClipboardList,

    FaDatabase,

    FaBullhorn,

    FaEllipsisH,

    FaTimes,

    FaChevronRight,
    FaSignOutAlt,

} from "react-icons/fa";



const mainTabs = [

    {

        label: "Dashboard",

        path: "/admin/dashboard",

        icon: FaHome,

    },

    {

        label: "Books",

        path: "/admin/books",

        icon: FaBook,

    },

    {

        label: "Members",

        path: "/admin/staff",

        icon: FaUsersCog,

    },

    {

        label: "Borrowers",

        path: "/admin/borrowers",

        icon: FaUsers,

    },

];



const moreLinks = [

    {

        label: "Book Copies",

        path: "/admin/copies",

        icon: FaCopy,

    },

    {

        label: "Categories",

        path: "/admin/categories",

        icon: FaTags,

    },

    {

        label: "Authors",

        path: "/admin/authors",

        icon: FaUserEdit,

    },

    {

        label: "Publishers",

        path: "/admin/publishers",

        icon: FaBuilding,

    },

    {

        label: "Announcements",

        path: "/admin/announcements",

        icon: FaBullhorn,

    },

    {

        label: "Reports",

        path: "/admin/reports",

        icon: FaChartBar,

    },

    {

        label: "System Logs",

        path: "/admin/logs",

        icon: FaClipboardList,

    },

    {

        label: "Backup & Restore",

        path: "/admin/backup",

        icon: FaDatabase,

    },

    {

        label: "System Settings",

        path: "/admin/settings",

        icon: FaCog,

    },

];



function AdminMobileNavigation() {

    const [moreOpen, setMoreOpen] = useState(false);

    const location = useLocation();



    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);



    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("userRole");

        localStorage.removeItem("currentUser");



        setShowLogoutModal(false);

        setMoreOpen(false);

        navigate("/");

    };



    const moreIsActive = moreLinks.some(

        (item) => location.pathname === item.path

    );



    return (

        <>

            {/* Mobile bottom navigation */}

            <nav

                aria-label="Admin mobile navigation"

                className="

                    fixed inset-x-0 bottom-0 z-40

                    border-t border-slate-200

                    bg-white/95 shadow-[0_-4px_24px_rgba(15,23,42,0.08)]

                    backdrop-blur-xl

                    lg:hidden

                "

                style={{

                    paddingBottom: "env(safe-area-inset-bottom)",

                }}

            >

                <div className="mx-auto flex max-w-xl items-center justify-around px-2 py-2">

                    {mainTabs.map((tab) => {

                        const Icon = tab.icon;



                        return (

                            <NavLink

                                key={tab.path}

                                to={tab.path}

                                onClick={() => setMoreOpen(false)}

                                className={({ isActive }) =>

                                    `

                                    flex min-w-0 flex-1 flex-col

                                    items-center justify-center

                                    gap-1 rounded-xl px-1 py-2

                                    transition-colors

                                    ${isActive

                                        ? "bg-blue-50 text-blue-900"

                                        : "text-slate-500 hover:bg-slate-50"

                                    }

                                    `

                                }

                            >

                                {({ isActive }) => (

                                    <>

                                        <Icon className="text-lg" />



                                        <span

                                            className={`text-[10px] ${isActive

                                                ? "font-bold"

                                                : "font-medium"

                                                }`}

                                        >

                                            {tab.label}

                                        </span>

                                    </>

                                )}

                            </NavLink>

                        );

                    })}



                    <button

                        type="button"

                        aria-label="More admin options"

                        aria-expanded={moreOpen}

                        onClick={() => setMoreOpen((open) => !open)}

                        className={`

                            flex min-w-0 flex-1 flex-col

                            items-center justify-center

                            gap-1 rounded-xl px-1 py-2

                            transition-colors

                            ${moreOpen || moreIsActive

                                ? "bg-blue-50 text-blue-900"

                                : "text-slate-500 hover:bg-slate-50"

                            }

                        `}

                    >

                        <FaEllipsisH className="text-lg" />

                        <span className="text-[10px] font-medium">

                            More

                        </span>

                    </button>

                </div>

            </nav>



            {/* Mobile More menu */}

            {moreOpen && (

                <div className="fixed inset-0 z-50 lg:hidden">

                    <button

                        type="button"

                        aria-label="Close more menu"

                        onClick={() => setMoreOpen(false)}

                        className="absolute inset-0 bg-slate-950/50"

                    />



                    <section

                        role="dialog"

                        aria-modal="true"

                        aria-label="More admin options"

                        className="

                            absolute inset-x-0 bottom-0

                            max-h-[85dvh] overflow-y-auto

                            rounded-t-3xl bg-slate-50

                            px-4 pt-4 shadow-2xl

                        "

                        style={{

                            paddingBottom:

                                "calc(24px + env(safe-area-inset-bottom))",

                        }}

                    >

                        <div className="mb-5 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-slate-900">

                                    More Options

                                </h2>

                                <p className="text-xs text-slate-500">

                                    Admin management tools

                                </p>

                            </div>



                            <button

                                type="button"

                                aria-label="Close"

                                onClick={() => setMoreOpen(false)}

                                className="

                                    rounded-full bg-white p-3

                                    text-slate-600 shadow-sm

                                "

                            >

                                <FaTimes />

                            </button>

                        </div>



                        <div className="space-y-2">

                            {moreLinks.map((item) => {

                                const Icon = item.icon;



                                return (

                                    <NavLink

                                        key={item.path}

                                        to={item.path}

                                        onClick={() => setMoreOpen(false)}

                                        className="

                                            flex items-center gap-4

                                            rounded-2xl border

                                            border-slate-100 bg-white

                                            px-4 py-4 shadow-sm

                                            transition-colors

                                            hover:bg-blue-50

                                        "

                                    >

                                        <span

                                            className="

                                                flex h-10 w-10

                                                items-center justify-center

                                                rounded-xl bg-blue-50

                                                text-blue-900

                                            "

                                        >

                                            <Icon />

                                        </span>



                                        <span className="flex-1 text-sm font-semibold text-slate-800">

                                            {item.label}

                                        </span>



                                        <FaChevronRight className="text-xs text-slate-400" />

                                    </NavLink>

                                );

                            })}



                            <button

                                type="button"

                                onClick={() => {

                                    setMoreOpen(false);

                                    setShowLogoutModal(true);

                                }}

                                className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-red-100 bg-white px-4 py-4 text-left font-semibold text-red-600 shadow-sm"

                            >

                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">

                                    <FaSignOutAlt />

                                </span>



                                <span className="flex-1">Logout</span>



                                <FaChevronRight className="text-xs" />

                            </button>

                        </div>

                    </section>

                </div>

            )}

        



                    <ConfirmDialog

                        open={showLogoutModal}

                        title="Confirm Logout"

                        message="Are you sure you want to sign out of the BCP Library Management System?"

                        icon={<FaSignOutAlt />}

                        confirmText="Yes, Logout"

                        confirmColor="bg-red-600 hover:bg-red-700"

                        onConfirm={handleLogout}

                        onCancel={() => setShowLogoutModal(false)}

                    />
        </>

    );

}



function AdminLayout({ children }) {

    // Preserve existing desktop sidebar links.

    const links = [

        {

            label: "Dashboard",

            path: "/admin/dashboard",

            icon: <FaHome />,

        },

        {

            label: "Book Management",

            icon: <FaBook />,

            children: [

                {

                    label: "Books",

                    path: "/admin/books",

                    icon: <FaBook />,

                },

                {

                    label: "Book Copies",

                    path: "/admin/copies",

                    icon: <FaCopy />,

                },

                {

                    label: "Categories",

                    path: "/admin/categories",

                    icon: <FaTags />,

                },

                {

                    label: "Authors",

                    path: "/admin/authors",

                    icon: <FaUserEdit />,

                },

                {

                    label: "Publishers",

                    path: "/admin/publishers",

                    icon: <FaBuilding />,

                },

            ],

        },

        {

            label: "Borrower Management",

            path: "/admin/borrowers",

            icon: <FaUsers />,

        },

        {

            label: "Staff Management",

            path: "/admin/staff",

            icon: <FaUsersCog />,

        },

        {

            label: "Announcements",

            path: "/admin/announcements",

            icon: <FaBullhorn />,

        },

        {

            label: "System Settings",

            path: "/admin/settings",

            icon: <FaCog />,

        },

        {

            label: "Reports",

            path: "/admin/reports",

            icon: <FaChartBar />,

        },

        {

            label: "System Logs",

            path: "/admin/logs",

            icon: <FaClipboardList />,

        },

        {

            label: "Backup & Restore",

            path: "/admin/backup",

            icon: <FaDatabase />,

        },

    ];



    let currentUser = {};



    try {

        currentUser = JSON.parse(

            localStorage.getItem("currentUser") || "{}"

        );

    } catch {

        currentUser = {};

    }



    const fullName = [

        currentUser.firstName,

        currentUser.middleName,

        currentUser.lastName,

    ]

        .filter(Boolean)

        .join(" ");



    return (

        <PortalLayout

            links={links}

            role="Administrator"

            mobileBottomNav

            navbarProps={{

                name: fullName || "System Administrator",

                email:

                    currentUser.email ||

                    currentUser.schoolId ||

                    "",

                role: "Administrator",

                profilePath: null,

                settingsPath: "/admin/settings",

            }}

        >

            <div className="pb-24 lg:pb-0">

                {children}

            </div>



            <AdminMobileNavigation />

        </PortalLayout>

    );

}



export default AdminLayout;
