"use client";
import React from "react";
import Container from "@/app/shared/components/Container";
import Filter from "@/app/(main)/product/(components)/Filter";

import Collection from "@/app/(main)/product/(components)/Collection";
import { useCollection } from "@/app/(main)/product/hooks/useCollection";
type Props = {};

const ProductPage = (props: Props) => {
  const {
    selectedOptions,
    handleSetSelectedOptions,
    handleApplyPriceRange,
    handleChangePriceRange,
    priceRange,
    applyPriceRange,
    handleResetOptions
  } = useCollection();
  return (
    <main id="product-page" className="product-page py-section">
      <Container>
        <div className="product-page-wrapper grid grid-cols-[1fr,3.2fr] gap-gutter">
          <Filter
            selectedOptions={selectedOptions}
            handleSetSelectedOptions={handleSetSelectedOptions}
            handleApplyPriceRange={handleApplyPriceRange}
            handleChangePriceRange={handleChangePriceRange}
            priceRange={priceRange}
            handleResetOptions={handleResetOptions}
          />
          <Collection
            applyPriceRange={applyPriceRange}
            priceRange={priceRange}
            selectedOptions={selectedOptions}
            handleSetSelectedOptions={handleSetSelectedOptions}
          />
        </div>
      </Container>
    </main>
  );
};

export default ProductPage;
