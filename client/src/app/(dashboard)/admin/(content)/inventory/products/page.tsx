"use client";

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  ColorPicker,
  Empty,
  Tooltip,
  Tree,
  TreeDataNode,
} from "antd";
import { Pencil, PlusIcon, Trash2Icon } from "lucide-react";

import { useCategory } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useCategory";
import { useDiscounts } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useDiscounts";
import { useProducts } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProduct";

import CreateCategoryModal from "@/app/shared/components/GeneralModal/components/CreateCategoryModal";
import CreateDiscountModal from "@/app/shared/components/GeneralModal/components/CreateDiscountModal";
import CreateProductModal from "@/app/shared/components/GeneralModal/components/CreateProductModal";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";

import { CreateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";

import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { productService } from "@/app/shared/services/products/productService";

import { getDateFormat } from "@/app/shared/utils/datetime";
import {
  CreateCategoryDTO,
  CreateCategoryFormDTO,
} from "@/app/shared/interfaces/categories/category.dto";
import UpdateProductModal from "@/app/shared/components/GeneralModal/components/UpdateProductModal";
import { ProductModel } from "@/app/shared/models/products/products.model";
import UpdateCategoryModal from "@/app/shared/components/GeneralModal/components/UpdateCategoryModal";
import UpdateDiscountModal from "@/app/shared/components/GeneralModal/components/UpdateDiscountModal";
import {
  formatCurrency,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import { DISCOUNT_SCOPE, DISCOUNT_TYPE } from "@/app/constants/enum";
import ActionGroup from "@/app/shared/components/ActionGroup";
import CreateVariantModal from "@/app/shared/components/GeneralModal/components/CreateVariantModal";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { VariantModel } from "@/app/shared/models/variant/variant.model";
import { useVariants } from "./hooks/useVariants";

type Props = {};

// Button with delete confirmation popover
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);

const ProductPage = (props: Props) => {
  // State management for modals
  const [isModalCreateProductOpen, setIsModalCreateProductOpen] =
    useState(false);
  const [isModalCreateCategoryOpen, setIsModalCreateCategoryOpen] =
    useState(false);
  const [
    isModalCreateDiscountCampaignOpen,
    setIsModalCreateDiscountCampaignOpen,
  ] = useState(false);
  const [isModalUpdateProductOpen, setIsModalUpdateProductOpen] =
    useState(false);
  const [updateProductId, setUpdateProductId] = useState<string>("");
  const [isModalUpdateCategoryOpen, setIsModalUpdateCategoryOpen] =
    useState(false);
  const [isModalCreateVariantOpen, setIsModalCreateVariantOpen] =
    useState(false);
  const [updateCategoryId, setUpdateCategoryId] = useState<string>("");
  const [
    isModalUpdateDiscountCampaignOpen,
    setIsModalUpdateDiscountCampaignOpen,
  ] = useState(false);
  const [updateDiscountCampaignId, setUpdateDiscountCampaignId] =
    useState<string>("");
  // Hooks for category, discount, and product management
  const {
    loading: createCategoryLoading,
    hanldeCreateCategory,
    hanldeDeleteCategory,
    loadingDelete: deleteCategoryLoading,
  } = useCategory();

  const {
    loading: createDiscountLoading,
    hanldeCreateDiscount,
    hanldeDeleteDiscount,
    loadingDelete: deleteDiscountLoading,
  } = useDiscounts();

  const { loadingSoftDelete: deleteProductLoading, handleSoftDeleteProduct } =
    useProducts();

  const { handleDeleteVariant, loadingDelete: deleteVariantLoading } =
    useVariants();

  // Queries for fetching data
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories", createCategoryLoading, deleteCategoryLoading],
    queryFn: () => categoriesService.getCategories({}, {}),
    placeholderData: keepPreviousData,
  });

  const {
    data: discounts,
    isLoading: isLoadingDiscounts,
    refetch: refetchDiscounts,
  } = useQuery({
    queryKey: ["discounts", createDiscountLoading, deleteDiscountLoading],
    queryFn: () =>
      discountsService.getDiscounts({
        scope: DISCOUNT_SCOPE.PRODUCT,
      }),
    placeholderData: keepPreviousData,
  });

  const {
    data: products,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products", deleteProductLoading],
    queryFn: () => productService.getProducts({}),
    placeholderData: keepPreviousData,
  });

  const {
    data: variants,
    isLoading: isLoadingVariants,
    refetch: refetchVariants,
  } = useQuery({
    queryKey: ["variants", deleteVariantLoading],
    queryFn: () => variantServices.getList({}),
    placeholderData: keepPreviousData,
  });

  // Handlers for delete actions
  const _onSoftDeleteProduct = async (id: string) => {
    await handleSoftDeleteProduct(id);
  };

  const _onDeleteCategory = async (id: string) => {
    await hanldeDeleteCategory(id);
  };

  const _onDeleteDiscount = async (id: string) => {
    await hanldeDeleteDiscount(id);
  };

  const _onDeleteVariants = async (id: string) => {
    await handleDeleteVariant(id);
  };

  // Handlers for opening and closing modals
  const _onOpenModalCreateProduct = () => {
    setIsModalCreateProductOpen(true);
  };

  const handleCloseModalCreateProduct = () => {
    setIsModalCreateProductOpen(false);
  };

  const _onOpenModalUpdateProduct = (id: string) => {
    setUpdateProductId(id);
    setIsModalUpdateProductOpen(true);
  };

  const handleCloseModalUpdateProduct = () => {
    setIsModalUpdateProductOpen(false);
  };

  const _onOpenModalUpdateCategory = (id: string) => {
    setUpdateCategoryId(id);
    setIsModalUpdateCategoryOpen(true);
  };

  const handleCloseModalUpdateCategory = () => {
    setIsModalUpdateCategoryOpen(false);
  };

  const _onOpenModalUpdateDiscountCampaign = (id: string) => {
    setUpdateDiscountCampaignId(id);
    setIsModalUpdateDiscountCampaignOpen(true);
  };

  const handleCloseModalUpdateDiscountCampaign = () => {
    setIsModalUpdateDiscountCampaignOpen(false);
  };

  const _onOpenModalCreateCategory = () => {
    setIsModalCreateCategoryOpen(true);
  };

  const handleCloseModalCreateCategory = () => {
    setIsModalCreateCategoryOpen(false);
  };

  const _onOpenModalCreateVariant = () => {
    setIsModalCreateVariantOpen(true);
  };

  const handleClostModalCreateVariant = () => {
    setIsModalCreateVariantOpen(false);
  };

  const _onOpenModalCreateDiscountCampaign = () => {
    setIsModalCreateDiscountCampaignOpen(true);
  };

  const handleCloseModalCreateDiscountCampaign = () => {
    setIsModalCreateDiscountCampaignOpen(false);
  };

  // Handlers for form submissions
  const handleSubmitCreateCategory = async (data: CreateCategoryFormDTO) => {
    const payload: CreateCategoryDTO = {
      name: data.name,
      description: data.description,
      image_id: data.imageId,
      status: data.status || "ACTIVE",
    };
    await hanldeCreateCategory(payload);
  };

  const handleSubmitCreateDiscountCampaignForm = async (data: any) => {
    const payload: CreateDiscountDTO = {
      name: data.name,
      description: data.description,
      amount: Number(data.amount),
      type: data.type,
      scope: data.scope,
      start_date: data.startDate.format(getDateFormat()),
      end_date: data.endDate.format(getDateFormat()),
    };
    await hanldeCreateDiscount(payload);
    handleCloseModalCreateDiscountCampaign();
  };

  const _buildVariantTree = (variants: VariantModel[]) => {
    const newData: {
      [type: string]: { name: string; value: string }[];
    } = {};
    variants.forEach((item) => {
      const value: { name: string; value: string } = {
        name: item.name,
        value: item.value,
      };
      newData[item.type] = newData[item.type]
        ? [...newData[item.type], value]
        : [value];
    });
    const treeData: TreeDataNode[] = Object.keys(newData).map((item) => {
      return {
        title: () => {
          const title = item.replace("color-", "");
          return (
            <div
              className="flex w-full items-center justify-between"
              key={item}
            >
              {title}
              <div className="flex items-center gap-1">
                <Button
                  type="text"
                  className="aspect-square rounded-full p-0"
                  onClick={() => {
                    // _onOpenModalUpdateDiscountCampaign(item.id);
                  }}
                >
                  <Pencil className="h-4 w-4 stroke-yellow-500" />
                </Button>
                <ButtonDeleteWithPopover
                  title={`Delete ${item}?`}
                  trigger={"click"}
                  handleDelete={() => {
                    _onDeleteVariants(
                      variants.find((variant) => variant.type == item)?.id ||
                        "",
                    );
                  }}
                />
              </div>
            </div>
          );
        },
        key: item,
        className: "w-full",
        children: newData[item].map((data) => {
          return {
            title: () => {
              return item.trim().toLocaleLowerCase().split("-")[0] ==
                "color" ? (
                <Tooltip
                  title={data.value}
                  className="flex w-full items-center gap-2"
                >
                  <ColorPicker defaultValue={data.value} disabled />
                  <span>{data.name}</span>
                </Tooltip>
              ) : (
                <div className="w-full">
                  {data.name} - {data.value}
                </div>
              );
            },
            key: data.name + data.value + item,
          };
        }),
      };
    });
    return treeData;
  };
  return (
    <div className="grid min-h-[300px] grid-flow-row grid-cols-3 gap-4">
      {/* Product Card */}
      <Card
        title="Product"
        className="h-full max-h-[300px] flex-1 overflow-y-auto"
        extra={
          <Button
            type="primary"
            className="flex items-center gap-2"
            onClick={_onOpenModalCreateProduct}
          >
            <PlusIcon className="h-4 w-4" />
            Add new
          </Button>
        }
      >
        {products &&
          products.data.map((item) => (
            <Tooltip
              title={`${item.inventory?.quantity || 0} items in stock`}
              key={item.id}
            >
              <div
                className="flex w-full items-center justify-between"
                key={item.id}
              >
                {item.name}
                <div className="flex items-center gap-1">
                  <Button
                    type="text"
                    className="aspect-square rounded-full p-0"
                    onClick={() => _onOpenModalUpdateProduct(item.id)}
                  >
                    <Pencil className="h-4 w-4 stroke-yellow-500" />
                  </Button>
                  <ButtonDeleteWithPopover
                    title={`Delete ${item.name}?`}
                    trigger={"click"}
                    handleDelete={() => {
                      _onSoftDeleteProduct(item.id);
                    }}
                    isWithDeleteConfirmPopover={false}
                  />
                </div>
              </div>
            </Tooltip>
          ))}
        {products && products.data.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <Empty description="No products found" />
          </div>
        )}
      </Card>

      {/* Category Card */}
      <Card
        title="Category"
        className="relative h-full max-h-[300px] overflow-y-auto"
        extra={
          <Button
            type="primary"
            className="flex items-center gap-2"
            onClick={_onOpenModalCreateCategory}
          >
            <PlusIcon className="h-4 w-4" />
            Add new
          </Button>
        }
      >
        {categories &&
          categories.data.map((item) => (
            <Tooltip title={`${item.name}`} key={item.id}>
              <div className="flex w-full items-center justify-between">
                {item.name}
                <div className="flex items-center gap-1">
                  <Button
                    type="text"
                    className="aspect-square rounded-full p-0"
                    onClick={() => _onOpenModalUpdateCategory(item.id)}
                  >
                    <Pencil className="h-4 w-4 stroke-yellow-500" />
                  </Button>
                  <ButtonDeleteWithPopover
                    title={`Delete ${item.name}?`}
                    trigger={"click"}
                    handleDelete={() => {
                      _onDeleteCategory(item.id);
                    }}
                  />
                </div>
              </div>
            </Tooltip>
          ))}
        {categories && categories.data.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <Empty description="No categories found" />
          </div>
        )}
      </Card>

      {/* Discount Campaign Card */}
      <Card
        title="Discount Campaign"
        className="h-full max-h-[300px] overflow-y-auto"
        extra={
          <Button
            type="primary"
            className="flex items-center gap-2"
            onClick={_onOpenModalCreateDiscountCampaign}
          >
            <PlusIcon className="h-4 w-4" />
            Add new
          </Button>
        }
      >
        <div className="flex flex-col gap-2">
          {discounts &&
            discounts.data
              .filter((item) => item.scope === DISCOUNT_SCOPE.PRODUCT)
              .map((item) => (
                <Tooltip
                  title={`${
                    item.type === DISCOUNT_TYPE.PERCENTAGE
                      ? `${formatDiscountPercentage(item.amount || 0)}`
                      : `${formatCurrency(item.amount || 0)}`
                  }`}
                  key={item.id}
                >
                  <div
                    className="flex w-full items-center justify-between"
                    key={item.id}
                  >
                    {item.name}
                    <div className="flex items-center gap-1">
                      <Button
                        type="text"
                        className="aspect-square rounded-full p-0"
                        onClick={() => {
                          _onOpenModalUpdateDiscountCampaign(item.id);
                        }}
                      >
                        <Pencil className="h-4 w-4 stroke-yellow-500" />
                      </Button>
                      <ButtonDeleteWithPopover
                        title={`Delete ${item.name}?`}
                        trigger={"click"}
                        handleDelete={() => {
                          _onDeleteDiscount(item.id);
                        }}
                      />
                    </div>
                  </div>
                </Tooltip>
              ))}
        </div>
        {discounts && discounts.data.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <Empty description="No discounts found" />
          </div>
        )}
      </Card>

      {/* Variant Card */}
      <Card
        title="Product variants"
        className="h-full max-h-[300px] overflow-y-auto"
        extra={
          <Button
            type="primary"
            className="flex items-center gap-2"
            onClick={_onOpenModalCreateVariant}
          >
            <PlusIcon className="h-4 w-4" />
            Add new
          </Button>
        }
      >
        <div className="flex flex-col gap-2">
          {variants && (
            <Tree
              showLine
              selectable={false}
              treeData={_buildVariantTree(variants.data)}
            />
          )}
        </div>
        {variants && variants.data.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <Empty description="No variants found" />
          </div>
        )}
      </Card>

      {/* Modals */}
      <CreateCategoryModal
        isModalCreateCategoryOpen={isModalCreateCategoryOpen}
        handleCloseModalCreateCategory={handleCloseModalCreateCategory}
        handleSubmitCreateCategoryForm={handleSubmitCreateCategory}
        loading={createCategoryLoading}
      />
      <CreateDiscountModal
        isModalCreateDiscountCampaignOpen={isModalCreateDiscountCampaignOpen}
        handleCloseModalCreateDiscountCampaign={
          handleCloseModalCreateDiscountCampaign
        }
        handleSubmitCreateDiscountCampaignForm={
          handleSubmitCreateDiscountCampaignForm
        }
        loading={createDiscountLoading}
      />
      <CreateProductModal
        isModalCreateProductOpen={isModalCreateProductOpen}
        handleCloseModalCreateProduct={handleCloseModalCreateProduct}
        refetch={refetchProducts}
      />
      <UpdateProductModal
        isModalUpdateProductOpen={isModalUpdateProductOpen}
        handleCloseModalUpdateProduct={handleCloseModalUpdateProduct}
        updateProductId={updateProductId}
        refetch={refetchProducts}
      />
      <UpdateCategoryModal
        isModalUpdateCategoryOpen={isModalUpdateCategoryOpen}
        handleCloseModalUpdateCategory={handleCloseModalUpdateCategory}
        updateCategoryId={updateCategoryId}
        refetch={refetchCategories}
      />
      <UpdateDiscountModal
        isModalUpdateDiscountCampaignOpen={isModalUpdateDiscountCampaignOpen}
        handleCloseModalUpdateDiscountCampaign={
          handleCloseModalUpdateDiscountCampaign
        }
        updateDiscountCampaignId={updateDiscountCampaignId}
        refetch={refetchDiscounts}
      />
      <CreateVariantModal
        isOpen={isModalCreateVariantOpen}
        handleCloseModal={handleClostModalCreateVariant}
        refetch={refetchVariants}
      />
    </div>
  );
};

export default ProductPage;
