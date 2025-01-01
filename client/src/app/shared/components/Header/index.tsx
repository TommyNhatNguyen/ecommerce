"use client";
import Container from "@/app/shared/components/Container";
import Logo from "@/app/shared/components/Logo";
import Navbar from "@/app/shared/components/Navbar";
import React from "react";
import Cta from "./components/Cta";
import { ROUTES } from "@/app/constants/routes";
const dropDownList = [
  { id: "1", link: "/category/soy", children: "Soy Candles" },
  { id: "2", link: "/category/scented", children: "Scented Candles" },
  { id: "3", link: "/category/beeswax", children: "Beeswax Candles" },
  { id: "4", link: "/category/pillar", children: "Pillar  Candles" },
  { id: "5", link: "/category/votive", children: "Votive Candles" },
  { id: "6", link: "/category/", children: "Show all" },
];
const Header = () => {
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
