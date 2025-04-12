import FilterComponent from "@/app/shared/components/Filter";
import Filter from "@/app/shared/components/Filter";
import { LIMIT_OPTIONS } from "@/app/constants/seeds";
import { Input, Select } from "antd";
import React from "react";
import { useIntl } from "react-intl";

type Props = {
  limit: number;
  handleSelectLimit: (value: number) => void;
  hasSelectedItems: boolean;
  handleClearAll: () => void;
  handleSearch: (value: string) => void;
};

const BrandFilter = ({
  limit,
  handleSelectLimit,
  hasSelectedItems,
  handleClearAll,
  handleSearch,
}: Props) => {
  const intl = useIntl();
  const _onSearch = (value: string) => {
    handleSearch(value);
  };
  const _onSelectLimit = (value: string) => {
    handleSelectLimit(Number(value));
  };
  return (
    <FilterComponent
      hasSelectedItems={hasSelectedItems}
      clearAll={handleClearAll}
    >
      <Filter.Item name="search" label={intl.formatMessage({ id: "search" })}>
        <Input.Search
          onSearch={(value) => {
            _onSearch(value);
          }}
          placeholder={intl.formatMessage({ id: "search" })}
        />
      </Filter.Item>
      <Filter.Item name="limit" label={intl.formatMessage({ id: "limit" })}>
        <Select
          className="w-full"
          options={LIMIT_OPTIONS.map((item) => ({
            label: `${item.label} ${intl.formatMessage({ id: "brands" })}`,
            value: item.value,
          }))}
          value={limit.toString()}
          onChange={_onSelectLimit}
        />
      </Filter.Item>
    </FilterComponent>
  );
};

export default BrandFilter;
