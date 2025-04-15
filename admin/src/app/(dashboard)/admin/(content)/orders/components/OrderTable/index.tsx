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
import { orderColumns } from "@/app/(dashboard)/admin/(content)/orders/components/OrderTable/components/columns";
import { useIntl } from "react-intl";

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
  const intl = useIntl();
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(10);
  const [isOpenCreateOrderModal, setIsOpenCreateOrderModal] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderModel | null>(null);
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
  /** 
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
  */
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
          loading={isLoading}
          tableLayout="auto"
          columns={orderColumns(intl)}
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
              return (
                <OrderExpandDetail
                  dataSource={productData}
                  user_name={`${ordersData?.[0].order_detail.customer_firstName} ${ordersData?.[0].order_detail.customer_lastName}`}
                  orderData={activeOrder}
                />
              );
            },
            onExpand(expanded, record) {
              const expandOrder =
                ordersData?.find((item) => item.id == record.id) || null;
              setActiveOrder(expandOrder);
            },
          }}
          scroll={{ x: "100vw" }}
          rowKey={(record) => record.id}
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
