import { IEntityCreateDTO, IEntityUpdateDTO } from 'src/modules/messages/entity/models/entity.dto';
import { IEntityConditionDTO } from 'src/modules/messages/entity/models/entity.dto';
import { Entity, EntityKind } from 'src/modules/messages/entity/models/entity.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IEntityUseCase {
  getEntityById(
    id: string,
    condition?: IEntityConditionDTO
  ): Promise<Entity | null>;
  getEntityByTypeAndKind(
    type: string,
    kind: EntityKind
  ): Promise<Entity | null>;
  getEntityList(
    paging: PagingDTO,
    condition?: IEntityConditionDTO
  ): Promise<ListResponse<Entity[]>>;
  createEntity(data: IEntityCreateDTO): Promise<Entity>;
  updateEntity(id: string, data: IEntityUpdateDTO): Promise<Entity>;
  deleteEntity(id: string): Promise<boolean>;
}

export interface IEntityRepository
  extends ICommandRepository,
    IQueryRepository {}

export interface IQueryRepository {
  getEntityById(
    id: string,
    condition: IEntityConditionDTO
  ): Promise<Entity | null>;
  getEntityList(
    paging: PagingDTO,
    condition: IEntityConditionDTO
  ): Promise<ListResponse<Entity[]>>;
  getEntityByTypeAndKind(
    type: string,
    kind: EntityKind
  ): Promise<Entity | null>;
}

export interface ICommandRepository {
  createEntity(data: IEntityCreateDTO): Promise<Entity>;
  updateEntity(id: string, data: IEntityUpdateDTO): Promise<Entity>;
  deleteEntity(id: string): Promise<boolean>;
}
