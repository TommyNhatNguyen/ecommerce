import { ERROR_MESSAGE } from "@/app/constants/errors";
import { statusOptions } from "@/app/constants/seeds";
import GeneralModal from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { CreateCategoryFormDTO } from "@/app/shared/interfaces/categories/category.dto";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { imagesService } from "@/app/shared/services/images/imagesService";
import { Button, Input, Select, Upload, UploadFile } from "antd";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomEditor from "../../CustomEditor";
import { Editor } from "ckeditor5";
type CreateCategoryModalPropsType = {
  isModalCreateCategoryOpen: boolean;
  handleCloseModalCreateCategory: () => void;
  handleSubmitCreateCategoryForm: (data: any) => void;
  loading?: boolean;
  refetch?: () => void;
};

const CreateCategoryModal = ({
  isModalCreateCategoryOpen,
  handleCloseModalCreateCategory,
  handleSubmitCreateCategoryForm,
  loading = false,
  refetch,
}: CreateCategoryModalPropsType) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateCategoryFormDTO>({
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
    },
  });
  const [file, setFile] = useState<UploadFile>();
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const createCategoryLoading = uploadImageLoading || loading;
  const _onChangeFile = (file: UploadFile) => {
    setFile(file);
  };
  const _onRemoveFile = () => {
    setFile(undefined);
  };
  const _onSubmitFileList = async () => {
    if (!file?.originFileObj) return;
    setUploadImageLoading(true);
    try {
      const response = await imagesService.uploadImage(file.originFileObj, {
        type: "CATEGORY" as ImageType.CATEGORY,
      });
      if (response) {
        return response.id;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploadImageLoading(false);
    }
  };
  const _onCloseModalCreateCategory = () => {
    handleCloseModalCreateCategory();
    setFile(undefined);
    reset();
  };

  const _onConfirmCreateCategory = async (data: any) => {
    const payload: CreateCategoryFormDTO = {
      ...data,
    };
    if (file) {
      const imageId = await _onSubmitFileList();
      if (!imageId) return;
      payload.imageId = imageId;
    }
    handleSubmitCreateCategoryForm(payload);
    _onCloseModalCreateCategory();
    refetch?.();
  };
  const _renderFooterModalCreateCategory = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModalCreateCategory}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateCategory)}
        >
          Create
        </Button>
      </div>
    );
  };
  const _renderTitleModalCreateCategory = () => {
    return <h1 className="text-2xl font-bold">Create Category</h1>;
  };
  const _renderContentModalCreateCategory = () => {
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
            render={({ field }) => (
              <InputAdmin
                label="Description"
                placeholder="Description"
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
            label="Status"
            placeholder="Status"
            required={true}
            customComponent={(props: any, ref: any) => (
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
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
          <InputAdmin
            label="Category Image"
            required={true}
            placeholder="Category Image"
            customComponent={() => (
              <Upload
                accept=".jpg,.jpeg,.png,.gif,.webp"
                listType="picture-card"
                fileList={file ? [file] : undefined}
                maxCount={1}
                onChange={(info) => {
                  _onChangeFile(info.file);
                }}
                onRemove={(file) => {
                  _onRemoveFile();
                }}
              >
                <PlusIcon className="h-4 w-4" />
              </Upload>
            )}
          />
        </div>
      </>
    );
  };
  return (
    <GeneralModal
      open={isModalCreateCategoryOpen}
      renderTitle={_renderTitleModalCreateCategory}
      renderContent={_renderContentModalCreateCategory}
      renderFooter={_renderFooterModalCreateCategory}
      onCancel={_onCloseModalCreateCategory}
      loading={createCategoryLoading}
    />
  );
};

export default CreateCategoryModal;
