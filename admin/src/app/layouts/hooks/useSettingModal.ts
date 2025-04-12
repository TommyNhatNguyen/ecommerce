import { useState } from "react";

export const useSettingModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return {
    open,
    loading,
    handleCancel,
    handleOpen,
  };
};
