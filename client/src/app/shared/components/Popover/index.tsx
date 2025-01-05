import { Button, Popover, PopoverProps } from "antd";
import { Trash2Icon, XIcon } from "lucide-react";
import React, { useState } from "react";

type WithDeleteConfirmPopoverProps = {
  handleDelete: () => void;
  isWithDeleteConfirmPopover?: boolean;
} & PopoverProps;

const withDeleteConfirmPopover = (Component: React.ReactNode) => {
  return function withDeleteConfirmPopoverComponent({
    handleDelete,
    title,
    isWithDeleteConfirmPopover = true,
    ...props
  }: WithDeleteConfirmPopoverProps) {
    const [open, setOpen] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const _toggleOpenDeleteConfirm = () => {
      setOpenDeleteConfirm((prev) => !prev);
    };
    const _toggleOpen = () => {
      setOpen((prev) => !prev);
    };
    const _onDelete = () => {
      _toggleOpenDeleteConfirm();
      handleDelete();
    };
    const _renderContent = () => {
      return (
        <div className="flex justify-end gap-2">
          <Button type="default" onClick={_toggleOpen}>
            <XIcon className="h-4 w-4" />
            Cancel
          </Button>
          {isWithDeleteConfirmPopover ? (
            <Popover
              trigger="click"
              content={
                <div className="flex justify-end gap-2">
                  <Button type="default" onClick={_toggleOpenDeleteConfirm}>
                    <XIcon className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="primary" onClick={_onDelete}>
                    <Trash2Icon className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              }
              title="Are you sure you want to delete this item?"
            >
              <Button type="primary">
                <Trash2Icon className="h-4 w-4" />
                Delete
              </Button>
            </Popover>
          ) : (
            <Button type="primary" onClick={_onDelete}>
              <Trash2Icon className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      );
    };

    return (
      <Popover
        open={open}
        onOpenChange={(open, e) => {
          if (!openDeleteConfirm) {
            _toggleOpen();
          }
        }}
        content={_renderContent}
        title={title}
        {...props}
      >
        {Component}
      </Popover>
    );
  };
};

export default withDeleteConfirmPopover;
