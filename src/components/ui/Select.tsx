import type { SelectHTMLAttributes } from "react";

export type Option = {
    value: string;
    label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    errorMessage?: string;
    options: readonly Option[];
};

const Select = ({
    label,
    errorMessage,
    className = "",
    options,
    ...props
}: SelectProps) => {
    return (
        <div className={`flex flex-col ${className}`}>
            {label && (
                <label
                    htmlFor={props.id}
                    className="mb-2 text-sm font-medium text-[var(--text-secondary)]"
                >
                    {label}
                </label>
            )}

            <select
                id={props.id}
                className={`
          w-full
          rounded-xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-3.5
          py-2.5
          text-sm
          text-[var(--text-primary)]
          transition-all
          duration-200

          hover:border-[var(--border-hover)]

          focus:border-[var(--accent)]
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--accent)]/15

          disabled:cursor-not-allowed
          disabled:opacity-50

          ${errorMessage
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                        : ""
                    }
        `}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {errorMessage && (
                <p className="mt-1.5 text-xs text-red-400">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default Select;