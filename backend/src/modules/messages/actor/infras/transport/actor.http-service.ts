import { Request, Response } from 'express';
import {
  IActorByActorInfoIdDTOSchema,
  IActorConditionDTOSchema,
  IActorCreateDTOSchema,
  IActorUpdateDTOSchema,
} from 'src/modules/messages/actor/models/actor.dto';
import { IActorUseCase } from 'src/modules/messages/actor/models/actor.interface';
import { PagingDTOSchema } from 'src/share/models/paging';

export class ActorHttpService {
  constructor(private readonly actorUseCase: IActorUseCase) {}
  async getActorByActorInfoId(req: Request, res: Response) {
    const { success, data, error } = IActorByActorInfoIdDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const actor = await this.actorUseCase.getActorByActorInfoId(
        data.actor_info_id,
        {}
      );
      if (!actor) {
        res.status(404).json({ message: 'Actor not found' });
        return;
      }
      res.status(200).json(actor);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getActorById(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = IActorConditionDTOSchema.safeParse(
      req.query
    );
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const actor = await this.actorUseCase.getActorById(id, data);
      if (!actor) {
        res.status(404).json({ message: 'Actor not found' });
        return;
      }
      res.status(200).json(actor);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async getActorList(req: Request, res: Response) {
    const {
      success: successPaging,
      data: paging,
      error: errorPaging,
    } = PagingDTOSchema.safeParse(req.query);
    const {
      success: successCondition,
      data: condition,
      error: errorCondition,
    } = IActorConditionDTOSchema.safeParse(req.query);
    if (!successPaging || !successCondition) {
      res
        .status(400)
        .json({ message: errorPaging?.message || errorCondition?.message });
      return;
    }
    try {
      const actorList = await this.actorUseCase.getActorList(paging, condition);
      if (!actorList) {
        res.status(404).json({ message: 'Actor list not found' });
        return;
      }
      res.status(200).json(actorList);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async createActor(req: Request, res: Response) {
    const { success, data, error } = IActorCreateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const actor = await this.actorUseCase.createActor(data);
      if (!actor) {
        res.status(404).json({ message: 'Failed to create actor' });
        return;
      }
      res.status(200).json(actor);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async updateActor(req: Request, res: Response) {
    const { id } = req.params;
    const { success, data, error } = IActorUpdateDTOSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error?.message });
      return;
    }
    try {
      const actor = await this.actorUseCase.getActorById(id);
      if (!actor) {
        res.status(404).json({ message: 'Actor not found' });
        return;
      }
      const updatedActor = await this.actorUseCase.updateActor(id, data);
      if (!updatedActor) {
        res.status(404).json({ message: 'Failed to update actor' });
        return;
      }
      res.status(200).json(updatedActor);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
  async deleteActor(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const actor = await this.actorUseCase.getActorById(id);
      if (!actor) {
        res.status(404).json({ message: 'Actor not found' });
        return;
      }
      const deletedActor = await this.actorUseCase.deleteActor(id);
      if (!deletedActor) {
        res.status(404).json({ message: 'Failed to delete actor' });
        return;
      }
      res.status(200).json(deletedActor);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  }
}
