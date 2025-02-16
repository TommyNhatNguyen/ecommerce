"use client";

import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { cn } from "@/app/shared/utils/utils";
import { type ClassValue } from "clsx";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

type ButtonPropsType = {
  children: React.ReactNode;
  classes?: ClassValue;
  variant?: "primary" | "secondary" | "vanilla" | "icon" | "accent-1" | "white";
  isDisabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseClasses =
  "h-btn min-h-btn px-[24px] text-center text-primary-btn rounded-[64px] duration-300 flex items-center justify-center gap-2 cursor-pointer";

const Button = ({
  children,
  classes,
  variant = "primary",
  isDisabled = false,
  ...props
}: ButtonPropsType) => {
  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "bg-pink-200 hover:bg-pink-100 text-white";
      break;
    case "secondary":
      variantClasses = "bg-gray-200 hover:bg-gray-100 text-white";
      break;
    case "accent-1":
      variantClasses = "bg-green-300 hover:bg-green-200 text-white";
      break;
    case "vanilla":
      variantClasses = "p-0";
      break;
    case "white":
      variantClasses = "bg-white hover:bg-white/80";
    case "icon":
      variantClasses =
        "flex aspect-square items-center justify-center rounded-full bg-green-300 duration-300 hover:bg-green-200 h-full px-0 text-white";
      break;
    default:
      break;
  }
  return (
    <button
      className={cn(
        "btn --general",
        baseClasses,
        variantClasses,
        classes,
        isDisabled &&
          "pointer-events-none cursor-not-allowed bg-gray-200 opacity-50",
      )}
      disabled={isDisabled}
      {...props}
    >
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
    <Link className={cn("link-wrapper text-white w-full h-full", classes)} href={link}>
      {Component}
    </Link>
  );
};

// Button with delete confirmation popover
export const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);

export default Button;
