import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const styles = {
  primary:
    "bg-leaf-900 text-white shadow-lg shadow-leaf-900/20 hover:-translate-y-0.5 hover:bg-leaf-700",
  secondary:
    "border border-leaf-900/20 bg-white/80 text-leaf-900 hover:-translate-y-0.5 hover:border-gold hover:bg-white",
  ghost: "text-leaf-900 hover:bg-leaf-100"
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-gold";

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({ children, variant = "primary", className = "", href, ...props }: LinkButtonProps) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
