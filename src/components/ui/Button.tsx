import type { ButtonHTMLAttributes } from "react";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof variants;
    size?: keyof typeof sizes;
    Loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

const variants = {
  primary:
    "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",

  danger:
    "bg-red-500 text-white hover:bg-red-600",

  outline:
    "border border-[var(--border)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]",
};

const sizes = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-sm",
  large: "px-5 py-2.5 text-base",
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "medium",
  Loading = false,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
inline-flex
items-center
justify-center
rounded-xl
font-medium
transition-all
duration-200
ease-out
cursor-pointer

hover:-translate-y-0.5
hover:shadow-md
active:translate-y-0
active:scale-[0.98]

focus:outline-none
focus:ring-2
focus:ring-[var(--accent)]/30
focus:ring-offset-2
focus:ring-offset-[var(--background)]

disabled:cursor-not-allowed
disabled:opacity-50
disabled:hover:translate-y-0
disabled:hover:shadow-none
disabled:active:scale-100
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
      disabled={Loading}
      {...props}
    >
      {leftIcon && (
        <span className="mr-2 flex items-center">
          {leftIcon}
        </span>
      )}

      {children}

      {rightIcon && (
        <span className="ml-2 flex items-center">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;