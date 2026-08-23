import { useState } from "react";
import Input from "../../../components/ui/Input";
import { CURRENCIES } from "../../../constants/currencies";
import Select from "../../../components/ui/Select";
import { WALLET_TYPES } from "../types/walletTypes";
import type { Wallet } from "../types/walletTypes";
import Button from "../../../components/ui/Button";


type WalletFormProps = {
    onSubmit: (wallet: Wallet) => void;
    wallet?: Wallet;
};

const WalletForm = ({ onSubmit, wallet }: WalletFormProps) => {
    type WalletFormData = Omit<Wallet, "id" | "icon">;
    const [formData, setFormData] = useState<WalletFormData>({
        name: wallet?.name ?? "", // if wallet is provided ( being edited), use its details; otherwise, use an empty string (for creating a new wallet)
        balance: wallet?.balance ?? 0,
        currency: wallet?.currency ?? "EGP",
        type: wallet?.type ?? "cash",
        color: wallet?.color ?? "#22c55e",
    });
    const [errors, setErrors] = useState({
        errorName: "",
        errorBalance: "",
    });

    const handleChange = (field: keyof typeof formData, value: string | number) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        console.log("Submitted!");

        onSubmit({
            id: wallet?.id ?? crypto.randomUUID(),
            ...formData,
            name: formData.name.trim(),
        });
        setFormData({
            name: "",
            balance: 0,
            currency: "EGP",
            type: "cash",
            color: "#22c55e",
        });
    };

    const validate = () => {
        const newErrors = {
            errorName: "",
            errorBalance: "",
        };

        if (formData.name.trim() === "") {
            newErrors.errorName = "Wallet name is required";
        } else if (formData.name.trim().length < 3) {
            newErrors.errorName = "Wallet name must be at least 3 characters";
        }
        if (formData.balance < 0) {
            newErrors.errorBalance = "Balance cannot be negative";
        }

        setErrors(newErrors);

        return Object.values(newErrors).every(
            (error) => error === ""
        );
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
                label="Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                errorMessage={errors.errorName}
            />
            <Input
                label="Balance"
                type="number"
                value={formData.balance}
                onChange={(e) => handleChange("balance", Number(e.target.value))}
                errorMessage={errors.errorBalance}
            />
            <Select
                label="Currency"
                value={formData.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                options={CURRENCIES}
            />
            <Select
                label="Wallet Type"
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                options={WALLET_TYPES}
            />
            <Input
                label="Color"
                type="color"
                value={formData.color}
                onChange={(e) => handleChange("color", e.target.value)}
            />
            <Button type="submit">
                {wallet ? "Update Wallet" : "Create Wallet"}
            </Button>
        </form>
    )
}

export default WalletForm;