import { cn } from "@/lib/utils";
import { Input, InputProps, InputRef } from "antd";
import React, { forwardRef } from "react";
import { ControllerRenderProps } from "react-hook-form";

type InputAdminPropsType = {
  label?:
    | string
    | React.ReactNode
    | ((labelClassName?: string) => React.ReactNode);
  error?: string;
  required?: boolean;
  customComponent?: (
    props: ControllerRenderProps<any, any> & { className?: string },
    ref: React.RefObject<InputRef>,
  ) => React.ReactNode;
  groupClassName?: string;
  labelClassName?: string;
  renderNextToInput?: () => React.ReactNode;
  className?: string;
} & InputProps;

const InputAdmin = forwardRef(
  (
    {
      label = "",
      error,
      required = false,
      customComponent,
      groupClassName,
      labelClassName,
      renderNextToInput,
      className,
      ...props
    }: InputAdminPropsType,
    ref: any,
  ) => {
    return (
      <div className={cn(groupClassName, "w-full")}>
        <div className="mb-2">
          <label className={cn("font-medium", labelClassName)}>
            {required && <span className="text-red-500">*</span>}
            {typeof label === "function" ? label(labelClassName) : label}
          </label>
        </div>
        {customComponent ? (
          customComponent(
            {
              ...props,
              ...{ className: cn(className, "w-full") },
            } as ControllerRenderProps<any, any> & { className?: string },
            ref as React.RefObject<InputRef>,
          )
        ) : (
          <div className="flex w-full items-center gap-2">
            <Input
              ref={ref}
              className={cn(
                "w-full",
                error ? "border-red-500 text-red-500" : "",
                className,
              )}
              {...props}
            />
            {renderNextToInput && renderNextToInput()}
          </div>
        )}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);

export default InputAdmin;
