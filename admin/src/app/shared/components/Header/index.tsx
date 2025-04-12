"use client";
import Container from "@/app/shared/components/Container";
import Logo from "@/app/shared/components/Logo";
import React, { useRef } from "react";
import Cta from "./components/Cta";
import HeaderNavbar from "@/app/shared/components/Header/components/Navbar";

const Header = () => {
  return (
    <header className="header fixed left-0 top-0 z-10 h-header w-full max-w-full bg-bg-primary-70 shadow-sm backdrop-blur-md">
      <Container classes="h-full w-full flex justify-between items-center">
        <Logo classes="header__logo" />
        <HeaderNavbar />
        <Cta classes="header__cta" />
      </Container>
    </header>
  );
};

export default Header;
