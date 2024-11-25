import { ROUTES } from "@/app/constants/routes";
import clsx from "clsx";
import { AppleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type LogoPropsType = {
  renderLogo?: React.ReactNode;
  classes?: string;
};

const Logo = ({ renderLogo, classes }: LogoPropsType) => {
  return (
    <Link href={ROUTES.HOME} className={clsx("logo", classes)}>
      {renderLogo ? renderLogo : <AppleIcon />}
    </Link>
  );
};

export default Logo;
