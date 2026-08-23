import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    collection,
    doc,
    onSnapshot,
    runTransaction as firestoreTransaction,
} from "firebase/firestore";

import { db } from "../firebase/firestore";
import { useAuth } from "./AuthContext";

import type { Transaction } from "../features/Transactions/types/transactionTypes";

type TransactionContextType = {
    transactions: Transaction[];
    loading: boolean;

    addTransaction: (
        transaction: Transaction
    ) => Promise<void>;

    transferMoney: (
        transaction: Transaction
    ) => Promise<void>;

    editTransaction: (
        transaction: Transaction
    ) => Promise<void>;

    removeTransaction: (
        id: string
    ) => Promise<void>;
};

export type TransactionProviderProps = {
    children: ReactNode;
};

const createReceiptId = () => {
    const date = new Date();

    const datePart = date
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

    const randomPart = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `RCPT-${datePart}-${randomPart}`;
};

const createTransactionId = () => {
    return crypto.randomUUID();
};

export const TransactionProvider = ({
    children,
}: TransactionProviderProps) => {
    const { user } = useAuth();

    const [transactions, setTransactions] =
        useState<Transaction[]>([]);

    const [loading, setLoading] =
        useState(true);

    /*
    ============================================================
    LOAD TRANSACTIONS
    ============================================================
    */

    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const transactionsRef = collection(
            db,
            "users",
            user.uid,
            "transactions"
        );

        const unsubscribe = onSnapshot(
            transactionsRef,
            (snapshot) => {
                const transactionData: Transaction[] =
                    snapshot.docs.map((document) => ({
                        id: document.id,
                        ...(document.data() as Omit<
                            Transaction,
                            "id"
                        >),
                    }));

                setTransactions(transactionData);
                setLoading(false);
            },
            (error) => {
                console.error(
                    "Failed to load transactions:",
                    error
                );

                setLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);

    /*
    ============================================================
    ADD INCOME / EXPENSE
    ============================================================
    */

    const addTransaction = async (
        transaction: Transaction
    ) => {
        if (!user) {
            throw new Error(
                "User is not authenticated"
            );
        }

        if (transaction.type === "transfer") {
            throw new Error(
                "Use transferMoney() for transfer transactions"
            );
        }

        if (transaction.amount <= 0) {
            throw new Error(
                "Transaction amount must be greater than zero"
            );
        }

        const transactionRef = doc(
            db,
            "users",
            user.uid,
            "transactions",
            transaction.id || createTransactionId()
        );

        const walletRef = doc(
            db,
            "users",
            user.uid,
            "wallets",
            transaction.walletId
        );

        await firestoreTransaction(
            db,
            async (tx) => {
                const walletSnapshot =
                    await tx.get(walletRef);

                if (!walletSnapshot.exists()) {
                    throw new Error(
                        "Wallet not found"
                    );
                }

                const wallet =
                    walletSnapshot.data();

                const balanceBefore =
                    Number(wallet.balance ?? 0);

                let balanceAfter =
                    balanceBefore;

                if (
                    transaction.type ===
                    "expense"
                ) {
                    if (
                        balanceBefore <
                        transaction.amount
                    ) {
                        throw new Error(
                            "Insufficient balance"
                        );
                    }

                    balanceAfter =
                        balanceBefore -
                        transaction.amount;
                }

                if (
                    transaction.type ===
                    "income"
                ) {
                    balanceAfter =
                        balanceBefore +
                        transaction.amount;
                }

                const receiptId =
                    transaction.receiptId ??
                    createReceiptId();

                tx.set(
                    transactionRef,
                    {
                        id:
                            transactionRef.id,

                        title:
                            transaction.title,

                        amount:
                            transaction.amount,

                        walletId:
                            transaction.walletId,

                        type:
                            transaction.type,

                        categoryId:
                            transaction.categoryId,

                        description:
                            transaction.description ??
                            "",

                        date:
                            transaction.date,

                        createdAt:
                            transaction.createdAt,

                        updatedAt:
                            new Date().toISOString(),

                        balanceBefore,

                        balanceAfter,

                        receiptId,

                        currency:
                            wallet.currency,

                        status:
                            transaction.status,
                    }
                );

                tx.update(
                    walletRef,
                    {
                        balance:
                            balanceAfter,
                    }
                );
            }
        );
    };

    /*
    ============================================================
    TRANSFER MONEY
    ============================================================
    */

    const transferMoney = async (
        transaction: Transaction
    ) => {
        if (!user) {
            throw new Error(
                "User is not authenticated"
            );
        }

        if (transaction.type !== "transfer") {
            throw new Error(
                "Invalid transaction type"
            );
        }

        if (!transaction.toWalletId) {
            throw new Error(
                "Destination wallet is required"
            );
        }

        if (
            transaction.walletId ===
            transaction.toWalletId
        ) {
            throw new Error(
                "Source and destination wallets must be different"
            );
        }

        if (transaction.amount <= 0) {
            throw new Error(
                "Transfer amount must be greater than zero"
            );
        }

        const sourceWalletRef = doc(
            db,
            "users",
            user.uid,
            "wallets",
            transaction.walletId
        );

        const destinationWalletRef = doc(
            db,
            "users",
            user.uid,
            "wallets",
            transaction.toWalletId
        );

        const transactionRef = doc(
            db,
            "users",
            user.uid,
            "transactions",
            transaction.id || createTransactionId()
        );

        await firestoreTransaction(
            db,
            async (tx) => {
                const sourceSnapshot =
                    await tx.get(
                        sourceWalletRef
                    );

                const destinationSnapshot =
                    await tx.get(
                        destinationWalletRef
                    );

                if (!sourceSnapshot.exists()) {
                    throw new Error(
                        "Source wallet not found"
                    );
                }

                if (
                    !destinationSnapshot.exists()
                ) {
                    throw new Error(
                        "Destination wallet not found"
                    );
                }

                const sourceWallet =
                    sourceSnapshot.data();

                const destinationWallet =
                    destinationSnapshot.data();

                /*
                ------------------------------------------------
                SAME CURRENCY ONLY
                ------------------------------------------------
                */

                if (
                    sourceWallet.currency !==
                    destinationWallet.currency
                ) {
                    throw new Error(
                        "Transfers are only allowed between wallets with the same currency"
                    );
                }

                const sourceBalanceBefore =
                    Number(
                        sourceWallet.balance ?? 0
                    );

                const destinationBalanceBefore =
                    Number(
                        destinationWallet.balance ?? 0
                    );

                if (
                    sourceBalanceBefore <
                    transaction.amount
                ) {
                    throw new Error(
                        "Insufficient balance"
                    );
                }

                const sourceBalanceAfter =
                    sourceBalanceBefore -
                    transaction.amount;

                const destinationBalanceAfter =
                    destinationBalanceBefore +
                    transaction.amount;

                const receiptId =
                    transaction.receiptId ??
                    createReceiptId();

                /*
                ------------------------------------------------
                CREATE TRANSFER RECORD
                ------------------------------------------------
                */

                tx.set(
                    transactionRef,
                    {
                        id:
                            transactionRef.id,

                        title:
                            transaction.title ||
                            "Transfer",

                        amount:
                            transaction.amount,

                        walletId:
                            transaction.walletId,

                        toWalletId:
                            transaction.toWalletId,

                        type:
                            "transfer",

                        categoryId:
                            transaction.categoryId,

                        description:
                            transaction.description ??
                            "",

                        date:
                            transaction.date,

                        createdAt:
                            transaction.createdAt,

                        updatedAt:
                            new Date().toISOString(),

                        /*
                        For a transfer, these represent
                        the SOURCE wallet.
                        */

                        balanceBefore:
                            sourceBalanceBefore,

                        balanceAfter:
                            sourceBalanceAfter,

                        receiptId,

                        currency:
                            sourceWallet.currency,

                        status:
                            transaction.status,
                    }
                );

                /*
                ------------------------------------------------
                UPDATE SOURCE
                ------------------------------------------------
                */

                tx.update(
                    sourceWalletRef,
                    {
                        balance:
                            sourceBalanceAfter,
                    }
                );

                /*
                ------------------------------------------------
                UPDATE DESTINATION
                ------------------------------------------------
                */

                tx.update(
                    destinationWalletRef,
                    {
                        balance:
                            destinationBalanceAfter,
                    }
                );
            }
        );
    };

    /*
    ============================================================
    EDIT TRANSACTION
    ============================================================
    */

    const editTransaction = async (
        updatedTransaction: Transaction
    ) => {
        if (!user) {
            throw new Error(
                "User is not authenticated"
            );
        }

        if (updatedTransaction.amount <= 0) {
            throw new Error(
                "Transaction amount must be greater than zero"
            );
        }

        const transactionRef = doc(
            db,
            "users",
            user.uid,
            "transactions",
            updatedTransaction.id
        );

        await firestoreTransaction(
            db,
            async (tx) => {
                /*
                ------------------------------------------------
                READ OLD TRANSACTION
                ------------------------------------------------
                */

                const oldSnapshot =
                    await tx.get(
                        transactionRef
                    );

                if (!oldSnapshot.exists()) {
                    throw new Error(
                        "Transaction not found"
                    );
                }

                const oldTransaction =
                    oldSnapshot.data() as Transaction;

                /*
                ------------------------------------------------
                RESTORE OLD TRANSACTION
                ------------------------------------------------
                */

                const walletBalances =
                    new Map<string, number>();

                const walletRefs =
                    new Map<string, ReturnType<typeof doc>>();

                const getWallet = async (
                    walletId: string
                ) => {
                    if (
                        walletBalances.has(
                            walletId
                        )
                    ) {
                        return walletBalances.get(
                            walletId
                        )!;
                    }

                    const ref = doc(
                        db,
                        "users",
                        user.uid,
                        "wallets",
                        walletId
                    );

                    const snapshot =
                        await tx.get(ref);

                    if (!snapshot.exists()) {
                        throw new Error(
                            "Wallet not found"
                        );
                    }

                    const balance =
                        Number(
                            snapshot.data()
                                .balance ?? 0
                        );

                    walletBalances.set(
                        walletId,
                        balance
                    );

                    walletRefs.set(
                        walletId,
                        ref
                    );

                    return balance;
                };

                /*
                =================================================
                OLD TRANSFER
                =================================================
                */

                if (
                    oldTransaction.type ===
                    "transfer"
                ) {
                    if (
                        !oldTransaction.toWalletId
                    ) {
                        throw new Error(
                            "Existing transfer is missing destination wallet"
                        );
                    }

                    const sourceBalance =
                        await getWallet(
                            oldTransaction.walletId
                        );

                    const destinationBalance =
                        await getWallet(
                            oldTransaction.toWalletId
                        );

                    walletBalances.set(
                        oldTransaction.walletId,
                        sourceBalance +
                        oldTransaction.amount
                    );

                    walletBalances.set(
                        oldTransaction.toWalletId,
                        destinationBalance -
                        oldTransaction.amount
                    );

                    if (
                        destinationBalance -
                        oldTransaction.amount <
                        0
                    ) {
                        throw new Error(
                            "Cannot edit this transfer because the destination wallet no longer has enough balance to reverse it"
                        );
                    }
                }

                /*
                =================================================
                OLD INCOME / EXPENSE
                =================================================
                */

                else {
                    const oldBalance =
                        await getWallet(
                            oldTransaction.walletId
                        );

                    let restoredBalance =
                        oldBalance;

                    if (
                        oldTransaction.type ===
                        "expense"
                    ) {
                        restoredBalance +=
                            oldTransaction.amount;
                    }

                    if (
                        oldTransaction.type ===
                        "income"
                    ) {
                        restoredBalance -=
                            oldTransaction.amount;
                    }

                    walletBalances.set(
                        oldTransaction.walletId,
                        restoredBalance
                    );
                }

                /*
                =================================================
                APPLY NEW TRANSACTION
                =================================================
                */

                if (
                    updatedTransaction.type ===
                    "transfer"
                ) {
                    if (
                        !updatedTransaction.toWalletId
                    ) {
                        throw new Error(
                            "Destination wallet is required"
                        );
                    }

                    if (
                        updatedTransaction.walletId ===
                        updatedTransaction.toWalletId
                    ) {
                        throw new Error(
                            "Source and destination wallets must be different"
                        );
                    }

                    await getWallet(
                        updatedTransaction.walletId
                    );

                    await getWallet(
                        updatedTransaction.toWalletId
                    );

                    const sourceRef =
                        walletRefs.get(
                            updatedTransaction.walletId
                        )!;

                    const destinationRef =
                        walletRefs.get(
                            updatedTransaction.toWalletId
                        )!;

                    /*
                    Read currencies.
                    */

                    const sourceSnapshot =
                        await tx.get(sourceRef);

                    const destinationSnapshot =
                        await tx.get(
                            destinationRef
                        );

                    if (
                        !sourceSnapshot.exists() ||
                        !destinationSnapshot.exists()
                    ) {
                        throw new Error(
                            "Wallet not found"
                        );
                    }

                    const sourceWallet =
                        sourceSnapshot.data();

                    const destinationWallet =
                        destinationSnapshot.data();

                    if (
                        sourceWallet.currency !==
                        destinationWallet.currency
                    ) {
                        throw new Error(
                            "Transfers are only allowed between wallets with the same currency"
                        );
                    }

                    const finalSourceBalance =
                        walletBalances.get(
                            updatedTransaction.walletId
                        )!;

                    const finalDestinationBalance =
                        walletBalances.get(
                            updatedTransaction.toWalletId
                        )!;

                    if (
                        finalSourceBalance <
                        updatedTransaction.amount
                    ) {
                        throw new Error(
                            "Insufficient balance"
                        );
                    }

                    const sourceBefore =
                        finalSourceBalance;

                    const sourceAfter =
                        sourceBefore -
                        updatedTransaction.amount;

                    const destinationAfter =
                        finalDestinationBalance +
                        updatedTransaction.amount;

                    walletBalances.set(
                        updatedTransaction.walletId,
                        sourceAfter
                    );

                    walletBalances.set(
                        updatedTransaction.toWalletId,
                        destinationAfter
                    );

                    /*
                    Update wallets.
                    */

                    for (
                        const [
                            walletId,
                            balance,
                        ] of walletBalances
                    ) {
                        const ref =
                            walletRefs.get(
                                walletId
                            );

                        if (ref) {
                            tx.update(
                                ref,
                                {
                                    balance,
                                }
                            );
                        }
                    }

                    /*
                    Update transaction.
                    */

                    tx.update(
                        transactionRef,
                        {
                            title:
                                updatedTransaction.title ||
                                "Transfer",

                            amount:
                                updatedTransaction.amount,

                            walletId:
                                updatedTransaction.walletId,

                            toWalletId:
                                updatedTransaction.toWalletId,

                            type:
                                "transfer",

                            categoryId:
                                updatedTransaction.categoryId,

                            description:
                                updatedTransaction.description ??
                                "",

                            date:
                                updatedTransaction.date,

                            updatedAt:
                                new Date().toISOString(),

                            balanceBefore:
                                sourceBefore,

                            balanceAfter:
                                sourceAfter,

                            currency:
                                sourceWallet.currency,

                            status:
                                updatedTransaction.status,
                        }
                    );

                    return;
                }

                /*
                =================================================
                NEW INCOME / EXPENSE
                =================================================
                */

                const newBalance =
                    await getWallet(
                        updatedTransaction.walletId
                    );

                const newWalletRef =
                    walletRefs.get(
                        updatedTransaction.walletId
                    )!;

                const newWalletSnapshot =
                    await tx.get(
                        newWalletRef
                    );

                if (
                    !newWalletSnapshot.exists()
                ) {
                    throw new Error(
                        "Wallet not found"
                    );
                }

                const newWallet =
                    newWalletSnapshot.data();

                let balanceBefore =
                    newBalance;

                let balanceAfter =
                    newBalance;

                /*
                If changing to a different wallet,
                the restored balance already exists
                in walletBalances.
                */

                if (
                    updatedTransaction.type ===
                    "expense"
                ) {
                    if (
                        balanceBefore <
                        updatedTransaction.amount
                    ) {
                        throw new Error(
                            "Insufficient balance"
                        );
                    }

                    balanceAfter =
                        balanceBefore -
                        updatedTransaction.amount;
                }

                if (
                    updatedTransaction.type ===
                    "income"
                ) {
                    balanceAfter =
                        balanceBefore +
                        updatedTransaction.amount;
                }

                walletBalances.set(
                    updatedTransaction.walletId,
                    balanceAfter
                );

                /*
                Update every affected wallet.
                */

                for (
                    const [
                        walletId,
                        balance,
                    ] of walletBalances
                ) {
                    const ref =
                        walletRefs.get(
                            walletId
                        );

                    if (ref) {
                        tx.update(
                            ref,
                            {
                                balance,
                            }
                        );
                    }
                }

                /*
                Update transaction.
                */

                tx.update(
                    transactionRef,
                    {
                        title:
                            updatedTransaction.title,

                        amount:
                            updatedTransaction.amount,

                        walletId:
                            updatedTransaction.walletId,

                        toWalletId:
                            null,

                        type:
                            updatedTransaction.type,

                        categoryId:
                            updatedTransaction.categoryId,

                        description:
                            updatedTransaction.description ??
                            "",

                        date:
                            updatedTransaction.date,

                        updatedAt:
                            new Date().toISOString(),

                        balanceBefore,

                        balanceAfter,

                        currency:
                            newWallet.currency,

                        status:
                            updatedTransaction.status,
                    }
                );
            }
        );
    };

    /*
    ============================================================
    DELETE TRANSACTION
    ============================================================
    */

    const removeTransaction = async (
        id: string
    ) => {
        if (!user || !id) return;

        const transactionRef = doc(
            db,
            "users",
            user.uid,
            "transactions",
            id
        );

        await firestoreTransaction(
            db,
            async (tx) => {
                const snapshot =
                    await tx.get(
                        transactionRef
                    );

                if (!snapshot.exists()) {
                    throw new Error(
                        "Transaction not found"
                    );
                }

                const transaction =
                    snapshot.data() as Transaction;

                /*
                =================================================
                DELETE TRANSFER
                =================================================
                */

                if (
                    transaction.type ===
                    "transfer"
                ) {
                    if (
                        !transaction.toWalletId
                    ) {
                        throw new Error(
                            "Transfer destination wallet is missing"
                        );
                    }

                    const sourceWalletRef =
                        doc(
                            db,
                            "users",
                            user.uid,
                            "wallets",
                            transaction.walletId
                        );

                    const destinationWalletRef =
                        doc(
                            db,
                            "users",
                            user.uid,
                            "wallets",
                            transaction.toWalletId
                        );

                    const sourceSnapshot =
                        await tx.get(
                            sourceWalletRef
                        );

                    const destinationSnapshot =
                        await tx.get(
                            destinationWalletRef
                        );

                    if (
                        !sourceSnapshot.exists() ||
                        !destinationSnapshot.exists()
                    ) {
                        throw new Error(
                            "Wallet not found"
                        );
                    }

                    const sourceWallet =
                        sourceSnapshot.data();

                    const destinationWallet =
                        destinationSnapshot.data();

                    const restoredSourceBalance =
                        Number(
                            sourceWallet.balance ?? 0
                        ) +
                        transaction.amount;

                    const restoredDestinationBalance =
                        Number(
                            destinationWallet.balance ?? 0
                        ) -
                        transaction.amount;

                    if (
                        restoredDestinationBalance <
                        0
                    ) {
                        throw new Error(
                            "Cannot delete this transfer because the destination wallet no longer has enough balance to reverse it"
                        );
                    }

                    tx.update(
                        sourceWalletRef,
                        {
                            balance:
                                restoredSourceBalance,
                        }
                    );

                    tx.update(
                        destinationWalletRef,
                        {
                            balance:
                                restoredDestinationBalance,
                        }
                    );

                    tx.delete(
                        transactionRef
                    );

                    return;
                }

                /*
                =================================================
                DELETE INCOME / EXPENSE
                =================================================
                */

                const walletRef = doc(
                    db,
                    "users",
                    user.uid,
                    "wallets",
                    transaction.walletId
                );

                const walletSnapshot =
                    await tx.get(walletRef);

                if (!walletSnapshot.exists()) {
                    throw new Error(
                        "Wallet not found"
                    );
                }

                const wallet =
                    walletSnapshot.data();

                let restoredBalance =
                    Number(
                        wallet.balance ?? 0
                    );

                if (
                    transaction.type ===
                    "expense"
                ) {
                    restoredBalance +=
                        transaction.amount;
                }

                if (
                    transaction.type ===
                    "income"
                ) {
                    restoredBalance -=
                        transaction.amount;
                }

                tx.update(
                    walletRef,
                    {
                        balance:
                            restoredBalance,
                    }
                );

                tx.delete(
                    transactionRef
                );
            }
        );
    };

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                loading,
                addTransaction,
                transferMoney,
                editTransaction,
                removeTransaction,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};

const TransactionContext =
    createContext<TransactionContextType | null>(
        null
    );

export default TransactionContext;