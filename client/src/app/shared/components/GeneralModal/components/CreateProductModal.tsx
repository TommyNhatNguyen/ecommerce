'use client'

import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  dataSource,
  discountCampaigns,
  statusOptions,
} from "@/app/constants/seeds";
import { Button, Checkbox, CheckboxProps, Input, Select, Upload } from 'antd';
import { ERROR_MESSAGE } from '@/app/constants/errors';
import InputAdmin from '@/app/shared/components/InputAdmin';
import { PlusIcon } from 'lucide-react';
import GeneralModal from '@/app/shared/components/GeneralModal';
import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/app/shared/services/categories/categoriesService';
import LoadingComponent from '@/app/shared/components/LoadingComponent';
import { discountsService } from '@/app/shared/services/discounts/discountsService';

type CreateProductModalPropsType = {
  isModalCreateProductOpen: boolean;
  handleCloseModalCreateProduct: () => void;
  handleSubmitCreateProductForm: (data: CreateProductDTO) => void;
}
type CreateProductDTO = {
  productName: string;
  category: string[];
  description: string;
  price: number | string;
  stock: number | string;
  discountCampaign: string | null;
  status: "publish" | "unpublish";
};
const CreateProductModal = ({
  isModalCreateProductOpen,
  handleCloseModalCreateProduct,
  handleSubmitCreateProductForm,
}: CreateProductModalPropsType) => {
  const [createProductForm, setCreateProductForm] = useState<CreateProductDTO>({
    productName: "",
    category: [],
    description: "",
    price: "",
    stock: "",
    discountCampaign: null,
    status: "publish",
  });
  const [isDropdownVisible, setIsDropdownVisible] = useState({
    category: false,
    discountCampaign: false,
  });
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories({}, {}),
    enabled: isDropdownVisible.category,
  });
  const {data: discounts, isLoading: isLoadingDiscounts} = useQuery({
    queryKey: ["discounts"],
    queryFn: () => discountsService.getDiscounts(),
    enabled: isDropdownVisible.discountCampaign,
  });
  const checkAll = categories && categories.data.length === createProductForm.category.length;
  const indeterminate = categories &&
    createProductForm.category.length > 0 &&
    createProductForm.category.length < categories.data.length;
  const _onCloseModalCreateProduct = () => {
    handleCloseModalCreateProduct();
    reset();
  };
  const _onConfirmCreateProduct: SubmitHandler<any> = (data) => {
    const payload: CreateProductDTO = {
      ...createProductForm,
      ...data,
    };
    handleSubmitCreateProductForm(payload);
    reset();
  };
  const _onChangeCategories = (list: string[]) => {
    setCreateProductForm((prev) => ({
      ...prev,
      category: list,
    }));
  };
  const _onCheckAllCategories: CheckboxProps["onChange"] = (e) => {
    setCreateProductForm((prev) => ({
      ...prev,
      category: e.target.checked && categories ? categories?.data.map((item) => item.id) : [],
    }));
  };
  const _onClearAllCategories = () => {
    setCreateProductForm((prev) => ({
      ...prev,
      category: [],
    }));
  };
  const _onChangeDiscountCampaign = (value: string) => {
    setCreateProductForm((prev) => ({
      ...prev,
      discountCampaign: value,
    }));
  };
  const _onChangeStatus = (value: "publish" | "unpublish") => {
    setCreateProductForm((prev) => ({
      ...prev,
      status: value,
    }));
  };
  const _renderTitleModalCreateProduct = () => {
    return <h1 className="text-2xl font-bold">Create Product</h1>;
  };
  const _renderContentModalCreateProduct = () => {
    return (
      <>
        <div className="flex w-full flex-1 flex-shrink-0 flex-col gap-4">
          <Controller
            control={control}
            name="productName"
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
                error={errors.productName?.message as string}
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
                value={createProductForm.category}
                onClear={_onClearAllCategories}
                placeholder="Select Category"
                allowClear={true}
                mode="multiple"
                onChange={_onChangeCategories}
                dropdownRender={(menu) => (
                  <>
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
                        value={createProductForm.category}
                        onChange={_onChangeCategories}
                        className="flex flex-col gap-2"
                      />
                      <LoadingComponent isLoading={isLoadingCategories} />
                    </div>
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
            name="stock"
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
                error={errors.stock?.message as string}
                {...field}
              />
            )}
          />
          <InputAdmin
            label="Discount Campaign"
            placeholder="Discount Campaign"
            customComponent={() => (
              <Select
                options={discounts?.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                onDropdownVisibleChange={(open) => {
                  setIsDropdownVisible((prev) => ({
                    ...prev,
                    discountCampaign: true,
                  }));
                }}
                placeholder="Select Discount Campaign"
                allowClear={true}
                value={createProductForm.discountCampaign}
                onChange={_onChangeDiscountCampaign}
                loading={isLoadingDiscounts}
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
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                // fileList={fileList}
                // onChange={onChange}
                // onPreview={onPreview}
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
      <>
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
      </>
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

export default CreateProductModal