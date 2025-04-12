import { cn } from "@/lib/utils";
import React from "react";

type TitlegroupPropsType = {
  children: React.ReactNode;
  classes?: string;
};

const Titlegroup = ({ children, classes }: TitlegroupPropsType) => {
  return <div className={cn("titlegroup", classes)}>{children}</div>;
};

Titlegroup.Title = ({
  children,
  classes,
}: {
  children: React.ReactNode;
  classes?: string;
}) => {
  return (
    <h2
      className={cn("titlegroup__title font-playright-bold text-h2", classes)}
    >
      {children}
    </h2>
  );
};

Titlegroup.Info = ({
  children,
  classes,
}: {
  children: React.ReactNode;
  classes?: string;
}) => {
  return <div className={cn("titlegroup__info", classes)}>{children}</div>;
};

Titlegroup.Description = ({
  children,
  classes,
}: {
  children: React.ReactNode;
  classes?: string;
}) => {
  return <p className={cn("titlegroup__info-desc", classes)}>{children}</p>;
};

export default Titlegroup;
