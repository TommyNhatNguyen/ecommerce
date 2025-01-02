import { ERROR_MESSAGE } from "@/app/constants/errors";
import { DatePicker, InputNumber } from "antd";
import GeneralModal from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { Button, Input } from "antd";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { formatDiscountPercentage } from "@/app/shared/utils/utils";

type CreateDiscountModalPropsType = {
  isModalCreateDiscountCampaignOpen: boolean;
  handleCloseModalCreateDiscountCampaign: () => void;
  handleSubmitCreateDiscountCampaignForm: (data: any) => void;
  loading?: boolean;
};

const CreateDiscountModal = ({
  isModalCreateDiscountCampaignOpen,
  handleCloseModalCreateDiscountCampaign,
  handleSubmitCreateDiscountCampaignForm,
  loading = false,
}: CreateDiscountModalPropsType) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const _onCloseModalCreateDiscountCampaign = () => {
    handleCloseModalCreateDiscountCampaign();
    reset();
  };

  const _onConfirmCreateDiscountCampaign = (data: any) => {
    handleSubmitCreateDiscountCampaignForm(data);
    reset();
  };

  const _renderFooterModalCreateDiscountCampaign = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModalCreateDiscountCampaign}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateDiscountCampaign)}
        >
          Create
        </Button>
      </div>
    );
  };

  const _renderTitleModalCreateDiscountCampaign = () => {
    return <h1 className="text-2xl font-bold">Create Discount Campaign</h1>;
  };

  const _renderContentModalCreateDiscountCampaign = () => {
    return (
      <div className="my-4 flex w-full flex-1 flex-shrink-0 flex-col gap-4">
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
              required={true}
              placeholder="Name"
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
        <Controller
          control={control}
          name="discountPercentage"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
            min: {
              value: 0,
              message: "Discount percentage must be greater than 0%",
            },
            max: {
              value: 100,
              message: "Discount percentage must be less than 100%",
            },
          }}
          render={({ field }) => (
            <InputAdmin
              label="Discount Percentage"
              placeholder="Discount Percentage"
              required={true}
              error={errors.discountPercentage?.message as string}
              {...field}
              customComponent={(props: any, ref: any) => (
                <InputNumber
                  min={0}
                  max={100}
                  className="w-full"
                  formatter={(value) => `${value}%`}
                  ref={ref}
                  {...props}
                />
              )}
            />
          )}
        />
        <div className="flex gap-2">
          <Controller
            control={control}
            name="startDate"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field }) => (
              <InputAdmin
                groupClassName="flex-1"
                label="Start Date"
                placeholder="Start Date"
                required={true}
                error={errors.startDate?.message as string}
                customComponent={(props: any, ref: any) => (
                  <DatePicker {...props} ref={ref} />
                )}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="endDate"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field }) => (
              <InputAdmin
                groupClassName="flex-1"
                label="End Date"
                placeholder="End Date"
                required={true}
                error={errors.endDate?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <DatePicker {...props} ref={ref} />
                )}
              />
            )}
          />
        </div>
      </div>
    );
  };
  return (
    <GeneralModal
      open={isModalCreateDiscountCampaignOpen}
      renderTitle={_renderTitleModalCreateDiscountCampaign}
      renderFooter={_renderFooterModalCreateDiscountCampaign}
      renderContent={_renderContentModalCreateDiscountCampaign}
      onCancel={_onCloseModalCreateDiscountCampaign}
      loading={loading}
    />
  );
};

export default CreateDiscountModal;
