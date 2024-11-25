import clsx from "clsx";
import React from "react";

type TitlegroupPropsType = {
  children: React.ReactNode;
  classes?: string;
};

const Titlegroup = ({ children, classes }: TitlegroupPropsType) => {
  return <div className={clsx("titlegroup", classes)}>{children}</div>;
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
      className={clsx("titlegroup__title font-playright-bold text-h2", classes)}
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
  return <div className={clsx("titlegroup__info", classes)}>{children}</div>;
};

Titlegroup.Description = ({
  children,
  classes,
}: {
  children: React.ReactNode;
  classes?: string;
}) => {
  return <p className={clsx("titlegroup__info-desc", classes)}>{children}</p>;
};

export default Titlegroup;
