import PortalLayout from "./PortalLayout";

import {
  FaHome,
  FaBook,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardCheck,
} from "react-icons/fa";

function StaffLayout({ children }) {
  const links = [
    {
      label: "Dashboard",
      path: "/staff/dashboard",
      icon: <FaHome />,
    },
    {
      label: "Borrow Requests",
      path: "/staff/requests",
      icon: <FaClipboardCheck />,
    },
    {
      label: "Borrowers",
      path: "/staff/borrowers",
      icon: <FaUsers />,
    },
    {
      label: "Returns",
      path: "/staff/returns",
      icon: <FaBook />,
    },
    {
      label: "Fine Collection",
      path: "/staff/fines",
      icon: <FaMoneyBillWave />,
    },
  ];

  return (
    <PortalLayout
      links={links}
      role="Librarian"
      navbarProps={{
        name: "Angela Reyes",
        email: "angela.reyes@bcp.edu.ph",
        role: "Librarian",
        profilePath: null,
      }}
    >
      {children}
    </PortalLayout>
  );
}

export default StaffLayout;