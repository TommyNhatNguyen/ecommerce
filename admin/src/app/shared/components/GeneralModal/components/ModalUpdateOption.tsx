import { Button, Checkbox, ColorPicker } from "antd";
import GeneralModal, { ModalRefType } from "..";
import { Controller, SubmitHandler, useForm, get } from "react-hook-form";
import { useNotification } from "@/app/contexts/NotificationContext";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import { MinusIcon, PlusIcon } from "lucide-react";
import {
  OptionUpdateDTO,
  OptionValueUpdateDTO,
} from "@/app/shared/interfaces/variant/variant.interface";
import { AggregationColor } from "antd/es/color-picker/color";
import { useQuery } from "@tanstack/react-query";
import { optionService } from "@/app/shared/services/variant/optionService";
import { useUpdateOptionModal } from "@/app/shared/components/GeneralModal/hooks/useUpdateOptionModal";
import { useIntl } from "react-intl";

type ModalUpdateOptionPropsType = {
  updateOptionId: string;
  refetch?: () => void;
  loading?: boolean;
};

const ModalUpdateOption = (
  { updateOptionId, refetch, loading = false }: ModalUpdateOptionPropsType,
  ref: any,
) => {
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const { data: option, isLoading: isLoadingOption } = useQuery({
    queryKey: ["option", updateOptionId, open],
    queryFn: () =>
      optionService.getOptionById(updateOptionId, {
        include_option_values: true,
      }),
    enabled: !!updateOptionId && !!open,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    getValues,
    watch,
  } = useForm<OptionUpdateDTO>({
    defaultValues: {
      name: "",
      is_color: false,
      option_values: [
        {
          name: "",
          value: "",
        },
      ],
    },
  });

  const [optionValues, setOptionValues] = useState<OptionValueUpdateDTO[]>(
    getValues("option_values"),
  );
  const [changeColor, setChangeColor] = useState<{
    [key: number]: AggregationColor;
  }>({});

  const { handleUpdateOption, isUpdateLoading } = useUpdateOptionModal();
  const { notificationApi } = useNotification();

  useEffect(() => {
    if (option) {
      reset({
        name: option.name,
        is_color: option.is_color,
        option_values: option.option_values?.map((optionValue) => ({
          name: optionValue.name,
          value: optionValue.value,
        })),
      });
      setOptionValues(option.option_values || []);
      if (option.is_color) {
        const colorValues: { [key: number]: AggregationColor } = {};
        option.option_values?.forEach((value, index) => {
          colorValues[index] = value.value as unknown as AggregationColor;
        });
        setChangeColor(colorValues);
      }
    }
  }, [option, isLoadingOption]);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const _onCloseModal = () => {
    setOpen(false);
    reset();
  };

  const _onConfirmUpdateOption = async (data: OptionUpdateDTO) => {
    await handleUpdateOption(updateOptionId, data);
    refetch?.();
    _onCloseModal();
  };

  const _onAddOptionValue = () => {
    setOptionValues([
      ...optionValues,
      {
        name: "",
        value: "",
      },
    ]);
  };

  const _onRemoveOptionValue = (id: number) => {
    if (getValues("option_values").length === 1) {
      notificationApi.error({
        message: intl.formatMessage({
          id: "must_have_at_least_one_option_value",
        }),
        description: intl.formatMessage({
          id: "must_have_at_least_one_option_value",
        }),
      });
      return;
    }
    setOptionValues(optionValues.filter((_, index) => index !== id));
    setValue(
      "option_values",
      getValues("option_values").filter((_, index) => index !== id),
    );
  };

  const _onChangeColor = (index: number, value: AggregationColor) => {
    setChangeColor({ ...changeColor, [index]: value });
  };

  useImperativeHandle<ModalRefType, ModalRefType>(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));

  const _renderTitle = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: "update_option" })}
      </h1>
    );
  };

  const _renderContent = () => {
    return (
      <div className="my-4 flex w-full flex-1 flex-shrink-0 flex-col gap-4">
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="name"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field }) => (
              <InputAdmin
                label={intl.formatMessage({ id: "attribute_name" })}
                placeholder={intl.formatMessage({ id: "attribute_name" })}
                error={errors.name?.message as string}
                required={true}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="is_color"
            render={({ field: { value, ...field } }) => (
              <InputAdmin
                label={intl.formatMessage({ id: "is_color" })}
                placeholder={intl.formatMessage({ id: "is_color" })}
                {...field}
                error={errors?.is_color?.message as string}
                customComponent={(props, ref: any) => (
                  <Checkbox {...props} ref={ref} checked={value} value={value} disabled>
                    {value
                      ? intl.formatMessage({ id: "yes" })
                      : intl.formatMessage({ id: "no" })}
                  </Checkbox>
                )}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          {optionValues.map((optionValue, index) => (
            <Controller
              key={`${optionValue.name}-${index}`}
              control={control}
              name={`option_values.${index}.name`}
              rules={{
                required: {
                  value: true,
                  message: ERROR_MESSAGE.REQUIRED,
                },
              }}
              render={({ field }) => (
                <div className="flex w-full items-center gap-2">
                  <InputAdmin
                    label={intl.formatMessage({ id: "option_name" })}
                    placeholder={intl.formatMessage({ id: "option_name" })}
                    required={true}
                    groupClassName="flex-1"
                    error={
                      get(errors, `option_values.${index}.name`)?.message || ""
                    }
                    disabled={
                      !!option?.option_values &&
                      index < option.option_values.length
                    }
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      !watch("is_color") &&
                        setValue(
                          `option_values.${index}.value`,
                          e.target.value.replace(/\s+/g, "_").toUpperCase(),
                        );
                    }}
                  />
                  <div className="flex items-end gap-2">
                    {watch("is_color") ? (
                      <InputAdmin
                        label={intl.formatMessage({ id: "option_value" })}
                        placeholder={intl.formatMessage({ id: "option_value" })}
                        required={true}
                        disabled={
                          !!option?.option_values &&
                          index < option.option_values.length
                        }
                        customComponent={(props) => (
                          <ColorPicker
                            {...props}
                            value={changeColor?.[index]}
                            showText={true}
                            onChange={(value) => _onChangeColor(index, value)}
                            onChangeComplete={(value) =>
                              setValue(
                                `option_values.${index}.value`,
                                value.toHexString(),
                              )
                            }
                          />
                        )}
                      />
                    ) : (
                      <InputAdmin
                        label={intl.formatMessage({ id: "option_value" })}
                        placeholder={intl.formatMessage({ id: "option_value" })}
                        value={watch(`option_values.${index}.value`)}
                        disabled={true}
                        required={true}
                        error={
                          get(errors, `option_values.${index}.value`)
                            ?.message || ""
                        }
                      />
                    )}
                    <Button
                      type="default"
                      onClick={() => _onRemoveOptionValue(index)}
                      icon={<MinusIcon className="h-4 w-4" />}
                      disabled={
                        !!option?.option_values &&
                        index < option.option_values.length
                      }
                    />
                  </div>
                </div>
              )}
            />
          ))}
        </div>
        <Button
          type="dashed"
          variant="dashed"
          onClick={_onAddOptionValue}
          className="m-auto w-fit"
          icon={<PlusIcon className="h-4 w-4" />}
        >
          {intl.formatMessage({ id: "add_option_value" })}
        </Button>
      </div>
    );
  };

  const _renderFooter = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModal}>
          {intl.formatMessage({ id: "close" })}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmUpdateOption)}
        >
          {intl.formatMessage({ id: "update" })}
        </Button>
      </div>
    );
  };

  return (
    <GeneralModal
      open={open}
      renderTitle={_renderTitle}
      renderFooter={_renderFooter}
      renderContent={_renderContent}
      onCancel={_onCloseModal}
      loading={loading || isLoadingOption || isUpdateLoading}
    />
  );
};

export default React.memo(forwardRef(ModalUpdateOption));
