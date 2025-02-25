import { Button, Checkbox, ColorPicker } from "antd";
import GeneralModal from "..";
import { Controller, SubmitHandler, useForm, get } from "react-hook-form";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useEffect, useState } from "react";
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

type UpdateOptionsModalPropsType = {
  isOpen: boolean;
  handleCloseModal: () => void;
  loading?: boolean;
  refetch?: () => void;
  optionId: string;
};

const UpdateOptionsModal = ({
  isOpen,
  handleCloseModal,
  loading = false,
  refetch,
  optionId,
}: UpdateOptionsModalPropsType) => {
  const { data: option, isLoading: isLoadingOption } = useQuery({
    queryKey: ["option", optionId, isOpen],
    queryFn: () =>
      optionService.getOptionById(optionId, {
        include_option_values: true,
      }),
    enabled: !!optionId && !!isOpen,
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
      name: option?.name,
      is_color: option?.is_color,
      option_values: option?.option_values?.map((optionValue) => ({
        name: optionValue.name,
        value: optionValue.value,
      })),
    },
  });

  const [optionValues, setOptionValues] = useState<OptionValueUpdateDTO[]>(
    getValues("option_values"),
  );
  const [changeColor, setChangeColor] = useState<{
    [key: number]: AggregationColor;
  }>({});

  console.log("🚀 ~ option:", option);

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

  const _resetData = () => {
    reset({
      name: "",
      is_color: false,
      option_values: [
        {
          name: "",
          value: "",
        },
      ],
    });
    setOptionValues([
      {
        name: "",
        value: "",
      },
    ]);
    setChangeColor({});
  };

  const _onCloseModal = () => {
    handleCloseModal();
    _resetData();
  };

  const _onUpdateOption: SubmitHandler<OptionUpdateDTO> = async (data) => {
    await handleUpdateOption(optionId, data, () => {
      notificationApi.success({
        message: "Update option success",
        description: "Update option success",
      });
      _resetData();
      _onCloseModal();
      refetch?.();
    });
  };

  const _onRemoveOptionValue = (id: number) => {
    if (getValues("option_values").length === 1) {
      notificationApi.error({
        message: "You must have at least one option value",
        description: "You must have at least one option value",
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

  // useEffect(() => {
  //   _resetData();
  // }, [watch("is_color")]);

  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Update options</h1>;
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
                label="Name"
                placeholder="Name"
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
                label="Is color?"
                placeholder="Is color?"
                {...field}
                error={errors?.is_color?.message as string}
                customComponent={(props, ref: any) => (
                  <Checkbox
                    {...props}
                    ref={ref}
                    checked={value}
                    value={value}
                    disabled
                  >
                    {value ? "🎨 Yes" : "🖌️ No"}
                  </Checkbox>
                )}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          {optionValues &&
            optionValues.map((optionValue, index) => (
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
                      label="Option name"
                      placeholder="Option name"
                      required={true}
                      groupClassName="flex-1"
                      error={
                        get(errors, `option_values.${index}.name`)?.message ||
                        ""
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
                          label="Option value"
                          placeholder="Option value"
                          required={true}
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
                          label="Option value"
                          placeholder="Option value"
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
                      />
                    </div>
                  </div>
                )}
              />
            ))}
        </div>
      </div>
    );
  };

  const _renderFooter = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModal}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onUpdateOption)}
        >
          Update
        </Button>
      </div>
    );
  };

  return (
    <GeneralModal
      open={isOpen}
      renderTitle={_renderTitle}
      renderFooter={_renderFooter}
      renderContent={_renderContent}
      onCancel={_onCloseModal}
      loading={loading || isLoadingOption || isUpdateLoading}
    />
  );
};

export default UpdateOptionsModal;
