import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../auth/auth-context";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const from = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        const success = login(email, password);

        if (!success) {
            setError("Please enter your email and password.");
            return;
        }

        navigate(from, { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="flex min-h-screen">
                {/* Brand section */}
                <div className="hidden flex-1 items-center justify-center bg-brand p-12 text-white lg:flex">
                    <div className="max-w-md">
                        <div className="text-3xl font-bold tracking-tight">
                            ABJAD
                        </div>

                        <div className="mt-1 text-sm text-white/70">
                            Platform Administration
                        </div>

                        <h1 className="mt-12 text-4xl font-semibold leading-tight">
                            Manage your ABJAD ERP platform from one place.
                        </h1>

                        <p className="mt-5 text-sm leading-6 text-white/75">
                            Manage organizations, subscriptions, access control,
                            features, usage limits, support, and platform settings.
                        </p>
                    </div>
                </div>

                {/* Login section */}
                <div className="flex w-full items-center justify-center p-6 sm:p-10 lg:w-[480px] lg:bg-white dark:lg:bg-slate-900">
                    <div className="w-full max-w-sm">
                        <div className="mb-8 lg:hidden">
                            <div className="text-2xl font-bold tracking-tight text-brand">
                                ABJAD
                            </div>

                            <div className="text-xs text-slate-500">
                                Platform Administration
                            </div>
                        </div>

                        <div className="card p-6 sm:p-8">
                            <div className="mb-6">
                                <h1 className="text-2xl font-semibold">
                                    Admin Login
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Sign in to the ABJAD Platform Admin.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="label">
                                        Email
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-3 text-slate-400"
                                        />

                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(event.target.value)
                                            }
                                            placeholder="admin@example.com"
                                            className="input w-full pl-9"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="label">
                                        Password
                                    </label>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-3 text-slate-400"
                                        />

                                        <input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                            placeholder="Enter password"
                                            className="input w-full pl-9"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                >
                                    Login
                                </button>
                            </form>

                            <p className="mt-5 text-center text-xs text-slate-400">
                                Development login — authentication is currently
                                static.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}