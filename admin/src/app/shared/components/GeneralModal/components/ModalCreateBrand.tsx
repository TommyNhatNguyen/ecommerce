import { ERROR_MESSAGE } from "@/app/constants/errors";
import { STATUS_OPTIONS } from "@/app/constants/seeds";
import GeneralModal, {
  ModalRefType,
} from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { Button, Select } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomEditor from "../../CustomEditor";
import { Editor } from "ckeditor5";
import { useIntl } from "react-intl";
import { BrandCreateDTO } from "@/app/shared/interfaces/brands/brands.dto";

type PropsType = {
  handleCreateBrand: (data: any) => void;
  loading?: boolean;
  refetch?: () => void;
};

const ModalCreateBrand = (
  { handleCreateBrand, loading = false, refetch }: PropsType,
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
  } = useForm<BrandCreateDTO>({
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
    },
  });
  const handleOpenModal = () => {
    setOpen(true);
  };
  const _onCloseModal = () => {
    setOpen(false);
    setValue("description", "");
    reset();
  };

  useImperativeHandle<ModalRefType, ModalRefType>(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));

  const _onConfirmCreateBrand = async (data: any) => {
    const payload: BrandCreateDTO = {
      ...data,
    };
    handleCreateBrand(payload);
    _onCloseModal();
    refetch?.();
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
          onClick={handleSubmit(_onConfirmCreateBrand)}
        >
          {intl.formatMessage({ id: "add_new" })}
        </Button>
      </div>
    );
  };
  const _renderTitle = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: "create_brand" })}
      </h1>
    );
  };
  const _renderContent = () => {
    return (
      <>
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
                label={intl.formatMessage({ id: "brand_name" })}
                required={true}
                placeholder={intl.formatMessage({ id: "brand_name" })}
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
      </>
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
  forwardRef<ModalRefType, PropsType>(ModalCreateBrand),
);
