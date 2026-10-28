import type { Wallet } from "../types/walletTypes";
import Button from "../../../components/ui/Button";
import { useTransaction } from "../../../hooks/useTransaction";
import { useState } from "react";

type ClearBalancesProps = {
  wallets: Wallet[];
  onClose: () => void;
};

const ClearBalances = ({ onClose }: ClearBalancesProps) => {
    const {
clearAllWalletsBalances,
    } = useTransaction();
  const [isClearing, setIsClearing] = useState(false);
  const handleConfirmClear = async () => {
    try {
      setIsClearing(true);
      await clearAllWalletsBalances();
      onClose();
    } catch (error) {
      console.error("Failed to clear wallet balances:", error);
    } finally {
      setIsClearing(false);
    }
  };
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          Clear Wallet Balances
        </h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Are you sure you want to clear the balances of all wallets? This action is permanent and cannot be undone.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onClose} disabled={isClearing}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmClear} disabled={isClearing}>
          {isClearing ? "Clearing..." : "Clear All Balances"}
        </Button>
      </div>
    </div>
  );
};

export default ClearBalances;