"use client";

import Filter from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/Filter";
import ProductTable from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/ProductTable";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";

type ProductPagePropsType = {};

const ProductPage = ({}: ProductPagePropsType) => {
  const filterRef = useRef<HTMLDivElement>(null);
  const [selectedProductColumns, setSelectedProductColumns] = useState<
    string[]
  >([]);
  const [selectedVariantColumns, setSelectedVariantColumns] = useState<
    string[]
  >([]);
  const [productDetail, setProductDetail] =
    useState<VariantProductModel | null>(null);
  const intl = useIntl();

  const handleCancelModalProductDetail = () => {
    setProductDetail(null);
  };
  return (
    <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
      <div className="col-span-2">
        <Filter ref={filterRef}>
          <Filter.Search
            name="search"
            label={intl.formatMessage({ id: "search" })}
            onSearch={(value) => {
              console.log(value);
            }}
          >
            Tìm kiếm
          </Filter.Search>
          <Filter.Item name="category">Nhóm hàng</Filter.Item>
          <Filter.Item name="options">Thuộc tính</Filter.Item>
          <Filter.Item name="brand">Nhãn hàng</Filter.Item>
          <Filter.Item name="status">Trạng thái sản phẩm</Filter.Item>
          <Filter.Item name="discount">Trạng thái giảm giá</Filter.Item>
          <Filter.Item name="limit">Số bản ghi</Filter.Item>
        </Filter>
      </div>
      {/* Danh sách sản phẩm */}
      <div className="col-span-10">
        <ProductTable />
      </div>
    </div>
  );
};

export default ProductPage;
