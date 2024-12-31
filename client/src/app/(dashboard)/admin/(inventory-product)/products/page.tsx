"use client";
import { useCategory } from "@/app/(dashboard)/admin/(inventory-product)/products/hooks/useCategory";
import { useDiscounts } from "@/app/(dashboard)/admin/(inventory-product)/products/hooks/useDiscounts";
import { useProducts } from "@/app/(dashboard)/admin/(inventory-product)/products/hooks/useProduct";
import {
  categories,
  dataSource,
  discountCampaigns,
} from "@/app/constants/seeds";
import { useNotification } from "@/app/contexts/NotificationContext";
import CreateCategoryModal from "@/app/shared/components/GeneralModal/components/CreateCategoryModal";
import CreateDiscountModal from "@/app/shared/components/GeneralModal/components/CreateDiscountModal";
import CreateProductModal from "@/app/shared/components/GeneralModal/components/CreateProductModal";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { CreateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { CreateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { productService } from "@/app/shared/services/products/productService";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Tooltip } from "antd";
import { Eye, Pencil, PlusIcon, Trash2Icon } from "lucide-react";
import React, { useState } from "react";

type Props = {};
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);
const ProductPage = (props: Props) => {
  const { notificationApi } = useNotification();
  const [isModalCreateProductOpen, setIsModalCreateProductOpen] =
    useState(false);
  const [isModalCreateCategoryOpen, setIsModalCreateCategoryOpen] =
    useState(false);
  const [
    isModalCreateDiscountCampaignOpen,
    setIsModalCreateDiscountCampaignOpen,
  ] = useState(false);
  const { loading: createCategoryLoading, hanldeCreateCategory } =
    useCategory();
  const { loading: createDiscountLoading, hanldeCreateDiscount } =
    useDiscounts();
  const { loading: createProductLoading, hanldeCreateProduct } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", createCategoryLoading],
    queryFn: () => categoriesService.getCategories({}, {}),
  });
  const { data: discounts, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ["discounts", createDiscountLoading],
    queryFn: () => discountsService.getDiscounts(),
  });
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", createProductLoading],
    queryFn: () => productService.getProducts({}, {}),
  });
  const _onOpenModalCreateProduct = () => {
    setIsModalCreateProductOpen(true);
  };
  const handleCloseModalCreateProduct = () => {
    setIsModalCreateProductOpen(false);
  };
  const handleSubmitCreateProductForm = async (data: CreateProductDTO) => {
    await hanldeCreateProduct(data);
    handleCloseModalCreateProduct();
  };

  const _onOpenModalCreateCategory = () => {
    setIsModalCreateCategoryOpen(true);
  };
  const handleCloseModalCreateCategory = () => {
    setIsModalCreateCategoryOpen(false);
  };
  const handleSubmitCreateCategory = async (data: any) => {
    await hanldeCreateCategory(data);
    handleCloseModalCreateCategory();
  };

  const _onOpenModalCreateDiscountCampaign = () => {
    setIsModalCreateDiscountCampaignOpen(true);
  };
  const handleCloseModalCreateDiscountCampaign = () => {
    setIsModalCreateDiscountCampaignOpen(false);
  };
  const handleSubmitCreateDiscountCampaignForm = async (data: any) => {
    const payload: CreateDiscountDTO = {
      name: data.name,
      description: data.description,
      discount_percentage: Number(data.discountPercentage),
      start_date: data.startDate.format("DD-MM-YYYY"),
      end_date: data.endDate.format("DD-MM-YYYY"),
    };
    await hanldeCreateDiscount(payload);
    handleCloseModalCreateDiscountCampaign();
  };

  return (
    <div className="grid grid-flow-row grid-cols-3 gap-4">
      <Card
        title="Product"
        className="max-h-[300px] flex-1 overflow-y-auto"
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
              <Button
                itemType="div"
                className="w-full justify-between"
                type="text"
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
                    trigger={"click"}
                    handleCancel={() => {}}
                    handleDelete={() => {}}
                  />
                </div>
              </Button>
            </Tooltip>
          ))}
        <LoadingComponent isLoading={isLoadingProducts} />
      </Card>
      <Card
        title="Category"
        className="relative max-h-[300px] overflow-y-auto"
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
            <Button
              itemType="div"
              className="w-full justify-between"
              type="text"
            >
              {item.name}
              <div className="flex items-center gap-1">
                <Button type="text" className="aspect-square rounded-full p-0">
                  <Pencil className="h-4 w-4 stroke-yellow-500" />
                </Button>
                <ButtonDeleteWithPopover
                  trigger={"click"}
                  handleCancel={() => {}}
                  handleDelete={() => {}}
                />
              </div>
            </Button>
          ))}
        <LoadingComponent isLoading={isLoadingCategories} />
      </Card>
      <Card
        title="Discount Campaign"
        className="max-h-[300px] overflow-y-auto"
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
              <Button
                itemType="div"
                className="w-full justify-between"
                type="text"
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
                    trigger={"click"}
                    handleCancel={() => {}}
                    handleDelete={() => {}}
                  />
                </div>
              </Button>
            </Tooltip>
          ))}
        <LoadingComponent isLoading={isLoadingDiscounts} />
      </Card>
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
        handleSubmitCreateProductForm={handleSubmitCreateProductForm}
        loading={createProductLoading}
      />
    </div>
  );
};

export default ProductPage;
