import { ERROR_MESSAGE } from "@/app/constants/errors";
import InputAdmin from "@/app/shared/components/InputAdmin";
import GeneralModal from "@/app/shared/components/GeneralModal";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Input, InputNumber, Select } from "antd";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useUpdateDiscountModal } from "@/app/shared/components/GeneralModal/hooks/useUpdateDiscountModal";
import { UpdateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { DISCOUNT_SCOPE, DISCOUNT_TYPE } from "@/app/constants/enum";
import { formatCurrency } from "@/app/shared/utils/utils";
import { formatDiscountPercentage } from "@/app/shared/utils/utils";
import { watch } from "node:fs";

type UpdateDiscountModalPropsType = {
  isModalUpdateDiscountCampaignOpen: boolean;
  handleCloseModalUpdateDiscountCampaign: () => void;
  updateDiscountCampaignId: string;
  refetch: () => void;
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
      type: data.type || DISCOUNT_TYPE.PERCENTAGE,
      scope: data.scope || DISCOUNT_SCOPE.PRODUCT,
      start_date: data.start_date ? new Date(data.start_date) : new Date(),
      end_date: data.end_date ? new Date(data.end_date) : new Date(),
    };
    await handleUpdateDiscount(updateDiscountCampaignId, payload);
    refetch();
    _onCloseModalUpdateDiscountCampaign();
  };
  const _renderTitleModalUpdateDiscountCampaign = () => {
    return <h1 className="text-2xl font-bold">Update Discount Campaign</h1>;
  };
  const _renderContentModalUpdateDiscountCampaign = () => {
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
            // @ts-ignore
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
            name="start_date"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field, formState: { errors } }) => (
              <InputAdmin
                groupClassName="flex-1"
                label="Start Date"
                placeholder="Start Date"
                required={true}
                error={errors.start_date?.message as string}
                {...field}
                customComponent={({ value, ...props }: any, ref: any) => (
                  <DatePicker value={dayjs(value)} {...props} ref={ref} />
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
            render={({ field, formState: { errors } }) => (
              <InputAdmin
                groupClassName="flex-1"
                label="End Date"
                placeholder="End Date"
                required={true}
                error={errors.end_date?.message as string}
                {...field}
                customComponent={({ value, ...props }: any, ref: any) => (
                  <DatePicker value={dayjs(value)} {...props} ref={ref} />
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
