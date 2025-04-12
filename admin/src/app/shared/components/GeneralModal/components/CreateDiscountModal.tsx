import { ERROR_MESSAGE } from "@/app/constants/errors";
import { Checkbox, DatePicker, InputNumber, Select } from "antd";
import GeneralModal from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { Button, Input } from "antd";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  formatCurrency,
  formatDiscountPercentage,
  formatNumber,
} from "@/app/shared/utils/utils";
import { DISCOUNT_SCOPE, DISCOUNT_TYPE } from "@/app/constants/enum";
import {
  CreateDiscountDTO,
  DiscountScope,
} from "@/app/shared/interfaces/discounts/discounts.dto";
import { getDateFormat } from "@/app/shared/utils/datetime";
import dayjs from "dayjs";

type CreateDiscountModalPropsType = {
  isModalCreateDiscountCampaignOpen: boolean;
  handleCloseModalCreateDiscountCampaign: () => void;
  handleSubmitCreateDiscountCampaignForm: (data: any) => void;
  loading?: boolean;
  defaultScope?: DiscountScope;
  refetch?: () => void;
};

const CreateDiscountModal = ({
  isModalCreateDiscountCampaignOpen,
  handleCloseModalCreateDiscountCampaign,
  handleSubmitCreateDiscountCampaignForm,
  loading = false,
  defaultScope = DISCOUNT_SCOPE.PRODUCT,
  refetch,
}: CreateDiscountModalPropsType) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<CreateDiscountDTO>();
  const _onCloseModalCreateDiscountCampaign = () => {
    handleCloseModalCreateDiscountCampaign();
    reset();
  };

  const _onConfirmCreateDiscountCampaign = (data: CreateDiscountDTO) => {
    const payload: CreateDiscountDTO = {
      ...data,
      is_fixed: !data?.is_fixed ? false : data.is_fixed,
      is_free: !data?.is_free ? false : data.is_free,
    };
    handleSubmitCreateDiscountCampaignForm(payload);
    reset();
    refetch?.();
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
        {/* Name */}
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
        {/* Description */}
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
        {/* Is fixed, is free, amount, scope */}
        <Controller
          control={control}
          name="is_fixed"
          render={({ field: { value, onChange, ...field } }) => (
            <Checkbox
              disabled={watch("is_free") === true}
              checked={value}
              onChange={(value) => {
                console.log("🚀 ~ onChange= ~ value:", value.target.checked);
                onChange(value.target.checked);
              }}
              className="flex-1"
              {...field}
            >
              Is Fixed
            </Checkbox>
          )}
        />

        <div className="grid grid-cols-2 gap-2">
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
          <div className="flex flex-col items-start gap-2">
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
                      max={watch("is_fixed") === true ? undefined : 100}
                      className="w-full"
                      ref={ref}
                      {...props}
                      formatter={(value) =>
                        watch("is_fixed") === true
                          ? `${formatCurrency(Number(value))}`
                          : `${formatDiscountPercentage(Number(value))}`
                      }
                    />
                  )}
                />
              )}
            />
            <Controller
              control={control}
              name="is_free"
              render={({ field: { value, onChange, ...field } }) => (
                <Checkbox
                  checked={value}
                  onChange={(value) => {
                    console.log(
                      "🚀 ~ onChange= ~ value:",
                      value.target.checked,
                    );
                    onChange(value.target.checked);
                    setValue("amount", 100);
                    setValue("is_fixed", false);
                    setValue("require_product_count", 1);
                  }}
                  {...field}
                  className="flex-1"
                >
                  Is Free
                </Checkbox>
              )}
            />
          </div>
        </div>
        {/* Max discount count, discount count */}
        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={control}
            name="max_discount_count"
            render={({ field }) => (
              <InputAdmin
                label="Max Discount Count"
                placeholder="Max Discount Count"
                {...field}
                customComponent={(props: any, ref: any) => (
                  <InputNumber
                    min={0}
                    {...props}
                    ref={ref}
                    className="w-full"
                    formatter={(value) => formatNumber(Number(value))}
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="require_product_count"
            render={({ field }) => (
              <InputAdmin
                label="Require Product Count"
                placeholder="Require Product Count"
                {...field}
                customComponent={(props: any, ref: any) => (
                  <InputNumber
                    disabled={watch("is_free") === true}
                    min={0}
                    {...props}
                    ref={ref}
                    className="w-full"
                    formatter={(value) => formatNumber(Number(value))}
                  />
                )}
              />
            )}
          />
        </div>
        {/* Start date, end date */}
        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={control}
            name="start_date"
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
                error={errors.start_date?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <DatePicker
                    {...props}
                    ref={ref}
                    value={
                      typeof field.value === "string"
                        ? dayjs(field.value)
                        : field.value
                    }
                    onChange={(value) => {
                      field.onChange(value.format(getDateFormat()));
                    }}
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="end_date"
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
                error={errors.end_date?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <DatePicker
                    {...props}
                    ref={ref}
                    value={
                      typeof field.value === "string"
                        ? dayjs(field.value)
                        : field.value
                    }
                    onChange={(value) => {
                      field.onChange(value.format(getDateFormat()));
                    }}
                  />
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
