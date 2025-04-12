import React, { Ref, forwardRef } from "react";
import { cn } from "../../utils/utils";
import { type ClassValue } from "clsx";
type ContainerPropsType = {
  children: React.ReactNode;
  classes?: string;
};

const Container = ({ children, classes }: ContainerPropsType) => {
  return <div className={cn("container", classes)}>{children}</div>;
};

type RichTextContainer = {
  children?: React.ReactNode;
  classes?: ClassValue;
} & React.ComponentPropsWithRef<"div">;

export const RichTextContainer = forwardRef(
  (
    { children, classes, ...props }: RichTextContainer,
    ref: Ref<HTMLDivElement>,
  ) => {
    return (
      <div className={cn("rich-text-container", classes)} {...props} ref={ref}>
        {children}
      </div>
    );
  },
);

export default Container;
