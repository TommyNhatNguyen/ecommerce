import { Request, Response } from 'express';
import {
  IEntityByTypeAndKindDTOSchema,
  IEntityConditionDTOSchema,
  IEntityCreateDTOSchema,
  IEntityUpdateDTOSchema,
} from 'src/modules/messages/entity/models/entity.dto';
import { IEntityUseCase } from 'src/modules/messages/entity/models/entity.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class EntityHttpService {
  constructor(private readonly entityUseCase: IEntityUseCase) {}
  async getEntityByTypeAndKind(req: Request, res: Response) {
    const { success, data, error } = IEntityByTypeAndKindDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const entity = await this.entityUseCase.getEntityByTypeAndKind(
        data.type,
        data.kind
      );
      if (!entity) {
        res.status(404).json({ message: 'Entity not found' });
        return;
      }
      res.status(200).json({ message: 'Entity found', ...entity });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getEntityById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const entity = await this.entityUseCase.getEntityById(id);
      if (!entity) {
        res.status(404).json({ message: 'Entity not found' });
        return;
      }
      res.status(200).json(entity);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getEntityList(req: Request, res: Response) {
    const {
      success: successPaging,
      data: paging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: successCondition,
      data: condition,
      error: errorCondition,
    } = IEntityConditionDTOSchema.safeParse(req.query);
    if (!successPaging || !successCondition) {
      res
        .status(400)
        .json({ message: errorPaging?.message || errorCondition?.message });
      return;
    }
    try {
      const entityList = await this.entityUseCase.getEntityList(
        paging,
        condition
      );
      if (!entityList) {
        res.status(404).json({ message: 'Entity list not found' });
        return;
      }
      res.status(200).json(entityList);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createEntity(req: Request, res: Response) {
    const { success, data, error } = IEntityCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const entity = await this.entityUseCase.createEntity(data);
      if (!entity) {
        res.status(404).json({ message: 'Failed to create entity' });
        return;
      }
      res.status(200).json(entity);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updateEntity(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = IEntityUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const entity = await this.entityUseCase.getEntityById(id);
      if (!entity) {
        res.status(404).json({ message: 'Entity not found' });
        return;
      }
      const updatedEntity = await this.entityUseCase.updateEntity(id, data);
      if (!updatedEntity) {
        res.status(404).json({ message: 'Failed to update entity' });
        return;
      }
      res.status(200).json(updatedEntity);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deleteEntity(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const entity = await this.entityUseCase.getEntityById(id);
      if (!entity) {
        res.status(404).json({ message: 'Entity not found' });
        return;
      }
      const deletedEntity = await this.entityUseCase.deleteEntity(id);
      if (!deletedEntity) {
        res.status(404).json({ message: 'Failed to delete entity' });
        return;
      }
      res.status(200).json(deletedEntity);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
