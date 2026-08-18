import PortalLayout from "./PortalLayout";

import {
  FaHome,
  FaBook,
  FaUsers,
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
      role="Library Staff"
      navbarProps={{
        name:
          fullName ||
          "Library Staff",

        email:
          currentUser.email ||
          currentUser.schoolId ||
          "",

        role: "Library Staff",

        profilePath: null,
      }}
    >
      {children}
    </PortalLayout>
  );
}

export default StaffLayout;