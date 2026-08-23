import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { animatePageIn } from "../utils/animations";
import Logo from '../assets/Logo.png'
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);
    const { user, profile, logout } = useAuth();

    useLayoutEffect(() => {
        if (!pageRef.current) return;

        animatePageIn(pageRef.current);
    }, []);

    return (
        <div
            ref={pageRef}
            className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]"
        >
            {/* =====================================================
          NAVBAR
      ====================================================== */}

            <header className="relative z-20 border-b border-[var(--border-subtle)]">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

                    {/* Logo */}

                    <Link
                        to="/"
                        className="flex items-center gap-2.5"
                    >
                        <div
                            className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-sm
                font-bold
                text-white
                shadow-[0_0_25px_rgba(139,92,246,0.25)]
              "
                        >
                            <img src={Logo} alt="" />
                        </div>

                        <span className="text-sm font-bold tracking-tight">
                            CashVault
                        </span>
                    </Link>

                    {/* Navigation */}

                    <nav className="hidden items-center gap-8 md:flex">

                        <a
                            href="#features"
                            className="
                text-sm
                text-[var(--text-muted)]
                transition-colors
                hover:text-[var(--text-primary)]
              "
                        >
                            Features
                        </a>

                        <a
                            href="#how-it-works"
                            className="
                text-sm
                text-[var(--text-muted)]
                transition-colors
                hover:text-[var(--text-primary)]
              "
                        >
                            How it works
                        </a>

                        {user && <Link
                            to="/dashboard"
                            className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                        >
                            Dashboard
                        </Link>}

                    </nav>

                    {/* Actions */}
                    {user ? (
                        <>
                            <div className="flex items-center gap-3">

                                <div className="flex items-center gap-2">
                                    {/* User Avatar / Name */}
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                                        {profile?.firstName ? profile.firstName[0].toUpperCase() : 'U'}
                                    </div>

                                    {/* Logout Button */}
                                    <button
                                        onClick={logout}
                                        className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/5 hover:text-[var(--text-primary)]"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">

                                <Link
                                    to="/login"
                                    className="
                hidden
                rounded-lg
                px-3
                py-2
                text-sm
                font-medium
                text-[var(--text-secondary)]
                transition-colors
                hover:text-[var(--text-primary)]
                sm:block
              "
                                >
                                    Sign in
                                </Link>

                                <Link
                                    to="/register"
                                    className="
                rounded-lg
                bg-[var(--accent)]
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                transition-all
                duration-200
                hover:bg-[var(--accent-hover)]
                hover:shadow-[0_8px_30px_rgba(139,92,246,0.25)]
              "
                                >
                                    Get started
                                </Link>

                            </div>
                        </>
                    )}


                </div>
            </header>


            {/* =====================================================
          HERO
      ====================================================== */}

            <main>

                <section className="relative">

                    {/* Purple atmosphere */}

                    <div
                        className="
              pointer-events-none
              absolute
              left-1/2
              top-[-180px]
              h-[500px]
              w-[700px]
              -translate-x-1/2
              rounded-full
              bg-[radial-gradient(circle,rgba(139,92,246,0.14),transparent_68%)]
              blur-2xl
            "
                    />

                    <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">

                        <div
                            data-animate
                            className="mx-auto max-w-3xl text-center"
                        >

                            {/* Eyebrow */}

                            <div
                                className="
                  mb-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[var(--accent-border)]
                  bg-[var(--accent-soft)]
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-[var(--accent)]
                "
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />

                                Personal finance, simplified
                            </div>

                            {/* Heading */}

                            <h1
                                className="
                  text-4xl
                  font-bold
                  leading-[1.05]
                  tracking-[-0.04em]
                  sm:text-6xl
                  lg:text-7xl
                "
                            >
                                Your money.

                                <br />

                                <span className="text-[var(--accent)]">
                                    Under control.
                                </span>
                            </h1>

                            {/* Description */}

                            <p
                                className="
                  mx-auto
                  mt-6
                  max-w-2xl
                  text-base
                  leading-7
                  text-[var(--text-muted)]
                  sm:text-lg
                "
                            >
                                CashVault gives you a clear, organized view of your
                                finances — from everyday transactions to wallets,
                                transfers, receipts, and financial reports.
                            </p>

                            {/* CTA */}

                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

                                <Link
                                    to={user ? "/dashboard" : "/register"}
                                    className="
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--accent)]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[var(--accent-hover)]
                    hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)]
                    sm:w-auto
                  "
                                >
                                    {user ? "Go To Dashboard" : "Start Managing Your Money"}
                                </Link>

                                <a
                                    href="#features"
                                    className="
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    px-6
                    py-3
                    text-sm
                    font-medium
                    text-[var(--text-secondary)]
                    transition-all
                    duration-200
                    hover:border-[var(--border-hover)]
                    hover:bg-[var(--surface-hover)]
                    hover:text-[var(--text-primary)]
                    sm:w-auto
                  "
                                >
                                    Explore features
                                </a>

                            </div>

                        </div>


                        {/* =================================================
                DASHBOARD PREVIEW
            ================================================== */}

                        <div
                            data-animate
                            className="
                relative
                mx-auto
                mt-16
                max-w-5xl
                sm:mt-20
              "
                        >

                            {/* Glow */}

                            <div
                                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-[350px]
                  w-[80%]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[rgba(139,92,246,0.10)]
                  blur-[100px]
                "
                            />

                            {/* Browser frame */}

                            <div
                                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  shadow-[0_30px_100px_rgba(0,0,0,0.45)]
                "
                            >

                                {/* Top bar */}

                                <div
                                    className="
                    flex
                    h-10
                    items-center
                    gap-1.5
                    border-b
                    border-[var(--border)]
                    bg-[var(--surface-elevated)]
                    px-4
                  "
                                >
                                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-disabled)]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-disabled)]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--text-disabled)]" />
                                </div>


                                {/* Dashboard */}

                                <div className="p-5 sm:p-8">

                                    {/* Header */}

                                    <div className="mb-6">

                                        <p className="mb-1 text-xs font-medium text-[var(--accent)]">
                                            Financial overview
                                        </p>

                                        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                                            Dashboard
                                        </h2>

                                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                                            Here's what's happening with your finances.
                                        </p>

                                    </div>


                                    {/* Summary */}

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                                        {[
                                            {
                                                label: "Total Balance",
                                                value: "EGP 42,850",
                                                description: "Across all wallets",
                                            },
                                            {
                                                label: "Total Income",
                                                value: "EGP 18,400",
                                                description: "Total money received",
                                            },
                                            {
                                                label: "Total Expenses",
                                                value: "EGP 7,250",
                                                description: "Total money spent",
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className="
                          rounded-xl
                          border
                          border-[var(--border)]
                          bg-[var(--surface-elevated)]
                          p-4
                        "
                                            >

                                                <p className="text-[10px] font-medium text-[var(--text-muted)]">
                                                    {item.label}
                                                </p>

                                                <p className="mt-2 text-lg font-bold tracking-tight">
                                                    {item.value}
                                                </p>

                                                <p className="mt-1 text-[10px] text-[var(--text-disabled)]">
                                                    {item.description}
                                                </p>

                                            </div>
                                        ))}

                                    </div>


                                    {/* Chart + Transactions */}

                                    <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">

                                        {/* Chart */}

                                        <div
                                            className="
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface-elevated)]
                        p-4
                      "
                                        >

                                            <p className="text-xs font-semibold">
                                                Income vs Expenses
                                            </p>

                                            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                                                Your financial activity over the last 6 months.
                                            </p>

                                            <div className="mt-6 flex h-28 items-end justify-between gap-2 px-2">

                                                {[42, 68, 48, 82, 61, 92, 70, 84, 56, 76, 64, 88].map(
                                                    (height, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex h-full flex-1 items-end gap-0.5"
                                                        >
                                                            <div
                                                                className="w-full rounded-t-sm bg-[var(--accent)] opacity-70"
                                                                style={{ height: `${height}%` }}
                                                            />

                                                            <div
                                                                className="w-full rounded-t-sm bg-[var(--expense)] opacity-40"
                                                                style={{
                                                                    height: `${Math.max(height - 25, 20)}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    ),
                                                )}

                                            </div>

                                        </div>


                                        {/* Transactions */}

                                        <div
                                            className="
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface-elevated)]
                        p-4
                      "
                                        >

                                            <p className="text-xs font-semibold">
                                                Recent Transactions
                                            </p>

                                            <div className="mt-4 space-y-3">

                                                {[
                                                    ["Salary", "+EGP 15,000", true],
                                                    ["Groceries", "-EGP 850", false],
                                                    ["Netflix", "-EGP 300", false],
                                                ].map(([name, amount, income]) => (
                                                    <div
                                                        key={name as string}
                                                        className="
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                                                    >

                                                        <div className="flex items-center gap-2">

                                                            <div
                                                                className={`
                                  flex
                                  h-7
                                  w-7
                                  items-center
                                  justify-center
                                  rounded-lg
                                  ${income
                                                                        ? "bg-[var(--income-soft)] text-[var(--income)]"
                                                                        : "bg-[var(--expense-soft)] text-[var(--expense)]"
                                                                    }
                                `}
                                                            >
                                                                {income ? "↓" : "↑"}
                                                            </div>

                                                            <div>
                                                                <p className="text-[10px] font-semibold">
                                                                    {name}
                                                                </p>

                                                                <p className="text-[9px] text-[var(--text-disabled)]">
                                                                    Today
                                                                </p>
                                                            </div>

                                                        </div>

                                                        <p
                                                            className={`
                                text-[10px]
                                font-bold
                                ${income
                                                                    ? "text-[var(--income)]"
                                                                    : "text-[var(--expense)]"
                                                                }
                              `}
                                                        >
                                                            {amount}
                                                        </p>

                                                    </div>
                                                ))}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
            FEATURES
        ====================================================== */}

                <section
                    id="features"
                    className="
            border-t
            border-[var(--border-subtle)]
          "
                >

                    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">

                        <div
                            data-animate
                            className="max-w-2xl"
                        >

                            <p className="text-sm font-medium text-[var(--accent)]">
                                Everything in one place
                            </p>

                            <h2
                                className="
                  mt-3
                  text-3xl
                  font-bold
                  tracking-[-0.03em]
                  sm:text-4xl
                "
                            >
                                Built around the way you manage money.
                            </h2>

                            <p className="mt-4 text-sm leading-6 text-[var(--text-muted)] sm:text-base">
                                CashVault keeps the important parts of your finances
                                connected without making them complicated.
                            </p>

                        </div>


                        <div
                            data-animate
                            className="
                mt-12
                grid
                gap-4
                md:grid-cols-2
                lg:grid-cols-3
              "
                        >

                            {[
                                {
                                    number: "01",
                                    title: "Wallets",
                                    description:
                                        "Keep your cash, bank accounts, cards, and other wallets organized in one place.",
                                },
                                {
                                    number: "02",
                                    title: "Transactions",
                                    description:
                                        "Record income and expenses with categories, dates, wallets, and detailed information.",
                                },
                                {
                                    number: "03",
                                    title: "Transfers",
                                    description:
                                        "Move money between wallets while keeping your financial history accurate.",
                                },
                                {
                                    number: "04",
                                    title: "Reports",
                                    description:
                                        "Understand where your money goes with daily, weekly, and monthly financial insights.",
                                },
                                {
                                    number: "05",
                                    title: "Receipts",
                                    description:
                                        "Keep a clear record of transactions and generate organized financial receipts.",
                                },
                                {
                                    number: "06",
                                    title: "Secure by design",
                                    description:
                                        "Your financial data stays organized and protected behind your personal account.",
                                },
                            ].map((feature) => (
                                <div
                                    key={feature.number}
                                    className="
                    group
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-6
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-[var(--accent-border)]
                    hover:bg-[var(--surface-hover)]
                  "
                                >

                                    <div className="flex items-center justify-between">

                                        <span
                                            className="
                        text-xs
                        font-semibold
                        text-[var(--accent)]
                      "
                                        >
                                            {feature.number}
                                        </span>

                                        <span
                                            className="
                        text-[var(--text-disabled)]
                        transition-transform
                        duration-200
                        group-hover:translate-x-1
                        group-hover:text-[var(--accent)]
                      "
                                        >
                                            →
                                        </span>

                                    </div>

                                    <h3 className="mt-8 text-base font-semibold">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                                        {feature.description}
                                    </p>

                                </div>
                            ))}

                        </div>

                    </div>

                </section>


                {/* =====================================================
            CTA
        ====================================================== */}

                <section
                    id="how-it-works"
                    className="border-t border-[var(--border-subtle)]"
                >

                    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">

                        <div
                            data-animate
                            className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-[var(--accent-border)]
                bg-[var(--surface)]
                px-6
                py-16
                text-center
                sm:px-12
              "
                        >

                            <div
                                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-[300px]
                  w-[500px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[radial-gradient(circle,rgba(139,92,246,0.12),transparent_70%)]
                  blur-2xl
                "
                            />

                            <div className="relative">

                                <p className="text-sm font-medium text-[var(--accent)]">
                                    Start with clarity
                                </p>

                                <h2
                                    className="
                    mx-auto
                    mt-3
                    max-w-2xl
                    text-3xl
                    font-bold
                    tracking-[-0.03em]
                    sm:text-4xl
                  "
                                >
                                    Take control of your finances today.
                                </h2>

                                <p
                                    className="
                    mx-auto
                    mt-4
                    max-w-xl
                    text-sm
                    leading-6
                    text-[var(--text-muted)]
                  "
                                >
                                    Create your CashVault account and start building
                                    a clearer picture of your money.
                                </p>

                                <Link
                                    to="/register"
                                    className="
                    mt-8
                    inline-flex
                    rounded-xl
                    bg-[var(--accent)]
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-200
                    hover:bg-[var(--accent-hover)]
                    hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)]
                  "
                                >
                                    Create your account
                                </Link>

                            </div>

                        </div>

                    </div>

                </section>

            </main>


            {/* =====================================================
          FOOTER
      ====================================================== */}

            <footer className="border-t border-[var(--border-subtle)]">

                <div
                    className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-4
            px-5
            py-8
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-8
          "
                >

                    <div className="flex items-center gap-2">

                        <div
                            className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                text-xs
                font-bold
                text-white
              "
                        >
                            <img src={Logo} alt="" />
                        </div>

                        <span className="text-sm font-semibold">
                            CashVault
                        </span>

                    </div>

                    <p className="text-xs text-[var(--text-disabled)]">
                        © 2026 CashVault. All rights reserved.
                    </p>

                </div>

            </footer>

        </div>
    );
};

export default LandingPage;