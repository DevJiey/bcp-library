import {
  useEffect,
  useState,
} from "react";

import PortalLayout from "./PortalLayout";
import apiRequest from "../services/api";

import {
  FaHome,
  FaBook,
  FaClipboardList,
} from "react-icons/fa";

function BorrowerLayout({ children }) {
  const [notifications, setNotifications] =
    useState([]);

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
  ];

  let currentUser = {};

  try {
    currentUser = JSON.parse(
      localStorage.getItem(
        "currentUser"
      ) || "{}"
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

  useEffect(() => {
    const loadNotifications =
      async () => {
        try {
          const response =
            await apiRequest(
              "/notifications/me"
            );

          setNotifications(
            response?.data || []
          );
        } catch (error) {
          console.error(
            "Failed to load navbar notifications:",
            error
          );

          setNotifications([]);
        }
      };

    loadNotifications();
  }, []);

  return (
    <PortalLayout
      links={links}
      role="Borrower"
      navbarProps={{
        name:
          fullName ||
          "Library Borrower",

        email:
          currentUser.email ||
          currentUser.schoolId ||
          "",

        role:
          currentUser.borrowerType ===
          "faculty"
            ? "Faculty"
            : "Student",

        profilePath:
          "/borrower/profile",

        notificationsPath:
          "/borrower/notifications",

        notifications,
      }}
    >
      {children}
    </PortalLayout>
  );
}

export default BorrowerLayout;