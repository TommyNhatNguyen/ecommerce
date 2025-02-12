"use client";
import Detail from "@/app/(main)/product/[id]/(components)/Detail";
import Reviews from "@/app/(main)/product/[id]/(components)/Reviews";
import SimilarCardComponent from "@/app/shared/components/SimilarCardComponent";
import React, { useState } from "react";
import { productService } from "@/app/shared/services/products/productService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { useParams } from "next/navigation";
type Props = {};

const ProductDetailPage = (props: Props) => {
  const { id } = useParams();

  const [selectedOptionValueId, setSelectedOptionValueId] = useState<{
    [key: string]: string;
  }>({});
  const { data: selectedVariant } = useQuery({
    queryKey: ["selected-variant", selectedOptionValueId],
    queryFn: () =>
      variantServices.getList({
        option_value_ids: Object.values(selectedOptionValueId),
        include_options_value: true,
        product_id: id as string,
        include_product_sellable: true,
        include_product: true,
      }),
    enabled: Object.values(selectedOptionValueId).length > 0,
    placeholderData: keepPreviousData,
  });
  const handleSelectOptionValue = (optionId: string, optionValueId: string) => {
    setSelectedOptionValueId((prev) => ({
      ...prev,
      [optionId]: optionValueId,
    }));
  };
  return (
    <main id="product-detail" className="product-detail py-section">
      <Detail
        selectedOptionValueId={selectedOptionValueId}
        setSelectedOptionValueId={setSelectedOptionValueId}
        selectedVariant={selectedVariant?.data?.[0]}
        handleSelectOptionValue={handleSelectOptionValue}
      />
      <Reviews productInfo={selectedVariant?.data?.[0]?.product} />
      <SimilarCardComponent title="Similar product" />
    </main>
  );
};

export default ProductDetailPage;
