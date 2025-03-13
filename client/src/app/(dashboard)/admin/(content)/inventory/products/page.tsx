"use client";
import CustomTable from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/CustomTable";
import Filter from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/Filter";
import React from "react";

type ProductPagePropsType = {};

const ProductPage = ({}: ProductPagePropsType) => {
  return (
    <div className="grid h-full min-h-[300px] grid-flow-row grid-cols-2 gap-4">
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
