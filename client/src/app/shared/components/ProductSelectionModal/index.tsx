import React, { useEffect, useState } from "react";
import GeneralModal from "../GeneralModal";
import { Button, Carousel, Image, Table, TableProps } from "antd";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productService } from "../../services/products/productService";
import { ProductModel } from "../../models/products/products.model";
import { defaultImage } from "../../resources/images/default-image";
import { cn, formatNumber } from "../../utils/utils";

type Props = {
  open: boolean;
  handleCloseModal: () => void;
  handleOnConfirmSelect: (data: ProductModel[]) => void;
  isDisabledSelectedRows?: boolean;
  currentSelectedRows?: ProductModel[];
};

const ProductSelectionModal = ({
  open = false,
  handleCloseModal,
  handleOnConfirmSelect,
  isDisabledSelectedRows = false,
  currentSelectedRows,
}: Props) => {
  const [selectedRows, setSelectedRows] = useState<ProductModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const _onCloseModal = () => {
    handleCloseModal();
  };
  const { data, isLoading: isProductLoading } = useQuery({
    queryKey: ["product"],
    queryFn: () =>
      productService.getProducts({
        includeImage: true,
        limit: limit,
        page: currentPage,
      }),
    placeholderData: keepPreviousData,
  });
  const { total_count } = data?.meta || {};
  const _onSelectRow = (
    record: ProductModel,
    selected: boolean,
    selectedRows: ProductModel[],
  ) => {
    setSelectedRows(selectedRows);
  };
  const _onSelectAllRow = (
    selected: boolean,
    selectedRows: ProductModel[],
    changeRows: ProductModel[],
  ) => {
    setSelectedRows(selectedRows);
  };
  const _onConfirmSelect = () => {
    handleOnConfirmSelect(selectedRows);
    _onCloseModal();
    setSelectedRows([]);
  };
  const columns: TableProps<ProductModel>["columns"] = [
    {
      title: null,
      dataIndex: "images",
      key: "images",
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
    },
    {
      title: "Inventory",
      dataIndex: "inventory",
      key: "inventory",
      render: (_, { inventory }) => {
        return <p>{formatNumber(inventory?.quantity || 0)}</p>;
      },
    },
  ];
  const _renderTitle = () => {
    return (
      <div>
        <h2 className="text-lg font-bold">Select products</h2>
      </div>
    );
  };
  const _renderContent = () => {
    return (
      <div>
        <Table
          dataSource={data?.data}
          columns={columns}
          rowKey={(record) => record.id}
          rowSelection={{
            onSelect: (record, selected, selectedRows, nativeEvent) =>
              _onSelectRow(record, selected, selectedRows),
            onSelectAll: (selected, selectedRows, changeRows) =>
              _onSelectAllRow(selected, selectedRows, changeRows),
            selectedRowKeys: selectedRows.map((item) => item.id),
            getCheckboxProps: (record) => ({
              disabled: isDisabledSelectedRows
                ? currentSelectedRows
                    ?.map((item) => item.id)
                    .includes(record.id)
                : false,
            }),
          }}
          size="small"
          scroll={{ x: "100%" }}
          pagination={{
            current: currentPage,
            pageSize: limit,
            total: total_count,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 40, 50, Number(total_count)],
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setLimit(pageSize);
            },
          }}
          components={{
            body: {
              cell: (props: any) => (
                <td
                  {...props}
                  className={cn(props.className, "align-middle")}
                />
              ),
            },
          }}
        />
      </div>
    );
  };
  const _renderFooter = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModal}>
          Close
        </Button>
        <Button type="primary" onClick={_onConfirmSelect}>
          Confirm
        </Button>
      </div>
    );
  };
  return (
    <GeneralModal
      open={open}
      renderContent={_renderContent}
      renderTitle={_renderTitle}
      renderFooter={_renderFooter}
      onCancel={_onCloseModal}
    />
  );
};

export default ProductSelectionModal;
