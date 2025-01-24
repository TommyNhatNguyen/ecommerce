"use client";
import useOrder from "@/app/(dashboard)/admin/orders/hooks/useOrder";
import { ORDER_STATE, ORDER_STATE_COLOR } from "@/app/constants/order-state";
import { statusOptions } from "@/app/constants/seeds";
import ActionGroup from "@/app/shared/components/ActionGroup";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { ImageModel } from "@/app/shared/models/images/images.model";
import {
  OrderModel,
  OrderState,
} from "@/app/shared/models/orders/orders.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { orderService } from "@/app/shared/services/orders/orderService";
import {
  formatCurrency,
  formatDiscountPercentage,
  formatNumber,
} from "@/app/shared/utils/utils";
import { cn } from "@/lib/utils";
import {
  keepPreviousData,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
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
import { ChevronDown, Plus, Trash2Icon } from "lucide-react";
import { formatDate } from "date-fns";
import React, { useState } from "react";
import OrderDetailModal from "@/app/shared/components/GeneralModal/components/OrderDetailModal";
import { DISCOUNT_TYPE } from "@/app/constants/enum";
import { CostModel } from "@/app/shared/models/cost/cost.model";
import { useAppSelector } from "@/app/shared/hooks/useRedux";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import CreateOrderDetailModal from "@/app/shared/components/GeneralModal/components/CreateOrderDetailModal";
import { OrderCreateDTO } from "@/app/shared/interfaces/orders/order.dto";

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
  handleSoftDeleteOrder: (order_id: string) => void;
  isSoftDeleteOrderLoading: boolean;
  orderState: OrderState | null;
  customQuery?: UseQueryOptions<
    ListResponseModel<OrderModel>,
    Error,
    ListResponseModel<OrderModel>,
    QueryKey
  >;
  handleDeleteOrder: (order_id: string) => void;
  isDeleteOrderLoading: boolean;
  isDeleteOrderError: boolean;
  isPermanentDelete?: boolean;
  handleCreateOrder: (data: OrderCreateDTO) => void;
  isCreateOrderLoading: boolean;
  createOrderError: any;
};
export type OrderTableDataType = {
  key: string;
  id: string;
  order_state: string;
  description: string;
  cost: CostModel[];
  customer_firstName: string;
  customer_lastName: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  subtotal: number;
  total_shipping_fee: number;
  total_payment_fee: number;
  total_costs: number;
  total_discount: number;
  total_order_discount: number;
  total_product_discount: number;
  total: number;
  discount: DiscountModel[];
  product_discount: DiscountModel[];
  shipping: {
    type: string;
    cost: number;
  };
  payment: {
    type: string;
    cost: number;
  };
  payment_info: {
    paid_amount: number;
    paid_all_date: string | null;
  };
  created_at: string;
  status: string;
};
export type ProductTableDataType = {
  key: string;
  id: string;
  order_id: string;
  image: ImageModel[];
  name: string;
  discount: DiscountModel[];
  product_details: {
    quantity: number;
    price: number;
    subtotal: number;
    discount_amount: number;
    total: number;
  };
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
  handleSoftDeleteOrder,
  isSoftDeleteOrderLoading,
  orderState,
  customQuery,
  handleDeleteOrder,
  isDeleteOrderLoading,
  isDeleteOrderError,
  isPermanentDelete = false,
  handleCreateOrder,
  isCreateOrderLoading,
  createOrderError,
}: OrderTablePropsType) => {
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(10);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [isModalOrderDetailOpen, setIsModalOrderDetailOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const { orderCreated } = useAppSelector((state) => state.socket);
  const { data: ordersDataResponse, isLoading } = useQuery(
    customQuery
      ? {
          ...customQuery,
          queryKey: [
            ...customQuery.queryKey,
            isUpdateOrderStateLoading,
            isUpdateOrderStatusLoading,
            orderCreated,
            isSoftDeleteOrderLoading,
            isDeleteOrderLoading,
            orderPage,
            orderLimit,
            isCreateOrderLoading,
          ],
        }
      : {
          queryKey: [
            "orders",
            orderPage,
            orderLimit,
            isUpdateOrderStateLoading,
            isUpdateOrderStatusLoading,
            orderCreated,
            isSoftDeleteOrderLoading,
            isDeleteOrderLoading,
          ],
          queryFn: () =>
            orderService.getList({
              page: orderPage,
              limit: orderLimit,
              includeOrderDetail: true,
              includeDiscount: true,
              includeCost: true,
              includeProducts: true,
              includeShipping: true,
              includePayment: true,
              order_state: orderState ? orderState : undefined,
            }),
          placeholderData: keepPreviousData,
        },
  );
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
  const _onSoftDeleteOrder = (order_id: string) => {
    handleSoftDeleteOrder(order_id);
  };
  const _onDeleteOrder = (order_id: string) => {
    handleDeleteOrder(order_id);
  };
  const _onConfirmUpdateOrderDetail = (data: any) => {
    // handleConfirmOrderDetail();
    console.log(data);
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
  const orderDataSource: OrderTableDataType[] | undefined =
    ordersData?.map((order) => ({
      key: order.id,
      id: order.id || "",
      order_state: order.order_state || "",
      description: order.description || "",
      cost: order.order_detail.cost as CostModel[],
      customer_lastName: order.order_detail.customer_lastName || "",
      customer_firstName: order.order_detail.customer_firstName || "",
      customer_name:
        `${order.order_detail.customer_firstName} ${order.order_detail.customer_lastName}` ||
        "",
      customer_phone: order.order_detail.customer_phone || "",
      customer_email: order.order_detail.customer_email || "",
      customer_address: order.order_detail.customer_address || "",
      subtotal: order.order_detail.subtotal || 0,
      total_shipping_fee: order.order_detail.total_shipping_fee || 0,
      total_payment_fee: order.order_detail.total_payment_fee || 0,
      total_costs: order.order_detail.total_costs || 0,
      total_discount: order.order_detail.total_discount || 0,
      total_order_discount: order.order_detail.total_order_discount || 0,
      total_product_discount: order.order_detail.total_product_discount || 0,
      total: order.order_detail.total || 0,
      discount: order.order_detail.discount || [],
      product_discount:
        order.order_detail.product?.flatMap(
          (product) =>
            product.discount?.map((discount) => ({
              id: discount.id,
              name: discount.name,
              amount: discount.amount,
              type: discount.type,
              scope: discount.scope,
            })) as DiscountModel[],
        ) || [],
      shipping: {
        type: order.order_detail.shipping?.type || "",
        cost: order.order_detail.shipping?.cost || 0,
      },
      payment: {
        type: order.order_detail.payment?.payment_method?.type || "",
        cost: order.order_detail.payment?.payment_method?.cost || 0,
      },
      payment_info: {
        paid_amount: order.order_detail.payment?.paid_amount || 0,
        paid_all_date: order.order_detail.payment?.paid_all_date || "",
      },
      created_at: order.created_at,
      status: order.status,
    })) || [];
  const productDataSource: ProductTableDataType[] | undefined =
    ordersData?.flatMap(
      (order) =>
        order.order_detail.product?.map((product) => ({
          key: product.id,
          id: product.id || "",
          order_id: order.id || "",
          image: (product.image as ImageModel[]) || [],
          name: product.name || "",
          product_details: product.product_details || [],
          discount: product.discount as DiscountModel[],
        })) || [],
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
      render: (
        _,
        { customer_name, customer_address, customer_email, customer_phone },
      ) => (
        <Tooltip
          title={
            <div className="flex flex-col gap-1">
              <span>Address: {customer_address}</span>
              <span>Email: {customer_email}</span>
              <span>Phone: {customer_phone}</span>
            </div>
          }
          className="text-ellipsis"
        >
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
      render: (_, { customer_address }) => (
        <Tooltip title={customer_address}>
          <p className="overflow-hidden text-ellipsis">{customer_address}</p>
        </Tooltip>
      ),
    },
    {
      title: "Shipping Phone",
      dataIndex: "shipping_phone",
      key: "shipping_phone",
      render: (_, { customer_phone }) => (
        <Tooltip title={customer_phone}>
          <p className="overflow-hidden text-ellipsis">{customer_phone}</p>
        </Tooltip>
      ),
    },
    {
      title: "Shipping",
      dataIndex: "shipping_method",
      key: "shipping_method",
      render: (_, { shipping }) => (
        <Tooltip title={formatCurrency(shipping.cost)}>
          <p className="overflow-hidden text-ellipsis">{shipping.type}</p>
        </Tooltip>
      ),
    },
    {
      title: "Payment",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (_, { payment }) => (
        <Tooltip title={formatCurrency(payment.cost)}>
          <p className="overflow-hidden text-ellipsis">{payment.type}</p>
        </Tooltip>
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (_, { subtotal }) => <span>{formatCurrency(subtotal)}</span>,
    },
    {
      title: "Total Discount",
      dataIndex: "total_discount",
      key: "total_discount",
      render: (_, { total_discount, discount, product_discount }) => (
        <Tooltip
          title={
            <div className="flex flex-col gap-1">
              {discount.map((item) => (
                <span key={item.id}>
                  <span className="font-semibold capitalize">
                    {item.scope} -{" "}
                  </span>
                  {item.name} -{" "}
                  {item.type === DISCOUNT_TYPE.PERCENTAGE
                    ? formatDiscountPercentage(item.amount)
                    : formatCurrency(item.amount)}
                </span>
              ))}
              {product_discount.map((item) => (
                <span key={item.id}>
                  <span className="font-semibold capitalize">
                    {item.scope} -{" "}
                  </span>
                  {item.name} -{" "}
                  {item.type === DISCOUNT_TYPE.PERCENTAGE
                    ? formatDiscountPercentage(item.amount)
                    : formatCurrency(item.amount)}
                </span>
              ))}
            </div>
          }
        >
          <span>{formatCurrency(total_discount)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Other costs",
      dataIndex: "total_costs",
      key: "total_costs",
      render: (_, { total_costs, cost }) => (
        <Tooltip
          title={
            <div className="flex flex-col gap-1">
              {cost.map((item) => (
                <span key={item.id}>
                  {item.name}: {formatCurrency(item.cost)}
                </span>
              ))}
            </div>
          }
        >
          <span>{formatCurrency(total_costs)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Total Discount",
      dataIndex: "total_discount",
      key: "total_discount",
      render: (_, { total_discount, discount }) => (
        <Tooltip
          title={
            <div className="flex flex-col gap-1">
              {discount.map((item) => (
                <div key={item.id}>
                  <span className="font-semibold capitalize">
                    {item.scope} -{" "}
                  </span>
                  <span>
                    {item.name} -{" "}
                    {item.type === DISCOUNT_TYPE.PERCENTAGE
                      ? formatDiscountPercentage(item.amount)
                      : formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          }
        >
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
            title: "Are you sure you want to delete this order?",
          }}
          handleDelete={() => {
            isPermanentDelete ? _onDeleteOrder(id) : _onSoftDeleteOrder(id);
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
      className: "max-w-[200px] w-[200px]",
      render: (_, { image }) => {
        const imagesList =
          image && image.length > 0
            ? image.map((item) => item.url)
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
      render: (_, { product_details }) => (
        <Tooltip title={formatCurrency(product_details.price)}>
          <span>{formatCurrency(product_details.price)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, { product_details }) => (
        <Tooltip title={formatNumber(product_details.quantity)}>
          <span>{formatNumber(product_details.quantity)}</span>
        </Tooltip>
      ),
      minWidth: 100,
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (_, { product_details }) => (
        <Tooltip title={formatCurrency(product_details.subtotal)}>
          <span>{formatCurrency(product_details.subtotal)}</span>
        </Tooltip>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (_, { product_details, discount }) => {
        return (
          <Tooltip
            title={() => {
              return discount.map((item) => (
                <p key={item.id}>
                  {item.name} -{" "}
                  {item.type === DISCOUNT_TYPE.PERCENTAGE
                    ? formatDiscountPercentage(item.amount)
                    : formatCurrency(item.amount)}
                </p>
              ));
            }}
          >
            <span>{formatCurrency(product_details.discount_amount)}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, { product_details }) => (
        <Tooltip title={formatCurrency(product_details.total)}>
          <span>{formatCurrency(product_details.total)}</span>
        </Tooltip>
      ),
    },
  ];
  const orderExpandedRowRender = (dataScource: ProductTableDataType[]) => {
    return (
      <Table<ProductTableDataType>
        tableLayout="auto"
        columns={productColumns}
        dataSource={dataScource}
        pagination={false}
        size="small"
        rowKey={(record) => record.id}
      />
    );
  };
  const [isOpenCreateOrderModal, setIsOpenCreateOrderModal] = useState(false);
  const _onOpenCreateOrderModal = () => {
    setIsOpenCreateOrderModal(true);
  };
  const _onCloseCreateOrderModal = () => {
    setIsOpenCreateOrderModal(false);
  };
  const _onCreateOrder = (data: any, resetDataCallback: () => void) => {
    handleCreateOrder(data);
    _onCloseCreateOrderModal();
    resetDataCallback();
  };
  return (
    <div className="order-table rounded-lg bg-white p-4">
      <div className="flex items-center gap-4">
        <h2 className={cn("order-table__title", "text-lg font-semibold")}>
          Orders
        </h2>
        <Button onClick={_onOpenCreateOrderModal} type="primary">
          <Plus className="h-4 w-4" />
          Add new order
        </Button>
      </div>
      <div className="mt-4">
        <Table
          tableLayout="auto"
          columns={orderColumns}
          dataSource={orderDataSource}
          rowClassName={"max-h-[100px] overflow-hidden"}
          expandable={{
            expandedRowRender: (record) => {
              const productData = productDataSource?.filter(
                (item) => item.order_id === record.id,
              );
              return orderExpandedRowRender(productData);
            },
          }}
          onChange={_onChangeTable}
          scroll={{ x: "100vw" }}
          rowKey={(record) => record.key}
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
      {/* MODAL */}
      <OrderDetailModal
        isModalOrderDetailOpen={isModalOrderDetailOpen}
        handleCloseModalOrderDetail={_onCloseModalOrderDetail}
        handleUpdateOrderDetail={_onConfirmUpdateOrderDetail}
        isEditMode={isEditMode}
        orderId={orderId}
        productsData={productDataSource?.filter(
          (item) => item.order_id === orderId,
        )}
        productsColumns={productColumns}
      />
      <CreateOrderDetailModal
        isOpen={isOpenCreateOrderModal}
        handleCloseCreateOrderModal={_onCloseCreateOrderModal}
        handleCreateOrder={_onCreateOrder}
        loading={isCreateOrderLoading}
      />
    </div>
  );
};

export default OrderTable;
