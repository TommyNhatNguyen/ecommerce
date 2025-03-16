'use client'
import BrandTable from '@/app/(dashboard)/admin/(content)/inventory/products/brands/components/BrandTable';
import BrandFilter from '@/app/(dashboard)/admin/(content)/inventory/products/brands/components/BrandFilter';
import { useBrandFilter } from '@/app/(dashboard)/admin/(content)/inventory/products/brands/hooks/useBrandFilter';
import React from 'react'

type Props = {}

const BrandPage = (props: Props) => {
  const {limit, ...rest} = useBrandFilter();
  return (
    <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
      <div className="col-span-2">
        <BrandFilter limit={limit} {...rest} />
      </div>
      <div className="col-span-10">
        <BrandTable limit={limit} />
      </div>
    </div>
  );
}

export default BrandPage