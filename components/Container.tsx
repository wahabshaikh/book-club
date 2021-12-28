import classNames from "classnames";
import { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div
      className={classNames(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
