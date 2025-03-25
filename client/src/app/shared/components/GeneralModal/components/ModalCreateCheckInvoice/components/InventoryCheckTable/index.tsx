import { inventoryCheckColumns } from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice/components/InventoryCheckTable/columns/inventoryCheckColumn";
import { Table, TableProps } from "antd";
import React from "react";
import { useIntl } from "react-intl";

type Props = {
  data?: any[];
  loading?: boolean;
} & TableProps<any>;

const InventoryCheckTable = ({ data = [], loading, ...props }: Props) => {
  const intl = useIntl();
  const newInventoryCheckColumns = inventoryCheckColumns(intl);
  return (
    <Table
      dataSource={data}
      columns={newInventoryCheckColumns}
      rowKey={(record) => record.id}
      pagination={false}
      rowClassName={"bg-slate-100"}
      loading={loading}
      className="w-full"
      {...props}
    />
  );
};

export default InventoryCheckTable;
