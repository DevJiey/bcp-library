import PortalLayout from "./PortalLayout";
import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaMoneyBillWave,
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
  ];

  const notifications = [
    {
      id: 1,
      title: "New books are now available",
      message: "Explore the newest books in the library catalog.",
      date: "August 5, 2026",
      unread: true,
    },
    {
      id: 2,
      title: "Return reminder",
      message: "Please return borrowed books before their due dates.",
      date: "August 3, 2026",
      unread: true,
    },
    {
      id: 3,
      title: "Library schedule reminder",
      message: "The library will close at 5:00 PM on Friday.",
      date: "August 2, 2026",
      unread: false,
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
        notificationsPath: "/borrower/notifications",
        notifications,
      }}
    >
      {children}
    </PortalLayout>
  );
}

export default BorrowerLayout;