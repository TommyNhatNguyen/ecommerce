import { ERROR_MESSAGE } from "@/app/constants/errors";
import GeneralModal from "@/app/shared/components/GeneralModal";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { Button, Input, Upload } from "antd";
import { PlusIcon } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type CreateCategoryModalPropsType = {
  isModalCreateCategoryOpen: boolean;
  handleCloseModalCreateCategory: () => void;
  handleSubmitCreateCategoryForm: (data: any) => void;
  loading?: boolean;
};

const CreateCategoryModal = ({
  isModalCreateCategoryOpen,
  handleCloseModalCreateCategory,
  handleSubmitCreateCategoryForm,
  loading = false,
}: CreateCategoryModalPropsType) => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();
  const _onCloseModalCreateCategory = () => {
    handleCloseModalCreateCategory();
    reset();
  };
  const _onConfirmCreateCategory = (data: any) => {
    handleSubmitCreateCategoryForm(data);
    reset();
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
                customComponent={(props: any, ref: any) => (
                  <Input.TextArea rows={4} {...props} ref={ref} />
                )}
                error={errors.description?.message as string}
                {...field}
              />
            )}
          />
        </div>
        <div className="mt-4">
          <InputAdmin
            label="Product Image"
            required={true}
            placeholder="Product Image"
            customComponent={() => (
              <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                // fileList={fileList}
                // onChange={onChange}
                // onPreview={onPreview}
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
      loading={loading}
    />
  );
};

export default CreateCategoryModal;
