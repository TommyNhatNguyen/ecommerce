import { ERROR_MESSAGE } from "@/app/constants/errors";
import CustomEditor from "@/app/shared/components/CustomEditor";
import GeneralModal, {
  ModalRefType,
} from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { Editor } from "ckeditor5";
import { WarehouseCreateDTO } from "@/app/shared/interfaces/warehouse/warehouse.interface";
import { Button, Select } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { STATUS_OPTIONS } from "@/app/constants/seeds";

type Props = {
  handleCreateWarehouse: (data: any) => void;
  loading?: boolean;
  refetch?: () => void;
};

const ModelCreateWarehouse = (
  { handleCreateWarehouse, loading = false, refetch }: Props,
  ref: any,
) => {
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<WarehouseCreateDTO>({
    defaultValues: {
      name: "",
      address: "",
      description: "",
      status: "ACTIVE",
    },
  });
  const handleOpenModal = () => {
    setOpen(true);
  };
  const _onCloseModal = () => {
    setOpen(false);
  };

  useImperativeHandle<ModalRefType, ModalRefType>(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));

  const _onConfirmCreateWarehouse = async (data: any) => {
    handleCreateWarehouse(data);
    _onCloseModal();
    reset();
    setValue("description", "");
    refetch?.();
  };

  const _renderTitle = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: "create_warehouse" })}
      </h1>
    );
  };

  const _renderContent = () => {
    return (
      <div className="flex w-full flex-1 flex-shrink-0 flex-col gap-4">
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
              label={intl.formatMessage({ id: "name" })}
              required={true}
              placeholder={intl.formatMessage({ id: "name" })}
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
              label={intl.formatMessage({ id: "description" })}
              placeholder={intl.formatMessage({ id: "description" })}
              {...field}
              customComponent={({ onChange, props }: any, ref: any) => (
                <CustomEditor
                  onChange={(_: any, editor: Editor) => {
                    field.onChange(editor.getData());
                  }}
                  {...props}
                  ref={ref}
                />
              )}
            />
          )}
        />
        <Controller
          control={control}
          name="address"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field, formState: { errors } }) => (
            <InputAdmin
              label={intl.formatMessage({ id: "address" })}
              required={true}
              placeholder={intl.formatMessage({ id: "address" })}
              error={errors.address?.message as string}
              {...field}
            />
          )}
        />
        <InputAdmin
          label={intl.formatMessage({ id: "status" })}
          placeholder={intl.formatMessage({ id: "status" })}
          required={true}
          customComponent={(props: any, ref: any) => (
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  options={STATUS_OPTIONS.map((item) => ({
                    label: intl.formatMessage({ id: item.label }),
                    value: item.value,
                  }))}
                  placeholder={intl.formatMessage({ id: "select_status" })}
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
        <Button type="default" onClick={_onCloseModal}>
          {intl.formatMessage({ id: "close" })}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateWarehouse)}
        >
          {intl.formatMessage({ id: "add_new" })}
        </Button>
      </div>
    );
  };
  return (
    <GeneralModal
      open={open}
      renderTitle={_renderTitle}
      renderContent={_renderContent}
      renderFooter={_renderFooter}
      onCancel={_onCloseModal}
      loading={loading}
    />
  );
};

export default React.memo(
  forwardRef<ModalRefType, Props>(ModelCreateWarehouse),
);
