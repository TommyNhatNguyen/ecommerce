"use client";
import Header from "@/app/shared/components/Header";
import Footer from "@/app/shared/components/Footer";
import React from "react";
import BannerSection from "@/app/shared/components/BannerSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

type MainLayoutPropsType = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutPropsType) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      {children}
      <BannerSection />
      <Footer />
      <Toaster />
    </QueryClientProvider>
  );
};

export default MainLayout;
