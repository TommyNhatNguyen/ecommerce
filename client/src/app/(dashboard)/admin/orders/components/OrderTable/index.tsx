"use client";
import useOrder from "@/app/(dashboard)/admin/orders/hooks/useOrder";
import { ORDER_STATE, ORDER_STATE_COLOR } from "@/app/constants/order-state";
import { statusOptions } from "@/app/constants/seeds";
import ActionGroup from "@/app/shared/components/ActionGroup";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { ImageModel } from "@/app/shared/models/images/images.model";
import { OrderState } from "@/app/shared/models/orders/orders.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { orderService } from "@/app/shared/services/orders/orderService";
import {
  formatCurrency,
  formatDiscountPercentage,
  formatNumber,
} from "@/app/shared/utils/utils";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Carousel,
  Image,
  Select,
  Table,
  TableColumnType,
  TableProps,
  Tooltip,
} from "antd";
import { Trash2Icon } from "lucide-react";
import { formatDate } from "date-fns";
import React, { useState } from "react";
import OrderDetailModal from "@/app/shared/components/GeneralModal/components/OrderDetailModal";

type OrderTablePropsType = {
  handleChangeOrderState: (order_id: string, order_state: OrderState) => void;
  isUpdateOrderStateLoading: boolean;
  handleChangeOrderStatus: (
    order_id: string,
    order_status: ModelStatus,
  ) => void;
  isUpdateOrderStatusLoading: boolean;
  selectedRows: OrderTableDataType[];
  handleSelectAllRow: (
    selected: boolean,
    selectedRows: OrderTableDataType[],
    changeRows: OrderTableDataType[],
  ) => void;
  handleSelectRow: (
    record: OrderTableDataType,
    selected: boolean,
    selectedRows: OrderTableDataType[],
  ) => void;
};
export type OrderTableDataType = {
  key: string;
  id: string;
  order_state: string;
  customer_name: string;
  shipping_address: string;
  shipping_phone: string;
  shipping_method: string;
  payment_method: string;
  total_price: number;
  total_discount: number;
  total_shipping_fee: number;
  total_payment_fee: number;
  total: number;
  created_at: string;
  status: string;
};
export type ProductTableDataType = {
  key: string;
  id: string;
  images: ImageModel[];
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  discount: number;
  total: number;
  discounts_list: DiscountModel[];
};
type OnChange = NonNullable<TableProps<OrderTableDataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
const OrderTable = ({
  handleChangeOrderState,
  isUpdateOrderStateLoading,
  handleChangeOrderStatus,
  isUpdateOrderStatusLoading,
  selectedRows,
  handleSelectAllRow,
  handleSelectRow,
}: OrderTablePropsType) => {
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(10);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [isModalOrderDetailOpen, setIsModalOrderDetailOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: ordersDataResponse, isLoading } = useQuery({
    queryKey: [
      "orders",
      orderPage,
      orderLimit,
      isUpdateOrderStateLoading,
      isUpdateOrderStatusLoading,
    ],
    queryFn: () =>
      orderService.getList({
        page: orderPage,
        limit: orderLimit,
      }),
  });
  const { meta, data: ordersData } = ordersDataResponse || {};
  const { total_count } = meta || {};
  const _onOpenModalOrderDetail = (id: string, isEditMode = false) => {
    setOrderId(id);
    setIsModalOrderDetailOpen(true);
    setIsEditMode(isEditMode);
  };
  const _onCloseModalOrderDetail = () => {
    setOrderId("");
    setIsModalOrderDetailOpen(false);
    setIsEditMode(false);
  };
  const _onConfirmOrderDetail = () => {
    // handleConfirmOrderDetail();
  };
  const _onChangeTable: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };
  const _onSelectRow = (
    record: OrderTableDataType,
    selected: boolean,
    selectedRows: OrderTableDataType[],
  ) => {
    handleSelectRow(record, selected, selectedRows);
  };
  const _onSelectAllRow = (
    selected: boolean,
    selectedRows: OrderTableDataType[],
    changeRows: OrderTableDataType[],
  ) => {
    handleSelectAllRow(selected, selectedRows, changeRows);
  };
  const _onChangeOrderState = (order_id: string, order_state: OrderState) => {
    handleChangeOrderState(order_id, order_state);
  };
  const _onChangeOrderStatus = (
    order_id: string,
    order_status: ModelStatus,
  ) => {
    handleChangeOrderStatus(order_id, order_status);
  };
  const orderDataSource = ordersData?.map((order) => ({
    key: order.id,
    id: order.id,
    order_state: order.order_state,
    customer_name: order.customer_name,
    shipping_address: order.shipping_address,
    shipping_phone: order.shipping_phone,
    shipping_method: order.shipping.type,
    payment_method: order.payment.type,
    total_price: order.total_price,
    total_discount: order.product.reduce(
      (acc, product) =>
        acc +
        ((product.discount?.reduce(
          (discountAcc, discount) =>
            discountAcc + (discount.discount_percentage || 0),
          0,
        ) || 0) /
          100) *
          product.order_detail.subtotal,
      0,
    ),
    total_shipping_fee: order.shipping.cost,
    total_payment_fee: order.payment.fee,
    total:
      order.total_price -
      order.product.reduce(
        (acc, product) =>
          acc +
          ((product.discount?.reduce(
            (discountAcc, discount) =>
              discountAcc + (discount.discount_percentage || 0),
            0,
          ) || 0) /
            100) *
            product.order_detail.subtotal,
        0,
      ) -
      order.shipping.cost -
      order.payment.fee,
    created_at: order.created_at,
    status: order.status,
  }));
  const productDataSource =
    ordersData?.flatMap((order) =>
      order.product.map((product) => ({
        key: product.id,
        order_id: order.id,
        id: product.id,
        images: product.image as ImageModel[],
        name: product.name,
        price: product.price,
        quantity: product.order_detail.quantity,
        subtotal: product.order_detail.subtotal,
        discount:
          (product.price *
            (product.discount?.reduce(
              (acc, discount) => acc + (discount.discount_percentage || 0),
              0,
            ) || 0)) /
          100,
        total:
          product.order_detail.subtotal -
          (product.price *
            (product.discount?.reduce(
              (acc, discount) => acc + (discount.discount_percentage || 0),
              0,
            ) || 0)) /
            100,
        discounts_list: product.discount as DiscountModel[],
      })),
    ) || [];
  const orderColumns: TableColumnType<OrderTableDataType>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_, { id }) => (
        <Tooltip title={id}>
          <Button
            type="link"
            className="overflow-hidden text-ellipsis"
            onClick={() => _onOpenModalOrderDetail(id)}
          >
            {id}
          </Button>
        </Tooltip>
      ),
      ellipsis: true,
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (_, { customer_name }) => (
        <Tooltip title={customer_name} className="text-ellipsis">
          {customer_name}
        </Tooltip>
      ),
    },
    {
      title: "Order State",
      dataIndex: "order_state",
      key: "order_state",
      className: "w-[200px]",
      render: (_, { order_state, id }) => {
        return (
          <Select
            options={Object.entries(ORDER_STATE).map(([key, value]) => ({
              label: value,
              value: key,
            }))}
            value={order_state}
            loading={isUpdateOrderStateLoading}
            disabled={false}
            onSelect={(value) => {
              _onChangeOrderState(id, value as OrderState);
            }}
            className="w-fit min-w-[100px]"
            labelRender={(option) => {
              const textColor = ORDER_STATE_COLOR[option.value];
              return (
                <div className={cn("font-semibold capitalize", `${textColor}`)}>
                  {option.label}
                </div>
              );
            }}
            dropdownRender={(menu) => {
              return (
                <div className="min-w-fit">
                  <div>{menu}</div>
                </div>
              );
            }}
          />
        );
      },
    },
    {
      title: "Shipping Address",
      dataIndex: "shipping_address",
      key: "shipping_address",
      render: (_, { shipping_address }) => (
        <Tooltip title={shipping_address}>
          <p className="overflow-hidden text-ellipsis">{shipping_address}</p>
        </Tooltip>
      ),
    },
    {
      title: "Shipping Phone",
      dataIndex: "shipping_phone",
      key: "shipping_phone",
    },
    {
      title: "Shipping Method",
      dataIndex: "shipping_method",
      key: "shipping_method",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      render: (_, { total_price }) => (
        <Tooltip title={formatCurrency(total_price)}>
          <span>{formatCurrency(total_price)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Total Discount",
      dataIndex: "total_discount",
      key: "total_discount",
      render: (_, { total_discount }) => (
        <Tooltip title={formatCurrency(total_discount)}>
          <span>{formatCurrency(total_discount)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Total Shipping Fee",
      dataIndex: "total_shipping_fee",
      key: "total_shipping_fee",
      render: (_, { total_shipping_fee }) => (
        <Tooltip title={formatCurrency(total_shipping_fee)}>
          <span>{formatCurrency(total_shipping_fee)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Total Payment Fee",
      dataIndex: "total_payment_fee",
      key: "total_payment_fee",
      render: (_, { total_payment_fee }) => (
        <Tooltip title={formatCurrency(total_payment_fee)}>
          <span>{formatCurrency(total_payment_fee)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      fixed: "right",
      render: (_, { total }) => (
        <Tooltip title={formatCurrency(total)}>
          <span>{formatCurrency(total)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      fixed: "right",
      render: (_, { created_at }) => (
        <Tooltip title={created_at}>
          <span>{formatDate(created_at, "dd/MM/yyyy HH:mm")}</span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      render: (_, { status, id }) => {
        return (
          <Select
            options={statusOptions}
            value={status}
            loading={isUpdateOrderStatusLoading}
            disabled={false}
            onSelect={(value) => {
              _onChangeOrderStatus(id, value as ModelStatus);
            }}
            className="min-w-[120px]"
            labelRender={(option) => {
              const textColor =
                option.value === "ACTIVE" ? "text-green-500" : "text-red-500";
              return (
                <div className={cn("font-semibold capitalize", `${textColor}`)}>
                  {option.label}
                </div>
              );
            }}
            dropdownRender={(menu) => {
              return (
                <div className="min-w-fit">
                  <div>{menu}</div>
                </div>
              );
            }}
          />
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      render: (_, { id }) => (
        <ActionGroup
          isWithDeleteConfirmPopover={false}
          deleteConfirmPopoverProps={{
            title: "Are you sure you want to delete this product?",
          }}
          handleDelete={() => {
            // _onSoftDeleteProduct(id);
          }}
          handleEdit={() => {
            _onOpenModalOrderDetail(id, true);
          }}
        />
      ),
    },
  ];
  const productColumns: TableColumnType<ProductTableDataType>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: null,
      dataIndex: "images",
      key: "images",
      className: "max-w-[200px] ",
      render: (_, { images }) => {
        const imagesList =
          images && images.length > 0
            ? images.map((image) => image.url)
            : [defaultImage];
        return (
          <Image.PreviewGroup
            items={imagesList}
            preview={{
              movable: false,
            }}
          >
            <Carousel autoplay dotPosition="bottom">
              {imagesList.map((item) => (
                <Image
                  key={item}
                  src={item}
                  alt="product"
                  width={150}
                  height={150}
                  fallback={defaultImage}
                  className="object-contain"
                />
              ))}
            </Carousel>
          </Image.PreviewGroup>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, { price }) => (
        <Tooltip title={formatCurrency(price)}>
          <span>{formatCurrency(price)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, { quantity }) => (
        <Tooltip title={formatNumber(quantity)}>
          <span>{formatNumber(quantity)}</span>
        </Tooltip>
      ),
      minWidth: 100,
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (_, { subtotal }) => (
        <Tooltip title={formatCurrency(subtotal)}>
          <span>{formatCurrency(subtotal)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (_, { discount, discounts_list }) => {
        const discountList = discounts_list || [];
        return (
          <Tooltip
            title={() => {
              return discountList.map((discount) => (
                <p key={discount.id}>
                  {discount.name} -{" "}
                  {formatDiscountPercentage(discount.discount_percentage)}
                </p>
              ));
            }}
          >
            <span>{formatCurrency(discount)}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, { total }) => (
        <Tooltip title={formatCurrency(total)}>
          <span>{formatCurrency(total)}</span>
        </Tooltip>
      ),
    },
  ];
  const orderExpandedRowRender = (dataScource: ProductTableDataType[]) => {
    return (
      <Table<ProductTableDataType>
        columns={productColumns}
        dataSource={dataScource}
        pagination={false}
        size="small"
        rowKey={(record) => record.id + Math.random()}
      />
    );
  };
  return (
    <div className="order-table rounded-lg bg-white p-4">
      <h2 className={cn("order-table__title", "text-lg font-semibold")}>
        Orders
      </h2>
      <div>
        <Table
          columns={orderColumns}
          dataSource={orderDataSource}
          rowClassName={"max-h-[100px] overflow-hidden"}
          expandable={{
            expandedRowRender: (record) => {
              const productData = productDataSource.filter(
                (item) => item.order_id === record.id,
              );
              return orderExpandedRowRender(productData);
            },
            expandRowByClick: true,
          }}
          onChange={_onChangeTable}
          scroll={{ x: "100vw" }}
          rowKey={(record) => record.id}
          rowSelection={{
            selectedRowKeys: selectedRows.map((item) => item.id),
            onSelect: (record, selected, selectedRows, nativeEvent) =>
              _onSelectRow(record, selected, selectedRows),
            onSelectAll: (selected, selectedRows, changeRows) =>
              _onSelectAllRow(selected, selectedRows, changeRows),
          }}
          pagination={{
            current: orderPage,
            pageSize: orderLimit,
            total: total_count,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 40, 50, Number(total_count)],
            onChange: (page, pageSize) => {
              setOrderPage(page);
              setOrderLimit(pageSize);
            },
          }}
        />
      </div>
      <OrderDetailModal
        isModalOrderDetailOpen={isModalOrderDetailOpen}
        handleCloseModalOrderDetail={_onCloseModalOrderDetail}
        handleConfirmOrderDetail={_onConfirmOrderDetail}
        isEditMode={isEditMode}
        orderId={orderId}
        productsData={productDataSource.filter(
          (item) => item.order_id === orderId,
        )}
        productsColumns={productColumns}
      />
    </div>
  );
};

export default OrderTable;
