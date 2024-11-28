import clsx from "clsx";
import { Check } from "lucide-react";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

type SelectPropsType = {
  children: React.ReactNode;
  getSelectedOptions?: (data: any) => void;
};

type SelectedOptionsType = {
  [key: string]: boolean;
};

const Select = ({ children, getSelectedOptions }: SelectPropsType) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>(
    {},
  );
  const _onHandleSelectChange = (id: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [id]: !selectedOptions[id],
    });
    getSelectedOptions && getSelectedOptions(selectedOptions);
  };
  return (
    <div className="select">
      {React.Children.map(children, (child) => {
        return React.cloneElement(child as React.ReactElement, {
          onChange: _onHandleSelectChange,
        });
      })}
    </div>
  );
};

type OptionPropsType = {
  children: React.ReactNode;
  id: string;
  onChange?: (id: string) => void;
  size?: number;
  isChecked: boolean;
};

Select.Option = ({
  children,
  id,
  onChange,
  isChecked,
  size = 16,
}: OptionPropsType) => {
  return (
    <div className="select__option relative flex items-center gap-[6px]">
      <div
        className={twMerge(
          "select__option-checkbox group relative block flex-shrink-0 cursor-pointer overflow-hidden rounded-[2px] border border-solid border-green-300 duration-300",
          isChecked && "bg-green-300",
        )}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <input
          type="checkbox"
          id={id}
          onChange={() => {
            onChange && onChange(id);
          }}
          className="absolute left-0 top-0 z-50 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className={twMerge(
            "select__option-checkbox absolute left-0 top-0 h-full w-full cursor-pointer group-hover:border-green-200",
            isChecked && "border-green-200",
          )}
        >
          <Check
            className={twMerge(
              "select__option-checkbox-icon relative h-full w-full scale-0 text-white duration-300",
              isChecked && "scale-100",
            )}
          />
        </div>
      </div>
      <label
        className="select__option-label font-roboto-regulars mt-[2px] cursor-pointer"
        htmlFor={id}
      >
        {children}
      </label>
    </div>
  );
};

export default Select;
