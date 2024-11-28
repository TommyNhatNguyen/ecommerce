import { ROUTES } from "@/app/constants/routes";
import Button from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import Form from "@/app/shared/components/Form";
import { Apple, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer id="footer" className="footer bg-green-100 pt-[32px]">
      <Container>
        <div className="footer__content flex items-center justify-between gap-gutter py-[32px] text-white">
          <div className="footer__content-top flex w-full flex-col items-center">
            <Link
              href={ROUTES.HOME}
              className="logo flex flex-col items-center"
            >
              <div className="logo__img">
                <Apple width={32} height={32} />
              </div>
              <h2 className="text-center font-playright-bold text-h2">
                Candle Shop
              </h2>
            </Link>
            <nav className="links flex gap-4">
              <Link href={ROUTES.HOME} className="text-body-sub underline">
                Home
              </Link>
              <Link href={ROUTES.PRODUCTS} className="text-body-sub underline">
                Products
              </Link>
              <Link href={ROUTES.BLOG} className="text-body-sub underline">
                Blog
              </Link>
              <Link href={ROUTES.CONTACT} className="text-body-sub underline">
                Contact
              </Link>
            </nav>
          </div>
          <div className="footer__content-middle mx-auto w-full min-w-fit max-w-[70%]">
            <div className="newsletter w-full rounded-2xl bg-black/20 p-[32px] text-center backdrop-blur-md">
              <h3 className="font-playright-semibold text-h3">
                Subscribe to our Newsletter
              </h3>
              <Form className="mx-auto mt-[16px] max-w-[344px]">
                <Form.Group
                  classes="h-input rounded-[42px] bg-black/15 flex items-center justify-between pl-[20px] pr-[10px] py-[10px] border-black/15 hover:border-black/70 duration-300 focus-within:border-black/70 gap-[8px]"
                  renderIcon={() => (
                    <Button className="from__group-icon flex aspect-square h-[40px] items-center justify-center rounded-full bg-green-300 duration-300 hover:bg-green-200">
                      <ChevronRight
                        className="text-white"
                        width={18}
                        height={18}
                      />
                    </Button>
                  )}
                >
                  <Form.Input
                    classes="text-white placeholder:text-white"
                    placeholder="Search An Item"
                  />
                </Form.Group>
              </Form>
              <div className="social mt-[16px] flex w-full justify-center gap-4">
                <a
                  href="https://facebook.com"
                  className="text-body-sub underline"
                >
                  Facebook
                </a>
                <a
                  href="https://instagram.com"
                  className="text-body-sub underline"
                >
                  Instagram
                </a>
                <a
                  href="https://twitter.com"
                  className="text-body-sub underline"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="footer__content-bottom flex h-[67px] w-full items-center justify-center border-t border-solid border-white">
        <p className="text-body-sub text-white">
          &copy; 2023 Candle Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
