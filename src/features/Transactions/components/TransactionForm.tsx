import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

import {
    TRANSACTION_TYPES,
} from "../types/transactionTypes";

import { useCategory } from "../../../hooks/useCategories";
import { useWallet } from "../../../hooks/useWallet";

import type { Option } from "../../../components/ui/Select";
import { useEffect, useMemo, useState } from "react";

import type {
    Transaction,
} from "../types/transactionTypes";

type TransactionFormProps = {
    walletOptions: Option[];
    onSubmit: (transaction: Transaction) => void;
    selectedTransaction?: Transaction;
};

type TransactionFormData = {
    title: string;
    amount: number;
    type: Transaction["type"];
    walletId: string;
    toWalletId: string;
    categoryId: string;
    description: string;
    date: string;
};

const TransactionForm = ({
    walletOptions,
    onSubmit,
    selectedTransaction,
}: TransactionFormProps) => {
    const { categories } = useCategory();
    const { wallets } = useWallet();

    const [formData, setFormData] =
        useState<TransactionFormData>({
            title:
                selectedTransaction?.title || "",

            amount:
                selectedTransaction?.amount || 0,

            type:
                selectedTransaction?.type || "expense",

            walletId:
                selectedTransaction?.walletId ||
                String(walletOptions[0]?.value || ""),

            toWalletId:
                selectedTransaction?.toWalletId || "",

            categoryId:
                selectedTransaction?.categoryId ||
                categories[0]?.id ||
                "",

            description:
                selectedTransaction?.description || "",

            date:
                selectedTransaction?.date
                    ? new Date(
                        selectedTransaction.date
                    ).toISOString()
                    : new Date().toISOString(),
        });

    /*
    ============================================================
    SELECTED SOURCE WALLET
    ============================================================
    */

    const selectedWallet = wallets.find(
        (wallet) =>
            wallet.id === formData.walletId
    );

    /*
    ============================================================
    DESTINATION WALLETS
    ============================================================
    */

    const destinationWalletOptions: Option[] =
        useMemo(() => {
            if (!selectedWallet) return [];

            return wallets
                .filter(
                    (wallet) =>
                        wallet.id !==
                        formData.walletId &&
                        wallet.currency ===
                        selectedWallet.currency
                )
                .map((wallet) => ({
                    value: wallet.id,
                    label: wallet.name,
                }));
        }, [
            wallets,
            formData.walletId,
            selectedWallet,
        ]);

    /*
    ============================================================
    RESET DESTINATION WHEN SOURCE CHANGES
    ============================================================
    */

    useEffect(() => {
        if (
            formData.type !== "transfer"
        ) {
            return;
        }

        const destinationStillValid =
            destinationWalletOptions.some(
                (option) =>
                    option.value ===
                    formData.toWalletId
            );

        if (!destinationStillValid) {
            setFormData((previous) => ({
                ...previous,
                toWalletId:
                    String(
                        destinationWalletOptions[0]
                            ?.value || ""
                    ),
            }));
        }
    }, [
        formData.type,
        destinationWalletOptions,
        formData.toWalletId,
    ]);

    /*
    ============================================================
    CATEGORY OPTIONS
    ============================================================
    */

    const categoryOptions: Option[] =
        categories
            .filter(
                (category) =>
                    category.type ===
                    formData.type
            )
            .map((category) => ({
                value: category.id,
                label: category.name,
            }));

    /*
    ============================================================
    VALIDATION
    ============================================================
    */

    const validate = () => {
        if (formData.amount <= 0) {
            alert(
                "Amount must be greater than zero"
            );

            return false;
        }

        if (!formData.walletId) {
            alert(
                "Please select a wallet"
            );

            return false;
        }

        /*
        Transfer validation
        */

        if (
            formData.type === "transfer"
        ) {
            if (!formData.toWalletId) {
                alert(
                    "Please select a destination wallet"
                );

                return false;
            }

            if (
                formData.walletId ===
                formData.toWalletId
            ) {
                alert(
                    "Source and destination wallets must be different"
                );

                return false;
            }

            if (!selectedWallet) {
                alert(
                    "Source wallet not found"
                );

                return false;
            }

            const destinationWallet =
                wallets.find(
                    (wallet) =>
                        wallet.id ===
                        formData.toWalletId
                );

            if (!destinationWallet) {
                alert(
                    "Destination wallet not found"
                );

                return false;
            }

            if (
                selectedWallet.currency !==
                destinationWallet.currency
            ) {
                alert(
                    "Transfers are only allowed between wallets with the same currency"
                );

                return false;
            }

            return true;
        }

        /*
        Income / Expense validation
        */

        if (!formData.title.trim()) {
            alert("Title is required");

            return false;
        }

        if (!formData.categoryId) {
            alert(
                "Please select a category"
            );

            return false;
        }

        return true;
    };

    /*
    ============================================================
    SUBMIT
    ============================================================
    */

    const handleSubmit = () => {
        if (!validate()) return;

        const now =
            new Date().toISOString();

        const transaction: Transaction = {
            id:
                selectedTransaction?.id ||
                crypto.randomUUID(),

            title:
                formData.type === "transfer"
                    ? formData.title ||
                    "Transfer"
                    : formData.title,

            amount:
                formData.amount,

            walletId:
                formData.walletId,

            toWalletId:
                formData.type === "transfer"
                    ? formData.toWalletId
                    : undefined,

            type:
                formData.type,

            categoryId:
                formData.categoryId,

            description:
                formData.description,

            date:
                new Date(
                    formData.date
                ).toISOString(),

            createdAt:
                selectedTransaction?.createdAt ||
                now,

            updatedAt:
                now,

            currency:
                selectedWallet?.currency ||
                "",

            status:
                selectedTransaction?.status ||
                "completed",
        };

        onSubmit(transaction);
    };

    /*
    ============================================================
    UI
    ============================================================
    */

    return (
        <div className="space-y-5">

            {/* Type */}

            <Select
                label="Type"
                options={TRANSACTION_TYPES}
                className="mb-0"
                value={formData.type}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        type:
                            e.target.value as Transaction["type"],
                    })
                }
            />

            {/* =====================================================
          TRANSFER
          ===================================================== */}

            {formData.type === "transfer" ? (
                <>
                    <Input
                        label="Amount"
                        placeholder="Enter transfer amount"
                        className="mb-0"
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                amount:
                                    parseFloat(
                                        e.target.value
                                    ) || 0,
                            })
                        }
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <Select
                            label="From Wallet"
                            options={walletOptions}
                            className="mb-0"
                            value={formData.walletId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    walletId:
                                        e.target.value,
                                })
                            }
                        />

                        <Select
                            label="To Wallet"
                            options={
                                destinationWalletOptions
                            }
                            className="mb-0"
                            value={
                                formData.toWalletId
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    toWalletId:
                                        e.target.value,
                                })
                            }
                        />

                    </div>

                    {selectedWallet && (
                        <p className="text-xs text-[var(--text-muted)]">
                            Only{" "}
                            <span className="font-semibold text-[var(--text-primary)]">
                                {selectedWallet.currency}
                            </span>{" "}
                            wallets are available for this transfer.
                        </p>
                    )}

                    <Input
                        label="Description (Optional)"
                        placeholder="Enter transfer description"
                        className="mb-0"
                        value={
                            formData.description
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description:
                                    e.target.value,
                            })
                        }
                    />
                </>
            ) : (
                <>
                    {/* =================================================
              INCOME / EXPENSE
              ================================================= */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <Input
                            label="Title"
                            placeholder="Enter transaction title"
                            className="mb-0"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title:
                                        e.target.value,
                                })
                            }
                        />

                        <Input
                            label="Amount"
                            placeholder="Enter transaction amount"
                            className="mb-0"
                            type="number"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount:
                                        parseFloat(
                                            e.target.value
                                        ) || 0,
                                })
                            }
                        />

                    </div>

                    <Input
                        label="Description (Optional)"
                        placeholder="Enter transaction description"
                        className="mb-0"
                        value={
                            formData.description
                        }
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description:
                                    e.target.value,
                            })
                        }
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <Select
                            label="Category"
                            options={
                                categoryOptions
                            }
                            className="mb-0"
                            value={
                                formData.categoryId
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    categoryId:
                                        e.target.value,
                                })
                            }
                        />

                        <Select
                            label="Wallet"
                            options={walletOptions}
                            className="mb-0"
                            value={
                                formData.walletId
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    walletId:
                                        e.target.value,
                                })
                            }
                        />

                    </div>
                </>
            )}

            {/* =====================================================
          SUBMIT
          ===================================================== */}

            <div className="pt-2">

                <Button
                    onClick={handleSubmit}
                    className="
            w-full
            rounded-xl
            bg-[var(--accent)]
            px-4
            py-3
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
            focus:ring-[var(--accent)]/40
            focus:ring-offset-2
            focus:ring-offset-[var(--surface)]
          "
                >
                    {formData.type === "transfer"
                        ? "Transfer Money"
                        : "Create Transaction"}
                </Button>

            </div>

        </div>
    );
};

export default TransactionForm;