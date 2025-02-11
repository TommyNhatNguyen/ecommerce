"use client";

import { ROUTES } from "@/app/constants/routes";
import Accordion from "@/app/shared/components/Accordion";
import { ButtonWithLink } from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

type Props = {};

const faqData = [
  {
    id: "faq1",
    title: "What is the return policy?",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam quod debitis odio aliquid inventore, deleniti delectus similique ea fugit magnam distinctio molestias iste tenetur doloribus alias voluptate numquam expedita culpa!",
  },
  {
    id: "faq2",
    title: "How do I track my order?",
    content:
      "You can track your order by logging into your account and visiting the 'Orders' section. You will find the tracking information there.",
  },
  {
    id: "faq3",
    title: "Can I purchase items in bulk?",
    content:
      "Yes, we offer bulk purchasing options. Please contact our sales team for more information.",
  },
  {
    id: "faq4",
    title: "What payment methods are accepted?",
    content: "We accept all major credit cards, PayPal, and bank transfers.",
  },
  {
    id: "faq5",
    title: "How do I contact customer support?",
    content:
      "You can contact our customer support via the 'Contact Us' page or by calling our support hotline.",
  },
];

const FAQSection = (props: Props) => {
  return (
    <section id="faq" className="faq my-section">
      <Container>
        <div className="faq-wrapper flex flex-col items-start justify-between gap-gutter lg:flex-row">
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
              classes="h-btn px-[24px] text-center text-white text-primary-btn rounded-[64px] bg-pink-200 hover:bg-pink-100 duration-300 flex items-center justify-center gap-2 mt-[24px]"
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
          <Accordion classes="faq__accordion w-full max-w-[700px] gap-[20px]">
            {faqData.map((item, index) => {
              const { id, title, content } = item;
              return (
                <Accordion.Item key={id} id={id} title={title}>
                  {content}
                </Accordion.Item>
              );
            })}
          </Accordion>
        </div>
      </Container>
    </section>
  );
};

export default FAQSection;
