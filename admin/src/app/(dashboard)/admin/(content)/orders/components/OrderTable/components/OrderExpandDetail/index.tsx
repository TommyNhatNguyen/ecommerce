import { orderExpandDetailColumns } from "@/app/(dashboard)/admin/(content)/orders/components/OrderTable/components/OrderExpandDetail/columns";
import OrderSummary from "@/app/(dashboard)/admin/(content)/orders/components/OrderTable/components/OrderExpandDetail/OrderSummary";
import { ProductSellableDetailsInOrderModel } from "@/app/shared/models/orders/orders.model";
import { Table } from "antd";
import React from "react";
import { useIntl } from "react-intl";

type Props = {
  dataSource: ProductSellableDetailsInOrderModel[];
};

const OrderExpandDetail = ({ dataSource, ...props }: Props) => {
  console.log("🚀 ~ OrderExpandDetail ~ dataSource:", dataSource);
  const intl = useIntl();
  const newColumns = orderExpandDetailColumns(intl);
  return (
    <div className="grid min-h-[792px] grid-cols-12 gap-4">
      {/* Order product table */}
      <Table<ProductSellableDetailsInOrderModel>
        tableLayout="auto"
        columns={newColumns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        className="rounded-4 col-span-8 h-full w-full bg-custom-white p-4 shadow-md"
        rowKey={(record) =>
          `${record?.product_sellable?.id}-${record?.product_variant_name}`
        }
        scroll={{
          x: "100%",
        }}
        {...props}
      />
      {/* Order Summary */}
      <OrderSummary />
    </div>
  );
};

export default OrderExpandDetail;
