import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import mockCategoryImage from "../../../../resources/images/homepage/category-1.jpg";
import mockCategoryImage2 from "../../../../resources/images/homepage/category-2.jpg";
import mockCategoryImage3 from "../../../../resources/images/homepage/category-3.jpg";
import mockCategoryImage4 from "../../../../resources/images/homepage/category-4.jpg";
import clsx from "clsx";

type Props = {};

const categories = [
  {
    imgUrl: mockCategoryImage,
    name: "Category 1",
    link: "/category/category-1",
  },
  {
    imgUrl: mockCategoryImage2,
    name: "Category 2",
    link: "/category/category-2",
  },
  {
    imgUrl: mockCategoryImage3,
    name: "Category 3",
    link: "/category/category-3",
  },
  {
    imgUrl: mockCategoryImage4,
    name: "Category 4",
    link: "/category/category-4",
  },
];

const CategorySection = (props: Props) => {
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
          className={clsx(
            "category__list mt-[68px] grid grid-flow-dense",
            `grid-cols-${categories.length / 2}`,
            "gap-gutter",
          )}
        >
          {categories.map((category, index) => (
            <Link
              href={category.link}
              className="category__list-item relative h-full max-h-[513px] w-full overflow-hidden rounded-[14px]"
            >
              <Image
                src={category.imgUrl}
                alt={category.name}
                className="h-full w-full object-cover"
              />
              <h3 className="absolute bottom-[20px] left-[20px] font-playright-bold text-h3 text-bg-primary">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CategorySection;
