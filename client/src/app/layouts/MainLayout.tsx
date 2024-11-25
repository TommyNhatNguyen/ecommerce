import Header from "@/app/shared/components/Header";
import Footer from "@/app/shared/components/Footer";
import React from "react";

type MainLayoutPropsType = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutPropsType) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
