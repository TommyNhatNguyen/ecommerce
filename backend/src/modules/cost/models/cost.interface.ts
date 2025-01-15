import { CostCreateDTO } from 'src/modules/cost/models/cost.dto';
import { CostUpdateDTO } from 'src/modules/cost/models/cost.dto';
import { CostConditionDTO } from 'src/modules/cost/models/cost.dto';
import { Cost } from 'src/modules/cost/models/cost.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface ICostUseCase {
  getById(id: string, condition: CostConditionDTO): Promise<Cost>;
  getList(
    paging: PagingDTO,
    condition: CostConditionDTO
  ): Promise<ListResponse<Cost[]>>;
  create(data: CostCreateDTO): Promise<Cost>;
  update(id: string, data: CostUpdateDTO): Promise<Cost>;
  delete(id: string): Promise<boolean>;
}

export interface ICostRepository extends IQueryRepository, ICommandRepository {}

export interface IQueryRepository {
  getById(id: string, condition: CostConditionDTO): Promise<Cost>;
  getList(
    paging: PagingDTO,
    condition: CostConditionDTO
  ): Promise<ListResponse<Cost[]>>;
}

export interface ICommandRepository {
  create(data: CostCreateDTO): Promise<Cost>;
  update(id: string, data: CostUpdateDTO): Promise<Cost>;
  delete(id: string): Promise<boolean>;
}
