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
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export class ActorUsecase implements IActorUseCase {
  constructor(private readonly actorRepo: IActorRepository) {}
  getActorByActorInfoId(
    actorInfoId: string,
    condition?: IActorConditionDTO
  ): Promise<Actor | null> {
    return this.actorRepo.getActorByActorInfoId(actorInfoId, condition);
  }
  getActorById(
    id: string,
    condition: IActorConditionDTO
  ): Promise<Actor | null> {
    return this.actorRepo.getActorById(id, condition);
  }
  getActorList(
    paging: PagingDTO,
    condition: IActorConditionDTO
  ): Promise<ListResponse<Actor[]>> {
    return this.actorRepo.getActorList(paging, condition);
  }
  createActor(data: IActorCreateDTO): Promise<Actor> {
    return this.actorRepo.createActor(data);
  }
  updateActor(id: string, data: IActorUpdateDTO): Promise<Actor> {
    return this.actorRepo.updateActor(id, data);
  }
  deleteActor(id: string): Promise<boolean> {
    return this.actorRepo.deleteActor(id);
  }
}
