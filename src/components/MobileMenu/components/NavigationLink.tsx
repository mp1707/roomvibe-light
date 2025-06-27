import React from "react";
import Link from "next/link";

interface NavigationLinkProps {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: "default" | "primary";
  className?: string;
}

export const NavigationLink = ({
  href,
  onClick,
  icon,
  label,
  variant = "default",
  className = "",
}: NavigationLinkProps) => {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
        isPrimary
          ? "text-primary hover:bg-primary/10"
          : "text-base-content hover:bg-base-200/50"
      } ${className}`}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
          isPrimary
            ? "bg-primary/20 group-hover:bg-primary/30"
            : "bg-base-200 group-hover:bg-base-300"
        }`}
      >
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );
};
