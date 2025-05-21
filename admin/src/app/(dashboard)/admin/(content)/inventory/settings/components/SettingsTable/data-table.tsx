import { ProductModel } from "@/app/shared/models/products/products.model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import VariantSettingTable from "../VariantSettingTable";
import { cn } from "@/app/shared/utils/utils";

export type DataTableProps = {
  columns: ColumnDef<ProductModel>[];
  data?: ProductModel[];
};

const InventorySettingTable = ({ columns, data }: DataTableProps) => {
  const [updatedCell, setUpdatedCell] = useState<string>("");
  const table = useReactTable({
    data: data || [],
    columns,
    getRowCanExpand: (row) => (row.original?.variant?.length || 0) > 0,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });
  return (
    <Table>
      {/* Header */}
      <TableHeader className="border-b border-solid border-gray-200">
        {table.getHeaderGroups().map((headerGroup) => {
          const { headers, id } = headerGroup;
          return (
            <TableRow key={id}>
              {headers.map((header) => {
                const { id: headerId, column, colSpan } = header;
                return (
                  <TableHead key={headerId} colSpan={colSpan}>
                    {flexRender(column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          );
        })}
      </TableHeader>
      {/* Body */}
      <TableBody>
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row) => {
            const { id } = row || {};
            return (
              <>
                <TableRow
                  key={id}
                  id={id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => row.toggleExpanded()}
                  className={cn(
                    "border-b border-solid border-gray-200 hover:cursor-pointer hover:bg-gray-50",
                    row.getIsExpanded() && "bg-gray-50",
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const { id: cellId } = cell || {};
                    return (
                      <TableCell key={cellId}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <VariantSettingTable
                        data={row.original?.variant || []}
                        updatedCell={updatedCell}
                        setUpdatedCell={setUpdatedCell}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {/* Footer */}
    </Table>
  );
};

export default InventorySettingTable;
