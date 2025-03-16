import CategoryFilter from "@/app/(dashboard)/admin/(content)/inventory/products/categories/components/CategoryFilter";
import CategoryTable from "@/app/(dashboard)/admin/(content)/inventory/products/categories/components/CategoryTable";
import React from "react";

type Props = {};

const CategoriesPage = (props: Props) => {
  return (
    <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
      <div className="col-span-2">
        <CategoryFilter />
      </div>
      <div className="col-span-10">
        <CategoryTable />
      </div>
    </div>
  );
};

export default CategoriesPage;
