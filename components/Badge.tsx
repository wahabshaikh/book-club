import classNames from "classnames";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: "primary" | "secondary";
}

const Badge = ({
  children,
  variant = "primary",
  className,
  ...props
}: BadgeProps) => {
  return (
    <p
      className={classNames(
        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
        variant === "primary" && "bg-green-100 text-green-800",
        variant === "secondary" && "bg-yellow-100 text-yellow-800",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export default Badge;
