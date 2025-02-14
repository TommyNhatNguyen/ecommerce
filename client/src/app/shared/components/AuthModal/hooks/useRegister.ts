import {
  CustomerLoginDTO,
  CustomerRegisterDTO,
} from "@/app/shared/interfaces/customers/customers.dto";
import { customerService } from "@/app/shared/services/customers/customerService";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const handleRegister = async (
    data: CustomerRegisterDTO,
    callback: {
      login: (data: CustomerLoginDTO) => void;
      callback?: () => void;
    },
  ) => {
    try {
      setIsLoading(true);
      const response = await customerService.register(data);
      if (response) {
        toast({
          title: "Register successful",
          description: "Register successful",
          variant: "default",
          className: "bg-bg-primary",
        });
        const loginPayload: CustomerLoginDTO = {
          username: response.username || data.username,
          password: data.password,
        };
        callback.login(loginPayload);
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Login failed",
        description: error?.response?.data?.message || "Login failed",
        variant: "destructive",
        className: "bg-bg-primary",
      });
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return { handleRegister, isLoading, error };
};
