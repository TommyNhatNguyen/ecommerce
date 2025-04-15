import { ProductSellableDetailsInOrderModel } from "@/app/shared/models/orders/orders.model";
import { TableProps, Tooltip, Image, Carousel, Select } from "antd";
import { IntlShape } from "react-intl";
import {
  formatCurrency,
  formatNumber,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { OrderUpdateDTO } from "@/app/shared/interfaces/orders/order.dto";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { ERROR_MESSAGE } from "@/app/constants/errors";

export const orderExpandDetailColumns: (
  intl: IntlShape,
  setValue: UseFormSetValue<OrderUpdateDTO>,
  control: Control<OrderUpdateDTO>,
) => TableProps<ProductSellableDetailsInOrderModel>["columns"] = (
  intl,
  setValue,
  control,
) => [
  {
    title: null,
    dataIndex: "image",
    key: "image",
    className: "max-w-[100px]",
    minWidth: 100,
    render: (_, { product_sellable }) => {
      const image = product_sellable?.image || [];
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
          <Carousel className="h-full w-full" autoplay dotPosition="bottom">
            {imagesList.map((item) => (
              <Image
                key={item}
                src={item}
                alt="product"
                fallback={defaultImage}
                className="h-full w-full object-contain"
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
    render: (_, { product_variant_name }) => (
      <Tooltip title={product_variant_name}>
        <span>{product_variant_name}</span>
      </Tooltip>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (_, { price }) => (
      <Tooltip title={formatCurrency(price || 0)}>
        <span>{formatCurrency(price || 0)}</span>
      </Tooltip>
    ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    render: (_, { quantity }) => (
      <Tooltip title={formatNumber(quantity)}>
        <span>{formatNumber(quantity)}</span>
      </Tooltip>
    ),
    minWidth: 100,
  },
  {
    title: "Subtotal",
    dataIndex: "subtotal",
    key: "subtotal",
    render: (_, { subtotal }) => (
      <Tooltip title={formatCurrency(subtotal)}>
        <span>{formatCurrency(subtotal)}</span>
      </Tooltip>
    ),
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
    render: (_, { discount_amount, product_sellable }) => {
      const discount = product_sellable?.discount || [];
      return (
        <Tooltip
          title={() => {
            return discount?.map((item) => (
              <p key={item.id}>
                {item.name} -{" "}
                {item.is_fixed
                  ? formatCurrency(item.amount)
                  : formatDiscountPercentage(item.amount)}
              </p>
            ));
          }}
        >
          <span>{formatCurrency(discount_amount || 0)}</span>
        </Tooltip>
      );
    },
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (_, { total }) => (
      <Tooltip title={formatCurrency(total)}>
        <span>{formatCurrency(total)}</span>
      </Tooltip>
    ),
  },
  {
    title: () => intl.formatMessage({ id: "select_inventory_product" }),
    dataIndex: "select_inventory_product",
    key: "select_inventory_product",
    render: (_, { product_sellable }, index) => {
      const { inventory } = product_sellable || {};
      const warehouse = inventory?.warehouse || [];
      return (
        <div className="w-full">
          <Controller
            name={`order_detail_info.products_detail.${index}.warehouse_id`}
            control={control}
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field: { onChange, ...field } }) => {
              return (
                <Select
                  {...field}
                  placeholder={intl.formatMessage({
                    id: "select_inventory_product",
                  })}
                  className="w-full"
                  options={warehouse.map((item) => ({
                    label: `${item.name} - ${intl.formatMessage(
                      {
                        id: "num_item",
                      },
                      {
                        num: item.inventory_warehouse.quantity || 0,
                      },
                    )}`,
                    value: item.id,
                  }))}
                  onChange={(value) => {
                    onChange(value);
                    setValue(
                      `order_detail_info.products_detail.${index}.id`,
                      product_sellable?.variant_id || "",
                    );
                    setValue(
                      `order_detail_info.products_detail.${index}.inventory_id`,
                      inventory?.id || "",
                    );
                  }}
                />
              );
            }}
          />
        </div>
      );
    },
  },
];
