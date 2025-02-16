"use client";
import { ShoppingCart, User } from "lucide-react";
import React, { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import Button, { ButtonWithLink } from "@/app/shared/components/Button";
import { ROUTES } from "@/app/constants/routes";
import AuthModal from "../../../AuthModal";
import { useCustomerAppSelector } from "@/app/shared/hooks/useRedux";

type Props = {
  classes?: string;
};

export enum ModalType {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
}

const Cta = ({ classes }: Props) => {
  const [isShowAuthModal, setIsShowAuthModal] = useState<ModalType | null>(
    null,
  );
  const { customerInfo } = useCustomerAppSelector((state) => state.auth);
  const _onShowAuthenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsShowAuthModal(ModalType.LOGIN);
  };
  const _onModalChange = (value: string) => {
    setIsShowAuthModal(value as ModalType);
  };
  const _onCloseAuthenModal = () => {
    setIsShowAuthModal(null);
  };
  return (
    <div className={clsx("cta flex items-center gap-4", classes)}>
      {!!customerInfo ? (
        <Link className="cta__profile" href={ROUTES.PROFILE}>
          <User />
        </Link>
      ) : (
        <ButtonWithLink
          variant="vanilla"
          onClick={_onShowAuthenModal}
          link={ROUTES.AUTHEN}
          classes="cta__login font-roboto-medium text-body-text text-green-300 hover:text-green-100"
        >
          Login/Register
        </ButtonWithLink>
      )}

      <Link className="cta__cart" href={ROUTES.CART}>
        <ShoppingCart />
      </Link>
      {/* Authmodal */}
      <AuthModal
        showModal={isShowAuthModal}
        onCancel={_onCloseAuthenModal}
        onModalChange={_onModalChange}
      />
    </div>
  );
};

export default Cta;
