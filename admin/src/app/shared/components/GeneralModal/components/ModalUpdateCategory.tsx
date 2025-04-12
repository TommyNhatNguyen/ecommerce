import { ERROR_MESSAGE } from "@/app/constants/errors";
import InputAdmin from "@/app/shared/components/InputAdmin";
import GeneralModal, {
  ModalRefType,
} from "@/app/shared/components/GeneralModal";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { useQuery } from "@tanstack/react-query";
import { Button, Select, Upload, UploadFile } from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { STATUS_OPTIONS } from "@/app/constants/seeds";
import { PlusIcon } from "lucide-react";
import { UpdateCategoryDTO } from "@/app/shared/interfaces/categories/category.dto";
import { useUpdateCategories } from "@/app/shared/components/GeneralModal/hooks/useUpdateCategories";
import CustomEditor from "@/app/shared/components/CustomEditor";
import { Editor } from "ckeditor5";
import { useIntl } from "react-intl";

type ModalUpdateCategoryPropsType = {
  updateCategoryId: string;
  refetch?: () => void;
  loading?: boolean;
};

const ModalUpdateCategory = (
  {
    updateCategoryId,
    refetch,
    loading = false,
  }: ModalUpdateCategoryPropsType,
  ref: any,
) => {
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["category", updateCategoryId, open],
    queryFn: () =>
      categoriesService.getCategoryById(updateCategoryId, {
        include_image: true,
      }),
    enabled: !!updateCategoryId && !!open,
  });
  const { control, handleSubmit, reset, getValues } = useForm<CategoryModel>({
    defaultValues: category,
  });
  const {
    handleUploadImages,
    uploadImageLoading,
    handleUpdateCategory,
    updateCategoryLoading,
  } = useUpdateCategories();
  useEffect(() => {
    if (category) {
      reset(category);
    }
  }, [category]);
  const finalLoading =
    uploadImageLoading || isLoadingCategory || updateCategoryLoading || loading;
      const handleOpenModal = () => {
        setOpen(true);
      };
      const _onCloseModal = () => {
        setOpen(false);
        reset();
      };

  const _onConfirmUpdateCategory = async (data: CategoryModel) => {
    const payload: UpdateCategoryDTO = {
      name: data.name,
      description: data.description || "",
      status: data.status,
    };
    if (!data.image?.cloudinary_id) {
      const imageIds: any = await handleUploadImages(
        data.image as unknown as UploadFile[],
      );
      payload.image_id = imageIds?.[0];
    }
    await handleUpdateCategory(updateCategoryId, payload);
    refetch?.();
    _onCloseModal();
  };

  useImperativeHandle<ModalRefType, ModalRefType>(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));
  const _renderTitleModalUpdateCategory = () => {
    return <h1 className="text-2xl font-bold">{intl.formatMessage({ id: "update_category" })}</h1>;
  };
  const _renderContentModalUpdateCategory = () => {
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
                value={field.value || ""}
                customComponent={({ onChange, props }: any, ref: any) => (
                  <CustomEditor
                    onChange={(_: any, editor: Editor) => {
                      field.onChange(editor.getData());
                    }}
                    initialData={field.value || ""}
                    initialLoading={isLoadingCategory}
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
        <div className="mt-4">
          <Controller
            control={control}
            name="image"
            render={({ field, formState: { errors } }) => {
              return (
                // @ts-ignore
                <InputAdmin
                  label={intl.formatMessage({ id: "image" })}
                  required={true}
                  placeholder={intl.formatMessage({ id: "image" })}
                  {...field}
                  error={errors.image_id?.message as string}
                  customComponent={({ value, onChange, ...props }, ref) => (
                    <Upload
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      listType="picture-card"
                      maxCount={1}
                      fileList={
                        value
                          ? value?.length
                            ? value
                            : [value].map((item) => ({
                                uid: item.id,
                                name: item.name,
                                url: item.url,
                              }))
                          : []
                      }
                      onChange={(info) => {
                        onChange(info.fileList);
                      }}
                      {...props}
                      ref={ref}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Upload>
                  )}
                />
              );
            }}
          />
        </div>
      </>
    );
  };
  const _renderFooterModalUpdateCategory = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModal}>
          {intl.formatMessage({ id: "close" })}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmUpdateCategory)}
        >
          {intl.formatMessage({ id: "update" })}
        </Button>
      </div>
    );
  };

  return (
    <GeneralModal
      open={open}
      renderTitle={_renderTitleModalUpdateCategory}
      renderContent={_renderContentModalUpdateCategory}
      renderFooter={_renderFooterModalUpdateCategory}
      onCancel={_onCloseModal}
      loading={finalLoading}
    />
  );
};

export default React.memo(forwardRef(ModalUpdateCategory));
