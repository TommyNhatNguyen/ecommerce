import { productInventoryColumns } from "@/app/shared/components/GeneralModal/components/ModalCreateInvoices/components/ProductInventoryTable/columns/productInventoryColumns";
import { WarehouseModel } from "@/app/shared/models/warehouse/warehouse.model";
import { Table } from "antd";
import React from "react";
import { useIntl } from "react-intl";

type Props = {
  data: WarehouseModel[];
  loading?: boolean;
};

const ProductInventoryTable = ({ data, loading }: Props) => {
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
    />
  );
};

export default ProductInventoryTable;
