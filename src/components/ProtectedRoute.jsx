import { Navigate } from "react-router-dom";

function ProtectedRoute({
    children,
    allowedRole,
}) {
    const token =
        localStorage.getItem("token");

    const userRole =
        localStorage.getItem("userRole");

    const storedUser =
        localStorage.getItem(
            "currentUser"
        );

    // Walang login/token
    if (!token) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    // May token pero incomplete
    // ang stored authentication data
    if (
        !userRole ||
        !storedUser
    ) {
        localStorage.removeItem(
            "token"
        );
        localStorage.removeItem(
            "userRole"
        );
        localStorage.removeItem(
            "currentUser"
        );

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    let currentUser;

    try {
        currentUser =
            JSON.parse(storedUser);
    } catch {
        localStorage.removeItem(
            "token"
        );
        localStorage.removeItem(
            "userRole"
        );
        localStorage.removeItem(
            "currentUser"
        );

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    // First-login users must change
    // their temporary password first.
    if (
        currentUser.isFirstLogin
    ) {
        return (
            <Navigate
                to="/change-password"
                replace
            />
        );
    }

    // Wrong role
    if (
        allowedRole &&
        userRole !== allowedRole
    ) {
        return (
            <Navigate
                to="/access-denied"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;