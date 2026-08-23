import type { Transaction } from "../types/transactionTypes";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import { useCategory } from "../../../hooks/useCategories";
// import { useNavigate } from "react-router-dom";

type TransactionCardProps = {
  transaction: Transaction;
  walletName: string;
  toWalletName?: string | undefined;
  onReceipt?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
};



const TransactionCard = ({ transaction, onDelete, walletName, toWalletName, onReceipt }: TransactionCardProps) => {
  const { categories } = useCategory();
  // const [transactions, setTransactions] =
  // useState(mockTransactions);
  // const navigate = useNavigate();
  const category = categories.find(
    (category) => category.id === transaction.categoryId
  );
  return (
    <Card
      className="
        group
        border-[var(--border)]
        bg-[var(--surface)]
        p-4
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-[var(--border-hover)]
        hover:bg-[var(--surface-elevated)]
        sm:p-5
      "
    >

      <div className="flex items-start gap-4">

        {/* Transaction indicator */}
        <div
          className={`
            mt-1
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            ${transaction.type === "income"
              ? "border-[var(--income)]/20 bg-[var(--income)]/10 text-[var(--income)]"
              : transaction.type === "transfer"
                ? "border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-[var(--expense)]/20 bg-[var(--expense)]/10 text-[var(--expense)]"
            }
          `}
        >
          <span className="text-sm font-bold">
            {transaction.type === "income"
              ? "+"
              : transaction.type === "transfer"
                ? "↔"
                : "−"}
          </span>
        </div>

        {/* Main information */}
        <div className="min-w-0 flex-1">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <h3 className="truncate text-sm font-semibold text-[var(--text-primary)] sm:text-base">
                {transaction.title}
              </h3>

              <p className="mt-1 text-[15px] text-[var(--text-muted)]">
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                {" • "}
                {(category?.name || "Unknown").charAt(0).toUpperCase() +
                  (category?.name || "Unknown").slice(1)}
              </p>
              <p className="mt-1 text-[15px] text-[var(--text-muted)]">
                {transaction.type === "transfer"
                  ? `${walletName} → ${toWalletName ?? "Unknown Wallet"}`
                  : walletName || "Unknown Wallet"}
              </p>

            </div>

            {/* Amount */}
            <p
              className={`
    shrink-0
    text-base
    font-bold
    sm:text-lg
    ${transaction.type === "income"
                  ? "text-[var(--income)]"
                  : transaction.type === "transfer"
                    ? "text-[var(--accent)]"
                    : "text-[var(--expense)]"
                }
  `}
            >
              {transaction.type === "income"
                ? "+"
                : transaction.type === "transfer"
                  ? ""
                  : "-"}
              {transaction.currency}{" "}
              {Math.abs(transaction.amount).toFixed(2)}
            </p>

          </div>

          {/* Bottom row */}
          <div className="flex flex-wrap items-center justify-between gap-3">

            <p className="text-s text-[var(--text-muted)]">
              {new Date(transaction.date).toLocaleDateString()}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">

              {/* <Button className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Edit
              </Button> */}

              <Button
                className="
    rounded-lg
    border
    border-[var(--border)]
    bg-[var(--surface-elevated)]
    px-3
    py-1.5
    text-xs
    font-semibold
    text-[var(--text-primary)]
    transition-all
    duration-200
    hover:border-[var(--accent)]/40
    hover:text-[var(--accent)]
  "
                onClick={() => onReceipt?.(transaction)}
              >
                Receipt
              </Button>


              {onDelete && (
                <Button
                  className="
                    rounded-lg
                    border
                    border-[var(--expense)]/20
                    bg-[var(--expense)]/5
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-[var(--expense)]
                    transition-all
                    duration-200
                    hover:border-[var(--expense)]/40
                    hover:bg-[var(--expense)]/10
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[var(--expense)]/30
                  "
                  onClick={() => onDelete(transaction)}
                >
                  Delete
                </Button>
              )}

            </div>

          </div>

        </div>

      </div>

    </Card>
  )
}

export default TransactionCard;