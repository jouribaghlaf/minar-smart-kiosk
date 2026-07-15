import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900 shadow-card",
  secondary: "bg-brand-50 text-brand-800 hover:bg-brand-100",
  ghost: "bg-transparent text-ink-700 hover:bg-cream-200",
  danger: "bg-emergency text-white hover:bg-emergency-dark shadow-card",
  outline: "border-2 border-brand-700 text-brand-700 bg-transparent hover:bg-brand-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-touch px-6 text-kiosk-sm rounded-2xl gap-2",
  lg: "h-touch-lg px-8 text-kiosk-base rounded-2xl gap-3",
  icon: "h-touch w-touch rounded-full p-0 justify-center",
};

/**
 * Base button used by every nav/drawer/card control in the app. Kiosk
 * touch-target sizing is baked into `size`, not left to callers, so
 * accidental undersized targets can't slip in.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", icon, iconPosition = "start", className, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        data-touch-target
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-colors duration-200",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {icon && iconPosition === "start" ? icon : null}
        {children}
        {icon && iconPosition === "end" ? icon : null}
      </button>
    );
  }
);

Button.displayName = "Button";
