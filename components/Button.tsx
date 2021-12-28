import classNames from "classnames";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "white";
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
        "py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
        variant === "primary" &&
          "inline-flex justify-center border-transparent text-white bg-indigo-600 hover:bg-indigo-700",
        variant === "white" &&
          "border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
