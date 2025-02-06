import React, { useEffect, useRef, useState } from "react";
import GeneralModal from "..";
import {
  Button,
  Carousel,
  Image,
  Input,
  InputNumber,
  InputRef,
  Select,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { ORDER_STATE } from "@/app/constants/order-state";
import InputAdmin from "../../InputAdmin";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import { useQuery } from "@tanstack/react-query";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { paymentService } from "@/app/shared/services/payment/paymentServcie";
import { costService } from "@/app/shared/services/cost/costService";
import {
  DISCOUNT_SCOPE,
  DISCOUNT_TYPE,
  NUMBER_TYPE,
} from "@/app/constants/enum";
import { shippingService } from "@/app/shared/services/shipping/shippingService";
import { customerService } from "@/app/shared/services/customers/customerService";
import { VALIDATION_PATTERN } from "@/app/constants/validations";
import { productService } from "@/app/shared/services/products/productService";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { cn, formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { Plus } from "lucide-react";
import ProductSelectionModal from "../../ProductSelectionModal";
import { OrderCreateDTO } from "@/app/shared/interfaces/orders/order.dto";
import { OrderState } from "@/app/shared/models/orders/orders.model";
import { ProductSellableModel } from "@/app/shared/models/products/products-sellable.model";
import { useNotification } from "@/app/contexts/NotificationContext";

type CreateOrderDetailModalPropsType = {
  isOpen: boolean;
  handleCreateOrder: (data: OrderCreateDTO, callback: () => void) => void;
  handleCloseCreateOrderModal: () => void;
  loading?: boolean;
};

const CreateOrderDetailModal = ({
  isOpen = false,
  handleCreateOrder,
  handleCloseCreateOrderModal,
  loading = false,
}: CreateOrderDetailModalPropsType) => {
  const [isOpenProductSelectionModal, setIsOpenProductSelctionModal] =
    useState(false);
  const [selectedProductList, setSelectedProductList] = useState<
    ProductSellableModel[]
  >([]);
  const [productDetailInfoList, setProductDetailInfoList] = useState<{
    [key: string]: {
      subtotal: number;
      total_discounts: number;
      total: number;
    };
  }>({});
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<OrderCreateDTO>({
    defaultValues: {
      order_state: ORDER_STATE.PENDING as OrderState,
    },
  });
  const { notificationApi } = useNotification();
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
  const handleCloseProductSelectionModal = () => {
    setIsOpenProductSelctionModal(false);
  };
  const handleOpenProductSelectionModal = () => {
    setIsOpenProductSelctionModal(true);
  };
  const handleSelectProducts = (data: ProductSellableModel[]) => {
    const updatedProductDetailList = data.map((item) => ({
      id: item.id,
      quantity: 1,
    }));
    setSelectedProductList((prev) => [...prev, ...data]);
    setValue("order_detail_info.products_detail", updatedProductDetailList);
  };
  const _onRemoveSelectProducts = (id: string) => {
    setSelectedProductList((prev) =>
      prev.filter((item) => item.variant?.id !== id),
    );
    const filteredProductsDetail = getValues(
      "order_detail_info.products_detail",
    ).filter((item) => item.id !== id);
    setValue("order_detail_info.products_detail", filteredProductsDetail);
  };
  const _onRemoveAllProducts = () => {
    setSelectedProductList([]);
    setProductDetailInfoList({});
    reset({
      ...getValues(),
      order_detail_info: {
        ...getValues("order_detail_info"),
        products_detail: [],
      },
    });
  };
  const _onChangeProductQuantity = (
    id: number,
    productId: string,
    quantity: number,
  ) => {
    const updatedProductDetailList = getValues(
      "order_detail_info.products_detail",
    ).map((item, index) => ({
      id: index === id ? productId : item.id,
      quantity: index === id ? quantity : item.quantity,
    }));
    setValue("order_detail_info.products_detail", updatedProductDetailList);
    // Calculate product information
    const productPrice =
      selectedProductList.find((item) => item.variant?.id === productId)
        ?.price || 0;
    const productTotalDiscounts =
      selectedProductList.find((item) => item.variant?.id === productId)
        ?.total_discounts || 0;
    setProductDetailInfoList((prev) => ({
      ...prev,
      [id]: {
        subtotal: quantity * productPrice,
        total_discounts: quantity * productTotalDiscounts,
        total: quantity * (productPrice - productTotalDiscounts),
      },
    }));
  };
  useEffect(() => {
    selectedProductList.forEach((item, index) => {
      _onChangeProductQuantity(index, item.variant?.id || "", 1);
    });
    const subtotal =
      getValues("order_detail_info.products_detail")?.reduce((acc, item) => {
        const product = selectedProductList.find(
          (p) => p.variant?.id === item.id,
        );
        return acc + item.quantity * (product?.price || 0);
      }, 0) || 0;
    const productDiscount =
      getValues("order_detail_info.products_detail")?.reduce((acc, item) => {
        const product = selectedProductList.find(
          (p) => p.variant?.id === item.id,
        );
        return acc + item.quantity * (product?.total_discounts || 0);
      }, 0) || 0;
    const orderDiscount =
      getValues("order_detail_info.order_discounts")?.reduce((acc, curr) => {
        const discount = discountList?.data.find((item) => item.id === curr);
        const finalDiscount =
          discount?.type === DISCOUNT_TYPE.PERCENTAGE
            ? ((discount?.amount || 0) * (subtotal || 0)) / 100
            : discount?.amount || 0;
        return acc + finalDiscount;
      }, 0) || 0;
    const totalShippingFee =
      shippingMethodList?.data.find(
        (item) => item.id === watch("order_detail_info.shipping_method_id"),
      )?.cost || 0;
    const totalPaymentFee =
      paymentMethodList?.data.find(
        (item) =>
          item.id === watch("order_detail_info.payment_info.payment_method_id"),
      )?.cost || 0;
    const totalCosts =
      watch("order_detail_info.costs_detail")?.reduce((acc, curr) => {
        const cost = costList?.data.find((item) => item.id === curr)?.cost || 0;
        return acc + cost;
      }, 0) || 0;
    const totalDiscount = orderDiscount + productDiscount;
    const total =
      subtotal -
      (totalShippingFee + totalPaymentFee + totalCosts + totalDiscount);
    setValue("order_detail_info.subtotal", subtotal);
    setValue("order_detail_info.total_order_discount", orderDiscount);
    setValue("order_detail_info.total_product_discount", productDiscount);
    setValue("order_detail_info.total_discount", totalDiscount);
    setValue("order_detail_info.total_shipping_fee", totalShippingFee);
    setValue("order_detail_info.total_payment_fee", totalPaymentFee);
    setValue("order_detail_info.total_costs", totalCosts);
    setValue("order_detail_info.total", total);
  }, [selectedProductList]);
  useEffect(() => {
    if (watch("order_detail_info.customer_id")) {
      const customer = customerList?.data.find(
        (item) => item.id === watch("order_detail_info.customer_id"),
      );
      setValue(
        "order_detail_info.customer_firstName",
        customer?.first_name || "",
      );
      setValue(
        "order_detail_info.customer_lastName",
        customer?.last_name || "",
      );
      setValue("order_detail_info.customer_phone", customer?.phone || "");
      setValue("order_detail_info.customer_email", customer?.email || "");
    }
  }, [watch("order_detail_info.customer_id")]);
  const _onResetData = () => {
    reset();
    _onRemoveAllProducts();
  };
  const _onCloseModal = () => {
    handleCloseCreateOrderModal();
    _onResetData();
  };
  const _onConfirmCreateOrder = (data: OrderCreateDTO) => {
    if (selectedProductList.length === 0) {
      notificationApi.error({
        message: "Please select at least one product",
        description: "Please select at least one product",
      });
      return;
    }
    handleCreateOrder(data, _onResetData);
  };
  const productSellableColumns: TableProps<ProductSellableModel>["columns"] = [
    {
      title: null,
      dataIndex: "images",
      key: "images",
      minWidth: 50,
      className: "max-w-[50px] max-h-[50px]",
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
            <Carousel adaptiveHeight dotPosition="bottom" arrows>
              {imagesList.map((item) => (
                <Image
                  key={item}
                  src={item}
                  alt="product"
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
      render: (_, { variant }) => {
        return <p>{variant?.name}</p>;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, { price }) => {
        return <p>{formatCurrency(price)}</p>;
      },
    },
    {
      title: "Inventory",
      dataIndex: "inventory",
      key: "inventory",
      render: (_, { inventory }) => {
        return <p>{inventory?.quantity}</p>;
      },
    },
    {
      title: "Order quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, { variant, inventory }, index) => {
        return (
          <Controller
            control={control}
            name={`order_detail_info.products_detail.${index}.quantity`}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={1}
                max={inventory?.quantity}
                defaultValue={1}
                onChange={(value) =>
                  _onChangeProductQuantity(index, variant?.id || "", value || 0)
                }
              />
            )}
          />
        );
      },
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (_, {}, index) => {
        return (
          <p>{formatCurrency(productDetailInfoList[index]?.subtotal || 0)}</p>
        );
      },
    },
    {
      title: "Total discounts",
      dataIndex: "total_discounts",
      key: "total_discounts",
      render: (_, {}, index) => {
        return (
          <p>
            {formatCurrency(productDetailInfoList[index]?.total_discounts || 0)}
          </p>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, {}, index) => {
        return (
          <p>{formatCurrency(productDetailInfoList[index]?.total || 0)}</p>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, { variant }) => {
        return (
          <Button
            type="link"
            variant="text"
            onClick={() => _onRemoveSelectProducts(variant?.id || "")}
          >
            Remove
          </Button>
        );
      },
    },
    {
      title: () => {
        return (
          <Button type="link" variant="text" onClick={_onRemoveAllProducts}>
            Remove all
          </Button>
        );
      },
      dataIndex: "remove_all",
      key: "remove_all",
    },
  ];
  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Create new order</h1>;
  };
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
                      groupClassName="flex-1"
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
                      allowClear={true}
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
                        allowClear={true}
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
                        formatter={(value) =>
                          `${formatCurrency(Number(value))}`
                        }
                      />
                    )}
                  />
                )}
              />
            </div>
            {/* Products */}
            <Table
              tableLayout="auto"
              columns={productSellableColumns}
              dataSource={selectedProductList}
              scroll={{ x: "100%" }}
              rowKey={(record) => record.id}
              size="small"
              footer={(data) => {
                return (
                  <div className="h-full w-full text-center">
                    <Button
                      type="dashed"
                      onClick={handleOpenProductSelectionModal}
                    >
                      <Plus className="h-4 w-4" />
                      Add a product
                    </Button>
                  </div>
                );
              }}
              summary={(record) => {
                const totalQuantity =
                  watch("order_detail_info.products_detail")?.reduce(
                    (acc, curr) => acc + curr.quantity,
                    0,
                  ) || 0;
                const subtotal =
                  getValues("order_detail_info.products_detail")?.reduce(
                    (acc, item) => {
                      const product = selectedProductList.find(
                        (p) => p.variant?.id === item.id,
                      );
                      return acc + item.quantity * (product?.price || 0);
                    },
                    0,
                  ) || 0;
                const totalDiscount =
                  getValues("order_detail_info.products_detail")?.reduce(
                    (acc, item) => {
                      const product = selectedProductList.find(
                        (p) => p.variant?.id === item.id,
                      );
                      return (
                        acc + item.quantity * (product?.total_discounts || 0)
                      );
                    },
                    0,
                  ) || 0;
                const total = subtotal - totalDiscount;
                return (
                  <Table.Summary>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={2} colSpan={2}>
                        <h3 className="text-md font-semibold">
                          Total Quantity:
                        </h3>
                        {formatNumber(totalQuantity)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} colSpan={2}>
                        <h3 className="text-md font-semibold">Subtotal:</h3>
                        {formatCurrency(subtotal)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} colSpan={2}>
                        <h3 className="text-md font-semibold">
                          Total discount:
                        </h3>
                        {formatCurrency(totalDiscount)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} colSpan={2} align="left">
                        <h3 className="text-md font-semibold">Total:</h3>
                        {formatCurrency(total)}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
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
        {/* Order summary */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-2 flex flex-col gap-2">
            <InputAdmin
              label="Subtotal (1)"
              placeholder="Subtotal"
              disabled
              customComponent={(props, ref: any) => (
                <InputNumber
                  {...props}
                  className="w-full flex-1"
                  value={formatCurrency(
                    watch("order_detail_info.subtotal") || 0,
                  )}
                />
              )}
            />
            <div className="flex items-start gap-2">
              <InputAdmin
                label="Total discount (2) = (2.1) + (2.2)"
                placeholder="Total discount"
                disabled
                customComponent={(props, ref: any) => (
                  <InputNumber
                    {...props}
                    className="w-full flex-1"
                    value={formatCurrency(
                      watch("order_detail_info.total_discount") || 0,
                    )}
                  />
                )}
              />
              <InputAdmin
                label="Total order discount (2.1)"
                placeholder="Total order discount"
                disabled
                customComponent={(props, ref: any) => (
                  <InputNumber
                    {...props}
                    className="w-full flex-1"
                    value={formatCurrency(
                      watch("order_detail_info.total_order_discount") || 0,
                    )}
                  />
                )}
              />
              <InputAdmin
                label="Total product discount (2.1)"
                placeholder="Total product discount"
                disabled
                customComponent={(props, ref: any) => (
                  <InputNumber
                    {...props}
                    className="w-full flex-1"
                    value={formatCurrency(
                      watch("order_detail_info.total_product_discount") || 0,
                    )}
                  />
                )}
              />
            </div>
            <div className="flex items-start gap-2">
              <InputAdmin
                label="Total shipping fee (3))"
                placeholder="Total shipping fee"
                disabled
                customComponent={(props, ref: any) => (
                  <InputNumber
                    {...props}
                    className="w-full flex-1"
                    value={formatCurrency(
                      watch("order_detail_info.total_shipping_fee") || 0,
                    )}
                  />
                )}
              />
              <InputAdmin
                label="Total payment fee (3))"
                placeholder="Total payemnt fee"
                disabled
                customComponent={(props, ref: any) => (
                  <InputNumber
                    {...props}
                    className="w-full flex-1"
                    value={formatCurrency(
                      watch("order_detail_info.total_payment_fee") || 0,
                    )}
                  />
                )}
              />
              <InputAdmin
                label="Total cost (4))"
                placeholder="Total cost"
                disabled
                customComponent={(props, ref: any) => (
                  <InputNumber
                    {...props}
                    className="w-full flex-1"
                    value={formatCurrency(
                      watch("order_detail_info.total_costs") || 0,
                    )}
                  />
                )}
              />
            </div>
            <InputAdmin
              label="Total (5) = (1) - (2) - (3) - (4)"
              placeholder="Total"
              disabled
              customComponent={(props, ref: any) => (
                <InputNumber
                  {...props}
                  className="w-full flex-1"
                  value={formatCurrency(watch("order_detail_info.total") || 0)}
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
          Create
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
        open={isOpen}
        onCancel={handleCloseCreateOrderModal}
        loading={loading}
      />
      <ProductSelectionModal
        open={isOpenProductSelectionModal}
        handleCloseModal={handleCloseProductSelectionModal}
        handleOnConfirmSelect={handleSelectProducts}
        isDisabledSelectedRows={true}
        currentSelectedRows={selectedProductList}
      />
    </>
  );
};

export default CreateOrderDetailModal;
