"use client";
import Button from "@/app/shared/components/Button";
import Form from "@/app/shared/components/Form";
import { ChevronRightIcon, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { CardProduct } from "@/app/shared/components/Card";
import { PlusCircle } from "lucide-react";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { productService } from "@/app/shared/services/products/productService";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { cn } from "@/app/shared/utils/utils";
import { Empty } from "antd";
type CollectionPropsType = {
  selectedOptions: string[];
  applyPriceRange: {
    from: number | undefined;
    to: number | undefined;
  };
  priceRange: {
    from: number;
    to: number;
  };
};

const Collection = ({
  selectedOptions,
  applyPriceRange,
  priceRange,
}: CollectionPropsType) => {
  const [limit, setLimit] = useState(12);
  const {
    data: products,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", selectedOptions, applyPriceRange],
    queryFn: (p) =>
      productService.getProducts({
        limit,
        page: p.pageParam,
        sortBy: "created_at",
        order: "DESC",
        status: "ACTIVE",
        includeImage: true,
        includeVariant: true,
        includeVariantInfo: true,
        includeVariantImage: true,
        includeCategory: true,
        categoryIds: selectedOptions,
        priceRange: applyPriceRange ? priceRange : undefined,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page === lastPage.meta.total_page) {
        return undefined;
      }
      return lastPage.meta.current_page + 1;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
  const _onAddToCart = (product: ProductModel) => {
    console.log(product);
  };
  const _onLoadMore = () => {
    fetchNextPage();
  };
  const totalProducts = useMemo(
    () => products?.pages[0]?.meta?.total_count || 0,
    [products],
  );
  const totalProductsLoaded = useMemo(
    () => products?.pages?.flatMap((page) => page.data)?.length || 0,
    [products],
  );
  return (
    <div className="product-page__content h-full">
      <div className="product-page__content-title">
        <h1 className="font-playright-bold text-h1">
          Our Collection Of Products
        </h1>
        <Form className="mt-[32px] w-full">
          <Form.Input
            wrapperClasses="h-input rounded-[42px] w-full border-green-300  flex items-center justify-between pl-[20px] pr-[10px] py-[10px] hover:border-green-100 duration-300 focus-within:border-green-100 gap-[8px]"
            renderIcon={() => (
              <Button variant="icon">
                <Search className="text-white" width={18} height={18} />
              </Button>
            )}
            placeholder="Search An Item"
          ></Form.Input>
        </Form>
      </div>
      <div className="product-page__content-list mt-[32px] h-full min-h-[80%]">
        <div className="total">
          <p className="font-roboto-medium">
            Showing 1 - {totalProductsLoaded} of {totalProducts} item(s)
          </p>
          <p className="text-body-sub">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="product__group min-h-macbook-screen my-[36px] grid grid-flow-dense grid-cols-3 gap-gutter">
          {products?.pages && products?.pages[0]?.data?.length > 0 ? (
            products?.pages
              .flatMap((page) => page.data)
              .map((product) => (
                <CardProduct
                  key={product.id}
                  {...product}
                  renderAction={() => (
                    <Button
                      variant="vanilla"
                      onClick={() => _onAddToCart(product)}
                    >
                      <PlusCircle width={24} height={24} />
                    </Button>
                  )}
                />
              ))
          ) : (
            <Empty
              description="No products found"
              className="col-span-3 row-auto"
            />
          )}
        </div>
        <div className="pagination mx-auto w-full text-center">
          <p className="font-roboto-medium">
            Showing 1 - {totalProductsLoaded} of {totalProducts} item(s)
          </p>
          <div className="progress relative mt-[26px] h-[4px] w-full rounded-[2px] bg-gray-100">
            <span
              className={cn(
                "progress-indicator absolute left-0 top-0 h-full rounded-full bg-green-300",
                `w-[${(totalProductsLoaded / totalProducts) * 100}%]`,
              )}
            ></span>
          </div>
          <Button
            onClick={_onLoadMore}
            variant="primary"
            classes="mx-auto mt-[26px]"
            disabled={!hasNextPage}
            isDisabled={!hasNextPage}
          >
            <span className="h-full content-center text-nowrap">Load More</span>
            <ChevronRightIcon
              width={20}
              height={20}
              className="h-full content-center text-nowrap"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Collection;
