import { useContext } from "react";
import TransactionContext from "../context/TransactionContext";

export const useTransaction = () => {
    const Tcontext = useContext(TransactionContext)!;

    if (!Tcontext) {
        throw new Error("useTransaction must be used inside TransactionProvider");
    }

    return Tcontext;
};