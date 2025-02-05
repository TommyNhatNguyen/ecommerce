import { Button, Checkbox, ColorPicker } from "antd";
import GeneralModal from "..";
import { Controller, SubmitHandler, useForm, get } from "react-hook-form";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useCreateOptionModal } from "@/app/shared/components/GeneralModal/hooks/useCreateOptionModal";
import { useEffect, useState } from "react";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import { Link, MinusIcon, PlusIcon } from "lucide-react";
import {
  OptionCreateDTO,
  OptionValueCreateDTO,
} from "@/app/shared/interfaces/variant/variant.interface";
import { AggregationColor } from "antd/es/color-picker/color";

type CreateOptionModalPropsType = {
  isOpen: boolean;
  handleCloseModal: () => void;
  loading?: boolean;
  refetch?: () => void;
};

const CreateOptionsModal = ({
  isOpen,
  handleCloseModal,
  loading = false,
  refetch,
}: CreateOptionModalPropsType) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    getValues,
    watch,
  } = useForm<OptionCreateDTO>({
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
  const [optionValues, setOptionValues] = useState<OptionValueCreateDTO[]>(
    getValues("option_values"),
  );
  const [changeColor, setChangeColor] = useState<{
    [key: number]: AggregationColor;
  }>();
  const { handleCreateOption, isCreateLoading } = useCreateOptionModal();
  const { notificationApi } = useNotification();
  const _resetData = () => {
    reset({
      name: getValues("name"),
      is_color: getValues("is_color"),
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
  const _onCreateOption: SubmitHandler<OptionCreateDTO> = async (data) => {
    await handleCreateOption(data, () => {
      notificationApi.success({
        message: "Create option success",
        description: "Create option success",
      });
      _resetData();
      _onCloseModal();
      refetch?.();
    });
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
  useEffect(() => {
    _resetData();
  }, [watch("is_color")]);
  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Create options</h1>;
  };
  const _renderContent = () => {
    return (
      <div className="my-4 flex w-full flex-1 flex-shrink-0 flex-col gap-4">
        <div className="flex items-center gap-2">
          {/* Name  */}
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
          {/* Color */}
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
                  <Checkbox {...props} ref={ref} checked={value} value={value}>
                    {value ? "🎨 Yes" : "🖌️ No"}
                  </Checkbox>
                )}
              />
            )}
          />
        </div>
        {/* List of option values */}
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
                    label="Option name"
                    placeholder="Option name"
                    required={true}
                    groupClassName="flex-1"
                    error={
                      get(errors, `option_values.${index}.name`)?.message || ""
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
        {/* Add option value button */}
        <Button
          type="dashed"
          variant="dashed"
          onClick={_onAddOptionValue}
          className="m-auto w-fit"
          icon={<PlusIcon className="h-4 w-4" />}
        >
          Add option value
        </Button>
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
          onClick={handleSubmit(_onCreateOption)}
        >
          Create
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
      loading={loading || isCreateLoading}
    />
  );
};

export default CreateOptionsModal;
