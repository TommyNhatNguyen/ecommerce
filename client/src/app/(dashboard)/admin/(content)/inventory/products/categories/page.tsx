'use client'
import CategoryFilter from "@/app/(dashboard)/admin/(content)/inventory/products/categories/components/CategoryFilter";
import CategoryTable from "@/app/(dashboard)/admin/(content)/inventory/products/categories/components/CategoryTable";
import { useCategoryFilter } from "@/app/(dashboard)/admin/(content)/inventory/products/categories/hooks/useCategoryFilter";
import React from "react";

type Props = {};

const CategoriesPage = (props: Props) => {
  const { limit, ...rest } = useCategoryFilter();
  return (
    <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
      <div className="col-span-2">
        <CategoryFilter limit={limit} {...rest} />
      </div>
      <div className="col-span-10">
        <CategoryTable limit={limit} />
      </div>
    </div>
  );
};

export default CategoriesPage;
