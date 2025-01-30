import { ERROR_MESSAGE } from "@/app/constants/errors";
import { VALIDATION_PATTERN } from "@/app/constants/validations";
import GeneralModal from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { roleService } from "@/app/shared/services/role/roleService";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Select } from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type CreateUserModalPropsType = {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  handleCreateUser: (data: any, callback: () => void) => void;
};

const CreateUserModal = ({
  isOpen,
  onClose,
  handleCreateUser,
  loading = false,
}: CreateUserModalPropsType) => {
  const { data: roleData } = useQuery({
    queryKey: ["role"],
    queryFn: () => roleService.getRoleList({ is_get_all: true }),
  });
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  const _onConfirmCreateUser = (data: any) => {
    handleCreateUser(data, () => {
      onClose();
      reset();
    });
  };
  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Create Category</h1>;
  };
  const _renderContent = () => {
    return (
      <div className="flex w-full flex-1 flex-shrink-0 flex-col gap-4">
        {/* Username */}
        <Controller
          control={control}
          name="username"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field }) => (
            <InputAdmin
              label="Username"
              placeholder="Username"
              required={true}
              error={errors.username?.message as string}
              {...field}
            />
          )}
        />
        {/* Password */}
        <Controller
          control={control}
          name="password"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field }) => (
            <InputAdmin
              label="Password"
              placeholder="Password"
              required={true}
              error={errors.password?.message as string}
              {...field}
              customComponent={(props, ref: any) => (
                <Input.Password {...props} ref={ref} />
              )}
            />
          )}
        />
        {/* Confirm password */}
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
            validate: (value) => {
              if (value !== getValues("password")) {
                return ERROR_MESSAGE.PASSWORD_NOT_MATCH;
              }
              return true;
            },
          }}
          render={({ field }) => (
            <InputAdmin
              label="Confirm Password"
              placeholder="Confirm Password"
              required={true}
              error={errors.confirmPassword?.message as string}
              {...field}
              customComponent={(props, ref: any) => (
                <Input.Password {...props} ref={ref} />
              )}
            />
          )}
        />
        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
            pattern: {
              value: VALIDATION_PATTERN.PHONE,
              message: ERROR_MESSAGE.INVALID_PHONE,
            },
          }}
          render={({ field }) => (
            <InputAdmin
              label="Phone"
              placeholder="Phone"
              required={true}
              error={errors.phone?.message as string}
              {...field}
            />
          )}
        />
        {/* Email */}
        <Controller
          control={control}
          name="email"
          rules={{
            pattern: {
              value: VALIDATION_PATTERN.EMAIL,
              message: ERROR_MESSAGE.INVALID_EMAIL,
            },
          }}
          render={({ field }) => (
            <InputAdmin
              label="Email"
              placeholder="Email"
              error={errors.email?.message as string}
              {...field}
            />
          )}
        />
        {/* Role */}
        <Controller
          control={control}
          name="role_id"
          render={({ field }) => (
            <InputAdmin
              label="Role"
              placeholder="Role"
              {...field}
              customComponent={(props, ref: any) => (
                <Select
                  options={roleData?.data?.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  placeholder="Select Role"
                  {...props}
                  ref={ref}
                />
              )}
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
          onClick={handleSubmit(_onConfirmCreateUser)}
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

export default CreateUserModal;
