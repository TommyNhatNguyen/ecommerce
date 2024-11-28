import Header from "@/app/shared/components/Header";
import Footer from "@/app/shared/components/Footer";
import React from "react";
import BannerSection from "@/app/shared/components/BannerSection";

type MainLayoutPropsType = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutPropsType) => {
  return (
    <>
      <Header />
      {children}
      <BannerSection />
      <Footer />
    </>
  );
};

export default MainLayout;
