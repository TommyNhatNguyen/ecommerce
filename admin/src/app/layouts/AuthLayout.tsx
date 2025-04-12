"use client";
import React from "react";
import bgAdmin from "@/app/shared/resources/images/background-1.png";
import Image from "next/image";
import { cn } from "@/app/shared/utils/utils";
import NotificationContextProvider from "@/app/contexts/NotificationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
type AuthLayoutPropsType = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutPropsType) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <main className="auth-layout">
          <div
            className={cn(
              "auth-layout__container",
              "grid h-screen w-full grid-cols-2",
            )}
          >
            <div className={cn("auth-layout__container-left", "h-full w-full")}>
              <Image
                src={bgAdmin}
                width={1500}
                alt="background"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div
              className={cn("auth-layout__container-right", "h-full w-full")}
            >
              {children}
            </div>
          </div>
        </main>
      </NotificationContextProvider>
    </QueryClientProvider>
  );
};

export default AuthLayout;
