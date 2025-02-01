import { Button, Checkbox, ColorPicker, Switch } from "antd";
import GeneralModal from "..";
import { useState } from "react";
import InputAdmin from "../../InputAdmin";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import { AggregationColor } from "antd/es/color-picker/color";
import { VariantCreateDTO } from "@/app/shared/interfaces/variant/variant.interface";
import { Plus, Trash2 } from "lucide-react";
import { useCreateVariant } from "../hooks/useCreateVariant";
import { useNotification } from "@/app/contexts/NotificationContext";

type CreateVariantModalPropsType = {
  isOpen: boolean;
  handleCloseModal: () => void;
  loading?: boolean;
  refetch?: () => void;
};

type FormValue = { type: string; value: { name: string; value: string }[] };

const CreateVariantModal = ({
  isOpen,
  handleCloseModal,
  loading = false,
  refetch,
}: CreateVariantModalPropsType) => {
  const [variantComponentIds, setVariantComponentIds] = useState<number[]>([1]);
  const [previewColor, setPreviewColor] = useState<{
    [id: string]: AggregationColor;
  }>();
  const [isOpenColor, setOpenColor] = useState(false);
  const [isCreateVariantLoading, setIsCreateVariantLoading] = useState(false);
  const { handleCreateVariant } = useCreateVariant();
  const { notificationApi } = useNotification();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm<FormValue>({
    defaultValues: {
      type: "",
      value: [
        {
          name: "",
          value: "",
        },
      ],
    },
  });

  const _resetData = () => {
    setVariantComponentIds([1]);
    reset();
  };
  const _onToggleColor = () => {
    setOpenColor((prev) => !prev);
    _resetData();
  };
  const _onChangeColor = (value: AggregationColor, id: number) => {
    setPreviewColor((prev) => ({ ...prev, [id]: value }));
  };
  const _onSetColor = (value: AggregationColor, id: number) => {
    setValue(`value.${id}.value`, `#${value.toHex()}`);
  };
  const _onAddNewInput = () => {
    setVariantComponentIds((prev) => [...prev, prev[prev.length - 1] + 1]);
  };
  const _onRemoveInput = (id: number, name: string) => {
    if (variantComponentIds.length == 1) {
      notificationApi.error({
        message: "Must have at least 1 input",
        description: "Must have at least 1 input",
      });
    } else {
      setVariantComponentIds((prev) => prev.filter((item) => item !== id));
      setValue(
        "value",
        getValues().value.filter((item) => item.name !== name),
      );
    }
  };
  const _onCloseModal = () => {
    handleCloseModal();
    _resetData();
  };
  const _onCreateVariant: SubmitHandler<FormValue> = async (data) => {
    try {
      setIsCreateVariantLoading(true);
      const response = await Promise.all(
        variantComponentIds.map((_, index) => {
          const type = data.type;
          const payload: VariantCreateDTO = {
            type: isOpenColor ? `color-${type}` : type,
            name: data.value[index].name,
            value: data.value[index].value,
          };
          const promise = handleCreateVariant(payload);
          return promise;
        }),
      );
      if (response) {
        notificationApi.success({
          message: "Variant created successfully",
          description: "Variant created successfully",
        });
        _onCloseModal();
      }
    } catch (error) {
      console.log(error);
      notificationApi.error({
        message: "Variant created failed",
        description: "Variant created failed",
      });
    } finally {
      setIsCreateVariantLoading(false);
      refetch && refetch();
    }
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
          onClick={handleSubmit(_onCreateVariant)}
        >
          Create
        </Button>
      </div>
    );
  };

  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Create product variant</h1>;
  };

  const _renderContent = () => {
    return (
      <div className="my-4 flex w-full flex-1 flex-shrink-0 flex-col gap-4">
        <div className="flex items-start gap-2">
          <InputAdmin
            label="🎨 Is color type?"
            customComponent={(props, ref: any) => {
              return (
                <div className="flex items-center gap-1">
                  <Checkbox checked={isOpenColor} onChange={_onToggleColor}>
                    <span className="font-medium">
                      {isOpenColor ? "Color type" : "Normal type"}{" "}
                    </span>
                  </Checkbox>
                </div>
              );
            }}
          />
          <Controller
            control={control}
            name="type"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field }) => {
              return (
                <InputAdmin
                  label="Variant type"
                  placeholder="Enter variant type"
                  groupClassName="flex-1"
                  required={true}
                  error={errors?.type?.message as string}
                  {...field}
                />
              );
            }}
          />
        </div>
        {variantComponentIds.map((id, index) => {
          return (
            <div key={id} className="flex w-full items-start gap-2">
              <Controller
                control={control}
                name={`value.${index}.name`}
                rules={{
                  required: {
                    value: true,
                    message: ERROR_MESSAGE.REQUIRED,
                  },
                }}
                render={({ field }) => {
                  return (
                    <div className="relative pl-[48px]">
                      <Button
                        type="text"
                        variant="text"
                        className="absolute left-0 top-[72%] -translate-y-1/2"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => _onRemoveInput(id, field.value)}
                      />
                      <InputAdmin
                        label={`Name ${id}`}
                        placeholder={`Enter variant name ${id}`}
                        groupClassName="flex-1"
                        required={true}
                        error={errors?.value?.[index]?.name?.message}
                        {...field}
                      />
                    </div>
                  );
                }}
              />

              {isOpenColor ? (
                <InputAdmin
                  label={`Value`}
                  groupClassName="flex-1"
                  required={true}
                  error={errors?.value?.[index]?.value?.message}
                  customComponent={(props, ref: any) => (
                    <ColorPicker
                      {...props}
                      onChange={(value: AggregationColor) =>
                        _onChangeColor(value, index)
                      }
                      onChangeComplete={(value: AggregationColor) =>
                        _onSetColor(value, index)
                      }
                      showText
                      allowClear
                      value={previewColor?.[index]}
                      disabled={!isOpenColor}
                    />
                  )}
                />
              ) : (
                <Controller
                  control={control}
                  name={`value.${index}.value`}
                  rules={{
                    required: {
                      value: true,
                      message: ERROR_MESSAGE.REQUIRED,
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <InputAdmin
                        label={`Value ${id}`}
                        placeholder={`Enter variant value ${id}`}
                        groupClassName="flex-1"
                        required={true}
                        error={errors?.value?.[index]?.value?.message}
                        {...field}
                      />
                    );
                  }}
                />
              )}
            </div>
          );
        })}
        <Button
          type="dashed"
          variant="dashed"
          icon={<Plus className="h-4 w-4" />}
          onClick={_onAddNewInput}
        >
          Add new value
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
      loading={loading || isCreateVariantLoading}
    />
  );
};

export default CreateVariantModal;
