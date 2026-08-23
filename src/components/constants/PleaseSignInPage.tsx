import { Link } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { animatePageIn } from "../../utils/animations/pageAnimations";

const PleaseSignInPage = () => {
    const pageRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!pageRef.current) return;

        animatePageIn(pageRef.current);
    }, []);

    return (
        <div
            ref={pageRef}
            className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[var(--background)]
        px-5
        py-12
      "
        >
            {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}

            <div
                className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle,rgba(139,92,246,0.12),transparent_68%)]
          blur-3xl
        "
            />

            {/* Subtle top glow */}

            <div
                className="
          pointer-events-none
          absolute
          left-1/2
          top-[-250px]
          h-[400px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-[radial-gradient(circle,rgba(139,92,246,0.08),transparent_70%)]
          blur-3xl
        "
            />

            {/* =====================================================
          CONTENT
      ====================================================== */}

            <div
                data-animate
                className="
          relative
          w-full
          max-w-md
        "
            >

                {/* Logo */}

                <div className="mb-8 flex justify-center">

                    <Link
                        to="/"
                        className="flex items-center gap-2.5"
                    >

                        <div
                            className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-[var(--accent)]
                text-sm
                font-bold
                text-white
                shadow-[0_0_30px_rgba(139,92,246,0.25)]
              "
                        >
                            C
                        </div>

                        <span
                            className="
                text-base
                font-bold
                tracking-tight
                text-[var(--text-primary)]
              "
                        >
                            CashVault
                        </span>

                    </Link>

                </div>


                {/* =================================================
            CARD
        ================================================== */}

                <div
                    className="
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-6
            shadow-[0_20px_70px_rgba(0,0,0,0.35)]
            sm:p-8
          "
                >

                    {/* Icon */}

                    <div
                        className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              border
              border-[var(--accent-border)]
              bg-[var(--accent-soft)]
              text-[var(--accent)]
            "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-5 w-5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                            />

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 17l5-5-5-5"
                            />

                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12H3"
                            />
                        </svg>
                    </div>


                    {/* Heading */}

                    <div className="mt-6 text-center">

                        <p className="text-xs font-medium text-[var(--accent)]">
                            Authentication required
                        </p>

                        <h1
                            className="
                mt-2
                text-2xl
                font-bold
                tracking-tight
                text-[var(--text-primary)]
                sm:text-3xl
              "
                        >
                            Please sign in
                        </h1>

                        <p
                            className="
                mx-auto
                mt-3
                max-w-sm
                text-sm
                leading-6
                text-[var(--text-muted)]
              "
                        >
                            You need to be signed in to access your CashVault
                            account and manage your finances.
                        </p>

                    </div>


                    {/* Actions */}

                    <div className="mt-7 space-y-3">

                        <Link
                            to="/login"
                            className="
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                bg-[var(--accent)]
                px-4
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                duration-200
                hover:bg-[var(--accent-hover)]
                hover:shadow-[0_10px_30px_rgba(139,92,246,0.22)]
              "
                        >
                            Sign in to CashVault
                        </Link>

                        <Link
                            to="/register"
                            className="
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface-elevated)]
                px-4
                py-3
                text-sm
                font-medium
                text-[var(--text-secondary)]
                transition-all
                duration-200
                hover:border-[var(--border-hover)]
                hover:bg-[var(--surface-hover)]
                hover:text-[var(--text-primary)]
              "
                        >
                            Create an account
                        </Link>

                    </div>


                    {/* Divider */}

                    <div className="my-6 flex items-center gap-3">

                        <div className="h-px flex-1 bg-[var(--border)]" />

                        <span className="text-[10px] uppercase tracking-wider text-[var(--text-disabled)]">
                            CashVault
                        </span>

                        <div className="h-px flex-1 bg-[var(--border)]" />

                    </div>


                    {/* Back */}

                    <Link
                        to="/"
                        className="
              flex
              items-center
              justify-center
              gap-1.5
              text-xs
              font-medium
              text-[var(--text-muted)]
              transition-colors
              hover:text-[var(--text-primary)]
            "
                    >
                        <span>←</span>
                        Back to home
                    </Link>

                </div>


                {/* Footer */}

                <p
                    className="
            mt-6
            text-center
            text-[10px]
            text-[var(--text-disabled)]
          "
                >
                    Your finances. One clear view.
                </p>

            </div>

        </div>
    );
};

export default PleaseSignInPage;