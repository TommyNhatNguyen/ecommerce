'use client'
import InventoryWarehouseFilter from '@/app/(dashboard)/admin/(content)/inventory/warehouses/components/InventoryWarehouseFilter';
import InventoryWarehouseTable from '@/app/(dashboard)/admin/(content)/inventory/warehouses/components/InventoryWarehouseTable';
import React from 'react'

type Props = {}

const WarehousesPage = (props: Props) => {
  return (
    <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
      <div className="col-span-12">
        <InventoryWarehouseTable/>
      </div>
    </div>
  );
}

export default WarehousesPage;
