"use client";

import ProductFilter from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/ProductFilter";
import ProductTable from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/ProductTable";
import { useProductFilter } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProductFilter";
import React from "react";

type ProductPagePropsType = {};

const ProductPage = ({}: ProductPagePropsType) => {
  const { categories, limit, isApplyFilters, ...rest } = useProductFilter();
  return (
    <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
      <div className="col-span-2">
        <ProductFilter
          categories={categories || []}
          limit={limit}
          isApplyFilters={isApplyFilters}
          {...rest}
        />
      </div>
      <div className="col-span-10">
        <ProductTable {...rest} isApplyFilters={isApplyFilters} limit={limit} />
      </div>
    </div>
  );
};

export default ProductPage;
