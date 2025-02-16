import { ROUTES } from '@/app/constants/routes';
import Navbar from '@/app/shared/components/Navbar';
import { categoriesService } from '@/app/shared/services/categories/categoriesService';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

type Props = {}

const HeaderNavbar = (props: Props) => {
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      categoriesService.getCategories({
        include_all: true,
        include_image: true,
      }),
  });
  const dropDownList = categoriesData &&
    categoriesData?.data && [
      ...categoriesData.data.map((category) => {
        return {
          id: category.id || "",
          link: `${ROUTES.PRODUCTS}?categoryIds[]=${category.id}`,
          children: category.name || "",
        };
      }),
      {
        id: "all",
        link: ROUTES.PRODUCTS,
        children: "All",
      },
    ];
  return (
    <Navbar classes="header__navbar absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
      <Navbar.Item link={ROUTES.HOME}>Home</Navbar.Item>
      <Navbar.Item dropDownList={dropDownList} link={ROUTES.CATEGORY}>
        Categories
      </Navbar.Item>
      <Navbar.Item link={ROUTES.CONTACT}>Contact Us</Navbar.Item>
      <Navbar.Item link={ROUTES.BLOG}>Blog</Navbar.Item>
    </Navbar>
  );
}

export default HeaderNavbar