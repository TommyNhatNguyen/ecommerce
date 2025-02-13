"use client";
import Container from "@/app/shared/components/Container";
import Logo from "@/app/shared/components/Logo";
import Navbar from "@/app/shared/components/Navbar";
import React from "react";
import Cta from "./components/Cta";
import { ROUTES } from "@/app/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../../services/categories/categoriesService";

const Header = () => {
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
    <header className="header absolute left-0 top-0 z-10 h-header w-full max-w-full bg-gradient-to-b from-bg-primary to-bg-secondary">
      <Container classes="h-full w-full flex justify-between items-center">
        <Logo classes="header__logo" />
        <Navbar classes="header__navbar absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
          <Navbar.Item link={ROUTES.HOME}>Home</Navbar.Item>
          <Navbar.Item dropDownList={dropDownList} link={ROUTES.CATEGORY}>
            Categories
          </Navbar.Item>
          <Navbar.Item link={ROUTES.CONTACT}>Contact Us</Navbar.Item>
          <Navbar.Item link={ROUTES.BLOG}>Blog</Navbar.Item>
        </Navbar>
        <Cta classes="header__cta" />
      </Container>
    </header>
  );
};

export default Header;
