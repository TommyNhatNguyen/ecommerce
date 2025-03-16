import { ERROR_MESSAGE } from "@/app/constants/errors";
import { STATUS_OPTIONS } from "@/app/constants/seeds";
import GeneralModal, {
  ModalRefType,
} from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { CreateCategoryFormDTO } from "@/app/shared/interfaces/categories/category.dto";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { imagesService } from "@/app/shared/services/images/imagesService";
import { Button, Input, Select, Upload, UploadFile } from "antd";
import { PlusIcon } from "lucide-react";
import React, {
  forwardRef,
  RefObject,
  useImperativeHandle,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import CustomEditor from "../../CustomEditor";
import { Editor } from "ckeditor5";
import { useIntl } from "react-intl";

type CreateCategoryModalPropsType = {
  handleSubmitCreateCategoryForm: (data: any) => void;
  loading?: boolean;
  refetch?: () => void;
};

const ModalCreateCategory = (
  {
    handleSubmitCreateCategoryForm,
    loading = false,
    refetch,
  }: CreateCategoryModalPropsType,
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
  const _onChangeFile = (filechange: UploadFile) => {
    setFile(filechange);
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

  const handleOpenModal = () => {
    setOpen(true);
  };
  const _onCloseModal = () => {
    setOpen(false);
    setFile(undefined);
    setValue("description", "");
    reset();
  };

  useImperativeHandle<ModalRefType, ModalRefType>(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));

  const _onConfirmCreateCategory = async (data: any) => {
    const payload: CreateCategoryFormDTO = {
      ...data,
    };
    if (file) {
      const imageId = await _onSubmitFileList();
      if (!imageId) return;
      payload.image_id = imageId;
    }
    handleSubmitCreateCategoryForm(payload);
    _onCloseModal();
    refetch?.();
  };
  const _renderFooterModalCreateCategory = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModal}>
          {intl.formatMessage({ id: "close" })}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateCategory)}
        >
          {intl.formatMessage({ id: "add_new" })}
        </Button>
      </div>
    );
  };
  const _renderTitleModalCreateCategory = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: "create_category" })}
      </h1>
    );
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
          <InputAdmin
            label={intl.formatMessage({ id: "image" })}
            required={true}
            placeholder={intl.formatMessage({ id: "image" })}
            customComponent={() => (
              <Upload
                accept=".jpg,.jpeg,.png,.gif,.webp"
                listType="picture-card"
                fileList={file ? [file] : undefined}
                maxCount={1}
                action={`${window.location.origin}/`}
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
      open={open}
      renderTitle={_renderTitleModalCreateCategory}
      renderContent={_renderContentModalCreateCategory}
      renderFooter={_renderFooterModalCreateCategory}
      onCancel={_onCloseModal}
      loading={createCategoryLoading}
    />
  );
};

export default React.memo(
  forwardRef<ModalRefType, CreateCategoryModalPropsType>(ModalCreateCategory),
);
