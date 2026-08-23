import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { useTransaction } from "../../../hooks/useTransaction";
import { useWallet } from "../../../hooks/useWallet";
import { useCategory } from "../../../hooks/useCategories";
import { useAuth } from "../../../context/AuthContext";

type ReceiptSectionProps = {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
};

const ReceiptSection = ({
    title,
    icon,
    children,
}: ReceiptSectionProps) => {
    return (
        <section className="border-t border-[var(--border)]">
            <div className="flex items-center gap-3 px-6 py-4 sm:px-8">
                <div
                    className="
                        flex h-8 w-8 shrink-0 items-center justify-center
                        rounded-lg
                        border border-[var(--accent)]/20
                        bg-[var(--accent)]/10
                        text-[var(--accent)]
                    "
                >
                    <span className="text-sm">{icon}</span>
                </div>

                <p
                    className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-[var(--accent)]
                    "
                >
                    {title}
                </p>
            </div>

            <div className="divide-y divide-[var(--border)] px-6 sm:px-8">
                {children}
            </div>
        </section>
    );
};

type ReceiptRowProps = {
    label: string;
    value: string;
    highlight?: boolean;
    mono?: boolean;
};

const ReceiptRow = ({
    label,
    value,
    highlight = false,
    mono = false,
}: ReceiptRowProps) => {
    return (
        <div
            className="
                grid
                grid-cols-1
                gap-1
                py-4
                sm:grid-cols-[190px_1fr]
                sm:gap-8
            "
        >
            <p className="text-xs font-medium text-[var(--text-muted)]">
                {label}
            </p>

            <p
                className={`
                    break-words
                    text-sm
                    font-semibold
                    ${highlight
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-primary)]"
                    }
                    ${mono ? "font-mono text-xs tracking-wide" : ""}
                `}
            >
                {value}
            </p>
        </div>
    );
};

