import clsx from "clsx";
import React from "react";

type ContainerPropsType = {
  children: React.ReactNode;
  classes?: string;
};

const Container = ({ children, classes }: ContainerPropsType) => {
  return <div className={clsx("container", classes)}>{children}</div>;
};

export default Container;
