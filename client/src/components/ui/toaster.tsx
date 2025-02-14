"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from "@/app/shared/utils/utils";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        className,
        ...props
      }) {
        return (
          <Toast key={id} {...props} className={cn("bg-bg-primary", className)}>
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="font-roboto-bold text-body-big">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="font-roboto-regular text-body-text">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
