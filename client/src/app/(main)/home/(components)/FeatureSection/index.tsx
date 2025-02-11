"use client";
import Button from "@/app/shared/components/Button";
import { CardProduct } from "@/app/shared/components/Card";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import { PlusCircle } from "lucide-react";
import React from "react";
import mockProductImage from "@/app/shared/resources/images/homepage/product-1.jpg";
import { ROUTES } from "@/app/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/app/shared/services/products/productService";
import { ProductModel } from "@/app/shared/models/products/products.model";
type Props = {};

const FeatureSection = (props: Props) => {
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return productService.getProducts({
        limit: 10,
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
  console.log("🚀 ~ FeatureSection ~ data:", data);
  const _onAddToCart = (product: ProductModel) => {
    console.log(product);
  };
  return (
    <section id="feature" className="feature mt-[100px]">
      <Container>
        <Titlegroup classes="flex justify-between flex-col md:flex-row">
          <Titlegroup.Title>Featured Products</Titlegroup.Title>
          <Titlegroup.Info classes="mt-2 md:mt-0 max-w-[40%]">
            <Titlegroup.Description>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
              quis pulvina.
            </Titlegroup.Description>
          </Titlegroup.Info>
        </Titlegroup>
        <div className="feature__products mt-[36px] grid grid-cols-2 gap-gutter lg:grid-cols-4">
          {data?.data &&
            data?.data.map((product) => (
              <CardProduct
                key={product.id}
                {...product}
                renderAction={() => (
                  <Button
                    onClick={() => {}}
                    variant="vanilla"
                    classes="bg-transparent p-0"
                  >
                    <PlusCircle className="h-8 w-8" />
                  </Button>
                )}
              />
            ))}
        </div>
      </Container>
    </section>
  );
};

export default FeatureSection;
