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
        "bg-custom-white relative flex h-full w-full items-center justify-center overflow-hidden rounded-md",
        className,
      )}
      {...props}
    >
      <ImageOffIcon width={32} height={32} />
    </div>
  );
};

export default NoImageComponent;
