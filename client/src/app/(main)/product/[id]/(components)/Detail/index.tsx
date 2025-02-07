"use client";
import Info from "@/app/(main)/product/[id]/(components)/Detail/components/Info";
import Thumbnails from "@/app/(main)/product/[id]/(components)/Detail/components/Thumbnails";
import { ROUTES } from "@/app/constants/routes";
import Breadcrumb from "@/app/shared/components/Breadcrumb";
import Button from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { productService } from "@/app/shared/services/products/productService";
import { optionService } from "@/app/shared/services/variant/optionService";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Heart, Star } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const Detail = (props: Props) => {
  const { id } = useParams();
  const [selectedOptionValueId, setSelectedOptionValueId] = useState<{
    [key: string]: string;
  }>({});
  const { data: optionList, isLoading } = useQuery({
    queryKey: ["option-list", id],
    queryFn: () =>
      optionService.getOptionList({
        product_id: id as string,
        include_option_values: true,
        include_variant: true,
      }),
    placeholderData: keepPreviousData,
  });
  const { data: productDetail } = useQuery({
    queryKey: ["product-detail", id],
    queryFn: () => productService.getProductById(id as string, {}),
    placeholderData: keepPreviousData,
  });
  const { data: selectedVariant } = useQuery({
    queryKey: ["selected-variant", selectedOptionValueId],
    queryFn: () =>
      variantServices.getList({
        option_value_ids: Object.values(selectedOptionValueId),
        include_options_value: true,
        product_id: id as string,
        include_product_sellable: true,
      }),
    enabled: Object.values(selectedOptionValueId).length > 0,
    placeholderData: keepPreviousData,
  });
  const handleSelectOptionValue = (optionId: string, optionValueId: string) => {
    setSelectedOptionValueId({
      ...selectedOptionValueId,
      [optionId]: optionValueId,
    });
  };
  useEffect(() => {
    if (optionList?.data) {
      optionList?.data?.forEach((option) => {
        setSelectedOptionValueId((prev) => ({
          ...prev,
          [option?.id || ""]: option?.option_values?.[0]?.id || "",
        }));
      });
    }
  }, [optionList]);
  return (
    <section className="product-detail__detail">
      <Container>
        <Breadcrumb>
          <Breadcrumb.Link link={ROUTES.HOME}>Home</Breadcrumb.Link>
          <Breadcrumb.Link link={ROUTES.PRODUCTS}>Product</Breadcrumb.Link>
          <Breadcrumb.Item>Detail</Breadcrumb.Item>
          <Breadcrumb.Item>{productDetail?.name}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="content mt-[20px] grid grid-cols-[1.34fr_1fr] items-start justify-between gap-gutter">
          <Thumbnails
            images={selectedVariant?.data?.[0]?.product_sellable?.image || []}
          />
          <Info
            options={optionList?.data || []}
            handleSelectOptionValue={handleSelectOptionValue}
            selectedOptionValueId={selectedOptionValueId}
            variant={selectedVariant?.data?.[0]}
          />
        </div>
      </Container>
    </section>
  );
};

export default Detail;
