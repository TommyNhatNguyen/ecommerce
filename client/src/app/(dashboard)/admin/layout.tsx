import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "@/app/shared/resources/css/globals.admin.css";
import StoreProvider from "@/app/shared/components/StoreProvider";
export const metadata: Metadata = {
  title: "Admin Auth",
  description: "Admin Auth",
};

const openSans = Open_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--ff-os-regular",
  weight: "400",
});

const openSansMedium = Open_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--ff-os-medium",
  weight: "500",
});

const openSansBold = Open_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--ff-os-bold",
  weight: "700",
});

export default function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="--dashboard">
      <body
        className={`${openSans.variable} ${openSansMedium.variable} ${openSansBold.variable} --dashboard antialiased`}
      >
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
