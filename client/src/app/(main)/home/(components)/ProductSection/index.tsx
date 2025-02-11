"use client";
import Button from "@/app/shared/components/Button";
import { ROUTES } from "@/app/constants/routes";
import { ButtonWithLink } from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import { ChevronRightIcon, PlusCircle } from "lucide-react";
import React, { useMemo, useState } from "react";
import mockProductImage from "@/app/shared/resources/images/homepage/product-2.jpg";
import { CardProduct } from "@/app/shared/components/Card";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productService } from "@/app/shared/services/products/productService";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { generatePages } from "@/app/shared/utils/common";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/app/shared/utils/utils";
import CustomPagination from "@/app/shared/components/CustomPagination";

type ProductSectionPropsType = {};

const ProductSection = ({}: ProductSectionPropsType) => {
  const [page, setPage] = useState(1);
  const { data } = useQuery({
    queryKey: ["products-popular"],
    queryFn: () =>
      productService.getProducts({
        limit: 12,
        page: page,
        sortBy: "created_at",
        order: "DESC",
        status: "ACTIVE",
        includeImage: true,
        includeVariant: true,
        includeVariantInfo: true,
        includeVariantInventory: true,
        includeVariantImage: true,
      }),
    placeholderData: keepPreviousData,
  });
  const { current_page, total_page } = useMemo(() => data?.meta, [data]) || {};
  const _onAddToCart = (product: ProductModel) => {
    console.log(product);
  };
  const _onNextPage = () => {
    if (page < (data?.meta?.total_page || 0)) {
      setPage((prev) => prev + 1);
    }
  };
  const _onPrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const _onChangePage = (selectedPage: number) => {
    setPage(selectedPage);
  };
  return (
    <section id="product" className="product mt-section">
      <Container>
        <Titlegroup classes="product__title flex items-center justify-between gap-gutter">
          <Titlegroup.Info classes="max-w-[50%]">
            <Titlegroup.Title>Most Popular Products</Titlegroup.Title>
            <Titlegroup.Description classes="mt-[16px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
              quis pulvinar.
            </Titlegroup.Description>
          </Titlegroup.Info>
          <ButtonWithLink link={ROUTES.PRODUCTS}>
            <span className="h-full content-center text-nowrap">
              View All Products
            </span>
            <ChevronRightIcon
              width={20}
              height={20}
              className="h-full content-center text-nowrap"
            />
          </ButtonWithLink>
        </Titlegroup>
        <div>
          <div className="product__group mt-[36px] grid grid-cols-2 grid-rows-3 gap-gutter md:grid-cols-4">
            {data?.data.map((product) => (
              <CardProduct
                key={product.id}
                {...product}
                renderAction={() => (
                  <Button
                    onClick={() => _onAddToCart(product)}
                    variant="vanilla"
                  >
                    <PlusCircle width={24} height={24} />
                  </Button>
                )}
              />
            ))}
          </div>
          <CustomPagination
            totalPage={total_page || 0}
            currentPage={current_page || 0}
            handlePrevPage={_onPrevPage}
            handleNextPage={_onNextPage}
            handleChangePage={_onChangePage}
          />
        </div>
      </Container>
    </section>
  );
};

export default ProductSection;
