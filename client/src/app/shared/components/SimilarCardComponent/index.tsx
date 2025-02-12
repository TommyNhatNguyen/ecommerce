"use client";
import { ROUTES } from "@/app/constants/routes";
import { ChevronRightIcon, PlusCircle } from "lucide-react";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import React from "react";
import Button, { ButtonWithLink } from "@/app/shared/components/Button";
import { CardProduct } from "@/app/shared/components/Card";
import { twMerge } from "tailwind-merge";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/app/shared/services/products/productService";
import { ProductModel } from "@/app/shared/models/products/products.model";
import CustomSlickSlider from "../CustomSlickSlider";
type SimilarCardComponentPropsType = {
  title?: string;
  sectionClasses?: string;
  withButton?: boolean;
};
const SimilarCardComponent = ({
  title = "Similar product",
  sectionClasses,
  withButton = true,
}: SimilarCardComponentPropsType) => {
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return productService.getProducts({
        limit: 12,
        page: 1,
        sortBy: "created_at",
        order: "DESC",
        status: "ACTIVE",
        includeImage: true,
        includeVariant: true,
        includeVariantInfo: true,
        includeVariantInventory: true,
        includeVariantImage: true,
      });
    },
  });
  const _onAddToCart = (product: any) => {
    console.log(product);
  };
  return (
    <section className={twMerge("similar-section", sectionClasses)}>
      <Container>
        <Titlegroup classes="product__title flex items-center justify-between gap-gutter">
          <Titlegroup.Info classes="max-w-[50%]">
            <Titlegroup.Title>{title}</Titlegroup.Title>
          </Titlegroup.Info>
          {withButton && (
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
          )}
        </Titlegroup>
        <div className="product__list mt-[36px]">
          {data?.data && data?.data.length > 0 && (
            <CustomSlickSlider>
              {data?.data.map((product) => (
                <CardProduct
                  key={product.id}
                  {...product}
                  classes="max-w-[90%]"
                  renderAction={() => (
                    <Button onClick={() => {}} variant="vanilla">
                      <PlusCircle width={24} height={24} />
                    </Button>
                  )}
                />
              ))}
            </CustomSlickSlider>
          )}
        </div>
      </Container>
    </section>
  );
};

export default SimilarCardComponent;
