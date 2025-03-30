'use client'
import InvoicesFilter from '@/app/(dashboard)/admin/(content)/inventory/invoices/components/InvoicesFilter'
import InvoicesTable from '@/app/(dashboard)/admin/(content)/inventory/invoices/components/InvoicesTable'
import { useInvoicesFilter } from '@/app/(dashboard)/admin/(content)/inventory/invoices/hooks/useInvoicesFilter'
import React from 'react'

type Props = {}
// Tạo hoá đơn nhập kho và xuất kho
// Xem chi tiết hoá đơn
// Sửa hoá đơn
// Xóa hoá đơn

const InvoicesPage = (props: Props) => {
  const {isApplyFilter, ...rest } = useInvoicesFilter();
  return (
    <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
      <div className="col-span-2">
        <InvoicesFilter isApplyFilter={isApplyFilter} {...rest} />
      </div>
      <div className="col-span-10">
        <InvoicesTable isApplyFilter={isApplyFilter} {...rest}/>
      </div>
    </div>
  )
}

export default InvoicesPage