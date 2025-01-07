import { cn } from "@/lib/utils";
import { Input, InputProps, InputRef } from "antd";
import React, { forwardRef } from "react";
import { ControllerRenderProps } from "react-hook-form";

type InputAdminPropsType = {
  label?: string | React.ReactNode | (() => React.ReactNode);
  error?: string;
  required?: boolean;
  customComponent?: (
    props: ControllerRenderProps<any, any>,
    ref: React.RefObject<InputRef>,
  ) => React.ReactNode;
  groupClassName?: string;
} & InputProps;

const InputAdmin = forwardRef(
  (
    {
      label = '',
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
          {typeof label === "function" ? label() : label}
        </label>
        {customComponent ? (
          customComponent(
            props as ControllerRenderProps<any, any>,
            ref as React.RefObject<InputRef>,
          )
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
