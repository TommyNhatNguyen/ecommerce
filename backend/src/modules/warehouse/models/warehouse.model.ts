import { ModelStatus } from 'src/share/models/base-model';
import z from 'zod';

export const WarehouseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  total_cost: z.number().min(0),
  total_quantity: z.number().min(0),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;
