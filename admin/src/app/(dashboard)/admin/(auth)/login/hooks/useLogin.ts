import { useNotification } from "@/app/contexts/NotificationContext";
import { useAppDispatch } from "@/app/shared/hooks/useRedux";
import { LoginDTO } from "@/app/shared/interfaces/auth/auth.dto";
import { authServices } from "@/app/shared/services/auth/authServices";
import { login } from "@/app/shared/store/reducers/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { notificationApi } = useNotification();
  const handleLogin = async (data: LoginDTO) => {
    try {
      setIsLoading(true);
      dispatch(
        login({
          data,
          callback: {
            success: () => {
              notificationApi.success({
                message: "Login successfully",
                description: "You are now logged in",
              });
              router.push("/admin/orders");
            },
            error: (error: any) => {
              notificationApi.error({
                message: "Login failed",
                description: error?.response?.data?.message || "Login failed",
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
