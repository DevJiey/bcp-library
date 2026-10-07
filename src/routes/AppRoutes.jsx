import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import ChangePassword from "../pages/auth/ChangePassword";

import BorrowerDashboard from "../pages/borrower/Dashboard";
import Books from "../pages/borrower/Books";
import Borrowings from "../pages/borrower/Borrowings";
import Notifications from "../pages/borrower/Notifications";
import Profile from "../pages/borrower/Profile";

import StaffDashboard from "../pages/staff/Dashboard";
import BorrowRequests from "../pages/staff/BorrowRequests";
import Returns from "../pages/staff/Returns";
import Borrowers from "../pages/staff/Borrowers";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminBooks from "../pages/admin/Books";
import BookCopies from "../pages/admin/BookCopies";
import Categories from "../pages/admin/Categories";
import Authors from "../pages/admin/Authors";
import Publishers from "../pages/admin/Publishers";
import Staff from "../pages/admin/Staff";
import Announcements from "../pages/admin/Announcements";
import Settings from "../pages/admin/Settings";
import Reports from "../pages/admin/Reports";
import Logs from "../pages/admin/Logs";
import Backup from "../pages/admin/Backup";

import NotFound from "../pages/NotFound";
import AccessDenied from "../pages/AccessDenied";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/change-password"
                element={<ChangePassword />}
            />

            <Route
                path="/borrower/dashboard"
                element={
                    <ProtectedRoute allowedRole="borrower">
                        <BorrowerDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/borrower/books"
                element={
                    <ProtectedRoute allowedRole="borrower">
                        <Books />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/borrower/borrowings"
                element={
                    <ProtectedRoute allowedRole="borrower">
                        <Borrowings />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/borrower/notifications"
                element={
                    <ProtectedRoute allowedRole="borrower">
                        <Notifications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/borrower/profile"
                element={
                    <ProtectedRoute allowedRole="borrower">
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/staff/dashboard"
                element={
                    <ProtectedRoute allowedRole="staff">
                        <StaffDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/staff/requests"
                element={
                    <ProtectedRoute allowedRole="staff">
                        <BorrowRequests />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/staff/returns"
                element={
                    <ProtectedRoute allowedRole="staff">
                        <Returns />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/staff/borrowers"
                element={
                    <ProtectedRoute allowedRole="staff">
                        <Borrowers />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/books"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <AdminBooks />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/copies"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <BookCopies />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/categories"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <Categories />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/authors"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <Authors />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/publishers"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <Publishers />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/staff"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <Staff />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/announcements"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <Announcements />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/settings"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <Settings />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/reports"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <Reports />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/logs"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <Logs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/backup"
                element={
                    <ProtectedRoute allowedRole="admin">
                        <Backup />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/access-denied"
                element={<AccessDenied />}
            />

            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
}

export default AppRoutes;