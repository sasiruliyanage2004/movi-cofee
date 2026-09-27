import React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "outline" | "gold" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-espresso text-warm-cream border border-espresso hover:bg-deep-coffee hover:border-deep-coffee",
  secondary:
    "bg-transparent text-espresso border border-espresso/30 hover:border-espresso hover:bg-espresso/5",
  outline:
    "bg-transparent text-warm-cream border border-warm-cream/35 hover:border-warm-cream hover:bg-warm-cream/10",
  gold:
    "bg-muted-gold text-espresso border border-muted-gold hover:bg-[#a98e5b] hover:border-[#a98e5b]",
  ghost:
    "bg-transparent text-espresso hover:text-muted-coffee border-b border-espresso/40 hover:border-espresso px-0 rounded-none",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-[11px] px-4 py-2.5 tracking-[0.16em]",
  md: "text-xs px-6 py-3.5 tracking-[0.18em]",
  lg: "text-xs px-8 py-4 tracking-[0.2em]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      external,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-sans font-medium uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer select-none text-center";
    const combinedClasses = `${baseClasses} ${variantStyles[variant]} ${
      variant === "ghost" ? "text-xs tracking-[0.16em] py-1" : sizeStyles[size]
    } ${className}`.trim();

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={combinedClasses}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={combinedClasses}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
