import { useState } from "react";
import type { Transaction } from "../types/transactionTypes";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Modal from "../../../components/ui/Modal";
import { useCategory } from "../../../hooks/useCategories";

type TransactionCardProps = {
  transaction: Transaction;
  walletName: string;
  toWalletName?: string;
  onReceipt?: (transaction: Transaction) => void;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
};

const TransactionCard = ({
  transaction,
  onDelete,
  walletName,
  toWalletName,
  onReceipt,
}: TransactionCardProps) => {
  const { categories } = useCategory();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const category = categories.find(
    (category) => category.id === transaction.categoryId
  );

  const formattedType =
    transaction.type.charAt(0).toUpperCase() +
    transaction.type.slice(1);

  const categoryName = category?.name
    ? category.name.charAt(0).toUpperCase() + category.name.slice(1)
    : "Unknown";

  const formattedDate = new Date(transaction.date).toLocaleString();

  const formatTimestamp = (
    value?: Date | string | { toDate?: () => Date }
  ) => {
    if (!value) return "—";

    if (
      typeof value === "object" &&
      "toDate" in value &&
      typeof value.toDate === "function"
    ) {
      return value.toDate().toLocaleString();
    }

    return new Date(value as Date | string).toLocaleString();
  };

  const handleDelete = () => {
    if (!onDelete) return;

    onDelete(transaction);
    setIsDetailsOpen(false);
  };

  const amountColor =
    transaction.type === "income"
      ? "text-[var(--income)]"
      : transaction.type === "transfer"
        ? "text-[var(--accent)]"
        : "text-[var(--expense)]";

  const indicatorStyle =
    transaction.type === "income"
      ? "border-[var(--income)]/20 bg-[var(--income)]/10 text-[var(--income)]"
      : transaction.type === "transfer"
        ? "border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]"
        : "border-[var(--expense)]/20 bg-[var(--expense)]/10 text-[var(--expense)]";

  const amountPrefix =
    transaction.type === "income"
      ? "+"
      : transaction.type === "transfer"
        ? ""
        : "-";

  return (
    <>
      {/* ===================================================== */}
      {/* TRANSACTION CARD */}
      {/* ===================================================== */}

      <Card
        className="
          group
          w-full
          border-[var(--border)]
          bg-[var(--surface)]
          p-3
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:border-[var(--border-hover)]
          hover:bg-[var(--surface-elevated)]
          sm:p-4
          lg:p-5
          xl:p-6
        "
        onClick={() => setIsDetailsOpen(true)}
      >
        <div
          className="
            flex
            min-w-0
            items-start
            gap-3
            sm:gap-4
            lg:gap-5
          "
        >
          {/* ================================================= */}
          {/* TRANSACTION INDICATOR */}
          {/* ================================================= */}

          <div
            className={`
              mt-1
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              sm:h-10
              sm:w-10
              ${indicatorStyle}
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

          {/* ================================================= */}
          {/* MAIN INFORMATION */}
          {/* ================================================= */}

          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                min-w-0
                flex-col
                gap-2
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:gap-4
              "
            >
              {/* Transaction information */}

              <div className="min-w-0 flex-1">
                <h3
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-[var(--text-primary)]
                    sm:text-base
                  "
                >
                  {transaction.title}
                </h3>

                <p className="mt-1 text-sm text-[var(--text-muted)] sm:text-[15px]">
                  {formattedType}
                  {" • "}
                  {categoryName}
                </p>

                <p className="mt-1 truncate text-sm text-[var(--text-muted)] sm:text-[15px]">
                  {transaction.type === "transfer"
                    ? `${walletName} → ${toWalletName ?? "Unknown Wallet"}`
                    : walletName || "Unknown Wallet"}
                </p>
              </div>

              {/* ================================================= */}
              {/* AMOUNT */}
              {/* ================================================= */}

              <p
                className={`
                  shrink-0
                  self-start
                  text-sm
                  font-bold
                  sm:self-center
                  sm:text-lg
                  lg:text-xl
                  ${amountColor}
                `}
              >
                {amountPrefix}
                {transaction.currency}{" "}
                {Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>

            {/* ================================================= */}
            {/* BOTTOM ROW */}
            {/* ================================================= */}

            <div
              className="
                mt-3
                flex
                min-w-0
                items-center
                justify-between
                gap-2
                sm:gap-3
              "
            >
              <p
                className="
                  shrink-0
                  text-xs
                  text-[var(--text-muted)]
                  sm:text-sm
                "
              >
                {new Date(transaction.date).toLocaleDateString()}
              </p>

              {/* More Details */}

              <Button
                type="button"
                onClick={() => setIsDetailsOpen(true)}
                className="
                  shrink-0
                  rounded-lg
                  border
                  border-[var(--border)]
                  bg-[var(--surface-elevated)]
                  px-2.5
                  py-1.5
                  text-[11px]
                  font-semibold
                  text-[var(--text-primary)]
                  transition-all
                  duration-200
                  hover:border-[var(--accent)]/40
                  hover:text-[var(--accent)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--accent)]/20
                  sm:px-3
                  sm:text-xs
                "
              >
                More Details
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ===================================================== */}
      {/* TRANSACTION DETAILS MODAL */}
      {/* ===================================================== */}

      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Transaction Details"
      >
        <div className="space-y-6">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div
            className={`
              rounded-2xl
              border
              p-4
              sm:p-5
              ${transaction.type === "income"
                ? "border-[var(--income)]/20 bg-[var(--income)]/5"
                : transaction.type === "transfer"
                  ? "border-[var(--accent)]/20 bg-[var(--accent)]/5"
                  : "border-[var(--expense)]/20 bg-[var(--expense)]/5"
              }
            `}
          >
            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  {formattedType}
                </p>

                <h3 className="mt-1 break-words text-xl font-bold text-[var(--text-primary)]">
                  {transaction.title}
                </h3>
              </div>

              <p
                className={`
                  shrink-0
                  text-lg
                  font-bold
                  sm:text-xl
                  ${amountColor}
                `}
              >
                {amountPrefix}
                {transaction.currency}{" "}
                {Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* ================================================= */}
          {/* TRANSACTION INFORMATION */}
          {/* ================================================= */}

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              Transaction Information
            </h4>

            <div className="overflow-hidden rounded-xl border border-[var(--border)]">
              {/* Category */}

              <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3">
                <span className="text-sm text-[var(--text-muted)]">
                  Category
                </span>

                <span className="text-right text-sm font-medium text-[var(--text-primary)]">
                  {categoryName}
                </span>
              </div>

              {/* Wallet */}

              <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3">
                <span className="text-sm text-[var(--text-muted)]">
                  {transaction.type === "transfer"
                    ? "From Wallet"
                    : "Wallet"}
                </span>

                <span className="text-right text-sm font-medium text-[var(--text-primary)]">
                  {walletName || "Unknown Wallet"}
                </span>
              </div>

              {/* Destination wallet */}

              {transaction.type === "transfer" && (
                <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3">
                  <span className="text-sm text-[var(--text-muted)]">
                    To Wallet
                  </span>

                  <span className="text-right text-sm font-medium text-[var(--text-primary)]">
                    {toWalletName ?? "Unknown Wallet"}
                  </span>
                </div>
              )}

              {/* Currency */}

              <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3">
                <span className="text-sm text-[var(--text-muted)]">
                  Currency
                </span>

                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {transaction.currency}
                </span>
              </div>

              {/* Status */}

              <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3">
                <span className="text-sm text-[var(--text-muted)]">
                  Status
                </span>

                <span className="text-sm font-medium capitalize text-[var(--text-primary)]">
                  {transaction.status ?? "—"}
                </span>
              </div>

              {/* Balance Before */}

              <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3">
                <span className="text-sm text-[var(--text-muted)]">
                  Balance Before
                </span>

                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {transaction.balanceBefore ?? "—"}
                </span>
              </div>

              {/* Balance After */}

              <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3">
                <span className="text-sm text-[var(--text-muted)]">
                  Balance After
                </span>

                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {transaction.balanceAfter ?? "—"}
                </span>
              </div>

              {/* Date */}

              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-sm text-[var(--text-muted)]">
                  Transaction Date
                </span>

                <span className="text-right text-sm font-medium text-[var(--text-primary)]">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* DESCRIPTION */}
          {/* ================================================= */}

          {transaction.description && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
                Description
              </h4>

              <div
                className="
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--background)]/40
                  px-4
                  py-3
                "
              >
                <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
                  {transaction.description}
                </p>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* SYSTEM INFORMATION */}
          {/* ================================================= */}

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
              System Information
            </h4>

            <div className="overflow-hidden rounded-xl border border-[var(--border)]">
              {/* Transaction ID */}

              <div className="flex flex-col gap-1 border-b border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-sm text-[var(--text-muted)]">
                  Transaction ID
                </span>

                <span className="break-all text-right font-mono text-xs text-[var(--text-secondary)]">
                  {transaction.id}
                </span>
              </div>

              {/* Created */}

              <div className="flex flex-col gap-1 border-b border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-sm text-[var(--text-muted)]">
                  Created
                </span>

                <span className="text-right text-xs text-[var(--text-secondary)]">
                  {formatTimestamp(transaction.createdAt)}
                </span>
              </div>

              {/* Last Updated */}

              <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-sm text-[var(--text-muted)]">
                  Last Updated
                </span>

                <span className="text-right text-xs text-[var(--text-secondary)]">
                  {formatTimestamp(transaction.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* RECEIPT */}
          {/* ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-3
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--background)]/30
              px-4
              py-3
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:gap-4
            "
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Receipt
              </p>

              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {transaction.receiptId
                  ? "A receipt is attached to this transaction."
                  : "No receipt attached."}
              </p>
            </div>

            {transaction.receiptId && onReceipt && (
              <Button
                type="button"
                onClick={() => onReceipt(transaction)}
                className="
                  w-full
                  shrink-0
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
                  hover:border-[var(--accent)]/40
                  hover:text-[var(--accent)]
                  sm:w-auto
                "
              >
                View Receipt
              </Button>
            )}
          </div>

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-[var(--border)]
              pt-5
              sm:flex-row
              sm:justify-end
            "
          >
            <Button
              type="button"
              onClick={() => setIsDetailsOpen(false)}
              className="
                w-full
                rounded-xl
                border
                border-[var(--border)]
                bg-transparent
                px-4
                py-2.5
                text-sm
                font-semibold
                text-[var(--text-secondary)]
                transition-all
                hover:bg-[var(--surface-elevated)]
                hover:text-[var(--text-primary)]
                sm:w-auto
              "
            >
              Close
            </Button>

            {onDelete && (
              <Button
                type="button"
                onClick={handleDelete}
                className="
                  w-full
                  rounded-xl
                  border
                  border-[var(--expense)]/20
                  bg-[var(--expense)]/5
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-[var(--expense)]
                  transition-all
                  hover:border-[var(--expense)]/40
                  hover:bg-[var(--expense)]/10
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--expense)]/30
                  sm:w-auto
                "
              >
                Delete Transaction
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TransactionCard;
