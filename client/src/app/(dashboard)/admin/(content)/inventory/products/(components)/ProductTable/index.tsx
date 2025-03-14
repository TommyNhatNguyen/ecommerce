import {
  PRODUCTS_COLUMNS,
  VARIANT_COLUMNS,
} from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/ProductTable/columns/columnsMenu";
import {
  productColumns,
  variantColumns,
} from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/ProductTable/columns/productColumns";
import ModalProductDetail from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/ModalProductDetail";
import { useProducts } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProduct";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { cn } from "@/app/shared/utils/utils";
import { Button, Checkbox, Divider, Dropdown, Table } from "antd";
import {
  AlignJustify,
  Download,
  FilePlus,
  Plus,
  RefreshCcw,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useProductFilter } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProductFilter";
import { useInView } from "react-intersection-observer";

type Props = {
  selectedCategories: string[];
};

const ProductTable = ({ selectedCategories }: Props) => {
  const intl = useIntl();
  const [selectedColumns, setSelectedColumns] = useState<{
    [key: string]: string[];
  }>({});
  const [productDetail, setProductDetail] =
    useState<VariantProductModel | null>(null);
  const { ref, inView } = useInView();
  const {
    products,
    isFetchingNextPage,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useProducts();
  const newProductColumns = useMemo(() => {
    return productColumns(intl)?.map((item) => ({
      ...item,
      hidden: !selectedColumns["product"]?.includes(item?.key as string),
    }));
  }, [selectedColumns]);

  const newVariantColumns = useMemo(() => {
    return variantColumns(intl)?.map((item) => ({
      ...item,
      hidden: !selectedColumns["variant"]?.includes(item?.key as string),
    }));
  }, [selectedColumns]);
  const _onRefetch = () => {
    refetch();
  };
  const _onSelectColumns = (id: string, keys: string[]) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [id]: keys,
    }));
  };
  const _onOpenModalCreateProduct = () => {
    console.log("open modal create product");
  };
  const handleCancelModalProductDetail = () => {
    setProductDetail(null);
  };

  useEffect(() => {
    if (products && products.length > 0) {
      setSelectedColumns({
        product: [
          ...(productColumns(intl) || []).map((item) => item?.key as string),
        ],
        variant: [
          ...(variantColumns(intl) || []).map((item) => item?.key as string),
        ],
      });
    }
  }, [products]);
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);
  return (
    <div className="h-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        {/* Tải lại */}
        <div className="left"></div>
        <div className="right flex items-center gap-2">
          <Button
            type="primary"
            icon={
              <RefreshCcw
                width={16}
                height={16}
                className={cn(isLoading && "animate-spin duration-300")}
              />
            }
            onClick={_onRefetch}
          />
          <Button
            type="primary"
            icon={<Plus width={16} height={16} />}
            onClick={_onOpenModalCreateProduct}
          >
            {intl.formatMessage({ id: "add_new" })}
          </Button>
          <Button
            type="primary"
            disabled
            icon={<FilePlus width={16} height={16} />}
          >
            <p>
              {intl.formatMessage({ id: "import_excel" })}(
              {intl.formatMessage({ id: "coming_soon" })})
            </p>
          </Button>
          <Button
            type="primary"
            disabled
            icon={<Download width={16} height={16} />}
          >
            <p>
              {intl.formatMessage({ id: "export_excel" })}(
              {intl.formatMessage({ id: "coming_soon" })})
            </p>
          </Button>
          <Dropdown
            trigger={["click"]}
            dropdownRender={() => {
              return (
                <div className="min-w-[200px] max-w-[200px] rounded-sm bg-custom-white p-2">
                  <div>
                    <p className="text-md font-roboto-bold">
                      {intl.formatMessage({ id: "product_columns" })}
                    </p>
                    <Checkbox.Group
                      options={PRODUCTS_COLUMNS}
                      value={selectedColumns["product"]}
                      onChange={(keys) => _onSelectColumns("product", keys)}
                      className="mt-2 flex flex-wrap gap-2"
                    />
                  </div>
                  <Divider />
                  <div>
                    <p className="text-md font-roboto-bold">
                      {intl.formatMessage({ id: "variant_columns" })}
                    </p>
                    <Checkbox.Group
                      options={VARIANT_COLUMNS}
                      value={selectedColumns["variant"]}
                      onChange={(keys) => _onSelectColumns("variant", keys)}
                      className="mt-2 flex flex-wrap gap-2"
                    />
                  </div>
                </div>
              );
            }}
          >
            <Button
              type="primary"
              icon={<AlignJustify width={16} height={16} />}
            />
          </Dropdown>
        </div>
      </div>
      <div>
        <Table
          dataSource={products}
          columns={newProductColumns}
          rowKey={(record) => record.id}
          pagination={false}
          loading={isFetchingNextPage}
          expandable={{
            childrenColumnName: "variant",
            expandRowByClick: true,
            expandedRowRender: (record) => {
              return (
                <>
                  <Table
                    key={record.id}
                    dataSource={record.variant}
                    columns={newVariantColumns}
                    rowKey={(record) => record.id}
                    onRow={(record) => {
                      return {
                        onClick: () => {
                          setProductDetail(record);
                        },
                      };
                    }}
                    pagination={false}
                  />
                </>
              );
            },
          }}
        />
        <div ref={ref}></div>
      </div>
      <ModalProductDetail
        data={productDetail}
        open={!!productDetail}
        onCancel={handleCancelModalProductDetail}
      />
    </div>
  );
};

export default React.memo(ProductTable);
