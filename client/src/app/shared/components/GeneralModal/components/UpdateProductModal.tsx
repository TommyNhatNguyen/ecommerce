import { ERROR_MESSAGE } from "@/app/constants/errors";
import InputAdmin from "@/app/shared/components/InputAdmin";
import GeneralModal from "@/app/shared/components/GeneralModal";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { productService } from "@/app/shared/services/products/productService";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Empty,
  Image,
  Input,
  InputNumber,
  Select,
  Upload,
  UploadFile,
} from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { statusOptions } from "@/app/constants/seeds";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { useUpdateProductModal } from "@/app/shared/components/GeneralModal/hooks/useUpdateProductModal";
import { UpdateProductDTO } from "@/app/shared/interfaces/products/product.dto";

const ButtonDeleteImageWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 text-white" />
  </Button>,
);

type UpdateProductModalPropsType = {
  isModalUpdateProductOpen: boolean;
  handleCloseModalUpdateProduct: () => void;
  updateProductId: string;
  refetch: () => void;
};

const UpdateProductModal = ({
  isModalUpdateProductOpen = false,
  handleCloseModalUpdateProduct,
  updateProductId,
  refetch,
}: UpdateProductModalPropsType) => {
  const {
    deleteImageLoading,
    deleteImageError,
    handleDeleteImage,
    uploadImageLoading,
    uploadImageError,
    handleUploadImages,
    updateProductLoading,
    updateProductError,
    handleUpdateProduct,
  } = useUpdateProductModal();
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", isModalUpdateProductOpen],
    queryFn: () => categoriesService.getCategories({}, {}),
    enabled: isModalUpdateProductOpen,
  });
  const { data: discounts, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ["discounts", isModalUpdateProductOpen],
    queryFn: () => discountsService.getDiscounts(),
    enabled: isModalUpdateProductOpen,
  });
  const {
    data: updateProductData,
    isLoading: loading,
    error: error,
  } = useQuery({
    queryKey: ["product", updateProductId, updateProductLoading],
    queryFn: () =>
      productService.getProductById(updateProductId, {
        includeCategory: true,
        includeDiscount: true,
        includeImage: true,
      }),
    enabled: !!updateProductId,
  });
  const [imageFileList, setImageFileList] = useState<UploadFile<any>[]>([]);
  const [currentImageFileList, setCurrentImageFileList] = useState<
    ProductModel["image"]
  >([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getFieldState,
  } = useForm({
    defaultValues: {
      name: "",
      categoryIds: [],
      description: "",
      price: "",
      quantity: "",
      discountIds: [],
      status: "",
    },
  });
  useEffect(() => {
    if (updateProductData) {
      setValue("name", updateProductData.name || "");
      setValue(
        "categoryIds",
        // @ts-ignore
        updateProductData.category?.map((item) => item.id || "") || [],
      );
      setValue("description", updateProductData.description || "");
      // @ts-ignore
      setValue("price", updateProductData.price || "");
      // @ts-ignore
      setValue("quantity", updateProductData.inventory?.quantity || "");
      setValue(
        "discountIds",
        // @ts-ignore
        updateProductData.discount?.map((item) => item.id || "") || [],
      );
      setValue("status", updateProductData.status || "");
      setCurrentImageFileList(updateProductData?.image || []);
    }
  }, [updateProductData]);

  const _onChangeFileList = (fileList: UploadFile[]) => {
    setImageFileList(fileList);
  };
  const _onRemoveFileList = (file: UploadFile) => {
    setImageFileList((prev) => {
      const imageFileList = prev.filter((item) => item.uid !== file.uid) || [];
      return imageFileList;
    });
  };
  const _onDeleteImage = async (imageId: string) => {
    const response = await handleDeleteImage(imageId);
    if (response) {
      setCurrentImageFileList((prev) => {
        const imageFileList =
          prev?.filter((item) => item?.id !== imageId) || [];
        return imageFileList;
      });
    }
  };
  const _onSubmitFileList = async () => {
    const imagesIds = await handleUploadImages(imageFileList);
    return imagesIds;
  };
  const _onClearAllFormData = () => {
    reset();
    setImageFileList([]);
  };
  const _onCloseModalUpdateProduct = () => {
    handleCloseModalUpdateProduct();
  };
  const _onConfirmUpdateProduct = async (data: any) => {
    const currentImageIds = currentImageFileList?.map((item) => item.id) || [];
    const payload: UpdateProductDTO = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      quantity: Number(data.quantity),
      categoryIds: data.categoryIds,
      discountIds: data.discountIds,
      status: data.status,
    };
    if (imageFileList.length > 0 || currentImageIds.length > 0) {
      const imageIds = (await _onSubmitFileList()) || [];
      payload.imageIds = [...currentImageIds, ...imageIds] as string[];
    }
    await handleUpdateProduct(updateProductId, payload);
    refetch();
    _onClearAllFormData();
    _onCloseModalUpdateProduct();
  };
  const _renderTitleModalUpdateProduct = () => {
    return <h1 className="text-2xl font-bold">Update Product</h1>;
  };

  const _renderContentModalUpdateProduct = () => {
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
          <Controller
            control={control}
            name="categoryIds"
            render={({ field }) => (
              <InputAdmin
                label="Category"
                placeholder="Category"
                error={errors.categoryIds?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <>
                    <Select
                      {...props}
                      ref={ref}
                      options={categories?.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      placement="bottomLeft"
                      placeholder="Select Category"
                      allowClear={true}
                      mode="multiple"
                      dropdownRender={(menu) => {
                        const isAllChecked =
                          field.value?.length === categories?.data.length;
                        const isIndeterminate =
                          categories &&
                          field.value?.length > 0 &&
                          field.value?.length < categories?.data.length;
                        return (
                          <div className="flex flex-col gap-2 p-2">
                            <Checkbox
                              checked={isAllChecked}
                              indeterminate={isIndeterminate}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange(
                                    categories?.data.map((item) => item.id) ||
                                      [],
                                  );
                                } else {
                                  field.onChange([]);
                                }
                              }}
                            >
                              <span>All</span>
                            </Checkbox>
                            {menu}
                            <LoadingComponent isLoading={isLoadingCategories} />
                          </div>
                        );
                      }}
                      optionRender={(option) => {
                        const { value, label } = option;
                        // @ts-ignore
                        const isChecked = field.value?.includes(value);
                        return (
                          <Checkbox checked={isChecked}>
                            <span>{option.label}</span>
                          </Checkbox>
                        );
                      }}
                    />
                  </>
                )}
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
          <Controller
            control={control}
            name="discountIds"
            render={({ field }) => (
              <InputAdmin
                label="Discount Campaign"
                placeholder="Discount Campaign"
                error={errors.discountIds?.message as string}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <>
                    <Select
                      {...props}
                      ref={ref}
                      options={discounts?.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      placement="bottomLeft"
                      placeholder="Select Discount Campaign"
                      allowClear={true}
                      mode="multiple"
                      dropdownRender={(menu) => {
                        const isAllChecked =
                          field.value?.length === discounts?.data.length;
                        const isIndeterminate =
                          discounts &&
                          field.value?.length > 0 &&
                          field.value?.length < discounts?.data.length;
                        return (
                          <div className="flex flex-col gap-2 p-2">
                            <Checkbox
                              checked={isAllChecked}
                              indeterminate={isIndeterminate}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange(
                                    discounts?.data.map((item) => item.id) ||
                                      [],
                                  );
                                } else {
                                  field.onChange([]);
                                }
                              }}
                            >
                              <span>All</span>
                            </Checkbox>
                            {menu}
                            <LoadingComponent isLoading={isLoadingDiscounts} />
                          </div>
                        );
                      }}
                      optionRender={(option) => {
                        const { value, label } = option;
                        // @ts-ignore
                        const isChecked = field.value?.includes(value);
                        return (
                          <Checkbox checked={isChecked}>
                            <span>{option.label}</span>
                          </Checkbox>
                        );
                      }}
                    />
                  </>
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <InputAdmin
                label="Status"
                placeholder="Status"
                required={true}
                {...field}
                customComponent={(props: any, ref: any) => (
                  <Select
                    {...props}
                    ref={ref}
                    options={statusOptions}
                    placeholder="Select Status"
                  />
                )}
              />
            )}
          />
        </div>
        <div className="mt-4">
          <InputAdmin
            label="Add New Product Image"
            required={true}
            placeholder="Add New Product Image"
            customComponent={() => (
              <div className="flex flex-wrap gap-2">
                <div className="flex gap-2">
                  {currentImageFileList &&
                    currentImageFileList.map((item) => (
                      <div key={item?.id} className="group relative">
                        <Image
                          src={item?.url || defaultImage}
                          alt="Product Image"
                          className="h-full w-full rounded-md object-fill"
                          wrapperClassName="h-[100px] w-[100px] flex items-center justify-center cursor-pointer"
                          preview={false}
                        />
                        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <ButtonDeleteImageWithPopover
                            trigger={"click"}
                            handleDelete={() => {
                              _onDeleteImage(item?.id || "");
                            }}
                            title="Delete Image"
                          />
                        </div>
                        {deleteImageLoading && (
                          <LoadingComponent isLoading={deleteImageLoading} />
                        )}
                      </div>
                    ))}
                </div>
                <Upload
                  listType="picture-card"
                  accept=".jpg,.jpeg,.png,.gif,.webp"
                  multiple={true}
                  fileList={imageFileList}
                  onChange={(info) => {
                    _onChangeFileList(info.fileList);
                  }}
                  onRemove={(file) => {
                    _onRemoveFileList(file);
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                </Upload>
              </div>
            )}
          />
        </div>
        <LoadingComponent isLoading={loading} />
      </>
    );
  };

  const _renderFooterModalUpdateProduct = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModalUpdateProduct}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmUpdateProduct)}
        >
          Update
        </Button>
      </div>
    );
  };
  return (
    <GeneralModal
      renderTitle={_renderTitleModalUpdateProduct}
      renderFooter={_renderFooterModalUpdateProduct}
      renderContent={_renderContentModalUpdateProduct}
      open={isModalUpdateProductOpen}
      onCancel={_onCloseModalUpdateProduct}
      onOk={_onConfirmUpdateProduct}
      loading={loading || uploadImageLoading || updateProductLoading}
    />
  );
};

export default UpdateProductModal;
