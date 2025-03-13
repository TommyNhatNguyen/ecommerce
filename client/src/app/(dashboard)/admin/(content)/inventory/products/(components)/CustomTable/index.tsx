import { Table } from "antd";
import React from "react";

type Props<T> = {
  children: React.ReactNode;
  data?: T[];
};

const CustomTable = <T,>({ children, data, ...props }: Props<T>) => {
  return (
    <div className="custom-table" {...props}>
      {children}
    </div>
  );
};

export default CustomTable;
