import { IResourcesRepository } from 'src/modules/resources/models/resources.interface';

import {
  ResourcesConditionDTO,
  ResourcesCreateDTO,
  ResourcesUpdateDTO,
} from 'src/modules/resources/models/resources.dto';
import { IResourcesUseCase } from 'src/modules/resources/models/resources.interface';
import { ResourcesModel } from 'src/modules/resources/models/resources.model';
import { PagingDTO } from 'src/share/models/paging';
import { ListResponse } from 'src/share/models/base-model';

export class ResourcesUseCase implements IResourcesUseCase {
  constructor(private readonly resourcesRepository: IResourcesRepository) {}

  async getResourcesById(
    id: string,
    condition?: ResourcesConditionDTO
  ): Promise<ResourcesModel | null> {
    return this.resourcesRepository.getResourcesById(id, condition);
  }

  async getResources(
    paging: PagingDTO,
    condition?: ResourcesConditionDTO
  ): Promise<ListResponse<ResourcesModel[]>> {
    return this.resourcesRepository.getResources(paging, condition);
  }

  async createResources(data: ResourcesCreateDTO): Promise<ResourcesModel> {
    return this.resourcesRepository.createResources(data);
  }

  async updateResources(
    id: string,
    data: ResourcesUpdateDTO
  ): Promise<ResourcesModel> {
    return this.resourcesRepository.updateResources(id, data);
  }

  async deleteResources(id: string): Promise<boolean> {
    return this.resourcesRepository.deleteResources(id);
  }
}
