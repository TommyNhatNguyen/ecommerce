import { useToast } from '@/hooks/use-toast';
import { ModelStatus } from "../others/status.model";
import { InventoryModel, InventoryWarehouseModel } from '@/app/shared/models/inventories/inventories.model';

export type WarehouseModel = {
  id: string;
  name: string;
  description: string;
  address: string;
  total_quantity: number;
  total_cost: number;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
  inventory_warehouse: InventoryWarehouseModel;
  inventory: InventoryModel[];
};
