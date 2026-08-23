import Card from "../../../components/ui/Card";
import type { Wallet } from "../types/walletTypes";
import Button from "../../../components/ui/Button";

type WalletCardProps = {
  wallet: Wallet;
  onEdit: (wallet: Wallet) => void;
  handleDeleteRequest: (wallet: Wallet) => void;
};

const WalletCard = ({
  wallet,
  onEdit,
  handleDeleteRequest,
}: WalletCardProps) => {
  const formattedBalance = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: wallet.currency,
    maximumFractionDigits: 2,
  }).format(wallet.balance);

  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        border-[var(--border)]
        bg-[var(--surface)]
        p-0
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[var(--border-hover)]
        hover:bg-[var(--surface-elevated)]
      "
    >
      {/* Wallet color accent */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          backgroundColor: wallet.color,
        }}
      />

      <div className="p-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Wallet
            </p>

            <h3 className="mt-2 truncate text-lg font-semibold text-[var(--text-primary)]">
              {wallet.name}
            </h3>

          </div>

          {/* Color indicator */}
          <div
            className="
              h-3
              w-3
              shrink-0
              rounded-full
              ring-4
              ring-white/5
            "
            style={{
              backgroundColor: wallet.color,
            }}
          />

        </div>

        {/* Balance */}
        <div className="mt-8">

          <p className="text-xs font-medium text-[var(--text-muted)]">
            Current balance
          </p>

          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            {formattedBalance}
          </p>

        </div>

        {/* Wallet Details */}
        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-3
            border-t
            border-[var(--border)]
            pt-5
          "
        >

          {/* Type */}
          <div
            className="
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              p-3
            "
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Type
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-[var(--text-primary)]">
              {wallet.type}
            </p>
          </div>

          {/* Currency */}
          <div
            className="
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              p-3
            "
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Currency
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {wallet.currency}
            </p>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">

          <Button
            onClick={() => onEdit(wallet)}
            className="
              flex-1
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface-elevated)]
              px-3
              py-2
              text-sm
              font-semibold
              text-[var(--text-secondary)]
              transition-all
              duration-200
              hover:bg-[var(--border)]
              hover:text-[var(--accent)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--accent)]/30
            "
          >
            Edit
          </Button>

          <Button
            onClick={() => handleDeleteRequest(wallet)}
            className="
              flex-1
              rounded-xl
              border
              border-[var(--expense)]/20
              bg-[var(--expense)]/10
              px-3
              py-2
              text-sm
              font-semibold
              text-[var(--expense)]
              transition-all
              duration-200
              hover:border-[var(--expense)]/40
              hover:bg-[var(--expense)]/15
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--expense)]/30
            "
          >
            Delete
          </Button>

        </div>

      </div>
    </Card>
  );
};

export default WalletCard;
