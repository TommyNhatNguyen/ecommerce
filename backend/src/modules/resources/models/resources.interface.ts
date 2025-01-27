import {
  ResourcesConditionDTO,
  ResourcesUpdateDTO,
} from 'src/modules/resources/models/resources.dto';
import { ResourcesCreateDTO } from 'src/modules/resources/models/resources.dto';
import { ResourcesModel } from 'src/modules/resources/models/resources.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IResourcesUseCase {
  getResourcesById(
    id: string,
    condition?: ResourcesConditionDTO
  ): Promise<ResourcesModel | null>;
  getResources(
    paging: PagingDTO,
    condition?: ResourcesConditionDTO
  ): Promise<ListResponse<ResourcesModel[]>>;
  createResources(data: ResourcesCreateDTO): Promise<ResourcesModel>;
  updateResources(
    id: string,
    data: ResourcesUpdateDTO
  ): Promise<ResourcesModel>;
  deleteResources(id: string): Promise<boolean>;
}

export interface IResourcesRepository
  extends IQueryRepository,
    ICommandRepository {}

export interface IQueryRepository {
  getResourcesById(
    id: string,
    condition?: ResourcesConditionDTO
  ): Promise<ResourcesModel | null>;
  getResources(
    paging: PagingDTO,
    condition?: ResourcesConditionDTO
  ): Promise<ListResponse<ResourcesModel[]>>;
}

export interface ICommandRepository {
  createResources(data: ResourcesCreateDTO): Promise<ResourcesModel>;
  updateResources(
    id: string,
    data: ResourcesUpdateDTO
  ): Promise<ResourcesModel>;
  deleteResources(id: string): Promise<boolean>;
}
