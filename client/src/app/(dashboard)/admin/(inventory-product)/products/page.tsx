"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Empty, Tooltip } from "antd";
import { Pencil, PlusIcon, Trash2Icon } from "lucide-react";

import { useCategory } from "@/app/(dashboard)/admin/(inventory-product)/products/hooks/useCategory";
import { useDiscounts } from "@/app/(dashboard)/admin/(inventory-product)/products/hooks/useDiscounts";
import { useProducts } from "@/app/(dashboard)/admin/(inventory-product)/products/hooks/useProduct";

import CreateCategoryModal from "@/app/shared/components/GeneralModal/components/CreateCategoryModal";
import CreateDiscountModal from "@/app/shared/components/GeneralModal/components/CreateDiscountModal";
import CreateProductModal from "@/app/shared/components/GeneralModal/components/CreateProductModal";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
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

  const { loadingDelete: deleteProductLoading, handleDeleteProduct } =
    useProducts();

  // Queries for fetching data
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", createCategoryLoading, deleteCategoryLoading],
    queryFn: () => categoriesService.getCategories({}, {}),
  });

  const { data: discounts, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ["discounts", createDiscountLoading, deleteDiscountLoading],
    queryFn: () => discountsService.getDiscounts(),
  });

  const {
    data: products,
    isLoading: isLoadingProducts,
    refetch,
  } = useQuery({
    queryKey: ["products", deleteProductLoading],
    queryFn: () => productService.getProducts({}),
  });

  // Handlers for delete actions
  const _onDeleteProduct = async (id: string) => {
    await handleDeleteProduct(id);
  };

  const _onDeleteCategory = async (id: string) => {
    await hanldeDeleteCategory(id);
  };

  const _onDeleteDiscount = async (id: string) => {
    await hanldeDeleteDiscount(id);
  };

  // Handlers for opening and closing modals
  const _onOpenModalCreateProduct = () => {
    setIsModalCreateProductOpen(true);
  };

  const handleCloseModalCreateProduct = () => {
    setIsModalCreateProductOpen(false);
  };

  const _onOpenModalCreateCategory = () => {
    setIsModalCreateCategoryOpen(true);
  };

  const handleCloseModalCreateCategory = () => {
    setIsModalCreateCategoryOpen(false);
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
      discount_percentage: Number(data.discountPercentage),
      start_date: data.startDate.format(getDateFormat()),
      end_date: data.endDate.format(getDateFormat()),
    };
    await hanldeCreateDiscount(payload);
    handleCloseModalCreateDiscountCampaign();
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
                  >
                    <Pencil className="h-4 w-4 stroke-yellow-500" />
                  </Button>
                  <ButtonDeleteWithPopover
                    title={`Delete ${item.name}?`}
                    trigger={"click"}
                    handleDelete={() => {
                      _onDeleteProduct(item.id);
                    }}
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
        <LoadingComponent isLoading={isLoadingProducts} />
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
        <LoadingComponent isLoading={isLoadingCategories} />
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
        {discounts &&
          discounts.data.map((item) => (
            <Tooltip title={`${item.discount_percentage || 0}%`} key={item.id}>
              <div
                className="flex w-full items-center justify-between"
                key={item.id}
              >
                {item.name}
                <div className="flex items-center gap-1">
                  <Button
                    type="text"
                    className="aspect-square rounded-full p-0"
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
        {discounts && discounts.data.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <Empty description="No discounts found" />
          </div>
        )}
        <LoadingComponent isLoading={isLoadingDiscounts} />
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
        refetch={refetch}
      />
    </div>
  );
};

export default ProductPage;
