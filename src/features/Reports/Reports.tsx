import {
    useMemo,
    useRef,
    useState,
} from "react";

import {
    ChevronLeft,
    ChevronRight,
    Download,
    CalendarDays,
    TrendingUp,
    TrendingDown,
    ArrowLeftRight,
    FileText,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTransaction } from "../../hooks/useTransaction";
import { useWallet } from "../../hooks/useWallet";
import { useCategory } from "../../hooks/useCategories";
import Logo from "../../assets/Logo.png"

import type {
    ReportPeriod,
} from "./types/reportTypes";

import {
    buildReportData,
} from "../../utils/Reports/reportCalculations";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

/* ============================================================
   HELPERS
============================================================ */

const startOfDay = (date: Date) => {
    const result = new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
};

const endOfDay = (date: Date) => {
    const result = new Date(date);

    result.setHours(
        23,
        59,
        59,
        999
    );

    return result;
};

const getPeriodRange = (
    date: Date,
    period: ReportPeriod
) => {
    const current = new Date(date);

    if (period === "daily") {
        return {
            start: startOfDay(current),
            end: endOfDay(current),
        };
    }

    if (period === "weekly") {
        const day =
            current.getDay();

        const diff =
            day === 0
                ? -6
                : 1 - day;

        const start =
            new Date(current);

        start.setDate(
            current.getDate() + diff
        );

        const end =
            new Date(start);

        end.setDate(
            start.getDate() + 6
        );

        return {
            start: startOfDay(start),
            end: endOfDay(end),
        };
    }

    const start =
        new Date(
            current.getFullYear(),
            current.getMonth(),
            1
        );

    const end =
        new Date(
            current.getFullYear(),
            current.getMonth() + 1,
            0
        );

    return {
        start: startOfDay(start),
        end: endOfDay(end),
    };
};

const movePeriod = (
    date: Date,
    period: ReportPeriod,
    amount: number
) => {
    const result =
        new Date(date);

    if (period === "daily") {
        result.setDate(
            result.getDate() + amount
        );
    }

    if (period === "weekly") {
        result.setDate(
            result.getDate() +
            amount * 7
        );
    }

    if (period === "monthly") {
        result.setMonth(
            result.getMonth() + amount
        );
    }

    return result;
};

const formatPeriod = (
    start: Date,
    end: Date,
    period: ReportPeriod
) => {
    if (period === "daily") {
        return start.toLocaleDateString(
            undefined,
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            }
        );
    }

    if (period === "weekly") {
        return `${start.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
            }
        )} – ${end.toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        )}`;
    }

    return start.toLocaleDateString(
        undefined,
        {
            month: "long",
            year: "numeric",
        }
    );
};

const formatDateRange = (
    start: Date,
    end: Date
) => {
    return `${start.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
        }
    )} – ${end.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    )}`;
};

const formatMoney = (
    amount: number,
    currency: string
) => {
    return new Intl.NumberFormat(
        undefined,
        {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }
    ).format(amount);
};

/* ============================================================
   COMPONENT
============================================================ */

