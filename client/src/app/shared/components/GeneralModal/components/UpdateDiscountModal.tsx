import { ERROR_MESSAGE } from "@/app/constants/errors";
import InputAdmin from "@/app/shared/components/InputAdmin";
import GeneralModal from "@/app/shared/components/GeneralModal";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox, DatePicker, Input, InputNumber, Select } from "antd";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useUpdateDiscountModal } from "@/app/shared/components/GeneralModal/hooks/useUpdateDiscountModal";
import { UpdateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { DISCOUNT_SCOPE, DISCOUNT_TYPE } from "@/app/constants/enum";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import { formatDiscountPercentage } from "@/app/shared/utils/utils";
import { watch } from "node:fs";
import { getDateFormat } from "@/app/shared/utils/datetime";

type UpdateDiscountModalPropsType = {
  isModalUpdateDiscountCampaignOpen: boolean;
  handleCloseModalUpdateDiscountCampaign: () => void;
  updateDiscountCampaignId: string;
  refetch?: () => void;
};

const UpdateDiscountModal = ({
  isModalUpdateDiscountCampaignOpen = false,
  handleCloseModalUpdateDiscountCampaign,
  updateDiscountCampaignId = "",
  refetch,
}: UpdateDiscountModalPropsType) => {
  const { updateDiscountLoading, updateDiscountError, handleUpdateDiscount } =
    useUpdateDiscountModal();
  const { data: discount, isLoading: isLoadingDiscount } = useQuery({
    queryKey: [
      "discount",
      updateDiscountCampaignId,
      isModalUpdateDiscountCampaignOpen,
    ],
    queryFn: () => discountsService.getDiscountById(updateDiscountCampaignId),
    enabled: !!updateDiscountCampaignId && !!isModalUpdateDiscountCampaignOpen,
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<DiscountModel>({
    defaultValues: discount,
  });
  console.log(discount);
  useEffect(() => {
    console.log(discount);
    if (discount) {
      reset(discount);
    }
  }, [discount, isLoadingDiscount]);
  const loading = false;

  const _onCloseModalUpdateDiscountCampaign = () => {
    handleCloseModalUpdateDiscountCampaign();
    reset();
  };
  const _onConfirmUpdateDiscountCampaign = async (data: DiscountModel) => {
    const payload: UpdateDiscountDTO = {
      name: data.name,
      description: data.description || "",
      amount: data.amount || 0,
      is_fixed: data.is_fixed || false,
      is_free: data.is_free || false,
      require_product_count: data.require_product_count || 0,
      require_order_amount: data.require_order_amount || 0,
      max_discount_count: data.max_discount_count || 0,
      scope: data.scope || DISCOUNT_SCOPE.PRODUCT,
      start_date: data.start_date
        ? dayjs(data.start_date).format()
        : dayjs().format(),
      end_date: data.end_date
        ? dayjs(data.end_date).format()
        : dayjs().format(),
    };
    await handleUpdateDiscount(updateDiscountCampaignId, payload);
    refetch?.();
    _onCloseModalUpdateDiscountCampaign();
  };
  const _renderTitleModalUpdateDiscountCampaign = () => {
    return <h1 className="text-2xl font-bold">Update Discount Campaign</h1>;
  };
  const _renderContentModalUpdateDiscountCampaign = () => {
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
  const _renderFooterModalUpdateDiscountCampaign = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModalUpdateDiscountCampaign}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmUpdateDiscountCampaign)}
        >
          Update
        </Button>
      </div>
    );
  };
  return (
    <GeneralModal
      renderTitle={_renderTitleModalUpdateDiscountCampaign}
      renderFooter={_renderFooterModalUpdateDiscountCampaign}
      renderContent={_renderContentModalUpdateDiscountCampaign}
      open={isModalUpdateDiscountCampaignOpen}
      onCancel={_onCloseModalUpdateDiscountCampaign}
      loading={loading}
    />
  );
};

export default UpdateDiscountModal;
