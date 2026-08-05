import PortalLayout from "./PortalLayout";
import {
    FaHome,
    FaBook,
    FaCopy,
    FaTags,
    FaUserEdit,
    FaBuilding,
    FaUsersCog,
    FaCog,
    FaChartBar,
    FaClipboardList,
    FaDatabase,
} from "react-icons/fa";

function AdminLayout({ children }) {
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
            label: "Staff Management",
            path: "/admin/staff",
            icon: <FaUsersCog />,
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

    return (
        <PortalLayout
            links={links}
            role="Administrator"
            navbarProps={{
                name: "System Administrator",
                email: "administrator@bcp.edu.ph",
                role: "Administrator",
                profilePath: null,
                settingsPath: "/admin/settings",
            }}
        >
            {children}
        </PortalLayout>
    );
}

export default AdminLayout;