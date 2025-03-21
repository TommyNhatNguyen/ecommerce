import { IInventoryUseCase } from 'src/modules/inventory/models/inventory.interface';
import { Request, Response } from 'express';
import { PagingDTOSchema } from 'src/share/models/paging';
import {
  InventoryCreateDTOSchema,
  InventoryUpdateDTOSchema,
} from 'src/modules/inventory/models/inventory.dto';
import { InventoryConditionDTOSchema } from 'src/modules/inventory/models/inventory.dto';

export class InventoryHttpService {
  constructor(private readonly inventoryUseCase: IInventoryUseCase) {}

  async getInventory(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data } = InventoryConditionDTOSchema.safeParse(req.query);
    if (!success) {
      res.status(400).json({ message: 'Invalid condition' });
      return;
    }
    try {
      const result = await this.inventoryUseCase.getInventoryById(id, data);
      res.json({ message: 'Success', ...result });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getInventoryList(req: Request, res: Response) {
    const {
      success: pagingSuccess,
      data: paging,
      error: pagingError,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: conditionSuccess,
      data: condition,
      error: conditionError,
    } = InventoryConditionDTOSchema.safeParse(req.query);
    if (!pagingSuccess || !conditionSuccess) {
      res
        .status(400)
        .json({ message: pagingError?.message || conditionError?.message });
      return;
    }
    try {
      const result = await this.inventoryUseCase.getInventoryList(
        paging,
        condition
      );
      res.json({ message: 'Success', ...result });
    } catch (error) {
      console.log(
        '🚀 ~ InventoryHttpService ~ getInventoryList ~ error:',
        error
      );
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createInventory(req: Request, res: Response) {
    const data = InventoryCreateDTOSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }
    try {
      const result = await this.inventoryUseCase.createInventory(data.data);
      res.json({ message: 'Success', data: result });
    } catch (error) {
      console.log("🚀 ~ InventoryHttpService ~ createInventory ~ error:", error)
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updateInventory(req: Request, res: Response) {
    const { id } = req.params;
    const data = InventoryUpdateDTOSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }
    try {
      const inventory = await this.inventoryUseCase.getInventoryById(id);
      if (!inventory) {
        res.status(404).json({ message: 'Inventory not found' });
        return;
      }
      const result = await this.inventoryUseCase.updateInventory(id, data.data);
      res.json({ message: 'Success', data: result });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deleteInventory(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const inventory = await this.inventoryUseCase.getInventoryById(id);
      if (!inventory) {
        res.status(404).json({ message: 'Inventory not found' });
        return;
      }
      await this.inventoryUseCase.deleteInventory(id);
      res.json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
