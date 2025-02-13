import { ImageOffIcon } from "lucide-react";
import React from "react";
import { cn } from "../../utils/utils";
import { type ClassValue } from "clsx";

type Props = {
  className?: ClassValue;
};

const NoImageComponent = ({ className, ...props }: Props) => {
  return (
    <div
      className={cn(
        "bg-custom-white rounded-m relative flex h-full w-full items-center justify-center overflow-hidden",
        "overflow-hidden rounded-md before:block before:h-full before:w-full before:pt-[100%]",
        className,
      )}
      {...props}
    >
      <ImageOffIcon className="absolute min-h-[20%]" />
    </div>
  );
};

export default NoImageComponent;
