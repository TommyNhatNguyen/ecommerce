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
  Divider,
  Empty,
  Image,
  Input,
  InputNumber,
  Select,
  Upload,
  UploadFile,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { STATUS_OPTIONS } from "@/app/constants/seeds";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { useUpdateProductModal } from "@/app/shared/components/GeneralModal/hooks/useUpdateProductModal";
import { UpdateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { DISCOUNT_SCOPE } from "@/app/constants/enum";
import { optionService } from "@/app/shared/services/variant/optionService";
import { generateAllPairs } from "@/app/shared/utils/generateAllPairs";
import { filterOption } from "@/lib/antd";
import CustomEditor from "@/app/shared/components/CustomEditor";
import { Editor } from "ckeditor5";

const ButtonDeleteImageWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 text-white" />
  </Button>,
);

type UpdateProductModalPropsType = {
  isModalUpdateProductOpen: boolean;
  handleCloseModalUpdateProduct: () => void;
  updateProductId: string;
  refetch?: () => void;
};

const UpdateProductModal = ({
  isModalUpdateProductOpen = false,
  handleCloseModalUpdateProduct,
  updateProductId,
  refetch,
}: UpdateProductModalPropsType) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOptionValues, setSelectedOptionValues] = useState<{
    [key: string]: string[];
  }>({});
  const [variantImageFileList, setVariantImageFileList] = useState<{
    [key: number]: UploadFile[];
  }>({});
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
    queryFn: () => categoriesService.getCategories({}),
    enabled: isModalUpdateProductOpen,
  });
  const { data: discounts, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ["discounts", isModalUpdateProductOpen],
    queryFn: () =>
      discountsService.getDiscounts({ scope: DISCOUNT_SCOPE.PRODUCT }),
    enabled: isModalUpdateProductOpen,
  });
  const { data: options, isLoading: isLoadingOptions } = useQuery({
    queryKey: ["options", isModalUpdateProductOpen],
    queryFn: () => optionService.getOptionList({ include_option_values: true }),
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
        includeVariant: true,
        includeVariantOption: true,
        includeVariantOptionType: true,
        includeVariantImage: true,
        includeVariantInfo: true,
        includeVariantInventory: true,
      }),
    enabled: !!updateProductId,
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    getFieldState,
  } = useForm<UpdateProductDTO>({
    defaultValues: {
      name: updateProductData?.name,
      description: updateProductData?.description,
      short_description: updateProductData?.short_description,
      status: updateProductData?.status,
      categoryIds: updateProductData?.category?.map((item) => item.id) || [],
      variants: updateProductData?.variant?.map((item) => ({
        variant_data: {
          name: item.name || "",
          options_value_ids: item.option_values?.map((item) => item.id) || [],
        },
        product_sellables: {
          price: item.product_sellable?.price,
          quantity: item.product_sellable?.inventory?.quantity || 0,
          low_stock_threshold:
            item.product_sellable?.inventory?.low_stock_threshold || 0,
          cost: item.product_sellable?.inventory?.cost || 0,
          status: item.status,
          discountIds:
            item.product_sellable?.discount?.map((item) => item.id) || [],
          imageIds: item.product_sellable?.image?.map((item) => item.id) || [],
        },
      })),
    },
  });

  const checkAll =
    categories && categories.data.length === watch("categoryIds").length;
  const indeterminate =
    categories &&
    watch("categoryIds").length > 0 &&
    watch("categoryIds").length < categories.data.length;
  const allPairs = useMemo(
    () => generateAllPairs(selectedOptionValues),
    [selectedOptionValues, selectedOptions],
  );
  const _onClearAllImages = () => setVariantImageFileList([]);
  const _onClearAllFormData = () => {
    reset();
    _onClearAllImages();
  };
  const _onCloseModalUpdateProduct = () => {
    handleCloseModalUpdateProduct();
    _onClearAllFormData();
  };
  // TODO: Update product
  const _onChangeFileList = (id: number, fileList: UploadFile[]) => {
    setVariantImageFileList((prev) => ({ ...prev, [id]: fileList }));
    setValue(
      `variants.${id}.product_sellables.imageIds`,
      fileList.map((item) => item.uid),
    );
  };

  const _onRemoveFileList = (id: number) => {
    setVariantImageFileList((prev) => {
      const newList = { ...prev };
      delete newList[id];
      return newList;
    });
  };
  const _onConfirmUpdateProduct = async (data: any) => {
    console.log("🚀 ~ const_onConfirmUpdateProduct= ~ data:", data);
    console.log(
      "🚀 ~ const_onConfirmUpdateProduct= ~ data:",
      variantImageFileList,
    );
    // const currentImageIds = currentImageFileList?.map((item) => item.id) || [];
    // const payload: UpdateProductDTO = {
    //   name: data.name,
    //   description: data.description,
    //   price: Number(data.price),
    //   quantity: Number(data.quantity),
    //   categoryIds: data.categoryIds,
    //   discountIds: data.discountIds,
    //   status: data.status,
    //   cost: Number(data.cost),
    // };
    // if (imageFileList.length > 0 || currentImageIds.length > 0) {
    //   const imageIds = (await _onSubmitFileList()) || [];
    //   payload.imageIds = [...currentImageIds, ...imageIds] as string[];
    // }
    // await handleUpdateProduct(updateProductId, payload);
    // refetch && refetch();
    // _onClearAllFormData();
    // _onCloseModalUpdateProduct();
  };

  useEffect(() => {
    if (updateProductData) {
      // Update form data
      reset({
        name: updateProductData?.name,
        description: updateProductData?.description,
        short_description: updateProductData?.short_description,
        status: updateProductData?.status,
        categoryIds: updateProductData?.category?.map((item) => item.id) || [],
        variants: updateProductData?.variant?.map((item) => {
          console.log("item.product_sellable", item.product_sellable);
          return {
            variant_data: {
              name: item?.name || "",
              options_value_ids:
                item.option_values?.map((item) => item.id) || [],
            },
            product_sellables: {
              price: item.product_sellable?.price || 0,
              quantity: item.product_sellable?.inventory?.quantity || 0,
              low_stock_threshold:
                item.product_sellable?.inventory?.low_stock_threshold || 0,
              cost: item.product_sellable?.inventory?.cost || 0,
              status: item.status,
              discountIds:
                item.product_sellable?.discount?.map((item) => item.id) || [],
              imageIds:
                item.product_sellable?.image?.map((item) => item.id) || [],
            },
          };
        }),
      });
      // Update selected options
      setSelectedOptions(
        Array.from(
          new Set(
            updateProductData?.variant
              ?.flatMap((item) =>
                item.option_values?.map(
                  (optionValue) => optionValue.options?.id,
                ),
              )
              .filter((item) => item !== undefined) || [],
          ),
        ),
      );
      // // Update selected option values
      setSelectedOptionValues(
        updateProductData?.variant?.reduce(
          (acc, item) => {
            item.option_values?.forEach((optionValue) => {
              const optionId = optionValue.options?.id || "";
              acc[optionId] = Array.from(
                new Set([...(acc[optionId] || []), optionValue.id]),
              );
            });
            return acc;
          },
          {} as { [key: string]: string[] },
        ) || {},
      );
      // Set variant image file list
      setVariantImageFileList(
        updateProductData?.variant?.reduce(
          (acc, item, index) => {
            acc[index] =
              item.product_sellable?.image?.map((image) => ({
                uid: image.id,
                name: image.url.split("/").pop() || "",
                url: image.url,
                status: "done",
                type: "image/jpeg",
                thumbUrl: image.url,
              })) || [];
            return acc;
          },
          {} as { [key: number]: UploadFile[] },
        ) || {},
      );
    }
  }, [updateProductData]);
  const _renderTitleModalUpdateProduct = () => {
    return <h1 className="text-2xl font-bold">Update Product</h1>;
  };

  const _renderContentModalUpdateProduct = () => {
    return (
      <>
        <div className="flex w-full flex-1 flex-shrink-0 flex-col gap-4">
          {/* Product information */}
          <div className="flex w-full flex-col gap-2">
            <h3 className="text-lg font-semibold underline">
              Product information
            </h3>
            <div className="flex w-full flex-col gap-4">
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
                name="categoryIds"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: ERROR_MESSAGE.REQUIRED,
                  },
                }}
                render={({ field }) => (
                  <InputAdmin
                    {...field}
                    error={errors?.categoryIds?.message || ""}
                    label="Category"
                    placeholder="Choose category"
                    groupClassName="w-full"
                    className="w-full"
                    required={true}
                    customComponent={(props, ref: any) => (
                      <Select
                        {...props}
                        ref={ref}
                        options={categories?.data.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                        placement="bottomLeft"
                        value={field.value}
                        onClear={() => field.onChange([])}
                        placeholder="Select Category"
                        allowClear={true}
                        mode="multiple"
                        dropdownRender={(menu) => {
                          return categories?.data &&
                            categories?.data.length > 0 ? (
                            <div className="flex flex-col gap-2 p-2">
                              <Checkbox
                                className="font-medium"
                                value="all"
                                onChange={(e) => {
                                  field.onChange(
                                    e.target.checked
                                      ? categories?.data.map((item) => item.id)
                                      : [],
                                  );
                                }}
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
                                value={field.value}
                                onChange={field.onChange}
                                className="flex flex-col gap-2"
                              />
                              <LoadingComponent
                                isLoading={isLoadingCategories}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <Empty description="No categories found" />
                            </div>
                          );
                        }}
                      />
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
                    {...field}
                    customComponent={({ onChange, props }: any, ref: any) => (
                      <CustomEditor
                        onChange={(_: any, editor: Editor) => {
                          field.onChange(editor.getData());
                        }}
                        initialData={field.value || ""}
                        initialLoading={loading}
                        data={field.value || ""}
                        {...props}
                        ref={ref}
                      />
                    )}
                  />
                )}
              />
              <Controller
                control={control}
                name="short_description"
                render={({ field }) => (
                  <InputAdmin
                    label="Short Description"
                    placeholder="Short Description"
                    {...field}
                    customComponent={({ onChange, props }: any, ref: any) => (
                      <CustomEditor
                        onChange={(_: any, editor: Editor) => {
                          field.onChange(editor.getData());
                        }}
                        initialData={field.value || ""}
                        initialLoading={loading}
                        data={field.value || ""}
                        {...props}
                        ref={ref}
                      />
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
                    className="w-full"
                    customComponent={(props: any, ref: any) => (
                      <Select
                        options={STATUS_OPTIONS}
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
          </div>
          {/* Product variants */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold underline">
              Product variants
            </h3>
            <div className="flex w-full flex-col gap-4">
              <InputAdmin
                label="Variant options"
                placeholder="Select some options"
                required={true}
                groupClassName="w-full"
                className="w-full"
                error={errors?.variants?.message || ""}
                customComponent={(props, ref) => (
                  <Select
                    options={options?.data.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    {...props}
                    showSearch={true}
                    filterOption={filterOption}
                    allowClear={true}
                    mode="multiple"
                    value={selectedOptions}
                    disabled={true}
                  />
                )}
              />
              {options?.data
                ?.filter((item) => selectedOptions.includes(item.id))
                ?.map((option) => (
                  <div key={option.id}>
                    <div>{option.name}</div>
                    <Checkbox.Group
                      options={option.option_values?.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      disabled={true}
                      value={selectedOptionValues[option.id]}
                    />
                  </div>
                ))}
              {allPairs &&
                allPairs[0] &&
                allPairs[0].length > 0 &&
                allPairs.map((item, index) => (
                  <Controller
                    control={control}
                    name={`variants.${index}`}
                    key={`${item[0]}-${item[1]}-${index}`}
                    render={({ field }) => (
                      <div>
                        {/* Variant data */}
                        <div className="grid grid-cols-3 gap-2">
                          <Controller
                            control={control}
                            name={`variants.${index}.variant_data.name`}
                            rules={{
                              required: {
                                value: true,
                                message: ERROR_MESSAGE.REQUIRED,
                              },
                            }}
                            render={({ field }) => (
                              <InputAdmin
                                label="Variant Name"
                                placeholder="Variant Name"
                                required={true}
                                error={
                                  errors?.variants?.[index]?.variant_data?.name
                                    ?.message || ""
                                }
                                {...field}
                                onChange={(e) => {
                                  setValue(
                                    `variants.${index}.variant_data.options_value_ids`,
                                    allPairs[index],
                                  );
                                  field.onChange(e.target.value);
                                }}
                              />
                            )}
                          />
                          <InputAdmin
                            label="Variant options"
                            placeholder="Select some options"
                            className="w-full"
                            required={true}
                            customComponent={(props, ref) => (
                              <Select
                                mode="multiple"
                                suffixIcon={null}
                                disabled
                                showSearch={true}
                                {...props}
                                value={options?.data
                                  ?.flatMap((option) => option.option_values)
                                  .filter((option) =>
                                    allPairs[index].includes(option?.id || ""),
                                  )
                                  .map((item) => item?.id || "")}
                              >
                                {options?.data
                                  ?.flatMap((option) => option.option_values)
                                  .filter((option) =>
                                    allPairs[index].includes(option?.id || ""),
                                  )
                                  .map((item) => (
                                    <Select.Option
                                      key={item?.id || ""}
                                      value={item?.id || ""}
                                    >
                                      {item?.name || ""}
                                    </Select.Option>
                                  ))}
                              </Select>
                            )}
                          />
                          {/* Price */}
                          <Controller
                            control={control}
                            name={`variants.${index}.product_sellables.price`}
                            rules={{
                              required: {
                                value: true,
                                message: ERROR_MESSAGE.REQUIRED,
                              },
                            }}
                            render={({ field }) => (
                              <InputAdmin
                                label="Price"
                                placeholder="Price"
                                required={true}
                                error={
                                  errors?.variants?.[index]?.product_sellables
                                    ?.price?.message || ""
                                }
                                {...field}
                                customComponent={(props, ref: any) => (
                                  <InputNumber
                                    {...props}
                                    ref={ref}
                                    className="w-full"
                                    formatter={(value) =>
                                      formatCurrency(Number(value))
                                    }
                                  />
                                )}
                              />
                            )}
                          />
                        </div>
                        {/* Product sellables */}
                        <div className="mt-2 flex flex-col gap-2">
                          <div className="grid grid-cols-3 gap-2">
                            {/* Inventory quantity */}
                            <Controller
                              control={control}
                              name={`variants.${index}.product_sellables.quantity`}
                              rules={{
                                required: {
                                  value: true,
                                  message: ERROR_MESSAGE.REQUIRED,
                                },
                              }}
                              render={({ field }) => (
                                <InputAdmin
                                  label="Inventory quantity"
                                  placeholder="Inventory quantity"
                                  required={true}
                                  error={
                                    errors?.variants?.[index]?.product_sellables
                                      ?.quantity?.message || ""
                                  }
                                  {...field}
                                  customComponent={(props, ref: any) => (
                                    <InputNumber
                                      {...props}
                                      ref={ref}
                                      className="w-full"
                                      formatter={(value) =>
                                        formatNumber(Number(value))
                                      }
                                    />
                                  )}
                                />
                              )}
                            />
                            {/* Low stock threshold */}
                            <Controller
                              control={control}
                              name={`variants.${index}.product_sellables.low_stock_threshold`}
                              rules={{
                                required: {
                                  value: true,
                                  message: ERROR_MESSAGE.REQUIRED,
                                },
                              }}
                              render={({ field }) => (
                                <InputAdmin
                                  label="Low stock threshold"
                                  placeholder="Low stock threshold"
                                  required={true}
                                  error={
                                    errors?.variants?.[index]?.product_sellables
                                      ?.low_stock_threshold?.message || ""
                                  }
                                  {...field}
                                  customComponent={(props, ref: any) => (
                                    <InputNumber
                                      {...props}
                                      ref={ref}
                                      className="w-full"
                                      formatter={(value) =>
                                        formatNumber(Number(value))
                                      }
                                    />
                                  )}
                                />
                              )}
                            />
                            {/* Cost */}
                            <Controller
                              control={control}
                              name={`variants.${index}.product_sellables.cost`}
                              rules={{
                                required: {
                                  value: true,
                                  message: ERROR_MESSAGE.REQUIRED,
                                },
                              }}
                              render={({ field }) => (
                                <InputAdmin
                                  label="Cost"
                                  placeholder="Cost"
                                  required={true}
                                  error={
                                    errors?.variants?.[index]?.product_sellables
                                      ?.cost?.message || ""
                                  }
                                  {...field}
                                  customComponent={(props, ref: any) => (
                                    <InputNumber
                                      {...props}
                                      ref={ref}
                                      className="w-full"
                                      formatter={(value) =>
                                        formatCurrency(Number(value))
                                      }
                                    />
                                  )}
                                />
                              )}
                            />
                          </div>
                          {/* Discounts */}
                          <Controller
                            control={control}
                            name={`variants.${index}.product_sellables.discountIds`}
                            render={({ field }) => (
                              <InputAdmin
                                label="Discounts"
                                placeholder="Discounts"
                                className="w-full"
                                {...field}
                                customComponent={(props: any, ref: any) => (
                                  <Select
                                    options={discounts?.data.map((item) => ({
                                      label: item.name,
                                      value: item.id,
                                    }))}
                                    showSearch={true}
                                    placeholder="Select Discounts"
                                    mode="multiple"
                                    {...props}
                                    ref={ref}
                                  />
                                )}
                              />
                            )}
                          />
                          {/* Status */}
                          <Controller
                            control={control}
                            name={`variants.${index}.product_sellables.status`}
                            render={({ field }) => (
                              <InputAdmin
                                label="Status"
                                placeholder="Status"
                                required={true}
                                className="w-full"
                                {...field}
                                customComponent={(props: any, ref: any) => (
                                  <Select
                                    options={STATUS_OPTIONS}
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
                          {/* Images */}
                          <div className="mt-4">
                            <Controller
                              control={control}
                              name={`variants.${index}.product_sellables.imageIds`}
                              render={({ field, formState: { errors } }) => {
                                return (
                                  // @ts-ignore
                                  <InputAdmin
                                    label="Product Image"
                                    required={true}
                                    placeholder="Product Image"
                                    {...field}
                                    error={
                                      errors?.variants?.[index]
                                        ?.product_sellables?.imageIds
                                        ?.message || ""
                                    }
                                    customComponent={(
                                      { value, onChange, ...props },
                                      ref,
                                    ) => {
                                      return (
                                        <Upload
                                          accept=".jpg,.jpeg,.png,.gif,.webp"
                                          listType="picture-card"
                                          maxCount={1}
                                          multiple={true}
                                          action={`${window.location.origin}/`}
                                          fileList={
                                            variantImageFileList[index] || []
                                          }
                                          onChange={(info) => {
                                            _onChangeFileList(
                                              index,
                                              info.fileList,
                                            );
                                          }}
                                          onRemove={(file) => {
                                            _onRemoveFileList(index);
                                          }}
                                          {...props}
                                          ref={ref}
                                        >
                                          <PlusIcon className="h-4 w-4" />
                                        </Upload>
                                      );
                                    }}
                                  />
                                );
                              }}
                            />
                          </div>
                        </div>
                        <Divider />
                      </div>
                    )}
                  />
                ))}
            </div>
          </div>
        </div>
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
