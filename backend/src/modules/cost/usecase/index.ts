import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  CostConditionDTO,
  CostCreateDTO,
  CostUpdateDTO,
} from 'src/modules/cost/models/cost.dto';
import { ICostRepository } from 'src/modules/cost/models/cost.interface';
import { Cost } from 'src/modules/cost/models/cost.model';
import { ICostUseCase } from 'src/modules/cost/models/cost.interface';

export class CostUseCase implements ICostUseCase {
  constructor(private readonly costRepository: ICostRepository) {}
  async getById(id: string, condition: CostConditionDTO): Promise<Cost> {
    return await this.costRepository.getById(id, condition);
  }
  async getList(
    paging: PagingDTO,
    condition: CostConditionDTO
  ): Promise<ListResponse<Cost[]>> {
    return await this.costRepository.getList(paging, condition);
  }
  async create(data: CostCreateDTO): Promise<Cost> {
    return await this.costRepository.create(data);
  }
  async update(id: string, data: CostUpdateDTO): Promise<Cost> {
    return await this.costRepository.update(id, data);
  }
  async delete(id: string): Promise<boolean> {
    return await this.costRepository.delete(id);
  }
}
