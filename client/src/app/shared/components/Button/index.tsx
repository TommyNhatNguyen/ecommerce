import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import React from "react";

type ButtonPropsType = {
  children: React.ReactNode;
  classes?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, classes, ...props }: ButtonPropsType) => {
  return (
    <button className={clsx("btn --general", classes)} {...props}>
      {children}
    </button>
  );
};

export const ButtonWithLink = ({
  children,
  link,
  ...props
}: ButtonPropsType & { link: string }) => {
  return withLink(<Button {...props}>{children}</Button>, link);
};

const withLink = (
  Component: React.ReactNode,
  link: string,
  classes?: string,
) => {
  return (
    <Link className={clsx("link-wrapper", classes)} href={link}>
      {Component}
    </Link>
  );
};

export default Button;
