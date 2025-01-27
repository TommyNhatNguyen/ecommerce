import { NextFunction, Request, Response } from 'express';
import {
  ResourcesConditionDTO,
  ResourcesCreateDTOSchema,
  ResourcesUpdateDTOSchema,
} from 'src/modules/resources/models/resources.dto';
import { IResourcesUseCase } from 'src/modules/resources/models/resources.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class ResourcesHttpService {
  constructor(private readonly resourcesUseCase: IResourcesUseCase) {}

  async getResourcesById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const resources = await this.resourcesUseCase.getResourcesById(id);
      if (!resources) {
        res.status(404).json({ message: 'Resources not found' });
        return;
      }
      res.status(200).json({ message: 'success', ...resources });
      return;
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getResources(req: Request, res: Response, next: NextFunction) {
    const { data: pagingData, success: pagingSuccess } =
      PagingDTOSchema.safeParse(req.query);
    const { data: conditionData, success: conditionSuccess } =
      ResourcesConditionDTO.safeParse(req.query);
    if (!pagingSuccess || !conditionSuccess) {
      res.status(400).json({ message: 'Invalid paging data' });
      return;
    }
    try {
      const resources = await this.resourcesUseCase.getResources(
        pagingData,
        conditionData
      );
      res.status(200).json({ message: 'success', ...resources });
      return;
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async createResources(req: Request, res: Response, next: NextFunction) {
    const { data: resourcesData, success: resourcesSuccess } =
      ResourcesCreateDTOSchema.safeParse(req.body);
    if (!resourcesSuccess) {
      res.status(400).json({ message: 'Invalid resources data' });
      return;
    }
    try {
      const resources = await this.resourcesUseCase.createResources(
        resourcesData
      );
      if (!resources) {
        res.status(400).json({ message: 'Failed to create resources' });
        return;
      }
      res.status(200).json({ message: 'success', ...resources });
      return;
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async updateResources(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { data: resourcesData, success: resourcesSuccess } =
      ResourcesUpdateDTOSchema.safeParse(req.body);
    if (!resourcesSuccess) {
      res.status(400).json({ message: 'Invalid resources data' });
      return;
    }
    try {
      const resources = await this.resourcesUseCase.updateResources(
        id,
        resourcesData
      );
      if (!resources) {
        res.status(400).json({ message: 'Failed to update resources' });
        return;
      }
      res.status(200).json({ message: 'success', ...resources });
      return;
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async deleteResources(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const resources = await this.resourcesUseCase.deleteResources(id);
      if (!resources) {
        res.status(400).json({ message: 'Failed to delete resources' });
        return;
      }
      res.status(200).json({ message: 'success' });
      return;
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
