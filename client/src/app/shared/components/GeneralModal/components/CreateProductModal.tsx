"use client";
import React, { useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Checkbox,
  Divider,
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
import { CreateProductDTOV2 } from "@/app/shared/interfaces/products/product.dto";
import { ImageType } from "@/app/shared/interfaces/image/image.dto";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import { DISCOUNT_SCOPE } from "@/app/constants/enum";
import { optionService } from "@/app/shared/services/variant/optionService";
import { generateAllPairs } from "@/app/shared/utils/generateAllPairs";
import { useNotification } from "@/app/contexts/NotificationContext";
import { filterOption } from "@/lib/antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Editor, Essentials } from "ckeditor5";
import CustomEditor from "@/app/shared/components/CustomEditor";

type CreateProductModalPropsType = {
  isModalCreateProductOpen: boolean;
  handleCloseModalCreateProduct: () => void;
  refetch?: () => void;
};

const CreateProductModal = ({
  isModalCreateProductOpen,
  handleCloseModalCreateProduct,
  refetch,
}: CreateProductModalPropsType) => {
  // ===== State Management =====
  const [variantImageFileList, setVariantImageFileList] = useState<{
    [key: number]: UploadFile[];
  }>({});
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOptionValues, setSelectedOptionValues] = useState<{
    [key: string]: string[];
  }>({});
  const { notificationApi } = useNotification();
  // ===== Form Management =====
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
    getValues,
  } = useForm<CreateProductDTOV2>({
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
      categoryIds: [],
      variants: [],
    },
  });
  // ===== Queries =====
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", isModalCreateProductOpen],
    queryFn: () => categoriesService.getCategories({}),
    enabled: isModalCreateProductOpen,
  });
  const { data: discounts, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ["discounts", isModalCreateProductOpen],
    queryFn: () =>
      discountsService.getDiscounts({ scope: DISCOUNT_SCOPE.PRODUCT }),
    enabled: isModalCreateProductOpen,
  });
  const { data: options, isLoading: isLoadingOptions } = useQuery({
    queryKey: ["options", isModalCreateProductOpen],
    queryFn: () => optionService.getOptionList({ include_option_values: true }),
    enabled: isModalCreateProductOpen,
  });
  // ===== Computed Values =====
  const { hanldeCreateProduct, loading } = useCreateProductModal();
  const createProductLoading = loading || uploadImageLoading;
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

  // ===== Event Handlers =====
  const _onClearAllImages = () => setVariantImageFileList([]);

  const _onClearAllFormData = () => {
    reset();
    _onClearAllImages();
  };

  const _onCloseModalCreateProduct = () => {
    handleCloseModalCreateProduct();
    _onClearAllFormData();
  };

  const _onChangeOption = (value: string[]) => {
    setSelectedOptions(value);
    setSelectedOptionValues((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) => value.includes(key)),
      ),
    );
  };

  const _onChangeOptionValue = (optionId: string, value: string[]) => {
    const currentVariantIndexList = allPairs
      .filter((pair) => pair.some((i) => value.includes(i)))
      .map((pair) => allPairs.indexOf(pair));
    setSelectedOptionValues((prev) => ({
      ...prev,
      [optionId]: value,
    }));
    reset({
      ...getValues(),
      variants: getValues("variants").filter((variant, index) =>
        currentVariantIndexList.includes(index),
      ),
    });
    _onClearAllImages();
  };

  const _onSubmitFileList = async () => {
    if (Object.keys(variantImageFileList).length === 0) return;
    setUploadImageLoading(true);
    try {
      const imagesResponseData = await Promise.all(
        Object.entries(variantImageFileList).map(async ([id, item]) => {
          if (!item) return;
          const imageReponses = await Promise.all(
            item.map(async (file) => {
              if (!file?.originFileObj) return;
              const response = await imagesService.uploadImage(
                file.originFileObj,
                {
                  type: "PRODUCT" as ImageType.PRODUCT,
                },
              );
              if (response) {
                return response;
              } else {
                throw new Error("Failed to upload image");
              }
            }),
          );
          return { [id]: imageReponses.map((item) => item?.id) };
        }),
      );
      if (imagesResponseData.length > 0) {
        return imagesResponseData;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      throw error;
    } finally {
      setUploadImageLoading(false);
    }
  };

  const _onConfirmCreateProduct: SubmitHandler<CreateProductDTOV2> = async (
    data,
  ) => {
    if (allPairs[0].length === 0) {
      notificationApi.error({
        message: "Please select at least one option",
        description: "Please select at least one option",
      });
      return;
    }
    const payload: CreateProductDTOV2 = {
      ...data,
    };
    const imageIds = (await _onSubmitFileList()) || [];
    payload.variants = payload.variants.map((variant, index) => ({
      ...variant,
      product_sellables: {
        ...variant.product_sellables,
        imageIds: Object.values(imageIds?.[index] || {}).flat() as string[],
      },
    }));
    await hanldeCreateProduct(payload);
    _onClearAllFormData();
    refetch && refetch();
    _onCloseModalCreateProduct();
  };

  const _onChangeFileList = (id: number, fileList: UploadFile[]) => {
    setVariantImageFileList({ ...variantImageFileList, [id]: fileList });
  };

  const _onRemoveFileList = (id: number) => {
    setVariantImageFileList((prev) => {
      const newList = { ...prev };
      delete newList[id];
      return newList;
    });
  };
  // ===== Render Methods =====
  const _renderTitleModalCreateProduct = () => (
    <h1 className="text-2xl font-bold">Create Product</h1>
  );

  const _renderContentModalCreateProduct = () => {
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
                    onChange={_onChangeOption}
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
                      value={selectedOptionValues[option.id]}
                      onChange={(value) =>
                        _onChangeOptionValue(option.id, value)
                      }
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
                          {/* Images */}
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
                                  fileList={variantImageFileList[index] || []}
                                  onChange={(info) => {
                                    _onChangeFileList(index, info.fileList);
                                  }}
                                  onRemove={(file) => {
                                    _onRemoveFileList(index);
                                  }}
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </Upload>
                              )}
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
      loading={createProductLoading || uploadImageLoading}
    />
  );
};

export default CreateProductModal;
