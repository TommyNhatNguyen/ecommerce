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

export type ProductColumnType = Exclude<
  TableProps<ProductModel>["columns"],
  undefined
>;

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
    ProductModel[]
  >([]);
  const [productsOrder, setProductsOrder] = useState<
    { id: string; quantity: number }[]
  >([]);
  const _onChangeProductQuantity = (id: string, quantity: number) => {
    setProductsOrder((prev) => [
      ...prev.filter((item) => item.id !== id),
      { id: id, quantity: quantity },
    ]);
  };
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
      order_state: ORDER_STATE.PENDING as OrderState,
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
        payment_info: {
          payment_method_id: "", // Select from payment methods
          paid_amount: 0, // User input
        },
        products_detail: [
          {
            id: "",
            quantity: 0,
          },
        ],
        customer_id: "", // Select current active users
        customer_firstName: "", // User input
        customer_lastName: "",
        customer_phone: "", // User input
        customer_email: "", // User input, optional
        customer_address: "", // User input
        costs_detail: [
          // Select from costs
        ] as string[],
        order_discounts: [
          // Select from order discounts
        ] as string[],
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
  const handleCloseProductSelectionModal = () => {
    setIsOpenProductSelctionModal(false);
  };
  const handleOpenProductSelectionModal = () => {
    setIsOpenProductSelctionModal(true);
  };
  const handleSelectProducts = (data: ProductModel[]) => {
    setSelectedProductList((prev) => [...prev, ...data]);
  };
  const _onRemoveSelectProducts = (id: string) => {
    setSelectedProductList((prev) => prev.filter((item) => item.id !== id));
  };
  const _onRemoveAllProducts = () => {
    setSelectedProductList([]);
  };
  const _onResetData = () => {
    reset();
    _onRemoveAllProducts();
  };
  const _onCloseModal = () => {
    handleCloseCreateOrderModal();
    _onResetData();
  };
  const _onConfirmCreateOrder = (data: OrderCreateDTO) => {
    const {
      order_detail_info: { customer_id, ...rest_order_detail_info },
      ...rest
    } = data;
    let payload: OrderCreateDTO = {
      ...rest,
      order_detail_info: {
        ...rest_order_detail_info,
        products_detail: productsOrder,
      },
    };
    if (customer_id) {
      payload = {
        ...payload,
        order_detail_info: {
          customer_id: customer_id,
          ...payload.order_detail_info,
        },
      };
    }
    handleCreateOrder(payload, _onResetData);
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

  useEffect(() => {
    if (selectedProductList?.length > 0) {
      const subtotal =
        selectedProductList?.length > 0
          ? selectedProductList
              .map(
                (item) =>
                  item.price *
                  (productsOrder.find((product) => product.id == item.id)
                    ?.quantity || 0),
              )
              .reduce((acc, curr) => acc + curr)
          : 0;
      const total_shipping_fee =
        shippingMethodList?.data.find(
          (item) => item.id === watch("order_detail_info.shipping_method_id"),
        )?.cost || 0;
      const total_payment_fee =
        paymentMethodList?.data.find(
          (item) =>
            item.id ===
            watch("order_detail_info.payment_info.payment_method_id"),
        )?.cost || 0;
      const total_product_discount =
        selectedProductList?.length > 0
          ? selectedProductList
              .map(
                (item) =>
                  item.total_discounts *
                  (productsOrder.find((product) => product.id == item.id)
                    ?.quantity || 0),
              )
              .reduce((acc, curr) => acc + curr)
          : 0;
      const total_order_discount =
        watch("order_detail_info.order_discounts")?.length > 0
          ? discountList?.data
              ?.filter((item) =>
                watch("order_detail_info.order_discounts").includes(item.id),
              )
              .map((item) =>
                item.type === DISCOUNT_TYPE.PERCENTAGE
                  ? subtotal * (item.amount / 100)
                  : item.amount,
              )
              .reduce((arr, curr) => arr + curr) || 0
          : 0;
      const total_discount = total_order_discount + total_product_discount;
      const total_cost =
        watch("order_detail_info.costs_detail")?.length > 0
          ? costList?.data
              .filter((item) =>
                watch("order_detail_info.costs_detail").includes(item.id),
              )
              .map((item) =>
                item.type === NUMBER_TYPE.PERCENTAGE ? item.cost : item.cost,
              )
              .reduce((arr, curr) => arr + curr) || 0
          : 0;
      const total =
        subtotal -
        (total_shipping_fee + total_payment_fee + total_discount + total_cost);
      setValue("order_detail_info.total_shipping_fee", total_shipping_fee);
      setValue("order_detail_info.total_payment_fee", total_payment_fee);
      setValue("order_detail_info.subtotal", subtotal);
      setValue("order_detail_info.total_order_discount", total_order_discount);
      setValue(
        "order_detail_info.total_product_discount",
        total_product_discount,
      );
      setValue("order_detail_info.total_discount", total_discount);
      setValue("order_detail_info.total_costs", total_cost);
      setValue("order_detail_info.total", total);
    }
  }, [
    watch("order_detail_info.shipping_method_id"),
    watch("order_detail_info.payment_info"),
    watch("order_detail_info.costs_detail"),
    watch("order_detail_info.order_discounts"),
    productsOrder,
  ]);
  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Create new order</h1>;
  };
  const productColumns: (ProductColumnType[number] & {
    editable?: boolean;
  })[] = [
    {
      title: null,
      dataIndex: "images",
      key: "images",
      minWidth: 100,
      className: "max-w-[100px] max-h-[100px] min-h-[100px]",
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
            <Carousel adaptiveHeight dotPosition="bottom">
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, { price }) => {
        return <p>{formatCurrency(price || 0)}</p>;
      },
    },
    {
      title: "Order quantity",
      dataIndex: "quantity",
      key: "quantity",
      editable: true,
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (_, { price, id }) => {
        const orderQuantity =
          productsOrder.find((item) => item.id == id)?.quantity || 0;
        const subTotal = price * orderQuantity;
        return <p>{formatCurrency(subTotal)}</p>;
      },
    },
    {
      title: "Total discount",
      dataIndex: "total_discount",
      key: "total_discount",
      render: (_, { total_discounts, id }) => {
        const orderQuantity =
          productsOrder.find((item) => item.id == id)?.quantity || 0;
        const totalDiscount = total_discounts * orderQuantity;
        return (
          <Tooltip
            title={`Discount/item: ${formatCurrency(total_discounts || 0)}`}
          >
            {formatCurrency(totalDiscount)}
          </Tooltip>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, { price_after_discounts, id }) => {
        const orderQuantity =
          productsOrder.find((item) => item.id == id)?.quantity || 0;
        const total = price_after_discounts * orderQuantity;
        return <p>{formatCurrency(total)}</p>;
      },
    },
    {
      title: () => {
        return (
          <div className="flex items-center">
            <h3>Action</h3>
            <Button type="link" variant="text" onClick={_onRemoveAllProducts}>
              Remove All
            </Button>
          </div>
        );
      },
      dataIndex: "action",
      key: "action",
      fixed: "right",
      render: (_, { id }) => {
        return (
          <Button
            type="link"
            variant="text"
            onClick={() => _onRemoveSelectProducts(id)}
          >
            Remove
          </Button>
        );
      },
    },
  ];
  const renderProductColumns = productColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ProductModel) => ({
        record,
        editable: col.editable,
        title: col.title,
      }),
    };
  });
  const productComponents: TableProps<ProductModel>["components"] = {
    body: {
      row: (props: any) => {
        return <tr {...props} />;
      },
      cell: ({
        record,
        editable,
        className,
        ...props
      }: {
        record: ProductModel;
        editable: boolean;
        className: string;
      }) => {
        const [product, setProduct] = useState<{
          id: string;
          quantity: number;
        }>({
          id: "",
          quantity: 0,
        });
        const [editing, setEditing] = useState(false);
        const inputRef = useRef<InputRef>(null);
        const _handleChange = (value: number) => {
          setProduct({ id: record.id, quantity: value });
        };
        const save = () => {
          setEditing(!editing);
          _onChangeProductQuantity(product.id, product.quantity);
        };
        useEffect(() => {
          if (editing) {
            inputRef.current?.focus();
          }
        }, [editing]);
        if (editable) {
          return (
            <td
              {...props}
              className={cn(className, "text-center align-middle")}
            >
              <InputNumber
                tabIndex={1}
                className={cn("w-full")}
                placeholder="Enter quantity for this product"
                value={
                  productsOrder.find((item) => item.id == record.id)?.quantity
                }
                onPressEnter={save}
                onBlur={save}
                onChange={(value) => _handleChange(Number(value))}
                controls={false}
                max={record?.inventory?.quantity}
                min={1}
                ref={inputRef as any}
              />
            </td>
          );
        }
        return (
          <td
            {...props}
            className={cn(className, "text-center align-middle")}
          />
        );
      },
    },
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
              columns={renderProductColumns as ProductColumnType}
              dataSource={selectedProductList}
              scroll={{ x: "100%" }}
              rowKey={(record) => record.id}
              components={productComponents}
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
                  productsOrder?.length > 0
                    ? productsOrder
                        ?.map((item) => item.quantity)
                        ?.reduce((arr, curr) => arr + curr)
                    : 0;
                const subtotal =
                  record?.length > 0
                    ? record
                        .map(
                          (item) =>
                            item.price *
                            (productsOrder.find(
                              (product) => product.id == item.id,
                            )?.quantity || 0),
                        )
                        .reduce((acc, curr) => acc + curr)
                    : 0;
                const totalDiscount =
                  record?.length > 0
                    ? record
                        .map(
                          (item) =>
                            item.total_discounts *
                            (productsOrder.find(
                              (product) => product.id == item.id,
                            )?.quantity || 0),
                        )
                        .reduce((acc, curr) => acc + curr)
                    : 0;
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
                  value={formatCurrency(watch("order_detail_info.subtotal"))}
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
                      watch("order_detail_info.total_discount"),
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
                      watch("order_detail_info.total_order_discount"),
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
                      watch("order_detail_info.total_product_discount"),
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
                      watch("order_detail_info.total_shipping_fee"),
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
                      watch("order_detail_info.total_payment_fee"),
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
                      watch("order_detail_info.total_costs"),
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
                  value={formatCurrency(watch("order_detail_info.total"))}
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
