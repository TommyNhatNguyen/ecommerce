import React from "react";

type Props = {};

const InventoryFilter = (props: Props) => {
  return (
    <div>
      Tên sản phẩm (search) Theo kho hàng (select multiple) Theo trạng thái kho
      (select multiple) Theo nhóm sản phẩm (select multiple) Theo thương hiệu
      (select multiple) Range: giá, giá vốn trung bình, tổng số lượng tồn kho,
      tổng giá vốn (lọc nâng cao - popup bao gồm những cái trên)
    </div>
  );
};

export default InventoryFilter;
