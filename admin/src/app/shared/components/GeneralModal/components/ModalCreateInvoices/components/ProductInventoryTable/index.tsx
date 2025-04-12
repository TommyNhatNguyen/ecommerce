import { productInventoryColumns } from "@/app/shared/components/GeneralModal/components/ModalCreateInvoices/components/ProductInventoryTable/columns/productInventoryColumns";
import { WarehouseModel } from "@/app/shared/models/warehouse/warehouse.model";
import { Table, TableProps } from "antd";
import React from "react";
import { useIntl } from "react-intl";

type Props = {
  data: WarehouseModel[];
  loading?: boolean;
} & TableProps<WarehouseModel>;

const ProductInventoryTable = ({ data, loading, ...props }: Props) => {
  console.log("🚀 ~ ProductInventoryTable ~ data:", data)
  const intl = useIntl();
  const newBrandsColumn = productInventoryColumns(intl);
  return (
    <Table
      dataSource={data}
      columns={newBrandsColumn}
      rowKey={(record) => record.id}
      pagination={false}
      rowClassName={"bg-slate-100"}
      loading={loading}
      className="w-full"
      {...props}
    />
  );
};

export default ProductInventoryTable;
