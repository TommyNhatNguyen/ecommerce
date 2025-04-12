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
import { getCartByIdLocal } from "@/app/shared/store/main-reducers/cart/cart";
import { useSocket, useSocketPush } from "@/app/shared/hooks/useSocket";
import { SOCKET_EVENTS_ENDPOINT } from "@/app/constants/socket-endpoint";
import { socketServices } from "@/app/shared/services/sockets";

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
      dispatch(getCartByIdLocal(""));
      dispatch(getCustomerInfo());
    } else {
      dispatch(getCartByIdLocal(""));
      router.push(ROUTES.HOME);
    }
  }, []);
  useSocket(
    socketServices.chatIo,
    [SOCKET_EVENTS_ENDPOINT.CHAT_MESSAGE],
    (data) => {
      console.log("🚀 ~ useEffect ~ data:", data);
    },
  );
  // setInterval(() => {
  //   socketServices.chatIo.emit(SOCKET_EVENTS_ENDPOINT.CHAT_MESSAGE, {
  //     message: "Hello",
  //     roomId: "room-01",
  //   });
  // }, 1000);
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
