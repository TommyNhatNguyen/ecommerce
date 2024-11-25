import { ShoppingCart, User } from "lucide-react";
import React from "react";
import clsx from "clsx";
import Link from "next/link";
import Button, { ButtonWithLink } from "@/app/shared/components/Button";
import { ROUTES } from "@/app/constants/routes";

type Props = {
  classes?: string;
};

const Cta = ({ classes }: Props) => {
  const _onShowAuthenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("clicked", e.target);
  };
  return (
    <div className={clsx("cta flex items-center gap-4", classes)}>
      <ButtonWithLink
        onClick={_onShowAuthenModal}
        link={ROUTES.AUTHEN}
        classes="cta__login font-roboto-medium text-body-text"
      >
        Login/Register
      </ButtonWithLink>
      <Link className="cta__profile" href={ROUTES.PROFILE}>
        <User />
      </Link>
      <Link className="cta__cart" href={ROUTES.CART}>
        <ShoppingCart />
      </Link>
    </div>
  );
};

export default Cta;
