import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type NavbarPropsType = {
  children: React.ReactNode;
  classes?: string;
};

type NavbarItemPropsType = {
  children: React.ReactNode;
  classes?: string;
  link: string;
  dropDownList?: NavbarDropdownItemPropsType[];
};

type NavbarDropdownPropsType = {
  children: React.ReactNode;
  classes?: string;
  showDropDown: boolean;
};

type NavbarDropdownItemPropsType = {
  id?: string;
  children: React.ReactNode;
  classes?: string;
  link: string;
};

const Navbar = ({ children, classes }: NavbarPropsType) => {
  return (
    <div
      className={clsx(
        "navbar flex h-full items-center justify-between gap-gutter",
        classes,
      )}
    >
      {children}
    </div>
  );
};

Navbar.Item = ({
  children,
  classes,
  link,
  dropDownList,
}: NavbarItemPropsType) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const handleShowDropDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowDropDown(!showDropDown);
  };
  if (dropDownList) {
    return (
      <button
        className={clsx(
          "navbar__item flex h-full items-center justify-center font-playright-semibold text-navlink text-green-300",
          dropDownList && "relative flex items-end gap-1",
          classes,
        )}
        onClick={handleShowDropDown}
      >
        {children}
        {dropDownList && (
          <>
            <Navbar.Dropdown showDropDown={showDropDown}>
              {dropDownList.map((item, index) => (
                <Navbar.DropdownItem key={item?.id || index} link={item.link}>
                  {item.children}
                </Navbar.DropdownItem>
              ))}
            </Navbar.Dropdown>
            <ChevronDown
              className={clsx("duration-300", showDropDown && "rotate-180")}
            />
          </>
        )}
      </button>
    );
  }
  return (
    <Link
      href={link}
      className={clsx(
        "navbar__item flex h-full items-center justify-center font-playright-semibold text-navlink text-green-300",
        dropDownList && "relative flex items-end gap-1",
        classes,
      )}
    >
      {children}
    </Link>
  );
};

Navbar.Dropdown = ({
  children,
  classes,
  showDropDown,
}: NavbarDropdownPropsType) => {
  return (
    <div
      className={clsx(
        "navbar__dropdown",
        "absolute left-0 top-[var(--header-height)] flex flex-col gap-4 rounded-bl-lg rounded-br-lg bg-pink-200 p-4 duration-300",
        showDropDown
          ? "opacity-1 pointer-events-auto"
          : "pointer-events-none opacity-0",
        classes,
      )}
    >
      {children}
    </div>
  );
};

Navbar.DropdownItem = ({
  children,
  classes,
  link,
}: NavbarDropdownItemPropsType) => {
  return (
    <Link
      href={link}
      className={clsx(
        "navbar__dropdown-item",
        "whitespace-nowrap text-nowrap text-left font-roboto-medium",
        classes,
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;
