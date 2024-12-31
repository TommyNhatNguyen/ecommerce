"use client";
import { useCategory } from "@/app/(dashboard)/admin/(inventory-product)/products/hooks/useCategory";
import { useDiscounts } from "@/app/(dashboard)/admin/(inventory-product)/products/hooks/useDiscounts";
import {
  categories,
  dataSource,
  discountCampaigns,
} from "@/app/constants/seeds";
import CreateCategoryModal from "@/app/shared/components/GeneralModal/components/CreateCategoryModal";
import CreateDiscountModal from "@/app/shared/components/GeneralModal/components/CreateDiscountModal";
import CreateProductModal from "@/app/shared/components/GeneralModal/components/CreateProductModal";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
import { CreateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { CreateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { productService } from "@/app/shared/services/products/productService";
import { useQuery } from "@tanstack/react-query";
import { Button, Card } from "antd";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const ProductPage = (props: Props) => {
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
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", createCategoryLoading],
    queryFn: () => categoriesService.getCategories({}, {}),
  });
  const { data: discounts, isLoading: isLoadingDiscounts } = useQuery({
    queryKey: ["discounts", createDiscountLoading],
    queryFn: () => discountsService.getDiscounts(),
  });
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getProducts({}, {}),
  });
  const _onOpenModalCreateProduct = () => {
    setIsModalCreateProductOpen(true);
  };
  const handleCloseModalCreateProduct = () => {
    setIsModalCreateProductOpen(false);
  };
  const handleSubmitCreateProductForm = (data: CreateProductDTO) => {
    console.log("Submit create product form", data);
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
            <div key={item.id}>{item.name}</div>
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
            <div key={item.id}>{item.name}</div>
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
            <div key={item.id}>{item.name}</div>
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
      />
      <CreateProductModal
        isModalCreateProductOpen={isModalCreateProductOpen}
        handleCloseModalCreateProduct={handleCloseModalCreateProduct}
        handleSubmitCreateProductForm={handleSubmitCreateProductForm}
      />
    </div>
  );
};

export default ProductPage;
