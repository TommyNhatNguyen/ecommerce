import SelectStatusAdmin from "@/app/shared/components/SelectStatusAdmin";
import { InventoryModel } from "@/app/shared/models/inventories/inventories.model";
import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { WarehouseModel } from "@/app/shared/models/warehouse/warehouse.model";
import { formatCurrency } from "@/app/shared/utils/utils";
import { formatNumber } from "@/app/shared/utils/utils";
import { Button, TableProps, Tag, Tooltip } from "antd";
import { Trash2 } from "lucide-react";
import { IntlShape } from "react-intl";

export const warehouseColumns: (
  intl: IntlShape,
  handleChangeStatus: (id: string, status: ModelStatus) => void,
  handleDelete: (id: string) => void,
) => TableProps<WarehouseModel>["columns"] = (
  intl,
  handleChangeStatus,
  handleDelete,
) => [
  {
    key: "name",
    title: intl.formatMessage({ id: "name" }),
    dataIndex: "name",
  },
  {
    key: "address",
    title: intl.formatMessage({ id: "address" }),
    dataIndex: "address",
  },
  {
    key: "total_quantity",
    title: intl.formatMessage({ id: "total_quantity_in_warehouse" }),
    dataIndex: "total_quantity",
    render: (_, { total_quantity }) => {
      return <span>{formatNumber(total_quantity)}</span>;
    },
  },
  {
    key: "total_cost",
    title: intl.formatMessage({ id: "total_cost_in_warehouse" }),
    dataIndex: "total_cost",
    render: (_, { total_cost }) => {
      return <span>{formatCurrency(total_cost)}</span>;
    },
  },
  {
    key: "description",
    title: intl.formatMessage({ id: "description" }),
    dataIndex: "description",
    render: (_, { description }) => {
      return <div dangerouslySetInnerHTML={{ __html: description }}></div>;
    },
  },
  // {
  //   key: "count_by_stock_status",
  //   title: intl.formatMessage({ id: "count_by_stock_status" }),
  //   dataIndex: "count_by_stock_status",
  //   render: (_, { inventory, total_quantity }) => {
  //     const isEmptyWarehouse = total_quantity === 0;
  //     const renderCountByStockStatus: Record<StockStatus, number> = {
  //       OUT_OF_STOCK: 0,
  //       LOW_STOCK: 0,
  //       IN_STOCK: 0,
  //       OVER_STOCK: 0,
  //     };
  //     inventory.forEach((item) => {
  //       const { stock_status } = item;
  //       if (renderCountByStockStatus[stock_status ?? "OUT_OF_STOCK"]) {
  //         renderCountByStockStatus[stock_status ?? "OUT_OF_STOCK"]++;
  //       } else {
  //         renderCountByStockStatus[stock_status ?? "OUT_OF_STOCK"] = 1;
  //       }
  //     });
  //     const stock_status_color: Record<StockStatus, string> = {
  //       LOW_STOCK: "orange",
  //       OVER_STOCK: "blue",
  //       IN_STOCK: "green",
  //       OUT_OF_STOCK: "red",
  //     };
  //     const stock_status_text: Record<StockStatus, string> = {
  //       LOW_STOCK: intl.formatMessage({ id: "low_stock" }),
  //       OVER_STOCK: intl.formatMessage({ id: "over_stock" }),
  //       IN_STOCK: intl.formatMessage({ id: "in_stock" }),
  //       OUT_OF_STOCK: intl.formatMessage({ id: "out_of_stock" }),
  //     };
  //     return (
  //       <div className="flex flex-col gap-1">
  //         {isEmptyWarehouse ? (
  //           <Tag color="default">
  //             {intl.formatMessage({ id: "empty_warehouse" })}
  //           </Tag>
  //         ) : (
  //           <>
  //             {Object.entries(renderCountByStockStatus).map(
  //               ([stock_status, count]) => (
  //                 count > 0 && (
  //                   <div key={stock_status} className="w-full">
  //                     <Tag
  //                       className="w-full"
  //                       color={stock_status_color[stock_status as StockStatus]}
  //                     >
  //                       {count} {stock_status_text[stock_status as StockStatus]}
  //                     </Tag>
  //                   </div>
  //                 )
  //               ),
  //             )}
  //           </>
  //         )}
  //       </div>
  //     );
  //   },
  // },
  {
    key: "status",
    title: () => intl.formatMessage({ id: "status" }),
    dataIndex: "status",
    render: (_, { status, id }) => {
      return (
        <SelectStatusAdmin
          handleChangeStatus={handleChangeStatus}
          status={status}
          id={id}
          customLabel={{
            active: "active",
            inactive: "inactive",
          }}
        />
      );
    },
  },
  {
    key: "created_at",
    title: intl.formatMessage({ id: "created_at" }),
    dataIndex: "created_at",
  },
  {
    key: "updated_at",
    title: intl.formatMessage({ id: "updated_at" }),
    dataIndex: "updated_at",
  },
  {
    key: "action",
    title: intl.formatMessage({ id: "actions" }),
    dataIndex: "action",
    render: (_, { id }) => {
      return (
        <Button
          type="link"
          variant="link"
          color="danger"
          icon={<Trash2 width={16} height={16} />}
          onClick={() => handleDelete(id)}
        >
          {intl.formatMessage({ id: "delete" })}
        </Button>
      );
    },
  },
];

