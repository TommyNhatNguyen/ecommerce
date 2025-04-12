"use client";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import GeneralModal from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { Button } from "antd";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  handleCreateRole: (data: any, callback: () => void) => void;
  refetch?: () => void;
};

const CreateRoleModal = ({
  isOpen,
  onClose,
  handleCreateRole,
  loading = false,
  refetch,
}: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const _onConfirmCreateRole = (data: any) => {
    handleCreateRole(data, () => {
      onClose();
      reset();
      refetch?.();
    });
  };
  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Create Role</h1>;
  };
  const _renderContent = () => {
    return (
      <div>
        <Controller
          control={control}
          name="name"
          rules={{
            required: {
              message: ERROR_MESSAGE.REQUIRED,
              value: true,
            },
          }}
          render={({ field }) => (
            <InputAdmin
              label="Role name"
              placeholder="Enter role name"
              error={(errors?.name?.message as string) || ""}
              required={true}
              {...field}
            />
          )}
        />
      </div>
    );
  };
  const _renderFooter = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateRole)}
        >
          Create
        </Button>
      </div>
    );
  };
  return (
    <GeneralModal
      renderTitle={_renderTitle}
      renderContent={_renderContent}
      renderFooter={_renderFooter}
      onCancel={onClose}
      open={isOpen}
      loading={loading}
    />
  );
};

export default CreateRoleModal;
