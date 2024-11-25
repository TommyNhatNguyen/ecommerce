"use client";
import Container from "@/app/shared/components/Container";
import Logo from "@/app/shared/components/Logo";
import Navbar from "@/app/shared/components/Navbar";
import { User } from "lucide-react";
import React from "react";
import Cta from "./components/Cta";
const dropDownList = [
  { id: "1", link: "/category/soy", children: "Soy Candles" },
  { id: "2", link: "/category/scented", children: "Scented Candles" },
  { id: "3", link: "/category/beeswax", children: "Beeswax Candles" },
  { id: "4", link: "/category/pillar", children: "Pillar  Candles" },
  { id: "5", link: "/category/votive", children: "Votive Candles" },
];
const Header = () => {
  return (
    <header className="header h-header w-full max-w-full bg-pink-200">
      <Container classes="h-full w-full flex justify-between items-center">
        <Logo classes="header__logo" />
        <Navbar classes="header__navbar">
          <Navbar.Item link="/">Home</Navbar.Item>
          <Navbar.Item dropDownList={dropDownList} link="/category">
            Categories
          </Navbar.Item>
          <Navbar.Item link="/contact">Contact Us</Navbar.Item>
          <Navbar.Item link="/blog">Blog</Navbar.Item>
        </Navbar>
        <Cta classes="header__cta" />
      </Container>
    </header>
  );
};

export default Header;
