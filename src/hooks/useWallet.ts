import { useContext } from "react";
import WalletContext from "../context/WalletContext";

export const useWallet = () => {
    const Wcontext = useContext(WalletContext)!;

    if (!Wcontext) {
        throw new Error("useWallet must be used inside WalletProvider");
    }

    return Wcontext;
};