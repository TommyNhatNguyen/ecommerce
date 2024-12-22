import { ModelStatus } from "src/share/models/base-model";
import z from "zod";

export const InventorySchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().min(0),
  status: z.nativeEnum(ModelStatus),
  created_at: z.date(),
  updated_at: z.date(),
});
  
export type Inventory = z.infer<typeof InventorySchema>;
