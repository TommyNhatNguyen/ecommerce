import {
  ImageCreateDTOSchema,
  ImageUpdateDTOSchema,
} from '@models/image/image.dto';
import { IImageUseCase } from '@models/image/image.interface';
import { Request, Response } from 'express';
import { PagingDTOSchema } from 'src/share/models/paging';

export class ImageHttpService {
  constructor(private readonly useCase: IImageUseCase) {}
  async getImage(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const image = await this.useCase.getImage(id);
      if (!image) {
        res.status(404).json({ message: 'Image not found' });
        return;
      }
      res.status(200).json({ message: 'Image retrieved successfully',  ...image });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve image' });
      return;
    }
  }
  async listImage(req: Request, res: Response) {
    const { success: pagingSuccess, data: pagingData, error: pagingError } = PagingDTOSchema.safeParse(req.query);
    if (!pagingSuccess) {
      res.status(400).json({ message: pagingError?.message });
      return;
    }
    try {
      const images = await this.useCase.listImage(pagingData);
      if (!images) {
        res.status(404).json({ message: 'Images not found' });
        return;
      }
      res.status(200).json({ message: 'Images retrieved successfully', ...images });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve images' });
      return;
    }
  }
  async createImage(req: Request, res: Response) {
    const { success, data, error } = ImageCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const image = await this.useCase.createImage(data);
      res
        .status(200)
        .json({ message: 'Image created successfully', ...image });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to create image' });
      return;
    }
  }
  async updateImage(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = ImageUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const image = await this.useCase.getImage(id);
      if (!image) {
        res.status(404).json({ message: 'Image not found' });
        return;
      }
      const updatedImage = await this.useCase.updateImage(id, data);
      res
        .status(200)
        .json({ message: 'Image updated successfully', ...updatedImage });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update image' });
      return;
    }
  }
  async deleteImage(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const image = await this.useCase.getImage(id);
      if (!image) {
        res.status(404).json({ message: 'Image not found' });
        return;
      }
      await this.useCase.deleteImage(id);
      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete image' });
      return;
    }
  }
}
