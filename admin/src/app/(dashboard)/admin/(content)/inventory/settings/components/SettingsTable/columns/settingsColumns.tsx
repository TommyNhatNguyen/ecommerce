import { ProductModel } from "@/app/shared/models/products/products.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { Tag, Image, Carousel, InputNumber, Button, TableProps } from "antd";
import { Controller } from "react-hook-form";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { IntlShape } from "react-intl";

export const settingsColumns = ({
  intl,
  control,
  setValue,
  onUpdateThreshold,
}) => {
  const productColumns: TableProps<ProductModel>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, { category }) => {
        return (
          <div className="flex flex-wrap gap-2">
            {category?.map((item) => <Tag key={item.id}>{item.name}</Tag>)}
          </div>
        );
      },
    },
    {
      title: "Total Variant",
      dataIndex: "total_variant",
      key: "total_variant",
      render: (_, { variant }) => {
        return variant?.length || 0;
      },
    },
  ];

  const variantColumns: TableProps<VariantProductModel>["columns"] = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      className: "max-w-[100px]",
      minWidth: 100,
      render: (_, { product_sellable }) => {
        const images = product_sellable?.image || [];
        return (
          <Image.PreviewGroup
            items={images.map((item) => item.url)}
            preview={{
              movable: false,
            }}
          >
            <Carousel autoplay dotPosition="bottom">
              {images.map((item) => (
                <Image
                  className="object-contain object-center"
                  src={item.url}
                  alt={item.url}
                  key={item.id}
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
      render: (_, { product_sellable }) => {
        console.log("🚀 ~ product_sellable:", product_sellable?.inventory);
        return product_sellable?.inventory?.total_quantity || 0;
      },
    },
    {
      title: "Stock status",
      dataIndex: "stock_status",
      key: "stock_status",
      render: (_, { product_sellable }) => {
        return product_sellable?.inventory?.stock_status || "";
      },
    },
    {
      title: "Update low stock threshold",
      dataIndex: "update_low_stock_threshold",
      key: "update_low_stock_threshold",
      render: (_, { product_sellable }, index) => {
        const id = product_sellable?.inventory?.id || "";
        const threshold = product_sellable?.inventory?.low_stock_threshold || 0;
        return (
          <Controller
            control={control}
            name={`${index}.threshold`}
            defaultValue={threshold}
            render={({ field }) => {
              return (
                <InputAdmin
                  placeholder="Enter low stock threshold"
                  {...field}
                  customComponent={(props, ref: any) => {
                    return (
                      <div className="flex w-full items-center gap-1">
                        <InputNumber
                          {...props}
                          ref={ref}
                          className="w-full"
                          min={0}
                          onChange={(value) => {
                            field.onChange(value);
                            setValue(`${index}.id`, id);
                          }}
                        />
                        <Button
                          type="primary"
                          onClick={() => onUpdateThreshold(id, field.value)}
                        >
                          Update
                        </Button>
                      </div>
                    );
                  }}
                />
              );
            }}
          />
        );
      },
    },
  ];

  return { productColumns, variantColumns };
};
