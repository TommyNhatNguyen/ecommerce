import { ROUTES } from "@/app/constants/routes";
import { ButtonWithLink } from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import { CircleCheckBig } from "lucide-react";
import React from "react";

type Props = {};

const CompletePage = (props: Props) => {
  return (
    <main id="complete" className="complete py-section">
      <Container>
        <div className="complete__content text-center">
          <h1 className="text-center font-playright-bold text-h1">
            Thank you for your order!
          </h1>
          <p className="mt-[16px] text-center text-body-big">
            Your order has been placed successfully.
          </p>
          <CircleCheckBig
            className="mx-auto mt-[16px] stroke-success"
            size={80}
          />
        </div>
        <div className="complete__actions flex items-center justify-center gap-[16px] mt-[16px]">
          <ButtonWithLink
            variant="vanilla"
            classes="bg-white text-green-300 hover:bg-green-300 duration-300 hover:text-white"
            link={ROUTES.HOME}
          >
            Back to Home
          </ButtonWithLink>
          <ButtonWithLink variant="primary" link={ROUTES.ORDER}>
            Check your order
          </ButtonWithLink>
        </div>
      </Container>
    </main>
  );
};

export default CompletePage;
