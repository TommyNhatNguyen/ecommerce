'use client'
import InvoicesFilter from '@/app/(dashboard)/admin/(content)/inventory/invoices/components/InvoicesFilter'
import InvoicesTable from '@/app/(dashboard)/admin/(content)/inventory/invoices/components/InvoicesTable'
import React from 'react'

type Props = {}
// Hiển thị danh sách hoá đơn nhập kho và xuất kho
// Lọc theo tên sản phẩm, kho, ngày tháng
// Tạo hoá đơn nhập kho và xuất kho
// Xem chi tiết hoá đơn
// Sửa hoá đơn
// Xóa hoá đơn

const InvoicesPage = (props: Props) => {
  return (
    <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
      <div className="col-span-2">
        <InvoicesFilter/>
      </div>
      <div className="col-span-10">
        <InvoicesTable/>
      </div>
    </div>
  )
}

export default InvoicesPage