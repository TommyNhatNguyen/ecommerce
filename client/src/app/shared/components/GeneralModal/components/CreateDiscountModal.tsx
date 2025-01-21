import { ERROR_MESSAGE } from "@/app/constants/errors";
import { DatePicker, InputNumber, Select } from "antd";
import GeneralModal from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { Button, Input } from "antd";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  formatCurrency,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import { DISCOUNT_SCOPE, DISCOUNT_TYPE } from "@/app/constants/enum";
import { DiscountScope } from "@/app/shared/interfaces/discounts/discounts.dto";

type CreateDiscountModalPropsType = {
  isModalCreateDiscountCampaignOpen: boolean;
  handleCloseModalCreateDiscountCampaign: () => void;
  handleSubmitCreateDiscountCampaignForm: (data: any) => void;
  loading?: boolean;
  defaultScope?: DiscountScope;
};

const CreateDiscountModal = ({
  isModalCreateDiscountCampaignOpen,
  handleCloseModalCreateDiscountCampaign,
  handleSubmitCreateDiscountCampaignForm,
  loading = false,
  defaultScope = DISCOUNT_SCOPE.PRODUCT,
}: CreateDiscountModalPropsType) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();
  const _onCloseModalCreateDiscountCampaign = () => {
    handleCloseModalCreateDiscountCampaign();
    reset();
  };

  const _onConfirmCreateDiscountCampaign = (data: any) => {
    handleSubmitCreateDiscountCampaignForm(data);
    reset();
  };
  useEffect(() => {
    reset({
      scope: defaultScope,
    });
  }, []);
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
                label="Discount Type"
                placeholder="Discount Type"
                required={true}
                error={errors.type?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <Select
                    options={Object.values(DISCOUNT_TYPE).map((type) => ({
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
            name="scope"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field }) => (
              <InputAdmin
                label="Discount Scope"
                placeholder="Discount Scope"
                required={true}
                error={errors.scope?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <Select
                    disabled={true}
                    options={Object.values(DISCOUNT_SCOPE).map((scope) => ({
                      label: scope,
                      value: scope,
                    }))}
                    optionRender={({ label }) => (
                      <div className="capitalize">{label}</div>
                    )}
                    labelRender={({ label }) => (
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
            name="amount"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
              min: {
                value: 0,
                message: "Discount amount must be greater than 0",
              },
            }}
            render={({ field }) => (
              <InputAdmin
                label="Discount Amount"
                placeholder="Discount Amount"
                groupClassName="flex-1"
                required={true}
                error={errors.amount?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <InputNumber
                    min={0}
                    max={
                      watch("type") === DISCOUNT_TYPE.PERCENTAGE
                        ? 100
                        : undefined
                    }
                    className="w-full"
                    ref={ref}
                    {...props}
                    formatter={(value) =>
                      watch("type") === DISCOUNT_TYPE.PERCENTAGE
                        ? `${formatDiscountPercentage(Number(value))}`
                        : `${formatCurrency(Number(value))}`
                    }
                  />
                )}
              />
            )}
          />
        </div>
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
