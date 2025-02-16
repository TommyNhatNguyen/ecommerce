"use client";
import Header from "@/app/shared/components/Header";
import Footer from "@/app/shared/components/Footer";
import React, { useEffect } from "react";
import BannerSection from "@/app/shared/components/BannerSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { cookiesStorage } from "../shared/utils/localStorage";
import { useCustomerAppDispatch } from "../shared/hooks/useRedux";
import { getCustomerInfo } from "../shared/store/main-reducers/auth/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "../constants/routes";

type MainLayoutPropsType = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutPropsType) => {
  const queryClient = new QueryClient();
  const dispatch = useCustomerAppDispatch();
  const router = useRouter();
  useEffect(() => {
    // If login, then get user info
    if (cookiesStorage.getToken()) {
      dispatch(getCustomerInfo());
    } else {
      router.push(ROUTES.HOME);
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main id="home">
        {children}
        <BannerSection />
        <Footer />
      </main>
      <Toaster />
    </QueryClientProvider>
  );
};

export default MainLayout;
