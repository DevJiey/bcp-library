
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import apiRequest from "../../services/api";

function SetupAccount() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("verifying");
    const [invitation, setInvitation] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const verifyInvitation = async () => {
            if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
                setStatus("invalid");
                return;
            }

            try {
                const response = await apiRequest(
                    "/borrower-invitations/verify",
                    {
                        method: "POST",
                        body: JSON.stringify({ token }),
                    }
                );

                if (!cancelled) {
                    setInvitation(response.data || null);
                    setStatus("valid");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                    setStatus("invalid");
                }
            }
        };

        verifyInvitation();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const passwordValid =
        password.length >= 8 &&
        password.length <= 72 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!passwordValid) {
            setError(
                "Password must be 8–72 characters and include uppercase, lowercase, and a number."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);

        try {
            await apiRequest(
                "/borrower-invitations/accept",
                {
                    method: "POST",
                    body: JSON.stringify({
                        token,
                        password,
                    }),
                }
            );

            setPassword("");
            setConfirmPassword("");
            setStatus("success");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">
                        BCP Library
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Borrower Account Setup
                    </p>
                </div>

                {status === "verifying" && (
                    <div
                        className="text-center text-slate-600"
                        role="status"
                    >
                        Verifying your invitation...
                    </div>
                )}

                {status === "invalid" && (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-red-600">
                            Invitation Unavailable
                        </h2>

                        <p className="mt-3 text-sm text-slate-600">
                            {error ||
                                "This invitation link is invalid or incomplete."}
                        </p>

                        <p className="mt-3 text-sm text-slate-500">
                            Please contact the library administrator
                            to request a new invitation.
                        </p>

                        <Link
                            to="/"
                            className="mt-6 inline-block font-medium text-blue-700 hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}

                {status === "success" && (
                    <div className="text-center" role="status">
                        <h2 className="text-xl font-semibold text-green-700">
                            Account Activated!
                        </h2>

                        <p className="mt-3 text-sm text-slate-600">
                            Your password has been set successfully.
                            You can now sign in using your school ID
                            and new password.
                        </p>

                        <Link
                            to="/"
                            className="mt-6 inline-block rounded-lg bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}

                {status === "valid" && (
                    <form onSubmit={handleSubmit}>
                        <h2 className="mb-2 text-xl font-semibold text-slate-900">
                            Create Your Password
                        </h2>

                        <p className="mb-6 text-sm text-slate-600">
                            Your invitation is valid. Set a secure
                            password to activate your borrower account.
                        </p>

                        {invitation?.firstName && (
                            <p className="mb-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                                Welcome, {invitation.firstName}!
                            </p>
                        )}

                        {error && (
                            <div
                                role="alert"
                                className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        <label
                            htmlFor="new-password"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                id="new-password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete="new-password"
                                required
                                minLength={8}
                                maxLength={72}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-16 outline-none focus:border-blue-600"
                                placeholder="Enter new password"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((value) => !value)
                                }
                                className="absolute right-3 top-3 text-sm text-blue-700"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                            8–72 characters, including uppercase,
                            lowercase, and a number.
                        </p>

                        <label
                            htmlFor="confirm-password"
                            className="mb-2 mt-5 block text-sm font-medium text-slate-700"
                        >
                            Confirm Password
                        </label>

                        <input
                            id="confirm-password"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            autoComplete="new-password"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                            placeholder="Confirm new password"
                        />

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                !passwordValid ||
                                password !== confirmPassword
                            }
                            className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? "Activating Account..."
                                : "Activate Account"}
                        </button>

                        <div className="mt-5 text-center">
                            <Link
                                to="/"
                                className="text-sm text-blue-700 hover:underline"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default SetupAccount;
