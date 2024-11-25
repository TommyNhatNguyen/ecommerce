import { ROUTES } from "@/app/constants/routes";
import { ButtonWithLink } from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

type Props = {};

const FAQSection = (props: Props) => {
  return (
    <section id="faq" className="faq mt-section">
      <Container>
        <Titlegroup classes="faq__title">
          <Titlegroup.Title>Frequently Asked Questions</Titlegroup.Title>
          <Titlegroup.Description classes="mt-[16px]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos,
            similique a! Consectetur deserunt numquam eligendi consequuntur
            totam amet, nihil assumenda esse, accusantium autem sapiente vel?
            Quae explicabo dicta eaque molestias!
          </Titlegroup.Description>
          <ButtonWithLink
            link={ROUTES.CONTACT}
            classes="h-btn px-[24px] text-center text-white text-primary-btn rounded-[64px] bg-pink-200 hover:bg-pink-100 duration-300 flex items-center justify-center gap-2 mt-[36px]"
          >
            <span className="h-full content-center text-nowrap">
              Ask a Question
            </span>
            <ChevronRightIcon
              width={20}
              height={20}
              className="h-full content-center text-nowrap"
            />
          </ButtonWithLink>
        </Titlegroup>
      </Container>
    </section>
  );
};

export default FAQSection;
