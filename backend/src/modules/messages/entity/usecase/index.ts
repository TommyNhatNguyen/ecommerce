import {
  IActorConditionDTO,
  IActorCreateDTO,
  IActorUpdateDTO,
} from 'src/modules/messages/actor/models/actor.dto';
import {
  IActorRepository,
  IActorUseCase,
} from 'src/modules/messages/actor/models/actor.interface';
import { Actor } from 'src/modules/messages/actor/models/actor.model';
import {
  IEntityConditionDTO,
  IEntityCreateDTO,
  IEntityUpdateDTO,
} from 'src/modules/messages/entity/models/entity.dto';
import { IEntityRepository } from 'src/modules/messages/entity/models/entity.interface';
import { IEntityUseCase } from 'src/modules/messages/entity/models/entity.interface';
import { Entity } from 'src/modules/messages/entity/models/entity.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class EntityUsecase implements IEntityUseCase {
  constructor(private readonly entityRepo: IEntityRepository) {}
  getEntityById(
    id: string,
    condition: IActorConditionDTO
  ): Promise<Entity | null> {
    return this.entityRepo.getEntityById(id, condition);
  }
  createEntity(data: IEntityCreateDTO): Promise<Entity> {
    return this.entityRepo.createEntity(data);
  }
  updateEntity(id: string, data: IEntityUpdateDTO): Promise<Entity> {
    return this.entityRepo.updateEntity(id, data);
  }
  deleteEntity(id: string): Promise<boolean> {
    return this.entityRepo.deleteEntity(id);
  }
  getEntityList(
    paging: PagingDTO,
    condition: IEntityConditionDTO
  ): Promise<ListResponse<Entity[]>> {
    return this.entityRepo.getEntityList(paging, condition);
  }
}
