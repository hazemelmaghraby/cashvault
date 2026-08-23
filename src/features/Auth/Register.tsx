import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getFirebaseError = (error: unknown) => {
        if (!(error instanceof Error)) {
            return "Registration failed. Please try again.";
        }

        switch (error.message) {
            case "Firebase: Error (auth/email-already-in-use).":
                return "This email is already registered.";

            case "Firebase: Error (auth/invalid-email).":
                return "Please enter a valid email address.";

            case "Firebase: Password should be at least 6 characters (auth/password-does-not-meet-requirements).":
            case "Firebase: Error (auth/weak-password).":
                return "Password must be at least 6 characters.";

            default:
                return "Registration failed. Please try again.";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if (!firstName.trim() || !lastName.trim()) {
            setError("Please enter your first and last name.");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await register(
                firstName.trim(),
                lastName.trim(),
                email.trim(),
                password
            );

            navigate("/");
        } catch (error) {
            setError(getFirebaseError(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-lg font-bold text-white shadow-lg shadow-[var(--accent)]/20">
                        C
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Start managing your finances with CashVault.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl shadow-black/10 sm:p-6"
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <Input
                            id="firstName"
                            label="First name"
                            placeholder="Hazem"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={loading}
                        />

                        <Input
                            id="lastName"
                            label="Last name"
                            placeholder="Mohamed"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={loading}
                        />

                    </div>

                    <div className="mt-4 space-y-4">
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />

                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />

                        <Input
                            id="confirmPassword"
                            label="Confirm password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        Loading={loading}
                        disabled={loading}
                        className="mt-6 w-full"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </Button>

                    <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>

                <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
                    Your financial data will be securely connected to your account.
                </p>

            </div>
        </div>
    );
};

export default RegisterPage;
