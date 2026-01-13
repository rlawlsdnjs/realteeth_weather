import { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "elevated";
}

const variantStyles = {
  default: "bg-white",
  bordered: "bg-white border border-gray-200",
  elevated: "bg-white shadow-lg",
};

export const Card = ({
  children,
  className,
  variant = "default",
}: CardProps) => {
  return (
    <div className={cn("rounded-lg p-6", variantStyles[variant], className)}>
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className }: CardHeaderProps) => {
  return <div className={cn("mb-4", className)}>{children}</div>;
};

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className }: CardTitleProps) => {
  return (
    <h3 className={cn("text-xl font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
};

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className }: CardContentProps) => {
  return <div className={cn("text-gray-700", className)}>{children}</div>;
};
