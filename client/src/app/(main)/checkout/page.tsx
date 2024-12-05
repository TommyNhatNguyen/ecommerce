"use client";
import CartDetails from "@/app/(main)/checkout/(components)/CartDetails";
import ShipInfo from "@/app/(main)/checkout/(components)/ShipInfo";
import { ROUTES } from "@/app/constants/routes";
import Container from "@/app/shared/components/Container";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const CheckoutPage = (props: Props) => {
  const router = useRouter();
  const handlePayment = () => {
    router.push(ROUTES.COMPLETE);
  };
  const shipInfoProps = {
    handlePayment,
  };
  return (
    <main id="checkout" className="checkout py-section">
      <Container>
        <div className="grid grid-cols-[1.45fr,1fr] items-start justify-between gap-gutter">
          <ShipInfo {...shipInfoProps} />
          <CartDetails />
        </div>
      </Container>
    </main>
  );
};

export default CheckoutPage;
