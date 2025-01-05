"use client";

import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Empty,
  Input,
  InputNumber,
  Select,
  Upload,
  UploadFile,
} from "antd";
import { PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { statusOptions } from "@/app/constants/seeds";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import InputAdmin from "@/app/shared/components/InputAdmin";
import GeneralModal from "@/app/shared/components/GeneralModal";
import LoadingComponent from "@/app/shared/components/LoadingComponent";

import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { imagesService } from "@/app/shared/services/images/imagesService";
import { useCreateProductModal } from "@/app/shared/components/GeneralModal/hooks/useCreateProductModal";

import {
  CreateProductBodyDTO,
  CreateProductDTO,
} from "@/app/shared/interfaces/products/product.dto";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";

type CreateProductModalPropsType = {
  isModalCreateProductOpen: boolean;
  handleCloseModalCreateProduct: () => void;
  refetch: () => void;
};

const CreateProductModal = ({
  isModalCreateProductOpen,
  handleCloseModalCreateProduct,
  refetch,
}: CreateProductModalPropsType) => {
  // State management
  const [createProductForm, setCreateProductForm] = useState<
    Omit<CreateProductDTO, "name" | "price" | "quantity">
  >({
    categoryIds: [],
    discountIds: [],
    status: "ACTIVE",
    imageFileList: [],
  });
  const [uploadImageLoading, setUploadImageLoading] = useState(false);

  // Form handling
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  // Queries
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", isModalCreateProductOpen],
    queryFn: () => categoriesService.getCategories({}, {}),
    enabled: isModalCreateProductOpen,
  });
  const { data: discounts, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ["discounts", isModalCreateProductOpen],
    queryFn: () => discountsService.getDiscounts(),
    enabled: isModalCreateProductOpen,
  });

  // Custom hooks
  const { hanldeCreateProduct, loading } = useCreateProductModal();
  const createProductLoading = loading || uploadImageLoading;

  // Checkbox states
  const checkAll =
    categories &&
    categories.data.length === createProductForm.categoryIds.length;
  const indeterminate =
    categories &&
    createProductForm.categoryIds.length > 0 &&
    createProductForm.categoryIds.length < categories.data.length;
  const checkAllDiscounts =
    discounts && discounts.data.length === createProductForm.discountIds.length;
  const indeterminateDiscounts =
    discounts &&
    createProductForm.discountIds.length > 0 &&
    createProductForm.discountIds.length < discounts.data.length;

  // Handlers
  const _onClearAllCategories = () => {
    setCreateProductForm((prev) => ({ ...prev, categoryIds: [] }));
  };

  const _onClearAllDiscounts = () => {
    setCreateProductForm((prev) => ({ ...prev, discountIds: [] }));
  };

  const _onClearAllImages = () => {
    setCreateProductForm((prev) => ({ ...prev, imageFileList: [] }));
  };
  const _onClearAllFormData = () => {
    reset();
    _onClearAllCategories();
    _onClearAllDiscounts();
    _onClearAllImages();
  };
  const _onCloseModalCreateProduct = () => {
    handleCloseModalCreateProduct();
    _onClearAllFormData();
  };
  const _onSubmitFileList = async () => {
    if (!createProductForm.imageFileList) return;
    setUploadImageLoading(true);
    try {
      const response = await Promise.all(
        createProductForm.imageFileList.map(async (file) => {
          if (!file?.originFileObj) return;
          const response = await imagesService.uploadImage(file.originFileObj, {
            type: "PRODUCT" as ImageType.PRODUCT,
          });
          if (response) {
            return response;
          } else {
            throw new Error("Failed to upload image");
          }
        }),
      );  
      if (response.length > 0) {
        const imageIds = response.map((item) => item?.id);
        return imageIds;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploadImageLoading(false);
    }
  };

  const _onConfirmCreateProduct: SubmitHandler<any> = async (data) => {
    const payload: CreateProductBodyDTO = {
      ...createProductForm,
      ...data,
      price: Number(data.price),
      quantity: Number(data.quantity),
    };
    if (createProductForm.imageFileList) {
      const imageIds = await _onSubmitFileList();
      payload.imageIds = imageIds as string[];
    }
    await hanldeCreateProduct(payload);
    refetch();
    _onCloseModalCreateProduct();
  };

  const _onChangeCategories = (list: string[]) => {
    setCreateProductForm((prev) => ({ ...prev, categoryIds: list }));
  };

  const _onCheckAllCategories: CheckboxProps["onChange"] = (e) => {
    setCreateProductForm((prev) => {
      const categoryIds =
        e.target.checked && categories
          ? categories?.data.map((item) => item.id)
          : [];
      return {
        ...prev,
        categoryIds,
      };
    });
  };

  const _onChangeDiscountCampaign = (value: string[]) => {
    setCreateProductForm((prev) => ({ ...prev, discountIds: value }));
  };

  const _onCheckAllDiscounts: CheckboxProps["onChange"] = (e) => {
    setCreateProductForm((prev) => {
      const discountIds =
        e.target.checked && discounts
          ? discounts?.data.map((item) => item.id)
          : [];
      return {
        ...prev,
        discountIds,
      };
    });
  };

  const _onChangeStatus = (value: ModelStatus) => {
    setCreateProductForm((prev) => ({ ...prev, status: value }));
  };

  const _onChangeFileList = (fileList: UploadFile[]) => {
    setCreateProductForm((prev) => ({
      ...prev,
      imageFileList: fileList,
    }));
  };

  const _onRemoveFileList = (file: UploadFile) => {
    setCreateProductForm((prev) => {
      const imageFileList =
        prev.imageFileList?.filter((item) => item.uid !== file.uid) || [];
      return {
        ...prev,
        imageFileList,
      };
    });
  };
  // Render functions
  const _renderTitleModalCreateProduct = () => {
    return <h1 className="text-2xl font-bold">Create Product</h1>;
  };

  const _renderContentModalCreateProduct = () => {
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
                label="Product Name"
                required={true}
                placeholder="Product Name"
                error={errors.name?.message as string}
                {...field}
              />
            )}
          />
          <InputAdmin
            label="Category"
            placeholder="Category"
            customComponent={(props, ref) => (
              <Select
                options={categories?.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                placement="bottomLeft"
                value={createProductForm.categoryIds}
                onClear={_onClearAllCategories}
                placeholder="Select Category"
                allowClear={true}
                mode="multiple"
                onChange={_onChangeCategories}
                dropdownRender={(menu) =>
                  categories?.data && categories?.data.length > 0 ? (
                    <div className="flex flex-col gap-2 p-2">
                      <Checkbox
                        className="font-medium"
                        value="all"
                        onChange={_onCheckAllCategories}
                        checked={checkAll}
                        indeterminate={indeterminate}
                      >
                        <span>All</span>
                      </Checkbox>
                      <div className="h-[1px] w-full bg-zinc-500/30"></div>
                      <Checkbox.Group
                        options={categories?.data.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                        value={createProductForm.categoryIds}
                        onChange={_onChangeCategories}
                        className="flex flex-col gap-2"
                      />
                      <LoadingComponent isLoading={isLoadingCategories} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Empty description="No categories found" />
                    </div>
                  )
                }
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
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="price"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
              pattern: {
                value: /^[0-9]*\.?[0-9]*$/,
                message: ERROR_MESSAGE.INVALID_NUMBER,
              },
            }}
            render={({ field }) => (
              <InputAdmin
                label="Price"
                required={true}
                placeholder="Price"
                error={errors.price?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <InputNumber
                    className="w-full"
                    ref={ref}
                    formatter={(value) => formatCurrency(Number(value))}
                    {...props}
                  />
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="quantity"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
              pattern: {
                value: /^[0-9]+$/,
                message: ERROR_MESSAGE.INVALID_NUMBER,
              },
            }}
            render={({ field }) => (
              <InputAdmin
                label="Stock"
                required={true}
                placeholder="Stock"
                error={errors.quantity?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <InputNumber
                    className="w-full"
                    formatter={(value) => formatNumber(Number(value))}
                    ref={ref}
                    {...props}
                  />
                )}
              />
            )}
          />
          <InputAdmin
            label="Discount Campaign"
            placeholder="Discount Campaign"
            customComponent={(props, ref) => (
              <Select
                options={discounts?.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                placement="bottomLeft"
                value={createProductForm.discountIds}
                onClear={_onClearAllDiscounts}
                placeholder="Select Discount Campaign"
                allowClear={true}
                mode="multiple"
                onChange={_onChangeDiscountCampaign}
                dropdownRender={(menu) =>
                  discounts?.data && discounts?.data.length > 0 ? (
                    <div className="flex flex-col gap-2 p-2">
                      <Checkbox
                        className="font-medium"
                        value="all"
                        onChange={_onCheckAllDiscounts}
                        checked={checkAllDiscounts}
                        indeterminate={indeterminateDiscounts}
                      >
                        <span>All</span>
                      </Checkbox>
                      <div className="h-[1px] w-full bg-zinc-500/30"></div>
                      <Checkbox.Group
                        options={discounts?.data.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                        value={createProductForm.discountIds}
                        onChange={_onChangeDiscountCampaign}
                        className="flex flex-col gap-2"
                      />
                      <LoadingComponent isLoading={isLoadingDiscounts} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Empty description="No discount campaigns found" />
                    </div>
                  )
                }
              />
            )}
          />
          <InputAdmin
            label="Status"
            placeholder="Status"
            required={true}
            customComponent={() => (
              <Select
                options={statusOptions}
                placeholder="Select Status"
                value={createProductForm.status}
                onChange={_onChangeStatus}
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
                listType="picture-card"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                multiple={true}
                fileList={createProductForm.imageFileList}
                onChange={(info) => {
                  _onChangeFileList(info.fileList);
                }}
                onRemove={(file) => {
                  _onRemoveFileList(file);
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

  const _renderFooterModalCreateProduct = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModalCreateProduct}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateProduct)}
        >
          Create
        </Button>
      </div>
    );
  };

  return (
    <GeneralModal
      renderTitle={_renderTitleModalCreateProduct}
      renderFooter={_renderFooterModalCreateProduct}
      renderContent={_renderContentModalCreateProduct}
      open={isModalCreateProductOpen}
      onCancel={_onCloseModalCreateProduct}
      onOk={_onConfirmCreateProduct}
      loading={createProductLoading || uploadImageLoading}
    />
  );
};

export default CreateProductModal;
