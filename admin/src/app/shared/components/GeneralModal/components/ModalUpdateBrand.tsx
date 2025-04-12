import { ERROR_MESSAGE } from "@/app/constants/errors";
import { STATUS_OPTIONS } from "@/app/constants/seeds";
import GeneralModal, {
  ModalRefType,
} from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { BrandModel } from "@/app/shared/models/brands/brands.model";
import { brandService } from "@/app/shared/services/brands/brandService";
import { useQuery } from "@tanstack/react-query";
import { Button, Select } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import CustomEditor from "../../CustomEditor";
import { Editor } from "ckeditor5";
import { useIntl } from "react-intl";
import { BrandUpdateDTO } from "@/app/shared/interfaces/brands/brands.dto";
import { useUpdateBrands } from "../hooks/useUpdateBrands";

type ModalUpdateBrandPropsType = {
  updateBrandId: string;
  refetch?: () => void;
  loading?: boolean;
};

const ModalUpdateBrand = (
  { updateBrandId, refetch, loading = false }: ModalUpdateBrandPropsType,
  ref: any,
) => {
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const { data: brand, isLoading: isLoadingBrand } = useQuery({
    queryKey: ["brand", updateBrandId, open],
    queryFn: () => brandService.getBrandById(updateBrandId),
    enabled: !!updateBrandId && !!open,
  });

  const { control, handleSubmit, reset } = useForm<BrandModel>({
    defaultValues: brand,
  });

  const { handleUpdateBrand, updateBrandLoading } = useUpdateBrands();

  useEffect(() => {
    if (brand) {
      reset(brand);
    }
  }, [brand]);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const _onCloseModal = () => {
    setOpen(false);
    reset();
  };

  useImperativeHandle<ModalRefType, ModalRefType>(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));

  const _onConfirmUpdateBrand = async (data: BrandModel) => {
    const payload: BrandUpdateDTO = {
      name: data.name,
      description: data.description || "",
      status: data.status,
    };
    await handleUpdateBrand(updateBrandId, payload);
    refetch?.();
    _onCloseModal();
  };

  const _renderTitle = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: "update_brand" })}
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
              value={field.value || ""}
              customComponent={({ onChange, props }: any, ref: any) => (
                <CustomEditor
                  onChange={(_: any, editor: Editor) => {
                    field.onChange(editor.getData());
                  }}
                  initialData={field.value || ""}
                  initialLoading={isLoadingBrand}
                  data={field.value || ""}
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
          onClick={handleSubmit(_onConfirmUpdateBrand)}
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
      renderContent={_renderContent}
      renderFooter={_renderFooter}
      onCancel={_onCloseModal}
      loading={isLoadingBrand || updateBrandLoading || loading}
    />
  );
};

export default React.memo(forwardRef(ModalUpdateBrand));
