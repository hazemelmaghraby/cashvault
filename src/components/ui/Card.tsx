import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

const variants = {
  default:
    "border border-[var(--border)] bg-[var(--surface)] shadow-sm",

  elevated:
    "border border-[var(--border)] bg-[var(--surface-elevated)] shadow-lg shadow-black/10",

  outline:
    "border border-[var(--border)] bg-transparent",
};

const sizes = {
  small: "p-3",
  medium: "p-5",
  large: "p-6",
};

const Card = ({
  children,
  className = "",
  variant = "default",
  size = "medium",
  ...props
}: CardProps) => {
  return (
    <div
      className={`
        rounded-2xl
        ${sizes[size]}
        ${variants[variant]}

        transition-all
        duration-200
        ease-out

        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
