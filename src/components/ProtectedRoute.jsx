import { Navigate } from "react-router-dom";

function ProtectedRoute({
    children,
    allowedRole,
}) {
    const token =
        localStorage.getItem("token");

    const userRole =
        localStorage.getItem("userRole");

    // Walang login/token
    if (!token) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    // May token pero walang stored role
    if (!userRole) {
        localStorage.removeItem("token");
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