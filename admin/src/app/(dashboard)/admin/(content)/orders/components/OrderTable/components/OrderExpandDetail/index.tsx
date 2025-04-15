"use client";
import { useOrderDetail } from "@/app/(dashboard)/admin/(content)/orders/components/OrderTable/components/hooks/useOrderDetail";
import { orderExpandDetailColumns } from "@/app/(dashboard)/admin/(content)/orders/components/OrderTable/components/OrderExpandDetail/columns";
import OrderSummary from "@/app/(dashboard)/admin/(content)/orders/components/OrderTable/components/OrderExpandDetail/OrderSummary";
import { OrderUpdateDTO } from "@/app/shared/interfaces/orders/order.dto";
import {
  OrderModel,
  ProductSellableDetailsInOrderModel,
} from "@/app/shared/models/orders/orders.model";
import { Table } from "antd";
import React from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

type Props = {
  dataSource: ProductSellableDetailsInOrderModel[];
  orderData: OrderModel | null;
  user_name?: string;
};

const OrderExpandDetail = ({
  dataSource,
  orderData,
  user_name,
  ...props
}: Props) => {
  const { handleSubmit, control, setValue } = useForm<OrderUpdateDTO>({
    defaultValues: {
      order_detail_info: {
        products_detail: [],
      },
    },
  });
  const intl = useIntl();
  const newColumns = orderExpandDetailColumns(intl, setValue, control);
  const { isConfirmOrderLoading, handleConfirmOrder } = useOrderDetail();
  const _onConfirmOrder = (data: OrderUpdateDTO) => {
    handleConfirmOrder(orderData?.id || "", data);
  };
  return (
    <div className="grid min-h-[792px] grid-cols-12 gap-4">
      {/* Order product table */}
      <div className="rounded-4 col-span-8 h-full w-full bg-custom-white p-4 shadow-md">
        <h2 className="mb-4 font-bold">
          {intl.formatMessage(
            { id: "order_product_list" },
            {
              user_name: user_name,
              num: dataSource.length,
            },
          )}
        </h2>
        <Table<ProductSellableDetailsInOrderModel>
          loading={isConfirmOrderLoading}
          tableLayout="auto"
          columns={newColumns}
          dataSource={dataSource}
          pagination={false}
          size="small"
          className="h-full w-full"
          rowKey={(record) =>
            `${record?.product_sellable?.id}-${record?.product_variant_name}`
          }
          scroll={{
            x: "100%",
          }}
          {...props}
        />
      </div>
      {/* Order Summary */}
      <OrderSummary
        orderData={orderData}
        handleConfirmOrder={_onConfirmOrder}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default OrderExpandDetail;
