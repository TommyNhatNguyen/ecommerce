import { Request, Response } from 'express';
import {
  BrandConditionDTOSchema,
  BrandCreateDTOSchema,
  BrandUpdateDTOSchema,
} from 'src/modules/brand/models/brand.dto';
import { IBrandUseCase } from 'src/modules/brand/models/brand.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class BrandHttpService {
  constructor(private readonly brandUseCase: IBrandUseCase) {}

  async createBrand(req: Request, res: Response) {
    const { success, data, error } = BrandCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const brand = await this.brandUseCase.createBrand(data);
      res.status(200).json({ message: 'Brand created successfully', ...brand });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Failed to create brand' });
      return;
    }
  }

  async updateBrand(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = BrandUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const brand = await this.brandUseCase.updateBrand(id, data);
      res.status(200).json({ message: 'Brand updated successfully', ...brand });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Failed to update brand' });
      return;
    }
  }

  async deleteBrand(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const brand = await this.brandUseCase.deleteBrand(id);
      res.status(200).json({ message: 'Brand deleted successfully' });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete brand' });
      return;
    }
  }

  async getBrand(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = BrandConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const brand = await this.brandUseCase.getBrand(id, data);
      res
        .status(200)
        .json({ message: 'Brand retrieved successfully', ...brand });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Failed to get brand' });
      return;
    }
  }

  async listBrand(req: Request, res: Response) {
    const {
      success,
      data: pagingData,
      error,
    } = PagingDTOSchema.safeParse(req.query);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    const {
      success: successBrand,
      data: condition,
      error: errorBrand,
    } = BrandConditionDTOSchema.safeParse(req.query);
    if (!successBrand) {
      res.status(400).json({ message: errorBrand?.message });
      return;
    }
    try {
      const brands = await this.brandUseCase.listBrand(pagingData, condition);
      res
        .status(200)
        .json({ message: 'Brands retrieved successfully', ...brands });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Failed to list brands' });
      return;
    }
  }
  async getAllBrand(req: Request, res: Response) {
    const { success, data, error } = BrandConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const brands = await this.brandUseCase.getAllBrand(data);
      res
        .status(200)
        .json({ message: 'Brands retrieved successfully', data: brands });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Failed to get all brands' });
      return;
    }
  }
}

export default BrandHttpService;
