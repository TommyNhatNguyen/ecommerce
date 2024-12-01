import clsx from "clsx";
import React from "react";
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
  children: React.ReactNode;
  renderIcon?: () => React.ReactNode;
  label?: string;
  error?: string;
  classes?: string;
} & React.HTMLAttributes<HTMLDivElement>;

Form.Group = ({
  children,
  renderIcon,
  label,
  error,
  classes,
  ...props
}: FormGroupPropsType) => {
  return (
    <div
      className={twMerge(
        "form__group border border-solid",
        error && "border-error",
        classes,
      )}
      {...props}
    >
      {label && (
        <label className="form__group-label" htmlFor="search">
          {label}
        </label>
      )}
      {children}
      {renderIcon && renderIcon()}
      {error && <p className="form__group-error">{error}</p>}
    </div>
  );
};

type FormInputPropsType = {
  type?: string;
  placeholder?: string;
  classes?: string;
  renderInput?: (
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

Form.Input = ({
  type = "text",
  placeholder,
  classes,
  renderInput,
  ...props
}: FormInputPropsType) => {
  return renderInput ? (
    renderInput({ ...props })
  ) : (
    <input
      className={twMerge(
        "form__group-input h-full w-full border-none bg-transparent font-roboto-regular text-green-300 outline-none placeholder:font-roboto-regular placeholder:text-green-300",
        classes,
      )}
      type={type}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Form;
