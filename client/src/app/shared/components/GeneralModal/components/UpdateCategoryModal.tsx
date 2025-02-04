import { ERROR_MESSAGE } from "@/app/constants/errors";
import InputAdmin from "@/app/shared/components/InputAdmin";
import GeneralModal from "@/app/shared/components/GeneralModal";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, Input, Select, Upload, UploadFile } from "antd";
import React, { useEffect, useState } from "react";
import {
  Controller,
  ControllerProps,
  ControllerRenderProps,
  useForm,
} from "react-hook-form";
import { statusOptions } from "@/app/constants/seeds";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { FileDiff, PlusIcon, Trash2Icon } from "lucide-react";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
import { UpdateCategoryDTO } from "@/app/shared/interfaces/categories/category.dto";
import { useUpdateCategories } from "@/app/shared/components/GeneralModal/hooks/useUpdateCategories";

const ButtonDeleteImageWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 text-white" />
  </Button>,
);

type UpdateCategoryModalPropsType = {
  isModalUpdateCategoryOpen: boolean;
  handleCloseModalUpdateCategory: () => void;
  updateCategoryId: string;
  refetch?: () => void;
};

const UpdateCategoryModal = ({
  isModalUpdateCategoryOpen,
  handleCloseModalUpdateCategory,
  updateCategoryId,
  refetch,
}: UpdateCategoryModalPropsType) => {
  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["category", updateCategoryId, isModalUpdateCategoryOpen],
    queryFn: () =>
      categoriesService.getCategoryById(updateCategoryId, {
        include_image: true,
      }),
    enabled: !!updateCategoryId && !!isModalUpdateCategoryOpen,
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
  const loading =
    uploadImageLoading || isLoadingCategory || updateCategoryLoading;
  const _onCloseModalUpdateCategory = () => {
    handleCloseModalUpdateCategory();
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
    _onCloseModalUpdateCategory();
  };
  const _renderTitleModalUpdateCategory = () => {
    return <h1 className="text-2xl font-bold">Update Category</h1>;
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
            render={({ field: { value, ...field }, formState: { errors } }) => (
              <InputAdmin
                label="Description"
                placeholder="Description"
                value={value as string}
                error={errors.description?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <Input.TextArea rows={4} {...props} ref={ref} />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field, formState: { errors } }) => (
              <InputAdmin
                label="Status"
                placeholder="Status"
                required={true}
                error={errors.status?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <Select
                    options={statusOptions}
                    placeholder="Select Status"
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
                  label="Add New Product Image"
                  required={true}
                  placeholder="Add New Product Image"
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
                        console.log("info", info);
                        console.log(value);
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
        <Button type="default" onClick={_onCloseModalUpdateCategory}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmUpdateCategory)}
        >
          Update
        </Button>
      </div>
    );
  };
  return (
    <GeneralModal
      open={isModalUpdateCategoryOpen}
      renderTitle={_renderTitleModalUpdateCategory}
      renderContent={_renderContentModalUpdateCategory}
      renderFooter={_renderFooterModalUpdateCategory}
      onCancel={handleCloseModalUpdateCategory}
      loading={loading}
    />
  );
};

export default UpdateCategoryModal;
