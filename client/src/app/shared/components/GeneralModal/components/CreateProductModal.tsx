"use client";

import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Checkbox,
  CheckboxProps,
  Empty,
  Input,
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
  const [createProductForm, setCreateProductForm] = useState<CreateProductDTO>({
    name: "",
    categoryIds: [],
    description: "",
    price: "",
    quantity: "",
    discountIds: [],
    status: "ACTIVE",
    imageFileList: [],
  });
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState({
    category: false,
    discountCampaign: false,
  });

  // Form handling
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  // Queries
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories({}, {}),
    enabled: isDropdownVisible.category,
  });
  const { data: discounts, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ["discounts"],
    queryFn: () => discountsService.getDiscounts(),
    enabled: isDropdownVisible.discountCampaign,
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

  const _onCloseModalCreateProduct = () => {
    handleCloseModalCreateProduct();
    reset();
    _onClearAllCategories();
    _onClearAllDiscounts();
    _onClearAllImages();
  };

  const _onSubmitFileList = async () => {
    if (!createProductForm.imageFileList) return;
    setUploadImageLoading(true);
    try {
      const response = await Promise.all(
        createProductForm.imageFileList.map(async (file) => {
          if (!file?.originFileObj) return;
          const response = await imagesService.uploadImage(file.originFileObj);
          if (response) {
            return response.data;
          } else {
            throw new Error("Failed to upload image");
          }
        }),
      );
      if (response.length > 0) {
        const imageIds = response.map((item) => item.id);
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
      payload.imageIds = imageIds;
    }
    await hanldeCreateProduct(payload);
    refetch();
    _onCloseModalCreateProduct();
    _onClearAllCategories();
    _onClearAllDiscounts();
  };

  const _onChangeCategories = (list: string[]) => {
    setCreateProductForm((prev) => ({ ...prev, categoryIds: list }));
  };

  const _onCheckAllCategories: CheckboxProps["onChange"] = (e) => {
    setCreateProductForm((prev) => ({
      ...prev,
      categoryIds:
        e.target.checked && categories
          ? categories?.data.map((item) => item.id)
          : [],
    }));
  };

  const _onChangeDiscountCampaign = (value: string[]) => {
    setCreateProductForm((prev) => ({ ...prev, discountIds: value }));
  };

  const _onCheckAllDiscounts: CheckboxProps["onChange"] = (e) => {
    setCreateProductForm((prev) => ({
      ...prev,
      discountIds:
        e.target.checked && discounts
          ? discounts?.data.map((item) => item.id)
          : [],
    }));
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
    setCreateProductForm((prev) => ({
      ...prev,
      imageFileList:
        prev.imageFileList?.filter((item) => item.uid !== file.uid) || [],
    }));
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
            required={true}
            customComponent={(props, ref) => (
              <Select
                options={categories?.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                placement="bottomLeft"
                onDropdownVisibleChange={(open) => {
                  setIsDropdownVisible((prev) => ({
                    ...prev,
                    category: true,
                  }));
                }}
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
            }}
            render={({ field }) => (
              <InputAdmin
                label="Price"
                required={true}
                placeholder="Price"
                error={errors.price?.message as string}
                {...field}
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
            }}
            render={({ field }) => (
              <InputAdmin
                label="Stock"
                required={true}
                placeholder="Stock"
                error={errors.quantity?.message as string}
                {...field}
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
                onDropdownVisibleChange={(open) => {
                  setIsDropdownVisible((prev) => ({
                    ...prev,
                    discountCampaign: true,
                  }));
                }}
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
        <LoadingComponent isLoading={createProductLoading} />
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
    />
  );
};

export default CreateProductModal;
