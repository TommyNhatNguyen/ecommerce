import { ProductTableDataType } from "@/app/(dashboard)/admin/orders/components/OrderTable";
import { ORDER_STATE } from "@/app/constants/order-state";
import { statusOptions } from "@/app/constants/seeds";
import GeneralModal from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { orderService } from "@/app/shared/services/orders/orderService";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Divider,
  InputNumber,
  Select,
  Input,
  Table,
  TableColumnType,
} from "antd";
import dayjs from "dayjs";
import { Printer } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {
  isModalOrderDetailOpen: boolean;
  handleCloseModalOrderDetail: () => void;
  handleUpdateOrderDetail: (data: any) => void;
  isEditMode: boolean;
  orderId: string;
  productsData: ProductTableDataType[];
  productsColumns: TableColumnType<ProductTableDataType>[];
};

const OrderDetailModal = ({
  isModalOrderDetailOpen,
  handleCloseModalOrderDetail,
  handleUpdateOrderDetail,
  isEditMode = false,
  productsData,
  productsColumns,
  orderId,
}: Props) => {
  const { data: orderDetail, isLoading } = useQuery({
    queryKey: ["orderDetail", orderId],
    queryFn: () =>
      orderService.getOrderDetail(orderId, {
        includeCost: true,
        includeDiscount: true,
        includeProducts: true,
        includeOrderDetail: true,
        includePayment: true,
        includeShipping: true,
      }),
    enabled: !!orderId,
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      order_id: orderId,
      created_at: "",
      status: "",
      order_state: "",
      customer_name: "",
      shipping_address: "",
      shipping_phone: "",
      shipping_method: "",
      payment_method: "",
      description: "",
      subtotal: 0,
      total_shipping_fee: 0,
      total_payment_fee: 0,
      total_cost: 0,
      total_discount: 0,
      total: 0,
    },
  });
  useEffect(() => {
    if (orderDetail) {
      reset({
        order_id: orderId,
        created_at: orderDetail.created_at,
        status: orderDetail.status,
        order_state: orderDetail.order_state,
        customer_name: orderDetail.order_detail.customer_name,
        shipping_address: orderDetail.order_detail.customer_address,
        shipping_phone: orderDetail.order_detail.customer_phone,
        shipping_method: orderDetail.order_detail.shipping?.type,
        payment_method: orderDetail.order_detail.payment?.payment_method?.type,
        description: orderDetail.description || "",
        subtotal: orderDetail.order_detail?.subtotal,
        total_shipping_fee: orderDetail.order_detail.shipping?.cost,
        total_payment_fee:
          orderDetail.order_detail.payment?.payment_method?.cost,
        total_cost: orderDetail.order_detail.total_costs,
        total_discount: orderDetail.order_detail.total_discount,
        total: orderDetail.order_detail.total,
      });
    }
  }, [orderDetail]);
  const _onCloseModalOrderDetail = () => {
    handleCloseModalOrderDetail();
  };
  const _onConfirmUpdateOrderDetail = (data: any) => {
    console.log(data);
    handleUpdateOrderDetail(data);
  };
  const _renderTitleModalOrderDetail = () => {
    return (
      <h1 className="text-2xl font-bold">
        {isEditMode ? "Edit order detail" : "Order detail"}
      </h1>
    );
  };
  const _renderContentModalOrderDetail = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="order_id"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="Order id"
                placeholder="Order id"
                disabled={true}
                groupClassName="flex-1"
                error={errors.order_id?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="created_at"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="Created at"
                placeholder="Created at"
                disabled={true}
                error={errors.created_at?.message}
                customComponent={({ value, ...props }: any, ref: any) => (
                  <DatePicker value={dayjs(value)} {...props} ref={ref} />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="Status"
                placeholder="Status"
                error={errors.status?.message}
                customComponent={(props, ref: any) => {
                  return (
                    <Select {...props} ref={ref} options={statusOptions} />
                  );
                }}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2 pb-4">
          <Controller
            control={control}
            name="order_state"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="Order state"
                placeholder="Order state"
                disabled={!isEditMode}
                error={errors.order_state?.message}
                customComponent={(props, ref: any) => {
                  return (
                    <Select
                      {...props}
                      ref={ref}
                      options={Object.entries(ORDER_STATE).map(
                        ([key, value]) => ({
                          label: key,
                          value: value,
                        }),
                      )}
                    />
                  );
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="customer_name"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="Customer name"
                placeholder="Customer name"
                disabled={!isEditMode}
                error={errors.customer_name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="shipping_address"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="Shipping address"
                placeholder="Shipping address"
                disabled={!isEditMode}
                error={errors.shipping_address?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="shipping_phone"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="Shipping phone"
                placeholder="Shipping phone"
                disabled={!isEditMode}
                error={errors.shipping_phone?.message}
                customComponent={(props, ref: any) => {
                  return (
                    <InputNumber {...props} ref={ref} className="w-full" />
                  );
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="shipping_method"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="Shipping method"
                placeholder="Shipping method"
                disabled={!isEditMode}
                error={errors.shipping_method?.message}
                customComponent={(props, ref: any) => {
                  return <Select {...props} ref={ref} options={[]} />;
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="payment_method"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="Payment method"
                placeholder="Payment method"
                disabled={!isEditMode}
                error={errors.payment_method?.message}
                customComponent={(props, ref: any) => {
                  return <Select {...props} ref={ref} options={[]} />;
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="Description"
                placeholder="Description"
                disabled={!isEditMode}
                error={errors.description?.message}
                customComponent={({ value, ...props }: any, ref: any) => (
                  <Input.TextArea rows={4} value={value} {...props} ref={ref} />
                )}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Product List</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Table
                columns={productsColumns}
                dataSource={productsData}
                pagination={false}
                scroll={{ x: true, y: 300 }}
                rowKey={(record) => record.id + record.key + Math.random()}
                key={orderDetail?.id}
                className="w-fit"
                tableLayout="auto"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-dashed border-zinc-500/30 pt-4">
          <h3 className="text-lg font-bold">Order Total Value</h3>
          <Controller
            control={control}
            name="total"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="(1) Total price"
                placeholder="Total price"
                disabled={!isEditMode}
                customComponent={(props, ref: any) => {
                  return (
                    <InputNumber {...props} ref={ref} className="w-full" />
                  );
                }}
              />
            )}
          />
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="total_discount"
              render={({ field }) => (
                <InputAdmin
                  {...field}
                  label="(2.1) Total discount"
                  placeholder="Total discount"
                  disabled={!isEditMode}
                  customComponent={(props, ref: any) => {
                    return (
                      <InputNumber {...props} ref={ref} className="w-full" />
                    );
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="total_shipping_fee"
              render={({ field }) => (
                <InputAdmin
                  {...field}
                  label="(2.2) Total shipping fee"
                  placeholder="Total shipping fee"
                  disabled={!isEditMode}
                  customComponent={(props, ref: any) => {
                    return (
                      <InputNumber {...props} ref={ref} className="w-full" />
                    );
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="total_payment_fee"
              render={({ field }) => (
                <InputAdmin
                  {...field}
                  label="(2.3) Total payment fee"
                  placeholder="Total payment fee"
                  disabled={!isEditMode}
                  customComponent={(props, ref: any) => {
                    return (
                      <InputNumber {...props} ref={ref} className="w-full" />
                    );
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="total_cost"
              render={({ field }) => (
                <InputAdmin
                  {...field}
                  label="(2) Total cost = (2.1) + (2.2) + (2.3)"
                  placeholder="Total cost"
                  disabled={!isEditMode}
                  customComponent={(props, ref: any) => {
                    return (
                      <InputNumber {...props} ref={ref} className="w-full" />
                    );
                  }}
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="total"
            render={({ field }) => (
              <InputAdmin
                {...field}
                label="(3) Total = (1) - (2)"
                placeholder="Total"
                disabled={!isEditMode}
                customComponent={(props, ref: any) => {
                  return (
                    <InputNumber {...props} ref={ref} className="w-full" />
                  );
                }}
              />
            )}
          />
        </div>
      </div>
    );
  };
  const _renderFooterModalOrderDetail = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModalOrderDetail}>
          {isEditMode ? "Cancel" : "Close"}
        </Button>
        {isEditMode && (
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit(_onConfirmUpdateOrderDetail)}
          >
            Update
          </Button>
        )}
        <Button
          type="primary"
          htmlType="submit"
          // onClick={_onConfirmOrderDetail}
        >
          <Printer className="h-4 w-4" />
          <span>Print</span>
        </Button>
      </div>
    );
  };
  return (
    <GeneralModal
      className="w-[80%] min-w-[900px] max-w-[1000px]"
      renderTitle={_renderTitleModalOrderDetail}
      renderFooter={_renderFooterModalOrderDetail}
      renderContent={_renderContentModalOrderDetail}
      open={isModalOrderDetailOpen}
      onCancel={_onCloseModalOrderDetail}
    />
  );
};

export default OrderDetailModal;
