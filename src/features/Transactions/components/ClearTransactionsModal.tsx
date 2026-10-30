import { useState } from "react";
import Button from "../../../components/ui/Button";
import { useTransaction } from "../../../hooks/useTransaction";

type ClearTransactionsModalProps = {
  onClose: () => void;
};

const ClearTransactionsModal = ({ onClose }: ClearTransactionsModalProps) => {
  const { clearTransactions } = useTransaction();
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmClear = async () => {
    try {
      setIsClearing(true);
      setError(null);
      await clearTransactions();
      onClose();
    } catch (clearError) {
      console.error("Failed to clear transactions:", clearError);
      setError("Unable to clear transactions. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Clear All Transactions
        </h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Are you sure you want to permanently delete all transactions? This
          action cannot be undone.
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onClose} disabled={isClearing}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirmClear}
          disabled={isClearing}
        >
          {isClearing ? "Clearing..." : "Clear All Transactions"}
        </Button>
      </div>
    </div>
  );
};

export default ClearTransactionsModal;