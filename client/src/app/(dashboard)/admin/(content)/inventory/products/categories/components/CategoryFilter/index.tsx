'use client'
import { useCategory } from "@/app/(dashboard)/admin/(content)/inventory/products/categories/hooks/useCategory";
import { LIMIT_OPTIONS } from "@/app/constants/seeds";
import FilterComponent from "@/app/shared/components/Filter";
import Filter from "@/app/shared/components/Filter";
import { Input, Select } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'

type Props = {}

const CategoryFilter = (props: Props) => {
  const intl = useIntl();
  const { limit, handleSelectLimit } = useCategory();
  const _onSearch = (value: string) => {
    console.log(value);
  };
  const _onSelectLimit = (value: string) => {
    handleSelectLimit(Number(value));
  }
  return (
    <FilterComponent
    // hasSelectedItems={hasSelectedItems}
    // clearAll={handleClearAll}
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
            label: `${item.label} ${intl.formatMessage({ id: "categories" })}`,
            value: item.value,
          }))}
          value={limit.toString()}
          onChange={_onSelectLimit}
        />
      </Filter.Item>
    </FilterComponent>
  );
}

export default CategoryFilter