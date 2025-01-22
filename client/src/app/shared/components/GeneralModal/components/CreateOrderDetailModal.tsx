import React, { useEffect, useState } from "react";
import GeneralModal from "..";
import {
  Button,
  Carousel,
  Image,
  Input,
  InputNumber,
  Select,
  Table,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { ORDER_STATE } from "@/app/constants/order-state";
import InputAdmin from "../../InputAdmin";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import { useQuery } from "@tanstack/react-query";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { paymentService } from "@/app/shared/services/payment/paymentServcie";
import { costService } from "@/app/shared/services/cost/costService";
import { DISCOUNT_SCOPE } from "@/app/constants/enum";
import { shippingService } from "@/app/shared/services/shipping/shippingService";
import { customerService } from "@/app/shared/services/customers/customerService";
import { VALIDATION_PATTERN } from "@/app/constants/validations";
import { productService } from "@/app/shared/services/products/productService";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { formatNumber } from "@/app/shared/utils/utils";

type CreateOrderDetailModalPropsType = {
  isOpen: boolean;
  handleCreateOrder: (data: any) => void;
  handleCloseCreateOrderModal: () => void;
};

const CreateOrderDetailModal = ({
  isOpen = false,
  handleCreateOrder,
  handleCloseCreateOrderModal,
}: CreateOrderDetailModalPropsType) => {
  const [productsOrder, setProductsOrder] = useState([]);
  console.log("productsOrderproductsOrder", productsOrder);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      description: "",
      order_state: ORDER_STATE.PENDING,
      order_detail_info: {
        subtotal: 0, // disabled
        total_shipping_fee: 0, // disabled
        total_payment_fee: 0, // disabled
        total_costs: 0, // disabled
        total_discount: 0, // disabled
        total_order_discount: 0, // disabled
        total_product_discount: 0, // disabled
        total: 0, // disabled
        shipping_method_id: "", // Select from shipping
        payment_id: "", // not have
        payment_info: {
          payment_method_id: "", // Select from payment methods
          paid_amount: 0, // User input
        },
        customer_id: "", // Select current active users
        customer_firstName: "", // User input
        customer_lastName: "",
        customer_phone: "", // User input
        customer_email: "", // User input, optional
        customer_address: "", // User input
        costs_detail: [
          // Select from costs
        ],
        products_detail: [
          // Select from products
          {
            id: "",
            quantity: 0,
          },
        ],
        order_discounts: [
          // Select from order discounts
        ],
      },
    },
  });
  const { data: shippingMethodList, isLoading: isShippingMethodList } =
    useQuery({
      queryKey: ["shippingMethod"],
      queryFn: () => shippingService.getList({}),
    });
  const { data: discountList, isLoading } = useQuery({
    queryKey: ["discounts"],
    queryFn: () =>
      discountsService.getDiscounts({ scope: DISCOUNT_SCOPE.ORDER }),
  });
  const { data: paymentMethodList, isLoading: isPaymentMethodLoading } =
    useQuery({
      queryKey: ["paymentMethod"],
      queryFn: () => paymentService.getListPaymentMethod({}),
    });
  const { data: costList, isLoading: isCostLoading } = useQuery({
    queryKey: ["cost"],
    queryFn: () => costService.getList({}),
  });
  const { data: customerList, isLoading: isCustomerLoading } = useQuery({
    queryKey: ["customer"],
    queryFn: () => customerService.getList({}),
  });
  const { data: productList, isLoading: isProductLoading } = useQuery({
    queryKey: ["product"],
    queryFn: () =>
      productService.getProducts({
        includeImage: true,
        includeCategory: true,
      }),
  });
  const _onCloseModal = () => {
    handleCloseCreateOrderModal();
  };
  const _onConfirmCreateOrder = (data: any) => {
    handleCreateOrder(data);
  };
  useEffect(() => {
    const selectedCustomerId = getValues("order_detail_info.customer_id");
    if (selectedCustomerId) {
      const customerDetail = customerList?.data?.find(
        (item) => item.id === selectedCustomerId,
      );
      setValue(
        "order_detail_info.customer_address",
        customerDetail?.address || "",
      );
      setValue("order_detail_info.customer_email", customerDetail?.email || "");
      setValue("order_detail_info.customer_phone", customerDetail?.phone || "");
      setValue(
        "order_detail_info.customer_firstName",
        customerDetail?.first_name || "",
      );
      setValue(
        "order_detail_info.customer_lastName",
        customerDetail?.last_name || "",
      );
    }
  }, [watch("order_detail_info.customer_id")]);
  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Create new order</h1>;
  };
  console.log(customerList?.data);
  const _renderBody = () => {
    return (
      <div className="flex flex-col gap-2">
        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <InputAdmin
              label="Description"
              placeholder="Description"
              {...field}
              error={errors?.description?.message || ""}
              customComponent={(props, ref: any) => (
                <Input.TextArea {...props} ref={ref} />
              )}
            />
          )}
        />
        {/* Order state */}
        <Controller
          name="order_state"
          control={control}
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field }) => (
            <InputAdmin
              required={true}
              label="Order State"
              placeholder="Order State"
              {...field}
              error={errors?.order_state?.message || ""}
              customComponent={(props, ref: any) => (
                <Select
                  {...props}
                  ref={ref}
                  options={Object.entries(ORDER_STATE).map(([key, value]) => ({
                    label: key,
                    value: value,
                  }))}
                />
              )}
            />
          )}
        />
        {/* Order detail */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Order detail</h2>
          <div className="mt-2 flex flex-col gap-2">
            {/* Customer info */}
            <div>
              <div className="flex items-start gap-2">
                {/* Customer id */}
                <Controller
                  name="order_detail_info.customer_id"
                  control={control}
                  render={({ field }) => (
                    <InputAdmin
                      {...field}
                      error={
                        errors?.order_detail_info?.customer_id?.message || ""
                      }
                      label="Current Customer"
                      placeholder="Choose current customer"
                      customComponent={(props, ref: any) => (
                        <Select
                          {...props}
                          ref={ref}
                          placeholder="Choose current customer"
                          options={customerList?.data.map((item) => ({
                            label: `${item.first_name || ""} ${item.last_name || ""}`,
                            value: item.id,
                          }))}
                          allowClear
                        />
                      )}
                    />
                  )}
                />
                {/* Customer address */}
                <Controller
                  name="order_detail_info.customer_address"
                  control={control}
                  disabled={!!watch("order_detail_info.customer_id")}
                  rules={{
                    required: {
                      value: true,
                      message: ERROR_MESSAGE.REQUIRED,
                    },
                  }}
                  render={({ field }) => (
                    <InputAdmin
                      required={true}
                      {...field}
                      label="Customer address"
                      placeholder="Enter customer address"
                      groupClassName="flex-1"
                      error={
                        errors?.order_detail_info?.customer_address?.message ||
                        ""
                      }
                    />
                  )}
                />
              </div>
              <div className="mt-2 grid grid-flow-row grid-cols-4 gap-2">
                {/* Customer Name */}
                <div className="col-span-2 flex items-start gap-2">
                  <Controller
                    name="order_detail_info.customer_firstName"
                    control={control}
                    render={({ field }) => (
                      <InputAdmin
                        {...field}
                        disabled={!!watch("order_detail_info.customer_id")}
                        label="Customer first name"
                        placeholder="Enter customer first name"
                        groupClassName="flex-1"
                        error={
                          errors?.order_detail_info?.customer_firstName
                            ?.message || ""
                        }
                      />
                    )}
                  />
                  <Controller
                    name="order_detail_info.customer_lastName"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: ERROR_MESSAGE.REQUIRED,
                      },
                    }}
                    render={({ field }) => (
                      <InputAdmin
                        required={true}
                        {...field}
                        disabled={!!watch("order_detail_info.customer_id")}
                        label="Customer last name"
                        placeholder="Enter customer last name"
                        groupClassName="flex-1"
                        error={
                          errors?.order_detail_info?.customer_lastName
                            ?.message || ""
                        }
                      />
                    )}
                  />
                </div>
                {/* Customer phone */}
                <Controller
                  name="order_detail_info.customer_phone"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: ERROR_MESSAGE.REQUIRED,
                    },
                    pattern: {
                      value: VALIDATION_PATTERN.PHONE,
                      message: ERROR_MESSAGE.INVALID_PHONE,
                    },
                  }}
                  render={({ field }) => (
                    <InputAdmin
                      disabled={!!watch("order_detail_info.customer_id")}
                      required={true}
                      {...field}
                      label="Customer phone"
                      placeholder="Enter customer phone"
                      error={
                        errors?.order_detail_info?.customer_phone?.message || ""
                      }
                    />
                  )}
                />
                {/* Customer email */}
                <Controller
                  name="order_detail_info.customer_email"
                  control={control}
                  rules={{
                    pattern: {
                      value: VALIDATION_PATTERN.EMAIL,
                      message: ERROR_MESSAGE.INVALID_EMAIL,
                    },
                  }}
                  render={({ field }) => (
                    <InputAdmin
                      {...field}
                      label="Customer email"
                      placeholder="Enter customer email"
                      disabled={!!watch("order_detail_info.customer_id")}
                      error={
                        errors?.order_detail_info?.customer_email?.message || ""
                      }
                    />
                  )}
                />
              </div>
            </div>
            {/* Shiping method */}
            <Controller
              name="order_detail_info.shipping_method_id"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: ERROR_MESSAGE.REQUIRED,
                },
              }}
              render={({ field }) => (
                <InputAdmin
                  required={true}
                  {...field}
                  error={
                    errors?.order_detail_info?.shipping_method_id?.message || ""
                  }
                  label="Shipping method"
                  placeholder="Choose a shipping method"
                  customComponent={(props, ref: any) => (
                    <Select
                      {...props}
                      ref={ref}
                      options={shippingMethodList?.data.map((item) => ({
                        label: item.type,
                        value: item.id,
                      }))}
                    />
                  )}
                />
              )}
            />
            {/* Payment method */}
            <div className="flex items-start gap-4">
              <Controller
                name="order_detail_info.payment_info.payment_method_id"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: ERROR_MESSAGE.REQUIRED,
                  },
                }}
                render={({ field }) => (
                  <InputAdmin
                    required={true}
                    {...field}
                    label="Payment method"
                    error={
                      errors?.order_detail_info?.payment_info?.payment_method_id
                        ?.message || ""
                    }
                    placeholder="Choose a payment method"
                    groupClassName="flex-1"
                    customComponent={(props, ref: any) => (
                      <Select
                        {...props}
                        ref={ref}
                        options={paymentMethodList?.data.map((item) => ({
                          label: item.type,
                          value: item.id,
                        }))}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="order_detail_info.payment_info.paid_amount"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: ERROR_MESSAGE.REQUIRED,
                  },
                }}
                render={({ field }) => (
                  <InputAdmin
                    required={true}
                    {...field}
                    error={
                      errors?.order_detail_info?.payment_info?.paid_amount
                        ?.message || ""
                    }
                    groupClassName="flex-1"
                    label="Paid amount"
                    placeholder="Enter amount customer has paid"
                    customComponent={(props, ref: any) => (
                      <InputNumber
                        className="w-full"
                        {...props}
                        ref={ref}
                        min={0}
                      />
                    )}
                  />
                )}
              />
            </div>
            {/* Products */}
            <Table
              columns={[
                {
                  title: null,
                  dataIndex: "images",
                  key: "images",
                  className: "max-w-[200px] w-[200px]",
                  render: (_, { image }) => {
                    const imagesList =
                      image && image.length > 0
                        ? image.map((item) => item.url)
                        : [defaultImage];
                    return (
                      <Image.PreviewGroup
                        items={imagesList}
                        preview={{
                          movable: false,
                        }}
                      >
                        <Carousel autoplay dotPosition="bottom">
                          {imagesList.map((item) => (
                            <Image
                              key={item}
                              src={item}
                              alt="product"
                              width={150}
                              height={150}
                              fallback={defaultImage}
                              className="object-contain"
                            />
                          ))}
                        </Carousel>
                      </Image.PreviewGroup>
                    );
                  },
                },
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Inventory",
                  dataIndex: "inventory",
                  key: "inventory",
                  render: (_, { inventory }) => {
                    return <p>{formatNumber(inventory?.quantity || 0)}</p>;
                  },
                },
                {
                  title: "Order quantity",
                  dataIndex: "quantity",
                  key: "quantity",
                  editable: true,
                  onCell: (record) => ({
                    record,
                    editable: true,
                  }),
                },
              ]}
              dataSource={productList?.data}
              scroll={{ x: "100vw" }}
              rowKey={(record) => record.id}
              components={{
                body: {
                  row: (props) => {
                    return <tr {...props} />;
                  },
                  cell: (props) => {
                    if (props.editable) {
                      return (
                        <Input
                          onChange={(e) => {
                            console.log(props);
                            setProductsOrder((prev) => {
                              return [
                                ...prev.filter(
                                  (item) => item.id !== props.record.id,
                                ),
                                {
                                  id: props.record.id,
                                  quantity: Number(e.target.value),
                                },
                              ];
                            });
                          }}
                        />
                      );
                    }
                    return <td {...props} />;
                  },
                },
              }}
            />
            {/* Cost */}
            <Controller
              name="order_detail_info.costs_detail"
              control={control}
              render={({ field }) => (
                <InputAdmin
                  {...field}
                  error={errors?.order_detail_info?.costs_detail?.message || ""}
                  label="Costs"
                  placeholder="Choose costs"
                  customComponent={(props, ref: any) => (
                    <Select
                      {...props}
                      ref={ref}
                      options={costList?.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      allowClear={true}
                      mode="multiple"
                    />
                  )}
                />
              )}
            />
            {/* Discount */}
            <Controller
              name="order_detail_info.order_discounts"
              control={control}
              render={({ field }) => (
                <InputAdmin
                  {...field}
                  error={errors?.order_detail_info?.costs_detail?.message || ""}
                  label="Discounts on order"
                  placeholder="Choose discounts apply to this order"
                  customComponent={(props, ref: any) => (
                    <Select
                      {...props}
                      ref={ref}
                      options={discountList?.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      allowClear={true}
                      mode="multiple"
                    />
                  )}
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  };
  const _renderFooter = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModal}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateOrder)}
        >
          Update
        </Button>
      </div>
    );
  };

  return (
    <>
      <GeneralModal
        className="w-[80%] min-w-[900px] max-w-[1000px]"
        renderTitle={_renderTitle}
        renderFooter={_renderFooter}
        renderContent={_renderBody}
        open={true}
      />
    </>
  );
};

export default CreateOrderDetailModal;
