import { useWallet } from "../../hooks/useWallet";
import { useTransaction } from "../../hooks/useTransaction";
import { Link } from "react-router-dom";
import SummaryCard from "./SummaryCard";
import {
  getMonthlyFinancialData,
} from "../../utils/dashboardUtils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useCategory } from "../../hooks/useCategories";
import {
  useLayoutEffect,
  useRef,
} from "react";
import { animatePageIn } from "../../utils/animations";
// import { usePermissions } from "../../hooks/usePermissions";
import { useAuth } from "../../context/AuthContext";
import {
  useCurrencyTotals,
} from "../../hooks/useCurrencyTotals";


const DashboardPage = () => {
  const { wallets, loading: walletsLoading } = useWallet();
  const { categories, loading: categoriesLoading } = useCategory();
  const { transactions, loading: transactionsLoading } = useTransaction();
  const { profile } = useAuth();

  const isLoading =
    walletsLoading ||
    categoriesLoading ||
    transactionsLoading;

  const [
    totalWalletsBalance,
    totalIncomeAmount,
    totalExpenseAmount,
  ] = useCurrencyTotals(
    wallets,
    transactions,
    profile?.currency ?? "EGP"
  );

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // ===
  const monthlyData = getMonthlyFinancialData(transactions);

  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!pageRef.current) return;

    animatePageIn(pageRef.current);
  }, []);

  // const { can } = usePermissions();

  // console.log("Manage users:", can("manage_users"));
  // console.log(profile?.role);
  // console.log("View staff:", can("view_staff"));

  if (isLoading) {
    return (
      <div
        ref={pageRef}
        className="space-y-8 pb-20 md:pb-0"
      >
        {/* Header */}
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-elevated)]" />

          <div className="h-10 w-48 animate-pulse rounded-lg bg-[var(--surface-elevated)]" />

          <div className="h-5 w-80 max-w-full animate-pulse rounded bg-[var(--surface-elevated)]" />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
              h-32
              animate-pulse
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
            "
            />
          ))}
        </div>

        {/* Chart */}
        <div
          className="
          overflow-hidden
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
        "
        >
          <div className="space-y-3 border-b border-[var(--border)] px-5 py-5 sm:px-6">
            <div className="h-5 w-40 animate-pulse rounded bg-[var(--surface-elevated)]" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-[var(--surface-elevated)]" />
          </div>

          <div className="h-[280px] animate-pulse bg-[var(--surface)] sm:h-[320px]" />
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="h-6 w-48 animate-pulse rounded bg-[var(--surface-elevated)]" />
            <div className="h-4 w-64 animate-pulse rounded bg-[var(--surface-elevated)]" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-[var(--border)]
                px-4
                py-4
                last:border-b-0
                sm:px-6
              "
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 animate-pulse rounded-xl bg-[var(--surface-elevated)]" />

                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-elevated)]" />
                    <div className="h-3 w-24 animate-pulse rounded bg-[var(--surface-elevated)]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="ml-auto h-4 w-20 animate-pulse rounded bg-[var(--surface-elevated)]" />
                  <div className="ml-auto h-3 w-12 animate-pulse rounded bg-[var(--surface-elevated)]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallets */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="h-6 w-36 animate-pulse rounded bg-[var(--surface-elevated)]" />
            <div className="h-4 w-52 animate-pulse rounded bg-[var(--surface-elevated)]" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                h-28
                animate-pulse
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--surface)]
              "
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="space-y-8 pb-20 md:pb-0"
    >

      {/* Header */}
      <div data-animate>
        <p className="mb-2 text-sm font-medium text-[var(--accent)]">
          Financial overview
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
          Here's what's happening with your finances.
        </p>
      </div>

      {/* Summary Cards */}
      <div data-animate
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <SummaryCard
          title="Total Balance"
          amount={totalWalletsBalance}
          currency={profile?.currency ?? "EGP"}
          description="Across all wallets"
        />

        <SummaryCard
          title="Total Income"
          amount={totalIncomeAmount}
          currency={profile?.currency ?? "EGP"}
          description="Total money received"
          type="income"
        />

        <SummaryCard
          title="Total Expenses"
          amount={totalExpenseAmount}
          currency={profile?.currency ?? "EGP"}
          description="Total money spent"
          type="expense"
        />

      </div>

      {/* Income vs Expenses */}
      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-[var(--border)]
          bg-[var(--surface)]
        "
      >
        <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">

          <h2 className="text-base font-semibold text-[var(--text-primary)] sm:text-lg">
            Income vs Expenses
          </h2>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Your financial activity over the last 6 months.
          </p>

        </div>

        <div data-animate className="h-[280px] w-full px-2 py-5 sm:h-[320px] sm:px-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke="var(--border)"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "var(--text-muted)",
                  fontSize: 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "var(--text-muted)",
                  fontSize: 12,
                }}
              />

              <Tooltip
                contentStyle={{
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                }}
              />

              <Bar
                dataKey="income"
                name="Income"
                fill="var(--income)"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="var(--expense)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div data-animate>

        <div className="mb-4 flex items-end justify-between gap-4">

          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Your latest financial activity
            </p>
          </div>

          <Link
            to="/transactions"
            className="
              shrink-0
              rounded-lg
              px-2
              py-1
              text-sm
              font-medium
              text-[var(--accent)]
              transition-colors
              duration-200
              hover:bg-[var(--accent-soft)]
              hover:text-[var(--accent-hover)]
            "
          >
            View All
          </Link>

        </div>

        {recentTransactions.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-6
              py-14
              text-center
            "
          >

            <div
              className="
                mx-auto
                mb-4
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--surface-elevated)]
                text-[var(--text-muted)]
              "
            >
              —
            </div>

            <p className="font-medium text-[var(--text-primary)]">
              No transactions yet
            </p>

            <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--text-muted)]">
              Add your first transaction to start tracking your financial
              activity.
            </p>

          </div>

        ) : (

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-[var(--border)]
              bg-[var(--surface)]
            "
          >

            {recentTransactions.map((transaction, index) => {

              const isIncome = transaction.type === "income";

              const category = categories.find(
                (category) => category.id === transaction.categoryId
              );

              return (
                <div
                  key={transaction.id}
                  className={`
                    group
                    flex
                    items-center
                    justify-between
                    gap-4
                    px-4
                    py-4
                    transition-colors
                    duration-200
                    hover:bg-[var(--surface-hover)]
                    sm:px-6
                    ${index !== recentTransactions.length - 1
                      ? "border-b border-[var(--border)]"
                      : ""
                    }
                  `}
                >

                  {/* Transaction information */}
                  <div data-animate className="flex min-w-0 items-center gap-3">

                    {/* Type indicator */}
                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${isIncome
                          ? "bg-[var(--income-soft)] text-[var(--income)]"
                          : "bg-[var(--expense-soft)] text-[var(--expense)]"
                        }
                      `}
                    >
                      <span className="text-sm font-bold">
                        {isIncome ? "↓" : "↑"}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        {transaction.title}
                      </p>

                      <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-[var(--text-muted)]">

                        <span className="truncate">
                          {category?.name || "Unknown"}
                        </span>

                        <span className="shrink-0 text-[var(--text-disabled)]">
                          •
                        </span>

                        <span className="shrink-0">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Amount */}
                  <div className="shrink-0 text-right">

                    <p
                      className={`
                        text-sm
                        font-bold
                        tracking-tight
                        ${isIncome
                          ? "text-[var(--income)]"
                          : "text-[var(--expense)]"
                        }
                      `}
                    >
                      {isIncome ? "+" : "-"}
                      {new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: transaction.currency,
                        maximumFractionDigits: 2,
                      }).format(transaction.amount)}
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--text-disabled)]">
                      {transaction.type}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

      {/* Wallets */}
      <div>

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Your Wallets
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Overview of your wallets
            </p>
          </div>

        </div>

        {wallets.length === 0 ? (

          <div
            className="
              rounded-2xl
              border border-[var(--border)]
              bg-[var(--surface)]
              px-6
              py-12
              text-center
            "
          >
            <p className="font-medium text-[var(--text-primary)]">
              No wallets yet
            </p>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Create a wallet to start tracking your money.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {wallets.map((wallet) => (

              <div
                key={wallet.id}
                className="
                  rounded-2xl
                  border border-[var(--border)]
                  bg-[var(--surface)]
                  p-5
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[var(--border-hover)]
                  hover:bg-[var(--surface-elevated)]
                "
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {wallet.name}
                    </p>

                    <p className="mt-1 text-xs capitalize text-[var(--text-muted)]">
                      {wallet.type}
                    </p>

                  </div>
                  <p className="shrink-0 text-lg font-bold text-[var(--text-primary)]">
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: wallet.currency,
                      maximumFractionDigits: 2,
                    }).format(wallet.balance)}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default DashboardPage;