'use client'

import { Button, Popover, PopoverProps } from "antd";
import { Trash2Icon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useIntl } from "react-intl";

type WithDeleteConfirmPopoverProps = {
  handleDelete: () => void;
  isWithDeleteConfirmPopover?: boolean;
  title?: string;
} & PopoverProps;

const withDeleteConfirmPopover = (Component: React.ReactNode) => {
  return function withDeleteConfirmPopoverComponent({
    handleDelete,
    title,
    isWithDeleteConfirmPopover = true,
    ...props
  }: WithDeleteConfirmPopoverProps) {
    const intl = useIntl();
    const [open, setOpen] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const _toggleOpenDeleteConfirm = () => {
      setOpenDeleteConfirm((prev) => !prev);
    };
    const _toggleOpen = () => {
      setOpen((prev) => !prev);
    };
    const _onDelete = () => {
      handleDelete();
    };
    const _renderContent = () => {
      return (
        <div className="flex justify-end gap-2">
          <Button type="default" onClick={_toggleOpen}>
            <XIcon className="h-4 w-4" />
            {intl.formatMessage({ id: "close" })}
          </Button>
          {isWithDeleteConfirmPopover ? (
            <Popover
              trigger="click"
              open={openDeleteConfirm}
              onOpenChange={() => {
                _toggleOpenDeleteConfirm();
              }}
              content={
                <div className="flex justify-end gap-2">
                  <Button type="default" onClick={_toggleOpenDeleteConfirm}>
                    <XIcon className="h-4 w-4" />
                    {intl.formatMessage({ id: "close" })}
                  </Button>
                  <Button type="primary" onClick={_onDelete}>
                    <Trash2Icon className="h-4 w-4" />
                    {intl.formatMessage({ id: "delete" })}
                  </Button>
                </div>
              }
              title={title || intl.formatMessage({ id: "are_you_sure_you_want_to_delete_this_item" })}
            >
              <Button type="primary">
                <Trash2Icon className="h-4 w-4" />
                {intl.formatMessage({ id: "delete" })}
              </Button>
            </Popover>
          ) : (
            <Button type="primary" onClick={_onDelete}>
              <Trash2Icon className="h-4 w-4" />
              {intl.formatMessage({ id: "delete" })}
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