const ReceiptPage = () => {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();

    /*
    ============================================================
    HOOKS
    ============================================================
    */

    const receiptRef = useRef<HTMLDivElement>(null);

    const { transactions, loading } = useTransaction();
    const { wallets } = useWallet();
    const { categories } = useCategory();

    const transaction = transactions.find(
        (transaction) => transaction.id === transactionId
    );

    /*
    ============================================================
    PRINT / PDF
    ============================================================
    
    IMPORTANT:
    This hook MUST be before the loading/not-found returns.
    Otherwise React will throw:
    
    "Rendered more hooks than during the previous render."
    ============================================================
    */

    const exportPDF = useReactToPrint({
        contentRef: receiptRef,

        documentTitle: transaction
            ? `CashVault-Receipt-${transaction.receiptId ?? transaction.id
            }`
            : "CashVault-Receipt",

        pageStyle: `
            @page {
                size: A4;
                margin: 12mm;
            }

            @media print {
                html,
                body {
                    background: #0b0b0b !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }

                body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                [data-receipt] {
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                }

                .no-print {
                    display: none !important;
                }
            }
        `,
    });

    /*
    ============================================================
    LOADING
    ============================================================
    */

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                    <div
                        className="
                            mx-auto mb-4
                            h-10 w-10
                            animate-spin
                            rounded-full
                            border-2
                            border-[var(--border)]
                            border-t-[var(--accent)]
                        "
                    />

                    <p className="text-sm text-[var(--text-muted)]">
                        Preparing your receipt...
                    </p>
                </div>
            </div>
        );
    }

    /*
    ============================================================
    NOT FOUND
    ============================================================
    */

    if (!transaction) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-6">
                <div className="text-center">
                    <div
                        className="
                            mx-auto flex h-14 w-14
                            items-center justify-center
                            rounded-2xl
                            border border-[var(--border)]
                            bg-[var(--surface)]
                            text-[var(--text-muted)]
                        "
                    >
                        !
                    </div>

                    <h1 className="mt-5 text-xl font-bold text-[var(--text-primary)]">
                        Receipt not found
                    </h1>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        This transaction could not be found.
                    </p>
                </div>
            </div>
        );
    }

    /*
    ============================================================
    DATA
    ============================================================
    */

    const wallet = wallets.find(
        (wallet) => wallet.id === transaction.walletId
    );

    const destinationWallet = transaction.toWalletId
        ? wallets.find(
            (wallet) => wallet.id === transaction.toWalletId
        )
        : undefined;

    const category = categories.find(
        (category) => category.id === transaction.categoryId
    );

    const currencyNames: Record<string, string> = {
        EGP: "Egyptian Pound",
        USD: "US Dollar",
        EUR: "Euro",
        GBP: "British Pound",
        SAR: "Saudi Riyal",
        AED: "UAE Dirham",
    };

    const currencyName =
        currencyNames[transaction.currency] ??
        transaction.currency;

    const formattedDate = new Date(
        transaction.date
    ).toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const isIncome = transaction.type === "income";
    const isExpense = transaction.type === "expense";
    const isTransfer = transaction.type === "transfer";

    const transactionAmount = isExpense
        ? -transaction.amount
        : transaction.amount;

    const receiptId =
        transaction.receiptId ?? transaction.id;

    const formatMoney = (amount: number) => {
        return amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    /*
    ============================================================
    STATUS
    ============================================================
    */

    const statusClasses =
        transaction.status === "completed"
            ? `
                border-[var(--income)]/20
                bg-[var(--income)]/10
                text-[var(--income)]
            `
            : transaction.status === "pending"
                ? `
                border-yellow-500/20
                bg-yellow-500/10
                text-yellow-500
            `
                : `
                border-[var(--expense)]/20
                bg-[var(--expense)]/10
                text-[var(--expense)]
            `;

    // const name = {profile?.firstName}

    /*
    ============================================================
    UI
    ============================================================
    */

    return (
        <div className="mx-auto w-full max-w-4xl px-4 pb-20 sm:px-6">

            {/* ==================================================
                BACK BUTTON
            ================================================== */}

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="
                    no-print
                    mb-6
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-[var(--text-muted)]
                    transition-colors
                    hover:text-[var(--text-primary)]
                "
            >
                <span className="text-lg">
                    ←
                </span>

                Back to transactions
            </button>

            {/* ==================================================
                RECEIPT
            ================================================== */}

            <div
                ref={receiptRef}
                data-receipt
                className="
        overflow-hidden
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
        shadow-2xl

        print:rounded-none
        print:border-0
        print:shadow-none
    "
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <header
                    className="
                        relative
                        overflow-hidden
                        border-b
                        border-[var(--border)]
                        bg-[var(--background)]
                        px-6
                        py-10
                        text-center
                        sm:px-10
                        sm:py-12
                    "
                >

                    {/* Decorative glow */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-24
                            -top-24
                            h-72
                            w-72
                            rounded-full
                            bg-[var(--accent)]/10
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-32
                            -left-24
                            h-72
                            w-72
                            rounded-full
                            bg-[var(--accent)]/5
                            blur-3xl
                        "
                    />

                    <div className="relative">

                        {/* Logo */}

                        <div
                            className="
                                mx-auto
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-[var(--accent)]/30
                                bg-[var(--accent)]/10
                                shadow-lg
                                shadow-[var(--accent)]/10
                            "
                        >
                            <span
                                className="
                                    text-2xl
                                    font-black
                                    text-[var(--accent)]
                                "
                            >
                                C
                            </span>
                        </div>

                        {/* Brand */}

                        <h1
                            className="
                                mt-5
                                text-3xl
                                font-black
                                tracking-[0.28em]
                                text-[var(--text-primary)]
                                sm:text-4xl
                            "
                        >
                            CASHVAULT
                        </h1>

                        {/* Divider */}

                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                justify-center
                                gap-3
                            "
                        >
                            <span className="h-px w-10 bg-[var(--accent)]/50" />

                            <span
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.3em]
                                    text-[var(--accent)]
                                "
                            >
                                Transaction Receipt
                            </span>

                            <span className="h-px w-10 bg-[var(--accent)]/50" />
                        </div>

                        {/* Receipt ID */}

                        <div
                            className="
                                mx-auto
                                mt-7
                                w-fit
                                rounded-full
                                border
                                border-[var(--border)]
                                bg-[var(--surface)]/70
                                px-5
                                py-2
                            "
                        >
                            <p
                                className="
                                    font-mono
                                    text-[10px]
                                    tracking-wide
                                    text-[var(--text-muted)]
                                "
                            >
                                {receiptId}
                            </p>
                        </div>
                    </div>
                </header>

                {/* ==================================================
                    AMOUNT HERO
                ================================================== */}

                <div
                    className="
                        border-b
                        border-[var(--border)]
                        px-6
                        py-12
                        text-center
                        sm:px-10
                        sm:py-14
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.25em]
                            text-[var(--text-muted)]
                        "
                    >
                        {isTransfer
                            ? "Transfer Amount"
                            : "Transaction Amount"}
                    </p>

                    <p
                        className={`
                            mt-4
                            text-4xl
                            font-black
                            tracking-tight
                            sm:text-5xl
                            ${isTransfer
                                ? "text-[var(--accent)]"
                                : isIncome
                                    ? "text-[var(--income)]"
                                    : "text-[var(--expense)]"
                            }
                        `}
                    >
                        {isIncome
                            ? "+"
                            : isExpense
                                ? "-"
                                : ""}

                        {transaction.currency}{" "}

                        {formatMoney(
                            Math.abs(
                                transaction.amount
                            )
                        )}
                    </p>

                    {/* Status */}

                    <div
                        className={`
                            mx-auto
                            mt-5
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-4
                            py-2
                            ${statusClasses}
                        `}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />

                        <span
                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                            "
                        >
                            {transaction.status}
                        </span>
                    </div>

                    <p
                        className="
                            mt-4
                            text-xs
                            text-[var(--text-muted)]
                        "
                    >
                        {formattedDate}
                    </p>
                </div>

                {/* ==================================================
                    TRANSFER FLOW
                ================================================== */}

                {isTransfer && (
                    <div
                        className="
                            border-b
                            border-[var(--border)]
                            px-6
                            py-8
                            sm:px-10
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                gap-3
                                sm:gap-6
                            "
                        >

                            {/* Source */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                    rounded-2xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface-elevated)]
                                    p-4
                                    text-center
                                "
                            >
                                <p
                                    className="
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.18em]
                                        text-[var(--text-muted)]
                                    "
                                >
                                    From
                                </p>

                                <p
                                    className="
                                        mt-2
                                        truncate
                                        text-sm
                                        font-bold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {wallet?.name ??
                                        "Unknown Wallet"}
                                </p>
                            </div>

                            {/* Arrow */}

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[var(--accent)]/20
                                    bg-[var(--accent)]/10
                                    text-[var(--accent)]
                                "
                            >
                                →
                            </div>

                            {/* Destination */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                    rounded-2xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface-elevated)]
                                    p-4
                                    text-center
                                "
                            >
                                <p
                                    className="
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.18em]
                                        text-[var(--text-muted)]
                                    "
                                >
                                    To
                                </p>

                                <p
                                    className="
                                        mt-2
                                        truncate
                                        text-sm
                                        font-bold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    {destinationWallet?.name ??
                                        "Unknown Wallet"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    TRANSACTION INFORMATION
                ================================================== */}

                <ReceiptSection
                    title="Transaction Information"
                    icon="↔"
                >
                    <ReceiptRow
                        label="Transaction ID"
                        value={transaction.id}
                        mono
                    />

                    <ReceiptRow
                        label="Date & Time"
                        value={formattedDate}
                    />

                    <ReceiptRow
                        label="Transaction Type"
                        value={transaction.type.toUpperCase()}
                    />

                    <ReceiptRow
                        label="Status"
                        value={transaction.status.toUpperCase()}
                        highlight={
                            transaction.status ===
                            "completed"
                        }
                    />
                </ReceiptSection>

                {/* ==================================================
                    WALLET INFORMATION
                ================================================== */}

                <ReceiptSection
                    title="Wallet Information"
                    icon="▣"
                >
                    <ReceiptRow
                        label="Wallet"
                        value={
                            wallet?.name ??
                            "Unknown Wallet"
                        }
                    />

                    {isTransfer && (
                        <ReceiptRow
                            label="Destination Wallet"
                            value={
                                destinationWallet?.name ??
                                "Unknown Wallet"
                            }
                        />
                    )}

                    <ReceiptRow
                        label="Currency"
                        value={`${transaction.currency} — ${currencyName}`}
                    />

                    <ReceiptRow
                        label="Balance Before"
                        value={`${transaction.currency} ${formatMoney(
                            transaction.balanceBefore ?? 0
                        )}`}
                    />

                    <ReceiptRow
                        label="Transaction Amount"
                        value={`${transaction.currency} ${transactionAmount < 0
                            ? "-"
                            : "+"
                            }${formatMoney(
                                Math.abs(transactionAmount)
                            )}`}
                        highlight
                    />

                    <ReceiptRow
                        label="Balance After"
                        value={`${transaction.currency} ${formatMoney(
                            transaction.balanceAfter ?? 0
                        )}`}
                    />
                </ReceiptSection>

                {/* ==================================================
                    TRANSACTION DETAILS
                ================================================== */}

                <ReceiptSection
                    title="Transaction Details"
                    icon="≡"
                >
                    <ReceiptRow
                        label="Title"
                        value={transaction.title}
                    />

                    <ReceiptRow
                        label="Category"
                        value={
                            category?.name ??
                            "Unknown Category"
                        }
                    />

                    <ReceiptRow
                        label="Description"
                        value={
                            transaction.description ||
                            "No description provided"
                        }
                    />
                </ReceiptSection>

                {/* ==================================================
                    ACCOUNT
                ================================================== */}

                <ReceiptSection
                    title="Account"
                    icon="●"
                >
                    <ReceiptRow
                        label="Account Holder"
                        value={
                            `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
                            "Account Holder"
                        }
                    />

                    <ReceiptRow
                        label="Account Currency"
                        value={`${transaction.currency} — ${currencyName}`}
                    />

                    <ReceiptRow
                        label="Account Role"
                        value={`${profile?.role}`}
                    />
                </ReceiptSection>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <footer
                    className="
                        relative
                        overflow-hidden
                        border-t
                        border-[var(--border)]
                        bg-[var(--background)]
                        px-6
                        py-10
                        text-center
                        sm:px-10
                    "
                >
                    <div
                        className="
                            mx-auto
                            mb-8
                            flex
                            items-center
                            justify-center
                            gap-3
                        "
                    >
                        <span className="h-px w-16 bg-[var(--accent)]/30" />

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rotate-45
                                bg-[var(--accent)]
                            "
                        />

                        <span className="h-px w-16 bg-[var(--accent)]/30" />
                    </div>

                    <p
                        className="
                            text-lg
                            font-black
                            tracking-[0.2em]
                            text-[var(--text-primary)]
                        "
                    >
                        CASHVAULT
                    </p>

                    <p
                        className="
                            mt-2
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.2em]
                            text-[var(--accent)]
                        "
                    >
                        Secure. Organized. Yours.
                    </p>

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-md
                            text-xs
                            leading-relaxed
                            text-[var(--text-muted)]
                        "
                    >
                        This document is an electronic
                        record generated by CashVault and
                        represents the transaction
                        information stored in your account.
                    </p>

                    {/* Receipt ID */}

                    <div
                        className="
                            mx-auto
                            mt-6
                            max-w-sm
                            rounded-xl
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            px-4
                            py-3
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-[var(--text-muted)]
                            "
                        >
                            Receipt ID
                        </p>

                        <p
                            className="
                                mt-1
                                break-all
                                font-mono
                                text-[10px]
                                text-[var(--text-primary)]
                            "
                        >
                            {receiptId}
                        </p>
                    </div>

                    <p
                        className="
                            mt-6
                            text-[9px]
                            uppercase
                            tracking-[0.15em]
                            text-[var(--text-muted)]
                        "
                    >
                        © {new Date().getFullYear()} CashVault
                    </p>
                </footer>
            </div>

            {/* ==================================================
                EXPORT BUTTON
            ================================================== */}

            <div className="no-print mt-6 flex justify-center">
                <button
                    type="button"
                    onClick={exportPDF}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-[var(--accent)]/30
                        bg-[var(--accent)]/10
                        px-5
                        py-3
                        text-sm
                        font-bold
                        text-[var(--accent)]
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:border-[var(--accent)]/50
                        hover:bg-[var(--accent)]/20
                        active:translate-y-0
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[var(--accent)]/30
                    "
                >
                    <span className="text-base">
                        ↓
                    </span>

                    Export PDF
                </button>
            </div>
        </div>
    );
};

export default ReceiptPage;