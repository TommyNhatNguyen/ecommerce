import clsx, { type ClassValue } from "clsx";
import React, { ReactHTMLElement, Ref, forwardRef } from "react";
import { cn } from "../../utils/utils";

type FormPropsType = {
  children: React.ReactNode;
  classes?: ClassValue;
} & React.FormHTMLAttributes<HTMLFormElement>;

const Form = ({ children, classes, ...props }: FormPropsType) => {
  return (
    <form className={cn("form", classes)} {...props}>
      {children}
    </form>
  );
};

type FormGroupPropsType = {
  renderIcon?: () => React.ReactNode;
  label?: string;
  labelClasses?: ClassValue;
  error?: string;
  inputClasses?: ClassValue;
  wrapperClasses?: ClassValue;
  isRequired?: boolean;
  children?: React.ReactNode;
  renderInput?: (
    props: React.InputHTMLAttributes<HTMLInputElement>,
    ref: Ref<HTMLInputElement>,
  ) => React.ReactNode;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

Form.Input = forwardRef(
  (
    {
      renderIcon,
      label,
      labelClasses,
      error,
      inputClasses,
      wrapperClasses,
      isRequired = false,
      renderInput,
      children,
      ...props
    }: FormGroupPropsType,
    ref: Ref<HTMLInputElement>,
  ) => {
    return (
      <div
        className={cn(
          "form__group min-h-input border border-solid",
          error && "border-error",
          wrapperClasses,
          props.type == "number" ? "relative w-full min-w-10 border-none" : "",
        )}
      >
        {label && (
          <label
            className={cn(
              "form__group-label block w-full text-left",
              error && "text-error",
              labelClasses,
            )}
            htmlFor="search"
          >
            {label} {isRequired && <span className="text-error">*</span>}
          </label>
        )}
        {renderInput ? (
          renderInput({ ...props }, ref)
        ) : (
          <div className="h-full w-full">
            <input
              className={cn(
                "form__group-input h-full w-full border-none bg-transparent font-roboto-regular text-green-300 outline-none duration-300 placeholder:font-roboto-regular placeholder:text-green-300",
                inputClasses,
                error && "border-error text-error",
                props.type == "number"
                  ? "absolute bottom-0 left-0 right-0 top-0 h-full w-full justify-items-center align-middle"
                  : "",
              )}
              ref={ref}
              {...props}
            />
            {children}
          </div>
        )}
        {renderIcon && renderIcon()}
        {error && (
          <p className="form__group-error mt-[6px] w-full text-left text-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);

export default Form;
