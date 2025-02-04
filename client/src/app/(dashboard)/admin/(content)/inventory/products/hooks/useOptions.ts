import { useNotification } from "@/app/contexts/NotificationContext";
import { useState } from "react";

export const useOptions = () => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<any>("");
  const { notificationApi } = useNotification();
  const handleDeleteOption = async (id: string) => {
    console.log(id);
  };
  return {
    handleDeleteOption,
    loadingDelete,
    errorDelete,
  };
};
