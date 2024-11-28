import Button from "@/app/shared/components/Button";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

type DropdownPropsType = {
  children: React.ReactNode;
  classes?: string;
  title?: string | React.ReactNode;
};

const Dropdown = ({ title, children, classes }: DropdownPropsType) => {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const _onHandleDropdown = () => {
    setIsShowDropdown(!isShowDropdown);
  };
  return (
    <div className={clsx("dropdown w-full", classes)}>
      <Button
        classes="dropdown__title btn flex w-full items-center justify-between gap-gutter font-roboto-medium text-body-big"
        onClick={_onHandleDropdown}
      >
        <div className="dropdown__title-text">{title}</div>
        <ChevronDownIcon
          className={clsx("dropdown__icon", isShowDropdown && "rotate-180")}
        />
      </Button>
      <ul className={clsx("dropdown", !isShowDropdown && "hidden")}>
        {children}
      </ul>
    </div>
  );
};

type DropdownItemPropsType = {
  children: React.ReactNode;
  classes?: string;
};

Dropdown.Item = ({ children, classes }: DropdownItemPropsType) => {
  return <li className={clsx("dropdown__item", classes)}>{children}</li>;
};

export default Dropdown;
