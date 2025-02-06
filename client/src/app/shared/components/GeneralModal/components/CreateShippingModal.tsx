import { ERROR_MESSAGE } from "@/app/constants/errors";
import { statusOptions } from "@/app/constants/seeds";
import GeneralModal from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { CreateCategoryFormDTO } from "@/app/shared/interfaces/categories/category.dto";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { imagesService } from "@/app/shared/services/images/imagesService";
import { formatCurrency } from "@/app/shared/utils/utils";
import { Button, Input, InputNumber, Select, Upload, UploadFile } from "antd";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
type CreateShippingModalPropsType = {
  isModalCreateShippingOpen: boolean;
  handleCloseModalCreateShipping: () => void;
  handleSubmitCreateShippingForm: (data: any) => void;
  loading?: boolean;
  refetch?: () => void;
};

const CreateShippingModal = ({
  isModalCreateShippingOpen,
  handleCloseModalCreateShipping,
  handleSubmitCreateShippingForm,
  loading = false,
  refetch,
}: CreateShippingModalPropsType) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      status: "ACTIVE",
      type: "",
      cost: 0,
    },
  });
  const _onCloseModalCreateShipping = () => {
    handleCloseModalCreateShipping();
    reset();
  };
  const _onConfirmCreateShipping = (data: any) => {
    handleSubmitCreateShippingForm(data);
    _onCloseModalCreateShipping();
    refetch?.();  
  };
  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Create Shipping</h1>;
  };
  const _renderContent = () => {
    return (
      <div className="flex w-full flex-1 flex-shrink-0 flex-col gap-4">
        <Controller
          control={control}
          name="type"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field, formState: { errors } }) => (
            <InputAdmin
              label="Type"
              placeholder="Type"
              required={true}
              error={errors.type?.message as string}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="cost"
          render={({ field, formState: { errors } }) => (
            <InputAdmin
              label="Cost"
              required={true}
              placeholder="Cost"
              error={errors.cost?.message as string}
              {...field}
              customComponent={(props: any, ref: any) => (
                <InputNumber
                  className="w-full"
                  ref={ref}
                  formatter={(value) => formatCurrency(Number(value))}
                  {...props}
                />
              )}
            />
          )}
        />
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
        <Button type="default" onClick={_onCloseModalCreateShipping}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateShipping)}
        >
          Create
        </Button>
      </div>
    );
  };
  return (
    <GeneralModal
      open={isModalCreateShippingOpen}
      renderTitle={_renderTitle}
      renderContent={_renderContent}
      renderFooter={_renderFooter}
      onCancel={_onCloseModalCreateShipping}
      loading={loading}
    />
  );
};

export default CreateShippingModal;
