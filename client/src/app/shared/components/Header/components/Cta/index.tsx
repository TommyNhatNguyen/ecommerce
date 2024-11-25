import { ShoppingCart, User } from "lucide-react";
import React from "react";
import clsx from "clsx";
import Link from "next/link";
import Button, { ButtonWithLink } from "@/app/shared/components/Button";

type Props = {
  classes?: string;
};

const Cta = ({ classes }: Props) => {
  return (
    <div className={clsx("cta flex items-center gap-4", classes)}>
      <ButtonWithLink
        onClick={(e) => {
          e.preventDefault();
          console.log("clicked", e.target);
        }}
        link="/login"
        classes="cta__login font-roboto-medium text-body-text"
      >
        Login/Register
      </ButtonWithLink>
      <Link className="cta__profile" href="/profile">
        <User />
      </Link>
      <div className="cta__cart">
        <ShoppingCart />
      </div>
    </div>
  );
};

export default Cta;
