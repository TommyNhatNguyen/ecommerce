"use client";
import useOrder from "@/app/(dashboard)/admin/(content)/orders/hooks/useOrder";
import { ORDER_STATE, ORDER_STATE_COLOR } from "@/app/constants/order-state";
import { STATUS_OPTIONS } from "@/app/constants/seeds";
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
import { Plus } from "lucide-react";
import { formatDate } from "date-fns";
import React, { useState } from "react";
import OrderDetailModal from "@/app/shared/components/GeneralModal/components/OrderDetailModal";
import { DISCOUNT_TYPE } from "@/app/constants/enum";
import { CostModel } from "@/app/shared/models/cost/cost.model";
import { useAppSelector } from "@/app/shared/hooks/useRedux";
import { ListResponseModel } from "@/app/shared/models/others/list-response.model";
import CreateOrderDetailModal from "@/app/shared/components/GeneralModal/components/CreateOrderDetailModal";
import { OrderCreateDTO } from "@/app/shared/interfaces/orders/order.dto";
import { ProductSellableDetailsInOrderModel } from "@/app/shared/models/orders/orders.model";
import OrderExpandDetail from "@/app/(dashboard)/admin/(content)/orders/components/OrderTable/components/OrderExpandDetail";

type OrderTablePropsType = {
  handleChangeOrderState: (order_id: string, order_state: OrderState) => void;
  isUpdateOrderStateLoading: boolean;
  handleChangeOrderStatus: (
    order_id: string,
    order_status: ModelStatus,
  ) => void;
  isUpdateOrderStatusLoading: boolean;
  selectedRows: OrderModel[];
  handleSelectAllRow: (
    selected: boolean,
    selectedRows: OrderModel[],
    changeRows: OrderModel[],
  ) => void;
  handleSelectRow: (
    record: OrderModel,
    selected: boolean,
    selectedRows: OrderModel[],
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
type OnChange = NonNullable<TableProps<OrderModel>["onChange"]>;
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
            isCreateOrderLoading,
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
              includeInventory: true,
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
    record: OrderModel,
    selected: boolean,
    selectedRows: OrderModel[],
  ) => {
    handleSelectRow(record, selected, selectedRows);
  };
  const _onSelectAllRow = (
    selected: boolean,
    selectedRows: OrderModel[],
    changeRows: OrderModel[],
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
  const orderColumns: TableColumnType<OrderModel>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (_, { id }) => (
        <Tooltip title={id}>
          <Button
            type="link"
            className="overflow-hidden text-ellipsis break-all"
            onClick={() => _onOpenModalOrderDetail(id)}
          >
            {id.substring(0, 10)}
          </Button>
        </Tooltip>
      ),
      ellipsis: true,
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      render: (_, { order_detail }) => {
        const {
          customer_address,
          customer_email,
          customer_phone,
          customer_firstName,
          customer_lastName,
        } = order_detail || {};
        const customer_name = `${customer_firstName} ${customer_lastName}`;
        return (
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
        );
      },
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
      render: (_, { order_detail }) => {
        const { customer_address } = order_detail || {};
        return (
          <Tooltip title={customer_address}>
            <p className="overflow-hidden text-ellipsis">{customer_address}</p>
          </Tooltip>
        );
      },
    },
    {
      title: "Shipping Phone",
      dataIndex: "shipping_phone",
      key: "shipping_phone",
      render: (_, { order_detail }) => {
        const { customer_phone } = order_detail || {};
        return (
          <Tooltip title={customer_phone}>
            <p className="overflow-hidden text-ellipsis">{customer_phone}</p>
          </Tooltip>
        );
      },
    },
    {
      title: "Shipping",
      dataIndex: "shipping_method",
      key: "shipping_method",
      render: (_, { order_detail }) => {
        const { shipping } = order_detail || {};
        return (
          <Tooltip title={formatCurrency(shipping?.cost || 0)}>
            <p className="overflow-hidden text-ellipsis">{shipping?.type}</p>
          </Tooltip>
        );
      },
    },
    {
      title: "Payment",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (_, { order_detail }) => {
        const { payment } = order_detail || {};
        return (
          <Tooltip title={formatCurrency(payment?.payment_method?.cost || 0)}>
            <p className="overflow-hidden text-ellipsis">
              {payment?.payment_method?.type}
            </p>
          </Tooltip>
        );
      },
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (_, { order_detail }) => {
        const { subtotal } = order_detail || {};
        return <span>{formatCurrency(subtotal)}</span>;
      },
    },
    {
      title: "Total Product Discount",
      dataIndex: "total_product_discount",
      key: "total_product_discount",
      render: (_, { order_detail, id }) => {
        const { total_product_discount } = order_detail || {};
        return <span>{formatCurrency(total_product_discount)}</span>;
      },
    },
    {
      title: "Total Order Discount",
      dataIndex: "total_order_discount",
      key: "total_order_discount",
      render: (_, { order_detail }) => {
        const { total_order_discount, discount } = order_detail || {};
        return (
          <Tooltip
            title={
              <div className="flex flex-col gap-1">
                {discount?.map((item) => (
                  <span key={item.id}>
                    <span className="font-semibold capitalize">
                      {item.scope} -{" "}
                    </span>
                    {item.name} -{" "}
                    {item.is_fixed
                      ? formatCurrency(item.amount)
                      : formatDiscountPercentage(item.amount)}
                  </span>
                ))}
              </div>
            }
          >
            <span>{formatCurrency(total_order_discount)}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Total Discount",
      dataIndex: "total_discount",
      key: "total_discount",
      render: (_, { order_detail }) => {
        const { total_discount } = order_detail || {};
        return <span>{formatCurrency(total_discount)}</span>;
      },
    },
    {
      title: "Other costs",
      dataIndex: "total_costs",
      key: "total_costs",
      render: (_, { order_detail }) => {
        const { total_costs, cost } = order_detail || {};
        return (
          <Tooltip
            title={
              <div className="flex flex-col gap-1">
                {cost?.map((item) => (
                  <span key={item.id}>
                    {item.name}: {formatCurrency(item.cost)}
                  </span>
                ))}
              </div>
            }
          >
            <span>{formatCurrency(total_costs)}</span>
          </Tooltip>
        );
      },
    },

    {
      title: "Total Shipping Fee",
      dataIndex: "total_shipping_fee",
      key: "total_shipping_fee",
      render: (_, { order_detail }) => {
        const { total_shipping_fee } = order_detail || {};
        return (
          <Tooltip title={formatCurrency(total_shipping_fee)}>
            <span>{formatCurrency(total_shipping_fee)}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Total Payment Fee",
      dataIndex: "total_payment_fee",
      key: "total_payment_fee",
      render: (_, { order_detail }) => {
        const { total_payment_fee } = order_detail || {};
        return (
          <Tooltip title={formatCurrency(total_payment_fee)}>
            <span>{formatCurrency(total_payment_fee)}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, { order_detail }) => {
        const { total } = order_detail || {};
        return (
          <Tooltip title={formatCurrency(total)}>
            <span>{formatCurrency(total)}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Paid Amount",
      dataIndex: "paid_amount",
      key: "paid_amount",
      render: (_, { order_detail }) => {
        const { payment } = order_detail || {};
        return (
          <Tooltip title={formatCurrency(payment?.paid_amount || 0)}>
            <span>{formatCurrency(payment?.paid_amount || 0)}</span>
          </Tooltip>
        );
      },
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
            options={STATUS_OPTIONS}
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
          dataSource={ordersData}
          rowClassName={"max-h-[100px] overflow-hidden"}
          expandable={{
            expandedRowRender: (record) => {
              const productData = ordersData
                ? ordersData
                    .filter((order) => order.id === record.id)
                    .flatMap(
                      (item) =>
                        item.order_detail.order_product_sellable_histories ||
                        [],
                    )
                : [];
              return <OrderExpandDetail dataSource={productData} />;
            },
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
      {/* MODAL */}
      {/* TODO: Fix create order modal */}
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
