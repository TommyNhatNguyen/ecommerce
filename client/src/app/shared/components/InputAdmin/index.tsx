import { cn } from "@/lib/utils";
import { Input, InputProps, InputRef } from "antd";
import React, { forwardRef } from "react";

type InputAdminPropsType = {
  label: string;
  error?: string;
  required?: boolean;
  customComponent?: (
    props: InputProps,
    ref: React.RefObject<InputRef>,
  ) => React.ReactNode;
  groupClassName?: string;
} & InputProps;

const InputAdmin = forwardRef(
  (
    {
      label,
      error,
      required = false,
      customComponent,
      groupClassName,
      ...props
    }: InputAdminPropsType,
    ref: any,
  ) => {
    return (
      <div className={cn("flex flex-col gap-1", groupClassName)}>
        <label className="font-medium">
          {required && <span className="text-red-500">*</span>}
          {label}
        </label>
        {customComponent ? (
          customComponent(props, ref as React.RefObject<InputRef>)
        ) : (
          <Input
            ref={ref}
            className={cn("w-full", error ? "border-red-500 text-red-500" : "")}
            {...props}
          />
        )}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);

export default InputAdmin;
