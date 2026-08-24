import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, profile } = useAuth();
    useEffect(() => {
        // If profile exists, the user is logged in -> redirect to dashboard
        if (profile) {
            navigate('/dashboard', { replace: true });  // to prevent infinite loop when pressing back
        }
    }, [profile, navigate]); // Triggers immediately when profile loads or changes

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getFirebaseError = (error: unknown) => {
        if (!(error instanceof Error)) {
            return "Login failed. Please try again.";
        };

        switch (error.message) {
            case "Firebase: Error (auth/invalid-credential).":
                return "Invalid email or password.";

            case "Firebase: Error (auth/user-not-found).":
                return "No account was found with this email.";

            case "Firebase: Error (auth/wrong-password).":
                return "Incorrect password.";

            case "Firebase: Error (auth/invalid-email).":
                return "Please enter a valid email address.";

            case "Firebase: Error (auth/user-disabled).":
                return "This account has been disabled.";

            default:
                return "Login failed. Please check your credentials.";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            await login(email.trim(), password);

            console.log(profile);
            console.log(profile?.role);
            console.log(profile?.status);
            console.log(profile?.currency);

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
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Sign in to continue to CashVault.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl shadow-black/10 sm:p-6"
                >
                    <div className="space-y-4">

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

                    </div>

                    <div className="mt-3 flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-xs font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                        >
                            Forgot password?
                        </Link>
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
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>

                    <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                        >
                            Create one
                        </Link>
                    </p>
                </form>

                <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
                    Your financial data is securely stored with your account.
                </p>

            </div>
        </div>
    );
};

export default LoginPage;