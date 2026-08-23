import WalletCard from "./components/WalletCard";
import Button from "../../components/ui/Button";
import { useLayoutEffect, useRef, useState } from "react"; import Modal from "../../components/ui/Modal";
import WalletForm from "./components/WalletForm";
import type { Wallet } from "./types/walletTypes";
import { useWallet } from "../../hooks/useWallet";
import {
  animatePageIn,
  animateListIn,
} from "../../utils/animations";

const WalletsPage = () => {
  const [isOpened, setIsOpened] = useState(false);

  const { wallets, addWallet, updateWallet, removeWallet, loading } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(undefined);
  const [walletToDelete, setWalletToDelete] = useState<Wallet | undefined>(undefined);

  const pageRef = useRef<HTMLDivElement>(null);
  const walletListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!pageRef.current) return;

    animatePageIn(pageRef.current);
  }, []);

  useLayoutEffect(() => {
    if (!walletListRef.current) return;

    animateListIn(walletListRef.current);
  }, [wallets.length]);

  const handleAddWallet = () => {
    setSelectedWallet(undefined);
    setIsOpened(true);
  };

  const handleEditWallet = (wallet: Wallet) => {
    console.log(wallet);
    setSelectedWallet(wallet);
    setIsOpened(true);
  };

  const handleSaveWallets = (wallet: Wallet) => {
    if (selectedWallet) {
      updateWallet(wallet)
      setSelectedWallet(undefined);
    } else {
      addWallet(wallet)
    }
    setIsOpened(false);
  };

  const handleDeleteWalletBtn = (wallet: Wallet) => {
    setWalletToDelete(wallet);
  }

  const handleDeleteWallet = () => {
    if (!walletToDelete) return;

    removeWallet(walletToDelete.id)

    setWalletToDelete(undefined);
  };


  return (
    <div ref={pageRef} className="space-y-8 pb-20 md:pb-0">

      {/* Header */}
      <div data-animate className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--accent)]">
            Your money
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Wallets
          </h1>

          <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
            Manage your accounts and keep track of your balances.
          </p>
        </div>

        <Button
          onClick={handleAddWallet}
          className="
          w-full
          rounded-xl
          bg-[var(--accent)]
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-lg
          shadow-[var(--accent)]/10
          transition-all
          duration-200
          hover:bg-[var(--accent-hover)]
          hover:shadow-[var(--accent)]/20
          sm:w-auto
        "
        >
          + Add Wallet
        </Button>

      </div>

      {/* Wallets */}
      {loading ? (
        <div className="col-span-full py-12 text-center text-sm text-[var(--text-muted)]">
          Loading wallets...
        </div>
      ) : wallets.length === 0 ? (

        <div
          className="
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-6
          py-16
          text-center
        "
        >
          <div
            className="
            mx-auto
            mb-5
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface-elevated)]
            text-[var(--accent)]
          "
          >
            $
          </div>

          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            No wallets yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--text-muted)]">
            Create your first wallet to start tracking your money.
          </p>

          <Button
            onClick={handleAddWallet}
            className="
            mt-6
            rounded-xl
            bg-[var(--accent)]
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-[var(--accent-hover)]
          "
          >
            Create Wallet
          </Button>

        </div>

      ) : (

        <div ref={walletListRef}
          data-animate-list
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {wallets.map((wallet) => (
            <div key={wallet.id} data-animate-item>
              <WalletCard
                wallet={wallet}
                onEdit={handleEditWallet}
                handleDeleteRequest={handleDeleteWalletBtn}
              />
            </div>
          ))}

        </div>

      )}

      {/* Create / Edit Wallet */}
      <Modal
        isOpen={isOpened}
        onClose={() => setIsOpened(false)}
        title="Create Wallet"
      >
        <WalletForm
          onSubmit={handleSaveWallets}
          wallet={selectedWallet}
        />
      </Modal>

      {/* Delete Wallet */}
      <Modal
        isOpen={!!walletToDelete}
        onClose={() => setWalletToDelete(undefined)}
        title="Delete Wallet"
      >

        <div className="space-y-5">

          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            Are you sure you want to delete this wallet?
          </p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

            <Button
              onClick={() => setWalletToDelete(undefined)}
              className="
              w-full
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--surface-elevated)]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[var(--text-secondary)]
              transition-all
              duration-200
              hover:bg-[var(--border)]
              hover:text-[var(--text-primary)]
              sm:w-auto
            "
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteWallet}
              className="
              w-full
              rounded-xl
              border
              border-[var(--expense)]/20
              bg-[var(--expense)]/10
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[var(--expense)]
              transition-all
              duration-200
              hover:border-[var(--expense)]/40
              hover:bg-[var(--expense)]/15
              sm:w-auto
            "
            >
              Delete
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  );
};

export default WalletsPage;