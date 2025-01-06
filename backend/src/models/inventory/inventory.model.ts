import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW_STOCK = 'LOW_STOCK',
}

export const InventorySchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().min(0),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
  stock_status: z.nativeEnum(StockStatus),
  low_stock_threshold: z.number().min(0),
});

export type Inventory = z.infer<typeof InventorySchema>;
