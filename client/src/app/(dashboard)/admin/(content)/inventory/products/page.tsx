"use client";
import React from "react";
import ProductCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard/ProductCard";
import CategoryCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard/CategoryCard";
import DiscountCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard/DiscountCard";
import OptionsCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard/OptionCard";

type ProductPagePropsType = {};

const ProductPage = ({}: ProductPagePropsType) => {
  return (
    <div className="grid min-h-[300px] grid-flow-row grid-cols-2 gap-4">
      <ProductCard />
      <CategoryCard />
      <DiscountCard />
      <OptionsCard />
    </div>
  );
};

export default ProductPage;
