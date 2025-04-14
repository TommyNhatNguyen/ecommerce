import { OrderModel } from "@/app/shared/models/orders/orders.model";
import { Tag, Tooltip } from "antd";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

type OrderSummaryPropType = {
  orderData: OrderModel | null;
};

const OrderSummary = ({ orderData }: OrderSummaryPropType) => {
  console.log("🚀 ~ OrderSummary ~ orderData:", orderData);
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
        <div>
          <h3>Mã đơn hàng: </h3>
          <span>{id}</span>
        </div>
        {/* Thông tin khách hàng */}
        <div>
          Tên khách hàng Số điện thoại Địa chỉ Email
          <div>
            <h3>Tên khách hàng: </h3>
            <span>{customerName}</span>
          </div>
          <div>
            <h3>Số điện thoại: </h3>
            <span>{customer_phone}</span>
          </div>
          <div>
            <h3>Email: </h3>
            <span>{customer_email}</span>
          </div>
          <div>
            <h3>Địa chỉ: </h3>
            <span>{customer_address}</span>
          </div>
        </div>
        <div>
          <h3>Ghi chú đơn hàng: </h3>
          <p>{description}</p>
        </div>
        <div>
          <div>
            <h3>Phương thức thanh toán: </h3>
            <span>{payment?.payment_method?.type || ""}</span>
          </div>
          <div>
            <h3>Phương thức shipping: </h3>
            <span>{shipping?.type || ""}</span>
          </div>
        </div>
        <div>
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
              <div key={product_sellable_id} className="flex items-start gap-2">
                {/* Thông tin sản phẩm */}
                <div>
                  <p>{product_variant_name}</p>
                  <p>
                    Kho: <Tag>Hello</Tag>
                  </p>
                </div>
                {/* Tổng hợp giá trị sản phẩm */}
                <div className="flex-1 flex-shrink-0">
                  <div>
                    <span>
                      {quantity} x {price} =
                    </span>
                    <span> {subtotal}</span>
                  </div>
                  <div>
                    <p>Discount: {discount_amount}</p>
                  </div>
                  <div>
                    <p>Total: {total}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <div>
            <h3>Tổng tạm tính: </h3>
            <span>{subtotal}</span>
          </div>
          <div>
            <h3>Tổng giảm giá: </h3>
            <span>{total_discount}</span>
          </div>
          <div>
            <h3>Tổng chi phí khác (trong đó):</h3>
            <span>
              {(total_payment_fee || 0) +
                (total_shipping_fee || 0) +
                (total_costs || 0)}
            </span>
            <div>
              <div>
                <h4>Chi phí ship: </h4>
                <span>{total_shipping_fee}</span>
              </div>
              <div>
                <h4>Chi phí thanh toán: </h4>
                <span>{total_payment_fee}</span>
              </div>
              <div>
                <h4>Chi phí khác: </h4>
                <span>{total_costs}</span>
              </div>
            </div>
          </div>
          <div>
            <div>
              <h3>Tổng giảm giá (trong đó): </h3>
              <span>{total_discount}</span>
            </div>
            <div>
              <div>
                <h4>Tổng giảm giá sản phẩm: </h4>
                <span>{total_product_discount}</span>
              </div>
              <div>
                <h4>Tổng giảm giá trên đơn hàng: </h4>
                <span>{total_order_discount}</span>
              </div>
            </div>
          </div>
          <div>
            <h3>Tổng giá trị đơn hàng: </h3>
            <span>{total}</span>
          </div>
          <div>
            <h3>Khách hàng đã thanh toán: </h3>
            <span>{payment?.paid_amount || 0}</span>
          </div>
          <div>
            <h3>Số tiền còn lại: </h3>
            <span>{(total || 0) - (payment?.paid_amount || 0)}</span>
          </div>
          <div>
            <h3>Ngày thanh toán toàn bộ: </h3>
            <span>{payment?.paid_all_date || 0}</span>
          </div>
          Tổng tạm tính Tổng giảm giá: giảm giá order, giảm giá sản phẩm Chi phí
          thanh toán Chi phí ship Chi phí khác Tổng đơn hàng cuối cùng Số tiền
          đã trả Ngày trả tiền hết
        </div>
      </div>
      {/*Trạng thái đơn hàng: Nhấn nút cập nhật để xác nhận đơn*/}
      <div></div>
    </div>
  );
};

export default OrderSummary;
