"use client";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
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
import { STATUS_OPTIONS } from "@/app/constants/seeds";
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
import { ClassicEditor, Editor, Essentials } from "ckeditor5";
import CustomEditor from "@/app/shared/components/CustomEditor";
import CustomCheckboxGroup from "@/app/shared/components/CustomCheckbox";
import { useIntl } from "react-intl";
import { warehouseService } from "@/app/shared/services/warehouse/warehouseService";
import { brandService } from "@/app/shared/services/brands/brandService";

export interface ModalRefType {
  handleOpenModal: () => void;
  handleCloseModal: () => void;
}

type PropsType = {
  refetch?: () => void;
};

const ModalCreateProduct = ({ refetch }: PropsType, ref: any) => {
  const [open, setOpen] = useState(false);
  // ===== State Management =====
  const [variantImageFileList, setVariantImageFileList] = useState<{
    [key: number]: UploadFile[];
  }>({});
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOptionValues, setSelectedOptionValues] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedWarehouse, setSelectedWarehouse] = useState<{
    [key: string]: string[];
  }>({});
  const { notificationApi } = useNotification();
  const intl = useIntl();
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
      sku: "",
      name: "",
      description: "",
      short_description: "",
      status: "ACTIVE",
      categoryIds: [],
      variants: [],
    },
  });
  // ===== Queries =====
  const { data: categories } = useQuery({
    queryKey: ["categories", open],
    queryFn: () => categoriesService.getCategories({}),
    enabled: open,
  });
  const { data: discounts } = useQuery({
    queryKey: ["discounts", open],
    queryFn: () =>
      discountsService.getDiscounts({ scope: DISCOUNT_SCOPE.PRODUCT }),
    enabled: open,
  });
  const { data: options } = useQuery({
    queryKey: ["options", open],
    queryFn: () => optionService.getOptionList({ include_option_values: true }),
    enabled: open,
  });
  const { data: warehouses } = useQuery({
    queryKey: ["warehouses", open],
    queryFn: () => warehouseService.getAll({}),
    enabled: open,
  });
  const { data: brands } = useQuery({
    queryKey: ["brands", open],
    queryFn: () => brandService.getAllBrands({}),
    enabled: open,
  });
  // ===== Computed Values =====
  const { hanldeCreateProduct, loading } = useCreateProductModal();
  const createProductLoading = loading || uploadImageLoading;
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

  const handleOpenModal = () => {
    setOpen(true);
  };
  const _onCloseModal = () => {
    setOpen(false);
    _onClearAllFormData();
  };

  useImperativeHandle<ModalRefType, ModalRefType>(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));

  const _onChangeOption = (value: string[]) => {
    setSelectedOptions(value);
    setSelectedOptionValues((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([key]) => value.includes(key)),
      ),
    );
  };

  const _onChangeOptionValue = useCallback(
    (optionId: string, value: string[]) => {
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
    },
    [allPairs],
  );

  const _onChangeWarehouse = (key: string, value: string[]) => {
    setSelectedWarehouse((prev) => ({
      ...prev,
      [key]: value,
    }));
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
    console.log("🚀 ~ ModalCreateProduct ~ payload:", payload);
    await hanldeCreateProduct(payload);
    _onClearAllFormData();
    refetch && refetch();
    _onCloseModal();
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
    <h1 className="text-2xl font-bold">
      {intl.formatMessage({ id: "create_product" })}
    </h1>
  );

  const _renderContentModalCreateProduct = () => {
    return (
      <>
        <div className="flex w-full flex-1 flex-shrink-0 flex-col gap-4">
          {/* Product information */}
          <div className="flex w-full flex-col gap-2">
            <h3 className="text-lg font-semibold underline">
              {intl.formatMessage({ id: "product_information" })}
            </h3>
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full gap-2">
                <Controller
                  control={control}
                  name="sku"
                  rules={{
                    required: {
                      value: true,
                      message: ERROR_MESSAGE.REQUIRED,
                    },
                  }}
                  render={({ field, formState: { errors } }) => (
                    <InputAdmin
                      label={intl.formatMessage({ id: "sku" })}
                      required={true}
                      placeholder={intl.formatMessage({ id: "sku" })}
                      error={errors.sku?.message as string}
                      {...field}
                    />
                  )}
                />
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
                      label={intl.formatMessage({ id: "product_name" })}
                      required={true}
                      placeholder={intl.formatMessage({ id: "product_name" })}
                      error={errors.name?.message as string}
                      {...field}
                    />
                  )}
                />
              </div>
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
                    label={intl.formatMessage({ id: "category" })}
                    placeholder={intl.formatMessage({ id: "choose_category" })}
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
                        placeholder={intl.formatMessage({
                          id: "choose_category",
                        })}
                        allowClear={true}
                        mode="multiple"
                        dropdownRender={(menu) => {
                          return categories?.data &&
                            categories?.data.length > 0 ? (
                            <CustomCheckboxGroup
                              wrapperClassName="flex flex-col gap-2"
                              className="grid grid-cols-2 gap-2"
                              data={categories?.data?.map((item) => ({
                                label: item.name,
                                value: item.id,
                              }))}
                              selectedData={field.value}
                              onSelect={(value) => {
                                field.onChange(value);
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center">
                              <Empty
                                description={intl.formatMessage({
                                  id: "no_categories_found",
                                })}
                              />
                            </div>
                          );
                        }}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="brand_id"
                control={control}
                render={({ field }) => (
                  <InputAdmin
                    {...field}
                    error={errors?.brand_id?.message || ""}
                    label={intl.formatMessage({ id: "brands" })}
                    placeholder={intl.formatMessage({ id: "choose_brand" })}
                    groupClassName="w-full"
                    className="w-full"
                    required={true}
                    customComponent={(props, ref: any) => (
                      <Select
                        {...props}
                        ref={ref}
                        options={brands?.data.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                        placement="bottomLeft"
                        value={field.value}
                        onClear={() => field.onChange("")}
                        placeholder={intl.formatMessage({
                          id: "choose_brand",
                        })}
                        allowClear={true}
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
              <Controller
                control={control}
                name="short_description"
                render={({ field }) => (
                  <InputAdmin
                    label={intl.formatMessage({ id: "short_description" })}
                    placeholder={intl.formatMessage({
                      id: "short_description",
                    })}
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
              {intl.formatMessage({ id: "product_variants" })}
            </h3>
            <div className="flex w-full flex-col gap-4">
              <InputAdmin
                label={intl.formatMessage({ id: "attributes" })}
                placeholder={intl.formatMessage({
                  id: "select_attributes",
                })}
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
                  <div key={option?.id}>
                    <p className="text-md mb-2 font-roboto-medium">
                      {option?.name}
                    </p>
                    <CustomCheckboxGroup
                      wrapperClassName="flex items-center gap-2"
                      className="flex flex-wrap gap-2"
                      data={option?.option_values?.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      selectedData={selectedOptionValues[option?.id]}
                      onSelect={(value) =>
                        _onChangeOptionValue(option?.id, value)
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
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-6 flex w-full gap-2">
                            <Controller
                              control={control}
                              name={`variants.${index}.variant_data.sku`}
                              rules={{
                                required: {
                                  value: true,
                                  message: ERROR_MESSAGE.REQUIRED,
                                },
                              }}
                              render={({ field }) => (
                                <InputAdmin
                                  label={intl.formatMessage({
                                    id: "sku",
                                  })}
                                  placeholder={intl.formatMessage({
                                    id: "sku",
                                  })}
                                  required={true}
                                  error={
                                    errors?.variants?.[index]?.variant_data?.sku
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
                                  label={intl.formatMessage({
                                    id: "variant_name",
                                  })}
                                  placeholder={intl.formatMessage({
                                    id: "variant_name",
                                  })}
                                  required={true}
                                  error={
                                    errors?.variants?.[index]?.variant_data
                                      ?.name?.message || ""
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
                          </div>
                          <InputAdmin
                            label={intl.formatMessage({
                              id: "variant_attributes",
                            })}
                            placeholder={intl.formatMessage({
                              id: "select_attributes",
                            })}
                            className="w-full"
                            groupClassName="col-span-3"
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
                                label={intl.formatMessage({ id: "price" })}
                                groupClassName="col-span-3"
                                placeholder={intl.formatMessage({
                                  id: "price",
                                })}
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
                          <InputAdmin
                            label={intl.formatMessage({ id: "warehouse" })}
                            required={true}
                            groupClassName="w-full"
                            className="w-full"
                            customComponent={({ props, ref }: any) => {
                              return (
                                <Select
                                  options={warehouses?.data?.map((item) => ({
                                    label: item.name,
                                    value: item.id,
                                  }))}
                                  className="w-full"
                                  onChange={(warehouseIds) => {
                                    setValue(
                                      `variants.${index}.product_sellables.inventory_quantity_by_warehouse`,
                                      warehouseIds.map(
                                        (warehouseId: string) => ({
                                          warehouse_id: warehouseId,
                                          cost: 0,
                                          quantity: 0,
                                        }),
                                      ),
                                    );
                                    _onChangeWarehouse(
                                      index.toString(),
                                      warehouseIds,
                                    );
                                  }}
                                  value={selectedWarehouse?.[index.toString()]}
                                  placeholder={intl.formatMessage({
                                    id: "select_warehouse",
                                  })}
                                  allowClear={true}
                                  mode="multiple"
                                  {...props}
                                  ref={ref}
                                />
                              );
                            }}
                          />
                          <div className="mt-2 flex flex-col gap-2">
                            {/* Warehouse + quantity + cost */}
                            {selectedWarehouse?.[index.toString()]?.map(
                              (item, warehouseIndex) => {
                                return (
                                  <div key={item}>
                                    {/* Warehouse ID */}
                                    <p className="mb-2 flex-shrink-0 whitespace-nowrap text-nowrap font-roboto-medium text-sm">
                                      {intl.formatMessage({ id: "warehouse" })}:{" "}
                                      {
                                        warehouses?.data?.find(
                                          (warehouse) => warehouse.id === item,
                                        )?.name
                                      }
                                    </p>
                                    <div className="flex items-start gap-2">
                                      {/* Inventory quantity */}
                                      <Controller
                                        control={control}
                                        name={`variants.${index}.product_sellables.inventory_quantity_by_warehouse.${warehouseIndex}.quantity`}
                                        rules={{
                                          required: {
                                            value: true,
                                            message: ERROR_MESSAGE.REQUIRED,
                                          },
                                        }}
                                        render={({ field }) => (
                                          <InputAdmin
                                            label={intl.formatMessage({
                                              id: "inventory_quantity",
                                            })}
                                            placeholder={intl.formatMessage({
                                              id: "inventory_quantity",
                                            })}
                                            required={true}
                                            error={
                                              errors?.variants?.[index]
                                                ?.product_sellables
                                                ?.inventory_quantity_by_warehouse?.[
                                                warehouseIndex
                                              ]?.quantity?.message || ""
                                            }
                                            {...field}
                                            customComponent={(
                                              props,
                                              ref: any,
                                            ) => (
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
                                        name={`variants.${index}.product_sellables.inventory_quantity_by_warehouse.${warehouseIndex}.cost`}
                                        rules={{
                                          required: {
                                            value: true,
                                            message: ERROR_MESSAGE.REQUIRED,
                                          },
                                        }}
                                        render={({ field }) => (
                                          <InputAdmin
                                            label={intl.formatMessage({
                                              id: "cost",
                                            })}
                                            placeholder={intl.formatMessage({
                                              id: "cost",
                                            })}
                                            required={true}
                                            error={
                                              errors?.variants?.[index]
                                                ?.product_sellables
                                                ?.inventory_quantity_by_warehouse?.[
                                                warehouseIndex
                                              ]?.cost?.message || ""
                                            }
                                            {...field}
                                            customComponent={(
                                              props,
                                              ref: any,
                                            ) => (
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
                                    </div>
                                  </div>
                                );
                              },
                            )}
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
                                  label={intl.formatMessage({
                                    id: "low_stock_threshold",
                                  })}
                                  placeholder={intl.formatMessage({
                                    id: "low_stock_threshold",
                                  })}
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
                            {/* High stock threshold */}
                            <Controller
                              control={control}
                              name={`variants.${index}.product_sellables.high_stock_threshold`}
                              rules={{
                                required: {
                                  value: true,
                                  message: ERROR_MESSAGE.REQUIRED,
                                },
                              }}
                              render={({ field }) => (
                                <InputAdmin
                                  label={intl.formatMessage({
                                    id: "high_stock_threshold",
                                  })}
                                  placeholder={intl.formatMessage({
                                    id: "high_stock_threshold",
                                  })}
                                  required={true}
                                  error={
                                    errors?.variants?.[index]?.product_sellables
                                      ?.high_stock_threshold?.message || ""
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
                          </div>
                          {/* Discounts */}
                          <Controller
                            control={control}
                            name={`variants.${index}.product_sellables.discountIds`}
                            render={({ field }) => (
                              <InputAdmin
                                label={intl.formatMessage({
                                  id: "discount",
                                })}
                                placeholder={intl.formatMessage({
                                  id: "select_discount",
                                })}
                                className="w-full"
                                {...field}
                                customComponent={(props: any, ref: any) => (
                                  <Select
                                    options={discounts?.data.map((item) => ({
                                      label: item.name,
                                      value: item.id,
                                    }))}
                                    showSearch={true}
                                    placeholder={intl.formatMessage({
                                      id: "select_discount",
                                    })}
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
                                label={intl.formatMessage({ id: "status" })}
                                placeholder={intl.formatMessage({
                                  id: "status",
                                })}
                                required={true}
                                className="w-full"
                                {...field}
                                customComponent={(props: any, ref: any) => (
                                  <Select
                                    options={STATUS_OPTIONS.map((item) => ({
                                      label: intl.formatMessage({
                                        id: `onsale_${item.label}`,
                                      }),
                                      value: item.value,
                                    }))}
                                    placeholder={intl.formatMessage({
                                      id: "select_status",
                                    })}
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
                              label={intl.formatMessage({
                                id: "product_image",
                              })}
                              required={true}
                              placeholder={intl.formatMessage({
                                id: "product_image",
                              })}
                              customComponent={() => (
                                <Upload
                                  listType="picture-card"
                                  accept=".jpg,.jpeg,.png,.gif,.webp"
                                  multiple={true}
                                  action={`${window.location.origin}/`}
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
        </div>
      </>
    );
  };

  const _renderFooterModalCreateProduct = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModal}>
          {intl.formatMessage({ id: "close" })}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateProduct)}
        >
          {intl.formatMessage({ id: "add_new" })}
        </Button>
      </div>
    );
  };

  return (
    <GeneralModal
      renderTitle={_renderTitleModalCreateProduct}
      renderFooter={_renderFooterModalCreateProduct}
      renderContent={_renderContentModalCreateProduct}
      open={open}
      onCancel={_onCloseModal}
      loading={createProductLoading || uploadImageLoading}
    />
  );
};

export default React.memo(
  forwardRef<ModalRefType, PropsType>(ModalCreateProduct),
);
