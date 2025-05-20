import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
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
  useReactTable,
} from "@tanstack/react-table";

export type DataTableProps = {
  columns: ColumnDef<VariantProductModel>[];
  data?: VariantProductModel[];
};

const InventoryVariantTable = ({ columns, data }: DataTableProps) => {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table>
      {/* Header */}
      <TableHeader>
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
              <TableRow
                key={id}
                id={id}
                data-state={row.getIsSelected() && "selected"}
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
    </Table>
  );
};

export default InventoryVariantTable;