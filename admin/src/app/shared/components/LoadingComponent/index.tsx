import { Spin, SpinProps } from "antd";
import { LoaderPinwheel } from "lucide-react";
import React from "react";

type LoadingComponentPropsType = {
  isLoading: boolean;
  size?: "small" | "default" | "large";
} & SpinProps;

const LoadingComponent = ({
  isLoading = false,
  size = "large",
  ...props
}: LoadingComponentPropsType) => {
  if (!isLoading) return null;
  return (
    <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-white/50">
      <Spin
        indicator={<LoaderPinwheel className="animate-spin" />}
        size={size}
        {...props}
      />
    </div>
  );
};

export default LoadingComponent;
