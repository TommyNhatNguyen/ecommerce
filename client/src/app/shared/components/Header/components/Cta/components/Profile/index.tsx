import { ROUTES } from "@/app/constants/routes";
import { useCustomerAppSelector } from "@/app/shared/hooks/useRedux";
import React from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { ButtonWithLink } from "@/app/shared/components/Button";
type Props = {
  handleShowAuthModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Profile = ({ handleShowAuthModal }: Props) => {
  const { customerInfo } = useCustomerAppSelector((state) => state.auth);
  return !!customerInfo ? (
    <Link className="cta__profile" href={ROUTES.PROFILE}>
      <User />
    </Link>
  ) : (
    <ButtonWithLink
      variant="vanilla"
      onClick={handleShowAuthModal}
      link={ROUTES.AUTHEN}
      classes="cta__login font-roboto-medium text-body-text text-green-300 hover:text-green-100"
    >
      Login/Register
    </ButtonWithLink>
  );
};

export default Profile;
