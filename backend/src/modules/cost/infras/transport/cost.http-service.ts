import { Request, Response } from 'express';
import {
  CostConditionDTOSchema,
  CostCreateDTOSchema,
  CostUpdateDTOSchema,
} from 'src/modules/cost/models/cost.dto';
import { PagingDTOSchema } from 'src/share/models/paging';
import { CostUseCase } from 'src/modules/cost/usecase';
export class CostHttpService {
  constructor(private readonly costUsecase: CostUseCase) {}

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CostConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const cost = await this.costUsecase.getById(id, data);
      if (!cost) {
        res.status(404).json({ success: false, message: 'Cost not found' });
        return;
      }
      res.status(200).json({ success: true, ...cost });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async getList(req: Request, res: Response) {
    const {
      success: successPaging,
      data: dataPaging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: successCondition,
      data: dataCondition,
      error: errorCondition,
    } = CostConditionDTOSchema.safeParse(req.query);
    if (!successPaging || !successCondition) {
      res.status(400).json({
        success: false,
        message: errorPaging?.message || errorCondition?.message,
      });
      return;
    }
    try {
      const cost = await this.costUsecase.getList(dataPaging, dataCondition);
      if (!cost) {
        res.status(404).json({ success: false, message: 'Cost not found' });
        return;
      }
      res.status(200).json({ success: true, ...cost });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async create(req: Request, res: Response) {
    const { success, data, error } = CostCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const cost = await this.costUsecase.create(data);
      res.status(200).json({ success: true, ...cost });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = CostUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    try {
      const updatedCost = await this.costUsecase.getById(id, {});
      if (!updatedCost) {
        res.status(404).json({ success: false, message: 'Cost not found' });
        return;
      }
      const cost = await this.costUsecase.update(id, data);
      res.status(200).json({ success: true, ...cost });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deletedCost = await this.costUsecase.getById(id, {});
      if (!deletedCost) {
        res.status(404).json({ success: false, message: 'Cost not found' });
        return;
      }
      await this.costUsecase.delete(id);
      res.status(200).json({
        success: true,
        message: 'Cost deleted successfully',
        ...deletedCost,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
      return;
    }
  }
}