const Reports = () => {
    const reportRef = useRef<HTMLDivElement>(null);
    const {
        profile,
    } = useAuth();

    const {
        transactions,
    } = useTransaction();

    const {
        wallets,
    } = useWallet();

    const {
        categories,
    } = useCategory();

    const [
        period,
        setPeriod,
    ] = useState<ReportPeriod>(
        "monthly"
    );

    const [
        selectedDate,
        setSelectedDate,
    ] = useState(
        new Date()
    );

    /* ----------------------------------------------------------
       DATE RANGE
    ---------------------------------------------------------- */

    const {
        start,
        end,
    } = useMemo(
        () =>
            getPeriodRange(
                selectedDate,
                period
            ),
        [
            selectedDate,
            period,
        ]
    );

    /* ----------------------------------------------------------
       REPORT
    ---------------------------------------------------------- */

    const accountHolder = profile ? `${profile.firstName} ${profile.lastName}` : "User";
    const report =
        useMemo(
            () =>
                buildReportData({
                    transactions,
                    wallets,
                    categories,

                    period,

                    startDate: start,
                    endDate: end,

                    accountHolder:
                        accountHolder,

                    currency:
                        profile?.currency ??
                        "EGP",
                }),
            [
                transactions,
                wallets,
                categories,
                period,
                start,
                end,
                profile,
            ]
        );

    const reportTransactions = useMemo(() => {
        return transactions
            .filter((transaction) => {
                const transactionDate = new Date(transaction.date);

                return (
                    transactionDate >= start &&
                    transactionDate <= end
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime()
            );
    }, [transactions, start, end]);

    /* ----------------------------------------------------------
       NAVIGATION
    ---------------------------------------------------------- */

    const previousPeriod = () => {
        setSelectedDate(
            movePeriod(
                selectedDate,
                period,
                -1
            )
        );
    };

    const nextPeriod = () => {
        setSelectedDate(
            movePeriod(
                selectedDate,
                period,
                1
            )
        );
    };

    const goToCurrentPeriod = () => {
        setSelectedDate(
            new Date()
        );
    };

    /* ----------------------------------------------------------
       RENDER
    ---------------------------------------------------------- */

    const handleExportPDF = async () => {
        if (!reportRef.current) return;

        let exportContainer: HTMLDivElement | null = null;

        try {
            const reportElement = reportRef.current;

            // ============================================================
            // CREATE A DESKTOP-SIZED EXPORT VERSION
            // ============================================================

            exportContainer = document.createElement("div");

            exportContainer.style.position = "fixed";
            exportContainer.style.left = "-100000px";
            exportContainer.style.top = "0";
            exportContainer.style.width = "1200px";
            exportContainer.style.minWidth = "1200px";
            exportContainer.style.maxWidth = "1200px";
            exportContainer.style.backgroundColor = "#ffffff";
            exportContainer.style.zIndex = "-9999";
            exportContainer.style.pointerEvents = "none";

            const clonedReport =
                reportElement.cloneNode(true) as HTMLDivElement;

            // Force the cloned report itself to desktop width
            clonedReport.style.width = "1200px";
            clonedReport.style.minWidth = "1200px";
            clonedReport.style.maxWidth = "1200px";
            clonedReport.style.margin = "0";
            clonedReport.style.backgroundColor = "#ffffff";

            exportContainer.appendChild(clonedReport);
            document.body.appendChild(exportContainer);

            // ============================================================
            // WAIT FOR DESKTOP LAYOUT TO BE CALCULATED
            // ============================================================

            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        resolve();
                    });
                });
            });

            // ============================================================
            // CAPTURE DESKTOP VERSION
            // ============================================================

            const canvas = await html2canvas(
                clonedReport,
                {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    logging: false,

                    // IMPORTANT:
                    // Pretend the browser viewport is desktop-sized.
                    width: 1200,
                    windowWidth: 1200,

                    height: clonedReport.scrollHeight,
                    windowHeight: clonedReport.scrollHeight,
                }
            );

            // ============================================================
            // REMOVE TEMPORARY REPORT
            // ============================================================

            exportContainer.remove();
            exportContainer = null;

            // ============================================================
            // CREATE PDF
            // ============================================================

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pageWidth = 210;
            const pageHeight = 297;

            const margin = 8;

            const contentWidth =
                pageWidth - margin * 2;

            const contentHeight =
                pageHeight - margin * 2;

            // Scale desktop report to A4 width
            const scale =
                contentWidth / canvas.width;

            const scaledWidth =
                canvas.width * scale;

            // Source pixels that fit on one A4 page
            const sourcePageHeight =
                contentHeight / scale;

            let sourceY = 0;
            let pageNumber = 0;

            while (sourceY < canvas.height) {

                if (pageNumber > 0) {
                    pdf.addPage();
                }

                const remainingHeight =
                    canvas.height - sourceY;

                const currentSourceHeight =
                    Math.min(
                        sourcePageHeight,
                        remainingHeight
                    );

                // ========================================================
                // CREATE PAGE SLICE
                // ========================================================

                const pageCanvas =
                    document.createElement("canvas");

                pageCanvas.width =
                    canvas.width;

                pageCanvas.height =
                    Math.ceil(currentSourceHeight);

                const ctx =
                    pageCanvas.getContext("2d");

                if (!ctx) {
                    throw new Error(
                        "Could not create PDF canvas context"
                    );
                }

                ctx.fillStyle = "#ffffff";

                ctx.fillRect(
                    0,
                    0,
                    pageCanvas.width,
                    pageCanvas.height
                );

                ctx.drawImage(
                    canvas,

                    // Source
                    0,
                    sourceY,
                    canvas.width,
                    currentSourceHeight,

                    // Destination
                    0,
                    0,
                    canvas.width,
                    currentSourceHeight
                );

                // ========================================================
                // ADD SLICE TO PDF
                // ========================================================

                const pageImage =
                    pageCanvas.toDataURL(
                        "image/png"
                    );

                const pageImageHeight =
                    currentSourceHeight * scale;

                pdf.addImage(
                    pageImage,
                    "PNG",
                    margin,
                    margin,
                    scaledWidth,
                    pageImageHeight
                );

                sourceY += currentSourceHeight;
                pageNumber++;
            }

            // ============================================================
            // SAVE
            // ============================================================

            const date =
                start.toISOString().split("T")[0];

            pdf.save(
                `CashVault-${period}-report-${date}.pdf`
            );

        } catch (error) {

            // Make absolutely sure the temporary
            // desktop report is removed if anything fails.
            if (exportContainer) {
                exportContainer.remove();
            }

            console.error(
                "Failed to export report:",
                error
            );
        }
    };

    return (
        <div className="space-y-8 pb-20 md:pb-0">

            {/* ======================================================
          HEADER
      ====================================================== */}

            <div>

                <p className="mb-2 text-sm font-medium text-[var(--accent)]">
                    Financial insights
                </p>

                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

                    <div>

                        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                            Reports
                        </h1>

                        <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
                            Review your financial activity and performance.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleExportPDF}
                        className="
      inline-flex
      items-center
      justify-center
      gap-2
      rounded-xl
      border
      border-[var(--border)]
      bg-[var(--surface)]
      px-4
      py-2.5
      text-sm
      font-semibold
      text-[var(--text-primary)]
      transition-all
      hover:-translate-y-0.5
      hover:bg-[var(--surface-elevated)]
    "
                    >
                        <Download className="h-4 w-4" />
                        Export PDF
                    </button>

                </div>

            </div>

            {/* ======================================================
          PERIOD CONTROLS
      ====================================================== */}

            <div
                className="
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
          p-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
            >

                {/* Period tabs */}

                <div
                    className="
            flex
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--surface-elevated)]
            p-1
          "
                >

                    {(
                        [
                            "daily",
                            "weekly",
                            "monthly",
                        ] as ReportPeriod[]
                    ).map(
                        (item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => {
                                    setPeriod(item);
                                    setSelectedDate(
                                        new Date()
                                    );
                                }}
                                className={`
                  rounded-lg
                  px-4
                  py-2
                  text-sm
                  font-medium
                  capitalize
                  transition-all

                  ${period === item
                                        ? `
                        bg-[var(--surface)]
                        text-[var(--text-primary)]
                        shadow-sm
                      `
                                        : `
                        text-[var(--text-muted)]
                        hover:text-[var(--text-primary)]
                      `
                                    }
                `}
                            >
                                {item}
                            </button>
                        )
                    )}

                </div>

                {/* Date navigation */}

                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        onClick={previousPeriod}
                        className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-muted)]
              transition
              hover:bg-[var(--surface-elevated)]
              hover:text-[var(--text-primary)]
            "
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div
                        className="
              flex
              min-w-52
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--surface-elevated)]
              px-4
              py-2
              text-sm
              font-medium
              text-[var(--text-primary)]
            "
                    >
                        <CalendarDays className="h-4 w-4 text-[var(--accent)]" />

                        {formatPeriod(
                            start,
                            end,
                            period
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={nextPeriod}
                        className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-muted)]
              transition
              hover:bg-[var(--surface-elevated)]
              hover:text-[var(--text-primary)]
            "
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={goToCurrentPeriod}
                        className="
              hidden
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-3
              py-2
              text-xs
              font-semibold
              text-[var(--text-muted)]
              transition
              hover:bg-[var(--surface-elevated)]
              hover:text-[var(--text-primary)]
              sm:block
            "
                    >
                        Current
                    </button>

                </div>

            </div>

            {/* ======================================================
          REPORT DOCUMENT
      ====================================================== */}

            <div
                ref={reportRef}
                className="
      overflow-hidden
      rounded-3xl
      border
      border-[var(--border)]
      bg-white
      text-slate-900
      shadow-sm
    "
            >

                {/* Report Header */}

                <div
                    className="
            border-b
            border-purple-400
            px-6
            py-8
            sm:px-10
            sm:py-10
          "
                >

                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">

                        <div>

                            <div className="mb-4 flex items-center gap-3">

                                <div
                                    className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    text-sm
                    font-bold
                    text-white
                  "
                                >
                                    <img src={Logo} alt="" />
                                </div>

                                <div>

                                    <p className="text-sm font-bold tracking-wide text-slate-950">
                                        CASHVAULT
                                    </p>

                                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                                        Financial Management
                                    </p>

                                </div>

                            </div>

                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                {period.charAt(0).toUpperCase() +
                                    period.slice(1)}{" "}
                                Financial Report
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                {formatDateRange(
                                    start,
                                    end
                                )}
                            </p>

                        </div>

                        <div className="sm:text-right">

                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Report ID
                            </p>

                            <p className="mt-1 font-mono text-sm font-semibold text-slate-700">
                                {report.reportId}
                            </p>

                            <p className="mt-3 text-xs text-slate-400">
                                Generated{" "}
                                {report.generatedAt.toLocaleDateString()}
                            </p>

                        </div>

                    </div>

                </div>

                {/* ==================================================
            ACCOUNT SUMMARY
        ================================================== */}

                <div className="border-b border-slate-200 px-6 py-6 sm:px-10">

                    <SectionTitle>
                        Account Summary
                    </SectionTitle>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                        <InfoItem
                            label="Account Holder"
                            value={
                                report.accountHolder
                            }
                        />

                        <InfoItem
                            label="Currency"
                            value={
                                report.currency
                            }
                        />

                        <InfoItem
                            label="Period"
                            value={formatDateRange(
                                start,
                                end
                            )}
                        />

                        <InfoItem
                            label="Transactions"
                            value={String(
                                report.transactionStats.total
                            )}
                        />

                    </div>

                </div>

                {/* ==================================================
            FINANCIAL OVERVIEW
        ================================================== */}

                <div className="border-b border-slate-200 px-6 py-6 sm:px-10">

                    <SectionTitle>
                        Financial Overview
                    </SectionTitle>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

                        <MetricCard
                            label="Opening Balance"
                            value={formatMoney(
                                report.openingBalance,
                                report.currency
                            )}
                        />

                        <MetricCard
                            label="Total Income"
                            value={formatMoney(
                                report.totalIncome,
                                report.currency
                            )}
                            icon={
                                <TrendingUp className="h-4 w-4" />
                            }
                            positive
                        />

                        <MetricCard
                            label="Total Expenses"
                            value={formatMoney(
                                report.totalExpenses,
                                report.currency
                            )}
                            icon={
                                <TrendingDown className="h-4 w-4" />
                            }
                            negative
                        />

                        <MetricCard
                            label="Transfers"
                            value={formatMoney(
                                report.totalTransfers,
                                report.currency
                            )}
                            icon={
                                <ArrowLeftRight className="h-4 w-4" />
                            }
                        />

                        <MetricCard
                            label="Closing Balance"
                            value={formatMoney(
                                report.closingBalance,
                                report.currency
                            )}
                            highlight
                        />

                    </div>

                </div>

                {/* ==================================================
            BREAKDOWNS
        ================================================== */}

                <div className="grid grid-cols-1 gap-8 border-b border-slate-200 px-6 py-6 sm:px-10 lg:grid-cols-2">

                    {/* Income */}

                    <Breakdown
                        title="Income Breakdown"
                        data={
                            report.incomeBreakdown
                        }
                        currency={
                            report.currency
                        }
                        positive
                    />

                    {/* Expenses */}

                    <Breakdown
                        title="Expense Breakdown"
                        data={
                            report.expenseBreakdown
                        }
                        currency={
                            report.currency
                        }
                    />

                </div>

                {/* ==================================================
            TOP EXPENSES
        ================================================== */}

                <div className="border-b border-slate-200 px-6 py-6 sm:px-10">

                    <SectionTitle>
                        Top Expense Categories
                    </SectionTitle>

                    <div className="space-y-4">

                        {report.topExpenseCategories.length ===
                            0 ? (
                            <EmptyText text="No expenses recorded during this period." />
                        ) : (
                            report.topExpenseCategories.map(
                                (category, index) => (
                                    <div
                                        key={
                                            category.categoryId
                                        }
                                        className="flex items-center gap-4"
                                    >

                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                                            {index + 1}
                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <div className="mb-1 flex justify-between gap-4">

                                                <span className="truncate text-sm font-semibold">
                                                    {
                                                        category.categoryName
                                                    }
                                                </span>

                                                <span className="text-sm font-bold">
                                                    {formatMoney(
                                                        category.amount,
                                                        report.currency
                                                    )}
                                                </span>

                                            </div>

                                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                                                <div
                                                    className="h-full rounded-full bg-slate-900"
                                                    style={{
                                                        width: `${Math.min(
                                                            category.percentage,
                                                            100
                                                        )}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                        <span className="w-14 text-right text-xs font-medium text-slate-400">
                                            {category.percentage.toFixed(
                                                1
                                            )}
                                            %
                                        </span>

                                    </div>
                                )
                            )
                        )}

                    </div>

                </div>

                {/* ==================================================
            TRANSACTION STATS
        ================================================== */}

                <div className="border-b border-slate-200 px-6 py-6 sm:px-10">

                    <SectionTitle>
                        Transaction Activity
                    </SectionTitle>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-6">

                        <Stat
                            label="Total"
                            value={
                                report.transactionStats.total
                            }
                        />

                        <Stat
                            label="Income"
                            value={
                                report.transactionStats.income
                            }
                        />

                        <Stat
                            label="Expenses"
                            value={
                                report.transactionStats.expenses
                            }
                        />

                        <Stat
                            label="Transfers"
                            value={
                                report.transactionStats.transfers
                            }
                        />

                        <Stat
                            label="Pending"
                            value={
                                report.transactionStats.pending
                            }
                        />

                        <Stat
                            label="Cancelled"
                            value={
                                report.transactionStats.cancelled
                            }
                        />

                    </div>

                </div>

                {/* ==================================================
    TRANSACTIONS
================================================== */}

                <div className="border-b border-slate-200 px-6 py-6 sm:px-10">

                    <div className="mb-4 flex items-end justify-between gap-4">

                        <div>
                            <SectionTitle>
                                Transactions
                            </SectionTitle>

                            <p className="mt-[-10px] text-xs text-slate-400">
                                Financial activity recorded during this period.
                            </p>
                        </div>

                        <p className="shrink-0 text-xs font-medium text-slate-400">
                            {reportTransactions.length} transaction
                            {reportTransactions.length !== 1 ? "s" : ""}
                        </p>

                    </div>

                    {reportTransactions.length === 0 ? (

                        <EmptyText text="No transactions recorded during this period." />

                    ) : (

                        <div className="overflow-hidden rounded-xl border border-slate-200">

                            {/* Table header */}

                            <div
                                className="
            hidden
            grid-cols-[1.5fr_1fr_1fr_1.2fr_1fr]
            border-b
            border-slate-200
            bg-slate-50
            px-4
            py-3
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            text-slate-400
            sm:grid
        "
                            >
                                <span>Transaction</span>
                                <span>Category</span>
                                <span>Date</span>
                                <span>Wallet</span>
                                <span className="text-right">
                                    Amount
                                </span>
                            </div>

                            {/* Transactions */}

                            {reportTransactions.map((transaction) => {

                                const category =
                                    categories.find(
                                        (item) =>
                                            item.id === transaction.categoryId
                                    );

                                const isIncome =
                                    transaction.type === "income";

                                const isTransfer =
                                    transaction.type === "transfer";

                                const transactionDate =
                                    new Date(transaction.date);

                                const fromWallet =
                                    wallets.find(
                                        (wallet) =>
                                            wallet.id === transaction.walletId
                                    );

                                const toWallet =
                                    transaction.toWalletId
                                        ? wallets.find(
                                            (wallet) =>
                                                wallet.id === transaction.toWalletId
                                        )
                                        : undefined;

                                const walletLabel = isTransfer
                                    ? `${fromWallet?.name ?? "Unknown"} → ${toWallet?.name ?? "Unknown"}`
                                    : fromWallet?.name ?? "Unknown Wallet";

                                return (
                                    <div
                                        key={transaction.id}
                                        className="
                    grid
                    grid-cols-2
                    gap-3
                    border-b
                    border-slate-200
                    px-4
                    py-4
                    last:border-0
                    sm:grid-cols-[1.5fr_1fr_1fr_1.2fr_1fr]
                    sm:items-center
                "
                                    >

                                        {/* Transaction */}

                                        <div className="min-w-0">

                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {transaction.title}
                                            </p>

                                            <p className="mt-1 text-[11px] text-slate-400">
                                                {isTransfer
                                                    ? "Transfer"
                                                    : isIncome
                                                        ? "Income"
                                                        : "Expense"}
                                            </p>

                                        </div>


                                        {/* Category */}

                                        <div>

                                            <p className="text-xs text-slate-400 sm:hidden">
                                                Category
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-700 sm:mt-0">
                                                {isTransfer
                                                    ? "Wallet Transfer"
                                                    : category?.name ?? "Uncategorized"}
                                            </p>

                                        </div>


                                        {/* Date */}

                                        <div>

                                            <p className="text-xs text-slate-400 sm:hidden">
                                                Date
                                            </p>

                                            <p className="mt-1 text-sm text-slate-600 sm:mt-0">
                                                {transactionDate.toLocaleDateString(
                                                    undefined,
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        year:
                                                            period === "monthly"
                                                                ? undefined
                                                                : "numeric",
                                                    }
                                                )}
                                            </p>

                                        </div>


                                        {/* Wallet */}

                                        <div>

                                            <p className="text-xs text-slate-400 sm:hidden">
                                                Wallet
                                            </p>

                                            <p
                                                className="
                            mt-1
                            truncate
                            text-sm
                            font-medium
                            text-slate-700
                            sm:mt-0
                        "
                                                title={walletLabel}
                                            >
                                                {walletLabel}
                                            </p>

                                        </div>


                                        {/* Amount */}

                                        <div className="text-left sm:text-right">

                                            <p className="text-xs text-slate-400 sm:hidden">
                                                Amount
                                            </p>

                                            <p
                                                className={`
                            mt-1
                            text-sm
                            font-bold
                            sm:mt-0
                            ${isIncome
                                                        ? "text-emerald-600"
                                                        : isTransfer
                                                            ? "text-slate-700"
                                                            : "text-red-600"
                                                    }
                        `}
                                            >
                                                {isIncome
                                                    ? "+"
                                                    : isTransfer
                                                        ? ""
                                                        : "-"}

                                                {formatMoney(
                                                    transaction.amount,
                                                    report.currency
                                                )}
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>

                {/* ==================================================
            WALLET SUMMARY
        ================================================== */}

                <div className="px-6 py-6 sm:px-10">

                    <SectionTitle>
                        Wallet Summary
                    </SectionTitle>

                    {report.wallets.length ===
                        0 ? (
                        <EmptyText text="No wallets available." />
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-200">

                            <div className="hidden grid-cols-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 sm:grid">

                                <span>Wallet</span>

                                <span>Opening</span>

                                <span>Activity</span>

                                <span className="text-right">
                                    Closing
                                </span>

                            </div>

                            {report.wallets.map(
                                (wallet) => (
                                    <div
                                        key={
                                            wallet.walletId
                                        }
                                        className="
                      grid
                      grid-cols-2
                      gap-3
                      border-b
                      border-slate-200
                      px-4
                      py-4
                      last:border-0
                      sm:grid-cols-4
                    "
                                    >

                                        <div>

                                            <p className="text-sm font-semibold">
                                                {
                                                    wallet.walletName
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {
                                                    wallet.currency
                                                }
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-400 sm:hidden">
                                                Opening
                                            </p>

                                            <p className="mt-1 text-sm font-medium sm:mt-0">
                                                {formatMoney(
                                                    wallet.openingBalance,
                                                    wallet.currency
                                                )}
                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-xs text-slate-400 sm:hidden">
                                                Activity
                                            </p>

                                            <p className="mt-1 text-sm font-medium sm:mt-0">
                                                +{formatMoney(
                                                    wallet.income +
                                                    wallet.transfersIn -
                                                    wallet.expenses -
                                                    wallet.transfersOut,
                                                    wallet.currency
                                                )}
                                            </p>

                                        </div>

                                        <div className="text-left sm:text-right">

                                            <p className="text-xs text-slate-400 sm:hidden">
                                                Closing
                                            </p>

                                            <p className="mt-1 text-sm font-bold sm:mt-0">
                                                {formatMoney(
                                                    wallet.closingBalance,
                                                    wallet.currency
                                                )}
                                            </p>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

                {/* ==================================================
            FOOTER
        ================================================== */}

                <div className="border-t border-purple-400 bg-slate-50 px-6 py-6 sm:px-10">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* Brand */}
                        <div className="flex items-center gap-3">

                            <img
                                src={Logo}
                                alt="CashVault"
                                className="h-7 w-7 object-contain"
                            />

                            <div>
                                <p className="text-xs font-bold tracking-wide text-slate-800">
                                    CASHVAULT
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                    Personal Financial Management
                                </p>
                            </div>

                        </div>

                        {/* Report information */}
                        <div className="text-left sm:text-right">

                            <p className="text-[11px] font-medium text-slate-500">
                                Generated by CashVault
                            </p>

                            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                                This report is based on recorded financial activity.
                            </p>

                        </div>

                    </div>

                    {/* Bottom line */}
                    <div className="mt-5 flex flex-col gap-1 border-t border-slate-200 pt-4 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">

                        <span>
                            Confidential financial report
                        </span>

                        <span>
                            Report ID: {report.reportId}
                        </span>

                        <span>
                            © {new Date().getFullYear()} CashVault
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
};

/* ============================================================
   SMALL COMPONENTS
============================================================ */

const SectionTitle = ({
    children,
}: {
    children: React.ReactNode;
}) => (
    <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {children}
    </h3>
);

const InfoItem = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <div>
        <p className="text-xs text-slate-400">
            {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
            {value}
        </p>
    </div>
);

const MetricCard = ({
    label,
    value,
    icon,
    positive,
    negative,
    highlight,
}: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    positive?: boolean;
    negative?: boolean;
    highlight?: boolean;
}) => (
    <div
        className={`
      rounded-xl
      border
      p-4
      ${highlight
                ? "border-slate-900 bg-slate-950 text-white"
                : "border-slate-200 bg-white"
            }
    `}
    >

        <div className="flex items-center justify-between">

            <p
                className={`
          text-xs
          font-medium
          ${highlight
                        ? "text-slate-400"
                        : "text-slate-400"
                    }
        `}
            >
                {label}
            </p>

            {icon && (
                <span
                    className={`
            ${positive
                            ? "text-emerald-600"
                            : negative
                                ? "text-red-600"
                                : "text-slate-500"
                        }
          `}
                >
                    {icon}
                </span>
            )}

        </div>

        <p
            className={`
        mt-2
        text-lg
        font-bold
        tracking-tight
        ${highlight
                    ? "text-white"
                    : "text-slate-900"
                }
      `}
        >
            {value}
        </p>

    </div>
);

const Breakdown = ({
    title,
    data,
    currency,
    positive,
}: {
    title: string;
    data: {
        categoryId: string;
        categoryName: string;
        amount: number;
        percentage: number;
        transactionCount: number;
    }[];
    currency: string;
    positive?: boolean;
}) => (
    <div>

        <SectionTitle>
            {title}
        </SectionTitle>

        {data.length === 0 ? (
            <EmptyText text="No activity recorded." />
        ) : (
            <div className="space-y-3">

                {data.map(
                    (item) => (
                        <div
                            key={
                                item.categoryId
                            }
                        >

                            <div className="mb-1.5 flex items-center justify-between gap-4">

                                <div className="min-w-0">

                                    <p className="truncate text-sm font-semibold">
                                        {
                                            item.categoryName
                                        }
                                    </p>

                                    <p className="text-[11px] text-slate-400">
                                        {
                                            item.transactionCount
                                        }{" "}
                                        transaction
                                        {item.transactionCount !==
                                            1
                                            ? "s"
                                            : ""}
                                    </p>

                                </div>

                                <div className="shrink-0 text-right">

                                    <p className="text-sm font-bold">
                                        {formatMoney(
                                            item.amount,
                                            currency
                                        )}
                                    </p>

                                    <p className="text-[11px] text-slate-400">
                                        {item.percentage.toFixed(
                                            1
                                        )}
                                        %
                                    </p>

                                </div>

                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className={`
                    h-full
                    rounded-full
                    ${positive
                                            ? "bg-emerald-600"
                                            : "bg-slate-900"
                                        }
                  `}
                                    style={{
                                        width: `${Math.min(
                                            item.percentage,
                                            100
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>
                    )
                )}

            </div>
        )}

    </div>
);

const Stat = ({
    label,
    value,
}: {
    label: string;
    value: number;
}) => (
    <div className="rounded-xl bg-slate-50 p-4">

        <p className="text-xs font-medium text-slate-400">
            {label}
        </p>

        <p className="mt-1 text-xl font-bold text-slate-900">
            {value}
        </p>

    </div>
);

const EmptyText = ({
    text,
}: {
    text: string;
}) => (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-400">
        <FileText className="h-4 w-4" />
        {text}
    </div>
);

export default Reports;