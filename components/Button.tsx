import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "white" | "pill";
}

const Button = ({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={classNames(
        "inline-flex justify-center items-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
        variant === "primary" &&
          "border-transparent text-white bg-primary hover:bg-primary/90 focus:ring-primary",
        variant === "accent" &&
          "text-white bg-accent hover:bg-accent/90 focus:ring-accent",
        variant === "white" &&
          "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
        variant === "pill" &&
          "px-2.5 py-0.5 border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
