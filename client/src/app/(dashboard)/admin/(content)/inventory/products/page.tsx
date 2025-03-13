"use client";
import {
  productColumns,
  variantColumns,
} from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/columns/productColumns";
import CustomTable from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/CustomTable";
import Filter from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/Filter";
import { useProducts } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProduct";
import { Table } from "antd";
import React from "react";
import { useIntl } from "react-intl";

type ProductPagePropsType = {};

const ProductPage = ({}: ProductPagePropsType) => {
  const { products } = useProducts();
  const intl = useIntl();
  return (
    <div className="h-full">
      {/* Bảng sản phẩm */}
      {/* Filter sản phẩm */}
      <Filter>
        {/* 
        - Tìm kiếm
        - Nhóm hàng
        - Thuộc tính
        - Nhãn hàng
        - Trạng thái sản phẩm
        - Trạng thái giảm giá
        - Số bản ghi
        */}
      </Filter>
      {/* Danh sách sản phẩm */}
      <CustomTable>
        <Table
          dataSource={products}
          columns={productColumns(intl)}
          rowKey={(record) => record.id}
          pagination={false}
          expandable={{
            childrenColumnName: "variant",
            expandRowByClick: true,
            expandedRowRender: (record) => {
              return (
                <Table
                  key={record.id}
                  dataSource={record.variant}
                  columns={variantColumns(intl)}
                  rowKey={(record) => record.id}
                  onRow={(record) => {
                    return {
                      onClick: () => {
                        console.log(record);
                      },
                    };
                  }}
                />
              );
            },
          }}
        />
        <div className="product-list">
          {/* Header của bảng sản phẩm */}
          <div className="product-list__header">
            {/* 
          - Thao tác: Chuyển nhóm hàng, chuyển trạng thái kinh doanh, chuyển thuộc tính
          - Tải lại
          - Thêm mới
          - Xoá nhiều (xuất hiện nếu chọn nhiều)
          - Import excel (Chưa có)
          - Xuất excel (Chưa có)
          - Thêm cột 
          */}
          </div>
          {/* Danh sách sản phẩm scroll infinite*/}
          <div className="product-list__body"></div>
        </div>
      </CustomTable>
    </div>
  );
};

export default ProductPage;
