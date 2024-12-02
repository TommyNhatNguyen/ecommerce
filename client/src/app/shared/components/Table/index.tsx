import clsx from "clsx";
import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type TablePropsType = {
  children: ReactNode;
};

type TableHeadPropsType = {
  children: ReactNode;
};

type TableBodyPropsType = {
  children: ReactNode;
};

type TableFooterPropsType = {
  children: ReactNode;
  classes?: string;
};

type TableRowPropsType = {
  type: "header" | "data";
  children: ReactNode;
  classes?: string;
};

type TableCellPropsType = {
  children?: ReactNode;
  classes?: string;
  data?: string | number;
  type?: "cell" | "header";
  colSpan?: number;
} & React.HTMLAttributes<HTMLTableCellElement>;

const Table = ({ children }: TablePropsType) => {
  return (
    <table className="h-full w-full border-collapse bg-white">{children}</table>
  );
};

Table.Head = ({ children }: TableHeadPropsType) => {
  return (
    <thead className="overflow-hidden rounded-[10px] border border-solid border-green-100">
      {children}
    </thead>
  );
};

Table.Body = ({ children }: TableBodyPropsType) => {
  return <tbody className="rounded-[10px] overflow-hidden">{children}</tbody>;
};

Table.Footer = ({ children, classes }: TableFooterPropsType) => {
  return (
    <tfoot className={twMerge("border border-solid border-green-300", classes)}>
      {children}
    </tfoot>
  );
};

Table.Row = ({ type = "header", children, classes }: TableRowPropsType) => {
  let variant = "header";
  switch (type) {
    case "header":
      variant = "h-[78px] bg-green-100 text-bg-primary";
      break;

    default:
      variant = "border border-solid border-gray-100";
      break;
  }
  return <tr className={twMerge(variant, classes)}>{children}</tr>;
};

Table.Cell = ({
  data,
  children,
  classes,
  type = "cell",
  ...props
}: TableCellPropsType) => {
  switch (type) {
    case "header":
      return (
        <th
          className={twMerge(
            "content-center p-[16px] text-center font-roboto-medium text-bg-primary",
            classes,
          )}
          {...props}
        >
          <span className="text-body-big">{data}</span>
          {children}
        </th>
      );
    default:
      return (
        <td
          className={twMerge(
            "content-center p-[16px] text-center",
            typeof data === "number" ? "text-right" : "text-center",
            classes,
          )}
          {...props}
        >
          <span>{data}</span>
          {children}
        </td>
      );
  }
};

export default Table;
