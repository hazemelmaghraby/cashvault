import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firestore";
import { useAuth } from "./AuthContext";

import type { Wallet } from "../features/Wallets/types/walletTypes";

type WalletContextType = {
    wallets: Wallet[];
    loading: boolean;
    addWallet: (wallet: Wallet) => Promise<void>;
    updateWallet: (wallet: Wallet) => Promise<void>;
    removeWallet: (id: string) => Promise<void>;
};

export type WalletProviderProps = {
    children: ReactNode;
};

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({
    children,
}: WalletProviderProps) => {
    const { user } = useAuth();

    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setWallets([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const walletsRef = collection(
            db,
            "users",
            user.uid,
            "wallets"
        );

        const unsubscribe = onSnapshot(
            walletsRef,
            (snapshot) => {
                const walletData: Wallet[] = snapshot.docs.map(
                    (document) => ({
                        id: document.id,
                        ...(document.data() as Omit<Wallet, "id">),
                    })
                );

                setWallets(walletData);
                setLoading(false);

            },
            (error) => {
                console.error(
                    "Failed to load wallets:",
                    error
                );
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);


    const addWallet = async (wallet: Wallet) => {
        if (!user) {
            throw new Error("User is not authenticated");
        }

        const walletRef = doc(
            db,
            "users",
            user.uid,
            "wallets",
            wallet.id
        );

        await setDoc(walletRef, {
            name: wallet.name,
            balance: wallet.balance,
            currency: wallet.currency,
            color: wallet.color,
            type: wallet.type,
            icon: wallet.icon ?? null,
        });
    };

    const updateWallet = async (wallet: Wallet) => {
        if (!user) {
            throw new Error("User is not authenticated");
        }

        const walletRef = doc(
            db,
            "users",
            user.uid,
            "wallets",
            wallet.id
        );

        await updateDoc(walletRef, {
            name: wallet.name,
            balance: wallet.balance,
            currency: wallet.currency,
            color: wallet.color,
            type: wallet.type,
            icon: wallet.icon ?? null,
        });
    };

    const removeWallet = async (id: string) => {
        if (!user || !id) return;

        const walletRef = doc(
            db,
            "users",
            user.uid,
            "wallets",
            id
        );

        await deleteDoc(walletRef);
    };

    return (
        <WalletContext.Provider
            value={{
                wallets,
                addWallet,
                updateWallet,
                removeWallet,
                loading,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
export default WalletContext;