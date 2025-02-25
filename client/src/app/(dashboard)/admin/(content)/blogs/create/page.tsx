"use client";
import { useBlogsCreate } from "@/app/(dashboard)/admin/(content)/blogs/create/hooks/useBlogsCreate";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import { statusOptions } from "@/app/constants/seeds";
import CustomEditor from "@/app/shared/components/CustomEditor";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { IBlogsCreate } from "@/app/shared/interfaces/blogs/blogs.interface";
import { Button, Image, Select, UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Editor } from "ckeditor5/src/core.js";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ModelStatus } from "../../../../../../../../backend/src/share/models/base-model";
import { useAppSelector } from "@/app/shared/hooks/useRedux";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
import { CustomerDragger } from "@/app/shared/components/CustomUploader";

type BlogsPropsType = {};
const BlogsCreate = (props: BlogsPropsType) => {
  const [images, setImages] = useState<{ [key: string]: UploadFile }>({});
  const { userInfo } = useAppSelector((state) => state.auth);
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<IBlogsCreate>({
    defaultValues: {
      status: ModelStatus.ACTIVE,
      user_id: userInfo?.id,
    },
  });
  const { handleCreateBlog, isCreateBlogLoading } = useBlogsCreate();
  const _onResetForm = () => {
    reset();
    setImages({});
  };
  const _onCreateBlog = (data: IBlogsCreate) => {
    handleCreateBlog(
      { ...data, user_id: userInfo?.id || "" },
      images,
      _onResetForm,
    );
  };
  return (
    <div className="flex w-full flex-col gap-4 overflow-hidden rounded-sm bg-white p-4">
      {/* Title */}
      <Controller
        control={control}
        name="title"
        rules={{
          required: {
            value: true,
            message: ERROR_MESSAGE.REQUIRED,
          },
        }}
        render={({ field }) => (
          <InputAdmin
            label="Title"
            placeholder="Enter blog title"
            error={errors.title?.message || ""}
            required={true}
            {...field}
          />
        )}
      />
      {/* Short description */}
      <Controller
        control={control}
        name="short_description"
        rules={{
          required: {
            value: true,
            message: ERROR_MESSAGE.REQUIRED,
          },
        }}
        render={({ field }) => (
          <InputAdmin
            label="Short description"
            placeholder="Enter blog short description"
            error={errors.short_description?.message || ""}
            required={true}
            {...field}
            customComponent={(props, ref) => (
              <TextArea {...props} ref={ref} rows={4} />
            )}
          />
        )}
      />
      {/* Description */}
      <Controller
        control={control}
        name="description"
        rules={{
          required: {
            value: true,
            message: ERROR_MESSAGE.REQUIRED,
          },
        }}
        render={({ field }) => (
          <InputAdmin
            label="Description"
            placeholder="Description"
            required={true}
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
      {/* Thumbnail */}
      <InputAdmin
        label="Thumbnail"
        placeholder="Thumbnail"
        required={true}
        customComponent={(props, ref) => (
          <div>
            <CustomerDragger
              {...props}
              onImageChange={(images) => setImages(images)}
              isSingle={true}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.values(images).map((image) => (
                <div key={image.uid}>
                  <Image
                    src={URL.createObjectURL(image.originFileObj as File)}
                    alt={image.name}
                    className="max-h-100 max-w-100 rounded-sm object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      />
      {/* Status */}
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <InputAdmin
            label="Status"
            placeholder="Status"
            required={true}
            className="w-full"
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
      {/* Submit */}
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onResetForm}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onCreateBlog)}
        >
          Create
        </Button>
      </div>
      <LoadingComponent isLoading={isCreateBlogLoading} />
    </div>
  );
};

export default BlogsCreate;
