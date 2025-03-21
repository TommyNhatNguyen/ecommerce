import { LIMIT_OPTIONS } from "@/app/constants/seeds";
import Filter from "@/app/shared/components/Filter";
import FilterComponent from "@/app/shared/components/Filter";
import { WarehouseModel } from "@/app/shared/models/warehouse/warehouse.model";
import { Button, Input, Select } from "antd";
import { FilterIcon } from "lucide-react";
import React from "react";
import { useIntl } from "react-intl";

type Props = {
  handleClearAll: () => void;
  hasSelectedItems: boolean;
  limit: number;
  handleSelectLimit: (value: number) => void;
  handleSearch: (value: string) => void;
  warehouses: WarehouseModel[] | undefined;
  selectedWarehouses: string[];
  handleSelectWarehouse: (value: string[]) => void;
};

const InvoicesFilter = ({
  handleClearAll,
  hasSelectedItems,
  limit,
  handleSelectLimit,
  handleSearch,
  warehouses,
  selectedWarehouses,
  handleSelectWarehouse,
}: Props) => {
  const intl = useIntl();
  const _onSearch = (value: string) => {
    handleSearch(value);
  };
  const _onSelectWarehouse = (value: string[]) => {
    handleSelectWarehouse(value);
  };
  const _onSelectLimit = (value: number) => {
    handleSelectLimit(value);
  };
  const _onAdvancedFilter = () => {
    console.log("advanced filter");
  };
  return (
    <FilterComponent
      hasSelectedItems={hasSelectedItems}
      clearAll={handleClearAll}
    >
      {/* Tên sản phẩm (search) */}
      <Filter.Item name="search" label={intl.formatMessage({ id: "search" })}>
        <Input.Search
          onSearch={_onSearch}
          placeholder={intl.formatMessage({ id: "search" })}
        />
      </Filter.Item>
      {/* Theo kho hàng (select multiple) */}
      <Filter.Item
        name="warehouse"
        label={intl.formatMessage({ id: "warehouse" })}
      >
        <Select
          placeholder={intl.formatMessage({ id: "select_warehouse" })}
          className="w-full"
          mode="multiple"
          showSearch={false}
          options={warehouses?.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          value={selectedWarehouses}
          onChange={_onSelectWarehouse}
        />
      </Filter.Item>
      {/* Số lượng bản ghi (select) */}
      <Filter.Item name="limit" label={intl.formatMessage({ id: "limit" })}>
        <Select
          className="w-full"
          options={LIMIT_OPTIONS.map((item) => ({
            label: `${item.label} ${intl.formatMessage({ id: "products" })}`,
            value: item.value,
          }))}
          value={limit}
          onChange={_onSelectLimit}
        />
      </Filter.Item>
      {/* Lọc nâng cao */}
      <Button
        type="primary"
        icon={<FilterIcon width={16} height={16} />}
        onClick={_onAdvancedFilter}
        className="w-full"
      >
        {intl.formatMessage({ id: "advanced_filter" })}
      </Button>
    </FilterComponent>
  );
};

export default InvoicesFilter;
