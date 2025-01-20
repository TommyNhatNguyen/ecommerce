import {
  IActorCreateDTO,
  IActorUpdateDTO,
} from 'src/modules/messages/actor/models/actor.dto';
import { IActorConditionDTO } from 'src/modules/messages/actor/models/actor.dto';
import { Actor } from 'src/modules/messages/actor/models/actor.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IActorUseCase {
  getActorById(
    id: string,
    condition?: IActorConditionDTO
  ): Promise<Actor | null>;
  getActorList(
    paging: PagingDTO,
    condition?: IActorConditionDTO
  ): Promise<ListResponse<Actor[]>>;
  createActor(data: IActorCreateDTO): Promise<Actor>;
  updateActor(id: string, data: IActorUpdateDTO): Promise<Actor>;
  deleteActor(id: string): Promise<boolean>;
}

export interface IActorRepository
  extends ICommandRepository,
    IQueryRepository {}

export interface IQueryRepository {
  getActorById(
    id: string,
    condition: IActorConditionDTO
  ): Promise<Actor | null>;
  getActorList(
    paging: PagingDTO,
    condition: IActorConditionDTO
  ): Promise<ListResponse<Actor[]>>;
}

export interface ICommandRepository {
  createActor(data: IActorCreateDTO): Promise<Actor>;
  updateActor(id: string, data: IActorUpdateDTO): Promise<Actor>;
  deleteActor(id: string): Promise<boolean>;
}
