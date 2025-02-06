import { NUMBER_TYPE } from "@/app/constants/enum";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import { statusOptions } from "@/app/constants/seeds";
import GeneralModal from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { CreateCategoryFormDTO } from "@/app/shared/interfaces/categories/category.dto";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { imagesService } from "@/app/shared/services/images/imagesService";
import {
  formatCurrency,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import { Button, Input, InputNumber, Select, Upload, UploadFile } from "antd";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
type CreateCostModalPropsType = {
  isModalCreateCostOpen: boolean;
  handleCloseModalCreateCost: () => void;
  handleSubmitCreateCostForm: (data: any) => void;
  loading?: boolean;
};

const CreateCostModal = ({
  isModalCreateCostOpen,
  handleCloseModalCreateCost,
  handleSubmitCreateCostForm,
  loading = false,
}: CreateCostModalPropsType) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  useEffect(() => {
    reset({
      status: "ACTIVE",
      type: NUMBER_TYPE.FIXED,
    });
  }, [isModalCreateCostOpen]);
  const _onCloseModalCreateCost = () => {
    handleCloseModalCreateCost();
    reset();
  };
  const _onConfirmCreateCost = (data: any) => {
    handleSubmitCreateCostForm(data);
    _onCloseModalCreateCost();
  };
  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Create Cost</h1>;
  };
  const _renderContent = () => {
    return (
      <div className="flex w-full flex-1 flex-shrink-0 flex-col gap-4">
        <Controller
          control={control}
          name="name"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field, formState: { errors } }) => (
            <InputAdmin
              label="Name"
              placeholder="Name"
              required={true}
              error={errors.name?.message as string}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <InputAdmin
              label="Description"
              placeholder="Description"
              customComponent={(props: any, ref: any) => (
                <Input.TextArea rows={4} {...props} ref={ref} />
              )}
              {...field}
            />
          )}
        />
        <div className="flex items-start gap-2">
          <Controller
            control={control}
            name="type"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field }) => (
              <InputAdmin
                label="Cost Type"
                placeholder="Cost Type"
                required={true}
                error={errors.type?.message as string}
                {...field}
                groupClassName="flex-1"
                customComponent={(props: any, ref: any) => (
                  <Select
                    placeholder="Select Cost Type"
                    options={Object.values(NUMBER_TYPE).map((type) => ({
                      label: type,
                      value: type,
                    }))}
                    labelRender={({ label }) => (
                      <div className="capitalize">{label}</div>
                    )}
                    optionRender={({ label }) => (
                      <div className="capitalize">{label}</div>
                    )}
                    {...props}
                    ref={ref}
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="cost"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
              min: {
                value: 0,
                message: "Cost must be greater than 0",
              },
            }}
            render={({ field }) => (
              <InputAdmin
                label="Cost"
                placeholder="Cost"
                groupClassName="flex-1"
                required={true}
                error={errors.cost?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <InputNumber
                    min={0}
                    max={
                      watch("type") === NUMBER_TYPE.PERCENTAGE ? 100 : undefined
                    }
                    className="w-full"
                    ref={ref}
                    {...props}
                    formatter={(value) =>
                      watch("type") === NUMBER_TYPE.PERCENTAGE
                        ? `${formatDiscountPercentage(Number(value))}`
                        : `${formatCurrency(Number(value))}`
                    }
                  />
                )}
              />
            )}
          />
        </div>
        <InputAdmin
          label="Status"
          placeholder="Status"
          required={true}
          error={errors.status?.message as string}
          customComponent={(props: any, ref: any) => (
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  options={statusOptions}
                  placeholder="Select Status"
                  value={field.value}
                  onChange={field.onChange}
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
        <Button type="default" onClick={_onCloseModalCreateCost}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateCost)}
        >
          Create
        </Button>
      </div>
    );
  };
  return (
    <GeneralModal
      open={isModalCreateCostOpen}
      renderTitle={_renderTitle}
      renderContent={_renderContent}
      renderFooter={_renderFooter}
      onCancel={_onCloseModalCreateCost}
      loading={loading}
    />
  );
};

export default CreateCostModal;