export const inventoryWarehouseColumns: (
  intl: IntlShape,
) => TableProps<InventoryModel>["columns"] = (intl: IntlShape) => [
  {
    key: "sku",
    title: intl.formatMessage({ id: "sku" }),
    dataIndex: "sku",
    render: (_, { product_sellable }) => {
      const { sku } = product_sellable.variant || {};
      return <span>{sku}</span>;
    },
  },
  {
    key: "name",
    title: intl.formatMessage({ id: "name" }),
    dataIndex: "name",
    render: (_, { product_sellable }) => {
      const { name } = product_sellable.variant || {};
      return <span>{name}</span>;
    },
  },
  {
    key: "quantity",
    title: intl.formatMessage({ id: "quantity" }),
    dataIndex: "quantity",
    render: (_, { inventory_warehouse, total_quantity }) => {
      const { quantity } = inventory_warehouse;
      const percentage = (quantity / total_quantity) * 100;
      return (
        <Tooltip
          title={intl.formatMessage(
            { id: "account_for_percentage_of_total_quantity_all_warehouse" },
            { percentage: percentage.toFixed(1) },
          )}
        >
          {formatNumber(quantity)}
        </Tooltip>
      );
    },
  },
  {
    key: "cost",
    title: intl.formatMessage({ id: "cost" }),
    dataIndex: "cost",
    render: (_, { inventory_warehouse, total_cost }) => {
      const { cost } = inventory_warehouse;
      return formatCurrency(cost);
    },
  },
  {
    key: "total_cost",
    title: intl.formatMessage({ id: "total_cost" }),
    dataIndex: "total_cost",
    render: (_, { inventory_warehouse, total_cost: inventory_total_cost }) => {
      const { total_cost } = inventory_warehouse;
      const percentage = (total_cost / inventory_total_cost) * 100;
      return (
        <Tooltip
          title={intl.formatMessage(
            { id: "account_for_percentage_of_total_cost_all_warehouse" },
            {
              percentage: percentage.toFixed(1),
            },
          )}
        >
          {formatCurrency(total_cost)}
        </Tooltip>
      );
    },
  },
  {
    key: "overall_stock_status",
    title: () => intl.formatMessage({ id: "overall_stock_status" }),
    dataIndex: "overall_stock_status",
    render: (
      _,
      { stock_status, high_stock_threshold, low_stock_threshold },
    ) => {
      const stock_status_color: Record<StockStatus, string> = {
        LOW_STOCK: "orange",
        OVER_STOCK: "blue",
        IN_STOCK: "green",
        OUT_OF_STOCK: "red",
      };
      const stock_status_text: Record<StockStatus, string> = {
        LOW_STOCK: intl.formatMessage({ id: "low_stock" }),
        OVER_STOCK: intl.formatMessage({ id: "over_stock" }),
        IN_STOCK: intl.formatMessage({ id: "in_stock" }),
        OUT_OF_STOCK: intl.formatMessage({ id: "out_of_stock" }),
      };
      return (
        <Tooltip
          title={
            <div>
              <p>
                {intl.formatMessage({ id: "high_stock_threshold" })}:{" "}
                {formatNumber(high_stock_threshold ?? 0)}
              </p>
              <p>
                {intl.formatMessage({ id: "low_stock_threshold" })}:{" "}
                {formatNumber(low_stock_threshold ?? 0)}
              </p>
            </div>
          }
        >
          <Tag color={stock_status_color[stock_status ?? "OUT_OF_STOCK"]}>
            {stock_status_text[stock_status ?? "OUT_OF_STOCK"]}
          </Tag>
        </Tooltip>
      );
    },
  },
  {
    key: "status",
    title: () => intl.formatMessage({ id: "status" }),
    dataIndex: "status",
    render: (_, { status }) => {
      return (
        <div>
          {status === "ACTIVE" ? (
            <Tag color="green">{intl.formatMessage({ id: "is_selling" })}</Tag>
          ) : (
            <Tag color="red">
              {intl.formatMessage({ id: "is_discountinued" })}
            </Tag>
          )}
        </div>
      );
    },
  },
  {
    key: "created_at",
    title: intl.formatMessage({ id: "created_at" }),
    dataIndex: "created_at",
  },
  {
    key: "updated_at",
    title: intl.formatMessage({ id: "updated_at" }),
    dataIndex: "updated_at",
  },
];
