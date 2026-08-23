interface SummaryCardProps {
    title: string;
    amount: number;
    description: string;
    currency: string;
    type?: "balance" | "income" | "expense";
}

const SummaryCard = ({
    title,
    amount,
    description,
    type = "balance",
    currency,
}: SummaryCardProps) => {

    const amountColor = {
        balance: "text-[var(--text-primary)]",
        income: "text-[var(--success)]",
        expense: "text-[var(--danger)]",
    }[type];

    const prefix =
        type === "income"
            ? "+ "
            : type === "expense"
                ? "- "
                : "";

    // const formattedAmount = new Intl.NumberFormat(undefined, {
    //     currency,
    //     style: "currency",
    //     maximumFractionDigits: 2,
    // }).format(Math.abs(amount));

    return (
        <div
            className="
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface)]
                p-5
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-[var(--border-hover)]
                hover:bg-[var(--surface-elevated)]
                sm:p-6
            "
        >

            <div className="flex items-start justify-between">

                <p className="text-sm font-medium text-[var(--text-muted)]">
                    {title}
                </p>

                <span
                    className={`
                        h-2
                        w-2
                        rounded-full
                        ${type === "income"
                            ? "bg-[var(--income)]"
                            : type === "expense"
                                ? "bg-[var(--expense)]"
                                : "bg-[var(--accent)]"
                        }
                    `}
                />

            </div>

            <p
                className={`
                            mt-4
                            text-2xl
                            font-bold
                            tracking-tight
                            sm:text-3xl
                            ${amountColor}
                        `}
            >
                {currency}: {prefix}{Math.abs(amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
            </p>

            <p className="mt-2 text-xs text-[var(--text-muted)]">
                {description}
            </p>

        </div>
    );
};

export default SummaryCard;
