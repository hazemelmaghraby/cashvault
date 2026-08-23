import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    errorMessage?: string;
};

const Input = ({
    label,
    errorMessage,
    className = "",
    ...props
}: InputProps) => {
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

            <input
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
                    placeholder:text-[var(--text-muted)]

                    transition-all
                    duration-200
                    ease-out

                    hover:border-[var(--border-hover)]

                    focus:border-[var(--accent)]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[var(--accent)]/20

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    ${errorMessage
                        ? "border-[var(--expense)] focus:border-[var(--expense)] focus:ring-[var(--expense)]/20"
                        : ""
                    }
                `}
                {...props}
            />

            {errorMessage && (
                <span className="mt-1.5 text-xs text-[var(--expense)]">
                    {errorMessage}
                </span>
            )}
        </div>
    );
};

export default Input;