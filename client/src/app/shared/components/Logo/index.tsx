import clsx from "clsx";
import { AppleIcon } from "lucide-react";
import React from "react";

type LogoPropsType = {
  renderLogo?: React.ReactNode;
  classes?: string;
};

const Logo = ({ renderLogo, classes }: LogoPropsType) => {
  return (
    <div className={clsx("logo", classes)}>
      {renderLogo ? renderLogo : <AppleIcon />}
    </div>
  );
};

export default Logo;
