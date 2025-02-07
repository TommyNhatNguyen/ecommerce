import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { label?: () => React.ReactNode }
>(({ className, type, label, ...props }, ref) => {
  return (
    <div>
      {label && <div className="mb-2">{label()}</div>}
      <div className="overflow-hidden rounded-sm">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-input shadow-sm transition-colors file:border-0 file:bg-transparent file:font-roboto-regular file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    </div>
  );
});
Input.displayName = "Input";

export { Input };
