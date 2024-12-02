"use client";
import { ROUTES } from "@/app/constants/routes";
import { ChevronRightIcon, PlusCircle } from "lucide-react";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import React from "react";
import Button, { ButtonWithLink } from "@/app/shared/components/Button";
import { CardProduct } from "@/app/shared/components/Card";
import { twMerge } from "tailwind-merge";
type SimilarCardComponentPropsType = {
  title?: string;
  productsList: any[];
  sectionClasses?: string;
  withButton?: boolean;
};
const SimilarCardComponent = ({
  title = "Similar product",
  productsList,
  sectionClasses,
  withButton = true,
}: SimilarCardComponentPropsType) => {
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
        <div className="product__group`">
          {Array.from({ length: 1 }).map((_, index) => (
            <div
              key={index}
              className="product__group-list mt-[36px] flex items-center justify-between gap-gutter"
            >
              {productsList.map((product) => (
                <CardProduct
                  key={product.name}
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
          ))}
        </div>
      </Container>
    </section>
  );
};

export default SimilarCardComponent;
