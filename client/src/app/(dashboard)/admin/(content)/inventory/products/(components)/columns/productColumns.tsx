import { ProductModel } from "@/app/shared/models/products/products.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { Image, TableProps, Tag } from "antd";
import { IntlShape } from "react-intl";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";



export const productColumns: (
  intl: IntlShape,
) => TableProps<ProductModel>["columns"] = (intl: IntlShape) => [
  {
    key: "image",
    title: () => intl.formatMessage({ id: "thumbnail" }),
    render: (_, { image }) => {
      return (
          <Image src={image?.[0]?.url} width={50} height={50} />
      );
    },
  },
  {
    key: "sku",
    title: () => intl.formatMessage({ id: "sku" }),
    dataIndex: "sku",
  },
  {
    key: "name",
    title: () => intl.formatMessage({ id: "name" }),
    dataIndex: "name",
  },
  {
    key: "short_description",
    title: () => intl.formatMessage({ id: "short_description" }),
    dataIndex: "short_description",
  },
  {
    key: "number_of_variants",
    title: () => intl.formatMessage({ id: "number_of_variants" }),
    dataIndex: "variants",
    render: (_, { variant }) => {
      return <span>{formatNumber(variant?.length || 0)}</span>;
    },
  },
  {
    key: "status",
    title: () => intl.formatMessage({ id: "status" }),
    dataIndex: "status",
    render: (_, { status }) => {
      return (
        <div>
          {status === "ACTIVE" ? (
            <Tag color="green">{intl.formatMessage({ id: "is_selling" })}</Tag>
          ) : (
            <Tag color="red">
              {intl.formatMessage({ id: "is_discountinued" })}
            </Tag>
          )}
        </div>
      );
    },
  },
];

export const variantColumns: (
  intl: IntlShape,
) => TableProps<VariantProductModel>["columns"] = (intl: IntlShape) => [
  {
    key: "image",
    title: () => intl.formatMessage({ id: "thumbnail" }),
    render: (_, { product_sellable, sku }) => {
      const { image } = product_sellable || {};
      return (
        <div className="flex items-center gap-2">
          <Image src={image?.[0]?.url} width={50} height={50} />
          <span>{sku}</span>
        </div>
      );
    },
  },
  {
    key: "sku",
    title: () => intl.formatMessage({ id: "sku" }),
    dataIndex: "sku",
  },
  {
    key: "name",
    title: () => intl.formatMessage({ id: "name" }),
    dataIndex: "name",
  },
  {
    key: "price",
    title: () => intl.formatMessage({ id: "price" }),
    dataIndex: "price",
    render: (_, { product_sellable }) => {
      const { price } = product_sellable || {};
      return <span>{formatCurrency(price || 0)}</span>;
    },
  },
  {
    key: "discount",
    title: () => intl.formatMessage({ id: "number_of_discount_campaign" }),
    dataIndex: "discount",
    render: (_, { product_sellable }) => {
      const { discount } = product_sellable || {};
      return <span>{formatNumber(discount?.length || 0)}</span>;
    },
  },
  {
    key: "attributes",
    title: () => intl.formatMessage({ id: "attributes" }),
    dataIndex: "attributes",
    render: (_, { option_values }) => {
      return (
        <div className="flex flex-wrap gap-2">
          {option_values?.map((option) => (
            <Tag key={option.id}>{option.name}</Tag>
          ))}
        </div>
      );
    },
  },
  {
    key: "status",
    title: () => intl.formatMessage({ id: "status" }),
    dataIndex: "status",
    render: (_, { status }) => {
      return (
        <div>
          {status === "ACTIVE" ? (
            <Tag color="green">{intl.formatMessage({ id: "is_selling" })}</Tag>
          ) : (
            <Tag color="red">
              {intl.formatMessage({ id: "is_discountinued" })}
            </Tag>
          )}
        </div>
      );
    },
  },
];
