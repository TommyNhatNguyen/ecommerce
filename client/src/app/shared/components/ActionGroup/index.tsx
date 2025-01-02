import { MoreHorizontal } from "lucide-react";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { Button, Popover, PopoverProps } from "antd";
import { Pencil, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import LoadingComponent from "@/app/shared/components/LoadingComponent";

type ActionGroupPropsType = {
  handleDelete: (...args: any[]) => void;
  handleEdit?: (...args: any[]) => void;
  content?: React.ReactNode;
  loading?: boolean;
} & PopoverProps;
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);
const ActionGroup = ({
  handleDelete,
  handleEdit,
  content,
  loading = false,
  ...props
}: ActionGroupPropsType) => {
  const [open, setOpen] = useState(false);
  const _onToggleOpen = () => {
    setOpen((prev) => !prev);
  };
  const _onEdit = () => {
    handleEdit?.();
    _onToggleOpen();
  };
  const _onDelete = () => {
    handleDelete?.();
    _onToggleOpen();
  };
  return (
    <Popover
      open={open}
      onOpenChange={_onToggleOpen}
      content={
        content ? (
          <div className="flex items-center gap-2 relative">
            {content}
            {loading && <LoadingComponent isLoading={loading} />}
          </div>
        ) : (
          <div className="flex items-center gap-2 relative">
            {!!handleEdit && (
              <Button
                type="text"
                className="aspect-square rounded-full p-0"
                onClick={_onEdit}
              >
                <Pencil className="h-4 w-4 stroke-yellow-500" />
              </Button>
            )}
            {!!handleDelete && (
              <ButtonDeleteWithPopover handleDelete={_onDelete} />
            )}
            {loading && <LoadingComponent isLoading={loading} />}
          </div>
        )
      }
      trigger="click"
      {...props}
    >
      <Button
        type="text"
        variant="outlined"
        className="aspect-square rounded-full p-0"
        disabled={loading}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </Popover>
  );
};

export default ActionGroup;
