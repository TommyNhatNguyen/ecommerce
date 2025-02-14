// import { useNotification } from "@/app/contexts/NotificationContext";
import { useCustomerAppDispatch } from "@/app/shared/hooks/useRedux";
import { CustomerLoginDTO } from "@/app/shared/interfaces/customers/customers.dto";
import { login } from "@/app/shared/store/main-reducers/auth/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useCustomerAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const handleLogin = async (data: CustomerLoginDTO, callback: () => void) => {
    try {
      setIsLoading(true);
      dispatch(
        login({
          data,
          callback: {
            success: () => {
              toast({
                title: "Welcome back",
                description: "Login successful",
                variant: "default",
                className: "bg-bg-primary",
              });
              callback();
              router.push("/home");
            },
            error: (error: any) => {
              console.log("🚀 ~ handleLogin ~ error:", error);
              toast({
                title: "Login failed",
                description: error?.response?.data?.message || "Login failed",
                variant: "destructive",
                className: "bg-bg-primary",
              });
            },
          },
        }),
      );
    } catch (error: any) {
      console.log(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return { handleLogin, isLoading, error };
};
