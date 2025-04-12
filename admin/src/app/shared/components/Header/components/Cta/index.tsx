"use client";
import { ShoppingCart, User } from "lucide-react";
import React, { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import Button, { ButtonWithLink } from "@/app/shared/components/Button";
import { ROUTES } from "@/app/constants/routes";
import AuthModal from "../../../AuthModal";
import { useCustomerAppSelector } from "@/app/shared/hooks/useRedux";
import Navbar from "@/app/shared/components/Navbar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import CartDropdown from "@/app/shared/components/Header/components/Cta/components/CartDropdown";
import Profile from "@/app/shared/components/Header/components/Cta/components/Profile";

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
      <Profile handleShowAuthModal={_onShowAuthenModal} />
      <CartDropdown />
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
