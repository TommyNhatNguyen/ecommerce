import { OrderUpdateDTO } from "@/app/shared/interfaces/orders/order.dto";
import { OrderModel } from "@/app/shared/models/orders/orders.model";
import { formatCurrency } from "@/app/shared/utils/utils";
import { Button, Tag } from "antd";
import { UseFormHandleSubmit } from "react-hook-form";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

type OrderSummaryPropType = {
  orderData: OrderModel | null;
  handleConfirmOrder: (data: OrderUpdateDTO) => void;
  handleSubmit: UseFormHandleSubmit<OrderUpdateDTO>;
};

const OrderSummary = ({
  orderData,
  handleConfirmOrder,
  handleSubmit,
}: OrderSummaryPropType) => {
  const { id, order_detail, description } = orderData || {};
  const customerName = useMemo(() => {
    return `${order_detail?.customer_firstName} ${order_detail?.customer_lastName}`;
  }, [orderData]);
  const {
    customer_phone,
    customer_address,
    customer_email,
    payment,
    shipping,
    order_product_sellable_histories,
    subtotal,
    total_discount,
    total_order_discount,
    total_costs,
    total_payment_fee,
    total_product_discount,
    total_shipping_fee,
    total,
  } = order_detail || {};
  const intl = useIntl();
  return (
    <div className="rounded-4 col-span-4 bg-custom-white p-4 shadow-md">
      <h2 className="mb-4 font-bold">
        {intl.formatMessage({ id: "order_detail" })}
      </h2>
      {/* Thông tin hoá đơn */}
      <div>
        {/* Mã đơn hàng */}
        <div className="flex items-start gap-2">
          <h3 className="text-nowrap font-semibold">Mã đơn hàng: </h3>
          <span>{id}</span>
        </div>
        {/* Thông tin khách hàng */}
        <div className="mt-2 border-t border-dashed border-neutral-500 pt-2">
          <div className="flex items-start gap-2">
            <h3 className="text-nowrap font-semibold">Tên khách hàng: </h3>
            <span>{customerName}</span>
          </div>
          <div className="flex items-start gap-2">
            <h3 className="text-nowrap font-semibold">Số điện thoại: </h3>
            <span>{customer_phone}</span>
          </div>
          <div className="flex items-start gap-2">
            <h3 className="text-nowrap font-semibold">Email: </h3>
            <span>{customer_email}</span>
          </div>
          <div className="flex items-start gap-2">
            <h3 className="text-nowrap font-semibold">Địa chỉ: </h3>
            <span>{customer_address}</span>
          </div>
        </div>
        <div className="mt-2 border-t border-dashed border-neutral-500 pt-2">
          <div className="flex items-start gap-2">
            <h3 className="text-nowrap font-semibold">Ghi chú đơn hàng: </h3>
            <p>{description}</p>
          </div>
        </div>
        <div className="mt-2 border-t border-dashed border-neutral-500 pt-2">
          <div className="flex items-start gap-2">
            <h3 className="text-nowrap font-semibold">
              Phương thức thanh toán:{" "}
            </h3>
            <span>{payment?.payment_method?.type || ""}</span>
          </div>
          <div className="flex items-start gap-2">
            <h3 className="text-nowrap font-semibold">
              Phương thức shipping:{" "}
            </h3>
            <span>{shipping?.type || ""}</span>
          </div>
        </div>
        <div className="mt-2 border-t border-dashed border-neutral-500 pt-2">
          <h3 className="mb-2 text-nowrap font-semibold">Danh sách sản phẩm</h3>
          {order_product_sellable_histories?.map((product) => {
            const {
              product_variant_name,
              quantity,
              price,
              subtotal,
              discount_amount,
              total,
              product_sellable_id,
            } = product || {};
            return (
              <div
                key={product_sellable_id}
                className="mb-2 flex items-start gap-2"
              >
                {/* Thông tin sản phẩm */}
                <div className="flex-1">
                  <p className="font-semibold">{product_variant_name}</p>
                  <p className="flex items-center gap-2">
                    Kho: <Tag>Hello</Tag>
                  </p>
                </div>
                {/* Tổng hợp giá trị sản phẩm */}
                <div className="flex-1 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-nowrap">
                      {quantity} x {formatCurrency(price || 0)} =
                    </span>
                    <span className="font-semibold text-neutral-800">
                      {" "}
                      {formatCurrency(subtotal || 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p>Discount: </p>
                    <span className="font-semibold text-red-500">
                      {formatCurrency(discount_amount || 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p>Total: </p>
                    <span className="font-semibold text-neutral-800">
                      {formatCurrency(total || 0)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 border-t border-dashed border-neutral-500 pt-2">
          <div className="flex items-start gap-2">
            <h3 className="text-nowrap font-semibold">Tổng tạm tính: </h3>
            <span className="font-medium">{formatCurrency(subtotal || 0)}</span>
          </div>
          <div className="flex items-start gap-2">
            <h3 className="text-nowrap font-semibold">Tổng giảm giá: </h3>
            <span className="font-medium text-red-500">
              {formatCurrency(total_discount || 0)}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <h3 className="text-nowrap font-semibold">
                Tổng chi phí khác (trong đó):
              </h3>
              <span className="font-medium">
                {formatCurrency(
                  (total_payment_fee || 0) +
                    (total_shipping_fee || 0) +
                    (total_costs || 0),
                )}
              </span>
            </div>
            <div className="pl-4">
              <div className="flex items-start gap-2">
                <h4 className="text-nowrap font-semibold">Chi phí ship: </h4>
                <span className="font-medium">
                  {formatCurrency(total_shipping_fee || 0)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <h4 className="text-nowrap font-semibold">
                  Chi phí thanh toán:{" "}
                </h4>
                <span className="font-medium">
                  {formatCurrency(total_payment_fee || 0)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <h4 className="text-nowrap font-semibold">Chi phí khác: </h4>
                <span className="font-medium">
                  {formatCurrency(total_costs || 0)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <h3 className="text-nowrap font-semibold">
                Tổng giảm giá (trong đó):{" "}
              </h3>
              <span className="font-medium text-red-500">
                {formatCurrency(total_discount || 0)}
              </span>
            </div>
            <div className="pl-4">
              <div className="flex items-start gap-2">
                <h4 className="text-nowrap font-semibold">
                  Tổng giảm giá sản phẩm:{" "}
                </h4>
                <span className="font-medium text-red-500">
                  {formatCurrency(total_product_discount || 0)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <h4 className="text-nowrap font-semibold">
                  Tổng giảm giá trên đơn hàng:{" "}
                </h4>
                <span className="font-medium text-red-500">
                  {formatCurrency(total_order_discount || 0)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-neutral-300 pt-4">
            <div className="flex items-start gap-2">
              <h3 className="text-nowrap font-semibold">
                Tổng giá trị đơn hàng:{" "}
              </h3>
              <span className="text-lg font-bold text-neutral-800">
                {formatCurrency(total || 0)}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <h3 className="text-nowrap font-semibold">
                Khách hàng đã thanh toán:{" "}
              </h3>
              <span className="font-medium text-green-600">
                {formatCurrency(payment?.paid_amount || 0)}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <h3 className="text-nowrap font-semibold">Số tiền còn lại: </h3>
              <span className="font-medium text-neutral-800">
                {formatCurrency((total || 0) - (payment?.paid_amount || 0))}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <h3 className="text-nowrap font-semibold">
                Ngày thanh toán toàn bộ:{" "}
              </h3>
              <span>{payment?.paid_all_date || 0}</span>
            </div>
          </div>
        </div>
      </div>
      {/*Trạng thái đơn hàng: Nhấn nút cập nhật để xác nhận đơn*/}
      <div className="mt-4 flex items-center justify-center border-t border-dashed border-neutral-500 pt-4">
        <Button
          type="primary"
          className="mx-auto w-full"
          onClick={handleSubmit(handleConfirmOrder)}
          disabled={orderData?.order_state !== "PENDING"}
        >
          {intl.formatMessage({ id: "confirm_order" })}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
