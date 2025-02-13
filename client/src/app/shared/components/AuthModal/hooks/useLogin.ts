// import { useNotification } from "@/app/contexts/NotificationContext";
import { useCustomerAppDispatch } from "@/app/shared/hooks/useRedux";
import { CustomerLoginDTO } from "@/app/shared/interfaces/customers/customers.dto";
import { login } from "@/app/shared/store/main-reducers/auth/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useCustomerAppDispatch();
  const router = useRouter();
  //   const { notificationApi } = useNotification();
  const handleLogin = async (data: CustomerLoginDTO) => {
    try {
      setIsLoading(true);
      dispatch(
        login({
          data,
          callback: {
            success: () => {
              //   notificationApi.success({
              //     message: "Login successfully",
              //     description: "You are now logged in",
              //   });
              router.push("/home");
            },
            error: (error: any) => {
              //   notificationApi.error({
              //     message: "Login failed",
              //     description: error?.response?.data?.message || "Login failed",
              //   });
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
