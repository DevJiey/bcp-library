import PortalLayout from "./PortalLayout";
import {
    FaHome,
    FaBook,
    FaClipboardList,
    FaMoneyBillWave,
    FaBell,
    FaUser,
} from "react-icons/fa";

function BorrowerLayout({ children }) {
    const links = [
        {
            label: "Dashboard",
            path: "/borrower/dashboard",
            icon: <FaHome />,
        },
        {
            label: "Books",
            path: "/borrower/books",
            icon: <FaBook />,
        },
        {
            label: "Borrowings",
            path: "/borrower/borrowings",
            icon: <FaClipboardList />,
        },
        {
            label: "Fines",
            path: "/borrower/fines",
            icon: <FaMoneyBillWave />,
        },
        {
            label: "Notifications",
            path: "/borrower/notifications",
            icon: <FaBell />,
        },
        {
            label: "Profile",
            path: "/borrower/profile",
            icon: <FaUser />,
        },
    ];

    return (
        <PortalLayout
            links={links}
            role="Borrower"
            navbarProps={{
                name: "Ronald Jay Cruz",
                email: "240116136@bcp.edu.ph",
                role: "Borrower",
                profilePath: "/borrower/profile",
            }}
        >
            {children}
        </PortalLayout>
    );
}

export default BorrowerLayout;