import clsx from "clsx";
import React, { ReactHTMLElement } from "react";
import { twMerge } from "tailwind-merge";

type FormPropsType = {
  children: React.ReactNode;
  classes?: string;
} & React.FormHTMLAttributes<HTMLFormElement>;

const Form = ({ children, classes, ...props }: FormPropsType) => {
  return (
    <form className={twMerge("form", classes)} {...props}>
      {children}
    </form>
  );
};

type FormGroupPropsType = {
  renderIcon?: () => React.ReactNode;
  label?: string;
  labelClasses?: string;
  error?: string;
  inputClasses?: string;
  wrapperClasses?: string;
  isRequired?: boolean;
  renderInput?: (
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => React.ReactNode;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

Form.Input = ({
  renderIcon,
  label,
  labelClasses,
  error,
  inputClasses,
  wrapperClasses,
  isRequired = false,
  renderInput,
  ...props
}: FormGroupPropsType) => {
  return (
    <div
      className={twMerge(
        "form__group border border-solid",
        error && "border-error",
        wrapperClasses,
      )}
    >
      {label && (
        <label
          className={twMerge(
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
        renderInput({ ...props })
      ) : (
        <input
          className={twMerge(
            "form__group-input h-full w-full border-none bg-transparent font-roboto-regular text-green-300 outline-none duration-300 placeholder:font-roboto-regular placeholder:text-green-300",
            inputClasses,
            error && "border-error text-error",
          )}
          {...props}
        />
      )}
      {renderIcon && renderIcon()}
      {error && (
        <p className="form__group-error mt-[6px] w-full text-left text-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default Form;
