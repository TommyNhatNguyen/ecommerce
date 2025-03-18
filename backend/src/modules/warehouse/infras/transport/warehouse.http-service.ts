import { Request, Response } from 'express';
import {
  WarehouseConditionDTOSchema,
  WarehouseCreateDTOSchema,
  WarehouseUpdateDTOSchema,
} from 'src/modules/warehouse/models/warehouse.dto';
import { IWarehouseUsecase } from 'src/modules/warehouse/models/warehouse.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class WarehouseHttpService {
  constructor(private readonly warehouseUseCase: IWarehouseUsecase) {}
  async getAllWarehouse(req: Request, res: Response) {
    const {
      success,
      data: condition,
      error,
    } = WarehouseConditionDTOSchema.safeParse(req.query);
    if (!success) {
      res.status(400).json({ message: error.message });
      return;
    }
    try {
      const warehouseList = await this.warehouseUseCase.getAllWarehouse(
        condition
      );
      res.json({ message: 'Success', data: warehouseList });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getWarehouse(req: Request, res: Response) {
    const { id } = req.params;
    const {
      success,
      data: condition,
      error,
    } = WarehouseConditionDTOSchema.safeParse(req.query);
    if (!success) {
      res.status(400).json({ message: error.message });
      return;
    }
    try {
      const warehouse = await this.warehouseUseCase.getWarehouseById(
        id,
        condition
      );
      res.json({ message: 'Success', data: warehouse });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getWarehouseList(req: Request, res: Response) {
    const {
      success,
      data: condition,
      error,
    } = WarehouseConditionDTOSchema.safeParse(req.query);
    const {
      success: successPaging,
      data: paging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    if (!success || !successPaging) {
      res.status(400).json({ message: error?.message || errorPaging?.message });
      return;
    }
    try {
      const warehouseList = await this.warehouseUseCase.getWarehouseList(
        paging,
        condition
      );
      res.json({ message: 'Success', ...warehouseList });
    } catch (error) {
      console.log(
        '🚀 ~ WarehouseHttpService ~ getAllWarehouse ~ error:',
        error
      );
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createWarehouse(req: Request, res: Response) {
    const { success, data, error } = WarehouseCreateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error.message });
      return;
    }
    try {
      const warehouse = await this.warehouseUseCase.createWarehouse(data);
      res.json({ message: 'Success', data: warehouse });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updateWarehouse(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = WarehouseUpdateDTOSchema.safeParse(
      req.body
    );
    if (!success) {
      res.status(400).json({ message: error.message });
      return;
    }
    try {
      const warehouse = await this.warehouseUseCase.updateWarehouse(id, data);
      res.json({ message: 'Success', data: warehouse });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deleteWarehouse(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await this.warehouseUseCase.deleteWarehouse(id);
      res.json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
