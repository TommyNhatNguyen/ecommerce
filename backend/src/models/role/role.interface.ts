import {
  IRoleConditionDTO,
  IRoleCreateDTO,
  IRoleUpdateDTO,
} from '@models/role/role.dto';
import { Role } from '@models/role/role.model';
import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';

export interface IRoleUseCase {
  getRoleById(id: string): Promise<Role>;
  getRoles(
    paging: PagingDTO,
    condition: IRoleConditionDTO
  ): Promise<ListResponse<Role[]>>;
  createRole(data: IRoleCreateDTO): Promise<Role>;
  updateRole(id: string, data: IRoleUpdateDTO): Promise<Role>;
  deleteRole(id: string): Promise<boolean>;
}

export interface IRoleRepository extends IQueryRepository, ICommandRepository {}

export interface IQueryRepository {
  getRoleById(id: string): Promise<Role>;
  getRoles(
    paging: PagingDTO,
    condition: IRoleConditionDTO
  ): Promise<ListResponse<Role[]>>;
}

export interface ICommandRepository {
  createRole(data: IRoleCreateDTO): Promise<Role>;
  updateRole(id: string, data: IRoleUpdateDTO): Promise<Role>;
  deleteRole(id: string): Promise<boolean>;
}
