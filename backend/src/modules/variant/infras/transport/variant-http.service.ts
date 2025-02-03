import { Request, Response } from 'express';
import { VariantCreateDTOSchema, VariantUpdateDTOSchema } from 'src/modules/variant/models/variant.dto';
import { VariantConditionDTOSchema } from 'src/modules/variant/models/variant.dto';
import { IVariantUseCase } from 'src/modules/variant/models/variant.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class VariantHttpService {
  constructor(private readonly useCase: IVariantUseCase) {}
  async getVariantById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const checkVariant = await this.useCase.getVariantById(id);
      if (!checkVariant) {
        res.status(400).json({ message: 'Variant not found' });
        return;
      }
      res.status(200).json({ message: 'Variant found', data: checkVariant });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get variant' });
      return;
    }
  }
  async listVariant(req: Request, res: Response) {
    const {
      success: successPaging,
      data: paging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    if (!successPaging) {
      res.status(400).json({ message: errorPaging?.message });
      return;
    }
    const {
      success: successCondition,
      data: condition,
      error: errorCondition,
    } = VariantConditionDTOSchema.safeParse(req.query);
    if (!successCondition) {
      res.status(400).json({ message: errorCondition?.message });
      return;
    }
    try {
      const variants = await this.useCase.listVariant(paging, condition);
      res.status(200).json({ message: 'Variant found', ...variants });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get variant' });
      return;
    }
  }
  async createVariant(req: Request, res: Response) {
    const { success, data, error } = VariantCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const variant = await this.useCase.createVariant(data);
      res
        .status(200)
        .json({ message: 'Variant created successfully', data: variant });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create variant' });
      return;
    }
  }
  async updateVariant(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = VariantUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const checkVariant = await this.useCase.getVariantById(id);
      if (!checkVariant) {
        res.status(400).json({ message: 'Variant not found' });
        return;
      }
      const variant = await this.useCase.updateVariant(id, data);
      res
        .status(200)
        .json({ message: 'Variant updated successfully', data: variant });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update variant' });
      return;
    }
  }
  async deleteVariant(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const checkVariant = await this.useCase.getVariantById(id);
      if (!checkVariant) {
        res.status(400).json({ message: 'Variant not found' });
        return;
      }
      await this.useCase.deleteVariant(id);
      res.status(200).json({ message: 'Variant deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete variant' });
      return;
    }
  }
}
