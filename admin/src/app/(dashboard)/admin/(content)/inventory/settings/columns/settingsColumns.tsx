import { ProductModel } from "@/app/shared/models/products/products.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { Tag, Image, Carousel, InputNumber, Button } from "antd";
import { useIntl } from "react-intl";
import { Controller, Control, UseFormSetValue } from "react-hook-form";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { ColumnType } from "antd/es/table";

type FormValues = {
  id: string;
  threshold: number;
}[];

type SettingsColumnsProps = {
  intl: ReturnType<typeof useIntl>;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  onUpdateThreshold: (id: string, threshold: number) => Promise<void>;
};

export const settingsColumns = ({
  intl,
  control,
  setValue,
  onUpdateThreshold,
}: SettingsColumnsProps) => {
  const productColumns: ColumnType<ProductModel>[] = [
    {
      title: intl.formatMessage({ id: "name" }),
      dataIndex: "name",
      key: "name",
    },
    {
      title: intl.formatMessage({ id: "category" }),
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
      title: intl.formatMessage({ id: "number_of_variants" }),
      dataIndex: "total_variant",
      key: "total_variant",
      render: (_, { variant }) => {
        return variant?.length || 0;
      },
    },
  ];

  const variantColumns: ColumnType<VariantProductModel>[] = [
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
      title: intl.formatMessage({ id: "name" }),
      dataIndex: "name",
      key: "name",
    },
    {
      title: intl.formatMessage({ id: "quantity" }),
      dataIndex: "inventory",
      key: "inventory",
      render: (_, { product_sellable }) => {
        return product_sellable?.inventory?.quantity || 0;
      },
    },
    {
      title: intl.formatMessage({ id: "stock_status" }),
      dataIndex: "stock_status",
      key: "stock_status",
      render: (_, { product_sellable }) => {
        return product_sellable?.inventory?.stock_status || "";
      },
    },
    {
      title: intl.formatMessage({ id: "low_stock_threshold" }),
      dataIndex: "update_low_stock_threshold",
      key: "update_low_stock_threshold",
      render: (_, { product_sellable }, index) => {
        const inventoryId = product_sellable?.inventory?.id || "";
        const threshold = product_sellable?.inventory?.low_stock_threshold || 0;
        setValue(`${index}.id` as any, inventoryId);
        setValue(`${index}.threshold` as any, threshold);
        return (
          <Controller
            control={control}
            name={`${index}.threshold` as any}
            render={({ field }) => {
              return (
                <InputAdmin
                  placeholder={intl.formatMessage({
                    id: "enter_low_stock_threshold",
                  })}
                  {...field}
                  customComponent={(
                    props,
                    ref: React.RefObject<HTMLInputElement>,
                  ) => {
                    return (
                      <div className="flex w-full items-center gap-1">
                        <InputNumber
                          {...props}
                          ref={ref}
                          className="w-full"
                          min={0}
                        />
                        <Button
                          type="primary"
                          onClick={() =>
                            onUpdateThreshold(inventoryId, props.value)
                          }
                        >
                          {intl.formatMessage({ id: "update" })}
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
