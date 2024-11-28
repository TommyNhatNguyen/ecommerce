import Button from "@/app/shared/components/Button";
import clsx from "clsx";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import React, { useState } from "react";

type AccordionPropsType = {
  children: React.ReactNode;
  classes?: string;
};

const Accordion = ({ children, classes }: AccordionPropsType) => {
  return (
    <ul className={clsx("accordion", "flex flex-col gap-gutter", classes)}>
      {children}
    </ul>
  );
};

type AccordionItemPropsType = {
  children: React.ReactNode;
  classes?: string;
  title: string;
  id: string;
} & React.LiHTMLAttributes<HTMLLIElement>;

Accordion.Item = ({
  title,
  children,
  classes,
  id,
  ...props
}: AccordionItemPropsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const _onToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <li
      className={clsx(
        "accordion-item",
        "w-full cursor-pointer rounded-[4px] border border-solid border-green-300 p-[24px]",
        classes,
      )}
      onClick={_onToggleOpen}
      {...props}
    >
      <Button
        className={clsx(
          "accordion-item__title",
          "flex h-full w-full items-center justify-between gap-gutter",
        )}
      >
        <h2 className="accordion-item__title-text text-body-big">{title}</h2>
        <ChevronDownIcon
          className={clsx("accordion-item__title-icon", isOpen && "rotate-180")}
          width={16}
          height={16}
        />
      </Button>
      <p
        className={clsx(
          "accordion-item__content h-full",
          isOpen ? "mt-[16px] max-h-full" : "max-h-0 overflow-hidden",
        )}
      >
        {children}
      </p>
    </li>
  );
};

export default Accordion;
