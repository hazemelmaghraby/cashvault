import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
// import { WALLET_TYPES } from "../Wallets/types/walletTypes";
import { TRANSACTION_TYPES } from "./types/transactionTypes";
// import mockTransactions from "./data/mockTransactions";
import TransactionCard from "./components/TransactionCard";
import { useLayoutEffect, useRef, useState } from "react"; import type { Wallet } from "../Wallets/types/walletTypes";
import TransactionForm from "./components/TransactionForm";
import Modal from "../../components/ui/Modal";
import type { Transaction } from './types/transactionTypes';
import { useWallet } from "../../hooks/useWallet";
import { useTransaction } from "../../hooks/useTransaction";
import { useCategory } from "../../hooks/useCategories";
import { useAuth } from "../../context/AuthContext";
// import type { Option } from "../../components/ui/Select";
import {
  animatePageIn,
  animateListIn,
} from "../../utils/animations";
import { useNavigate } from "react-router-dom";
import PleaseSignInPage from "../../components/constants/PleaseSignInPage";

const TransactionsPage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const transactionListRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!pageRef.current) return;

    animatePageIn(pageRef.current);
  }, []);

  const { wallets } = useWallet();
  console.log(wallets);
  const { categories } = useCategory();
  const { user } = useAuth();

  // for data transformation, we can map the wallets to an array of objects with value and label properties
  const walletOptions = wallets.map((wallet: Wallet) => ({
    value: wallet.id,
    label: wallet.name,
  }));


  const [isOpened, setIsOpened] = useState(false);
  const {
    transactions,
    addTransaction,
    transferMoney,
    // editTransaction,
    removeTransaction,
  } = useTransaction();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const handleSaveTransaction = async (
    transaction: Transaction
  ) => {
    try {
      if (transaction.type === "transfer") {
        await transferMoney(transaction);
      } else {
        await addTransaction(transaction);
      }

      setIsOpened(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save transaction"
      );
    }
  };
  const handleDeleteTransaction = (
    transaction: Transaction
  ) => {
    removeTransaction(transaction.id);
  };

  // Filteration
  const walletFilterOptions = [
    { value: "", label: "All Wallets" },
    ...walletOptions,
  ];

  const categoryFilterOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  const typeFilterOptions = [
    { value: "", label: "All Types" },
    ...TRANSACTION_TYPES,
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesWallet =
      !selectedWallet ||
      transaction.walletId === selectedWallet;

    const matchesCategory =
      !selectedCategory ||
      transaction.categoryId === selectedCategory;

    const matchesType =
      !selectedType ||
      transaction.type === selectedType;

    return (
      matchesSearch &&
      matchesWallet &&
      matchesCategory &&
      matchesType
    );
  });

  // Sorting

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "highest", label: "Highest Amount" },
    { value: "lowest", label: "Lowest Amount" },
  ];

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
          );

        case "oldest":
          return (
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
          );

        case "highest":
          return b.amount - a.amount;

        case "lowest":
          return a.amount - b.amount;

        default:
          return 0;
      }
    }
  );
  useLayoutEffect(() => {
    if (!transactionListRef.current) return;

    animateListIn(transactionListRef.current);
  }, [sortedTransactions.length]);

  if (!user) {
    return <PleaseSignInPage />;
  }

  return (
    <div
      ref={pageRef}
      className="space-y-8 pb-20 md:pb-0"
    >

      {/* Header */}
      <div
        data-animate
        className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--accent)]">
            Financial activity
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">
            Track and manage your income and expenses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={() => setIsOpened(true)}
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
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--accent)]
            focus:ring-offset-2
            focus:ring-offset-[var(--background)]
            sm:w-auto
          "
          >
            + Add Transaction
          </Button>

          <Button
            onClick={() => navigate("/reports")}
            className="
            w-full
            rounded-xl
            bg-transparent
            px-5
            border
            border-amber-50
            hover:bg-black
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
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--accent)]
            focus:ring-offset-2
            focus:ring-offset-[var(--background)]
            sm:w-auto
          "
          >
            Periodic Reports
          </Button>
        </div>
      </div>

      {/* Search & Sort */}
      <div
        data-animate
        className="
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
          p-4
          sm:p-5
        "
      >

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">

          <Input
            label="Search"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            options={sortOptions}
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />

        </div>

      </div>

      {/* Filters */}
      <div>

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Filters
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Narrow down your transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <Select
            options={walletFilterOptions}
            label="Wallet"
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
          />

          <Select
            options={categoryFilterOptions}
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />

          <Select
            options={typeFilterOptions}
            label="Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          />

        </div>

      </div>

      {/* Transactions */}
      <div data-animate>

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              All Transactions
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {sortedTransactions.length}{" "}
              {sortedTransactions.length === 1
                ? "transaction"
                : "transactions"}
            </p>
          </div>

        </div>

        {sortedTransactions.length === 0 ? (

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

            <p className="font-semibold text-[var(--text-primary)]">
              No transactions found
            </p>

            <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--text-muted)]">
              Try changing your filters or add a new transaction to get
              started.
            </p>

          </div>

        ) : (

          <div
            data-animate-list
            className="space-y-3"
          >

            {sortedTransactions.map((transaction) => {
              const wallet = wallets.find(
                (wallet) => wallet.id === transaction.walletId
              );

              // const toWallet = transaction.toWalletId
              //   ? wallets.find(
              //     (wallet) => wallet.id === transaction.toWalletId
              //   )
              //   : undefined;

              return (
                <div key={transaction.id} data-animate-item>
                  <TransactionCard
                    transaction={transaction}
                    walletName={wallet?.name ?? "Unknown Wallet"}
                    toWalletName={
                      transaction.toWalletId
                        ? wallets.find(
                          (w) => w.id === transaction.toWalletId
                        )?.name
                        : undefined
                    }
                    onDelete={handleDeleteTransaction}
                    onReceipt={(transaction) => {
                      console.log("RECEIPT CLICKED:", transaction.id);

                      navigate(
                        `/transactions/${transaction.id}/receipt`
                      );
                    }}
                  />
                </div>
              );
            })}

          </div>

        )}

        <Modal
          isOpen={isOpened}
          onClose={() => setIsOpened(false)}
          title="Create Transaction"
        >
          <TransactionForm
            walletOptions={walletOptions}
            onSubmit={handleSaveTransaction}
          />
        </Modal>

      </div>

    </div>
  );
};

export default TransactionsPage;