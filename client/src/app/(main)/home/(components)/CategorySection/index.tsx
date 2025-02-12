import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import Link from "next/link";
import React from "react";

import { getCategories } from "@/app/shared/services/categories/categoryServicer.server";
import { ROUTES } from "@/app/constants/routes";
import defaultImg from "@/app/shared/resources/images/homepage/category-1.jpg";
import { cn } from "@/app/shared/utils/utils";
type Props = {};

const CategorySection = async (props: Props) => {
  const categories = await getCategories({ include_image: true });
  return (
    <section id="category" className="category mt-section">
      <Container>
        <Titlegroup classes="category__title text-center max-w-[60%] mx-auto">
          <Titlegroup.Title>View Our Range Of Categories</Titlegroup.Title>
          <Titlegroup.Info classes="mt-[16px]">
            <Titlegroup.Description>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
              quis pulvinar.
            </Titlegroup.Description>
          </Titlegroup.Info>
        </Titlegroup>
        <div
          className={cn(
            "category__list mt-[68px] grid grid-cols-2 lg:grid-cols-4",
            "h-full gap-gutter",
          )}
        >
          {categories?.data.map((category, index) => (
            <div
              key={category.id || index}
              className={cn(
                "aspect-[360/630] h-full max-h-[360px] w-full rounded-[14px] bg-white/60 p-6 shadow-sm",
              )}
            >
              <Link
                href={`${ROUTES.PRODUCTS}?categoryIds[]=${category.id}`}
                className="category__list-item relative block h-full w-full overflow-hidden rounded-[14px] bg-white"
              >
                <img
                  src={category.image?.url || defaultImg.src}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-[1%] left-[1%] rounded-2xl bg-bg-primary-60 p-4 shadow-md backdrop-blur-md">
                  <h3 className="font-playright-bold text-h3 text-green-200">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CategorySection;
