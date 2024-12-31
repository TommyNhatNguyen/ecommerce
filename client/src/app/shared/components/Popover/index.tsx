import { Button, Popover, PopoverProps } from "antd";
import { Trash2Icon, XIcon } from "lucide-react";
import React, { useState } from "react";

type WithDeleteConfirmPopoverProps = {
  handleCancel: () => void;
  handleDelete: () => void;
} & PopoverProps;

const withDeleteConfirmPopover = (Component: React.ReactNode) => {
  return function withDeleteConfirmPopoverComponent({
    handleCancel,
    handleDelete,
    ...props
  }: WithDeleteConfirmPopoverProps) {
    const [open, setOpen] = useState(false);
    const _onDelete = () => {
      handleDelete();
      setOpen(false);
    };
    const _onCancel = () => {
      handleCancel();
      setOpen(false);
    };
    const _toggleOpen = () => {
      setOpen(!open);
    };
    const _renderContent = () => {
      return (
        <div className="flex justify-end gap-1">
          <Button type="primary" onClick={_onDelete}>
            <Trash2Icon className="h-4 w-4" />
            Delete
          </Button>
          <Button type="default" onClick={_onCancel}>
            <XIcon className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      );
    };

    return (
      <Popover
        open={open}
        onOpenChange={_toggleOpen}
        content={_renderContent}
        title="Are you sure you want to delete this item?"
        {...props}
      >
        {Component}
      </Popover>
    );
  };
};

export default withDeleteConfirmPopover;
