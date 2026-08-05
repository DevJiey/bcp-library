import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRole, children }) {
    const userRole = localStorage.getItem("userRole");

    if (!userRole) {
        return <Navigate to="/" replace />;
    }

    if (userRole !== allowedRole) {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
}

export default ProtectedRoute;