import {
  IRoleCreateDTO,
  IRolePermissionCreateDTO,
  IRolePermissionUpdateDTO,
  IRoleUpdateDTO,
} from 'src/modules/role/models/role.dto';
import { IRoleConditionDTO } from 'src/modules/role/models/role.dto';
import { Role, RoleWithPermissions } from 'src/modules/role/models/role.model';
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
  addPermissionToRole(data: IRolePermissionCreateDTO[]): Promise<boolean>;
  updatePermissionToRole(
    data: IRolePermissionUpdateDTO
  ): Promise<RoleWithPermissions>;
  getRoleWithPermissions(id: string): Promise<RoleWithPermissions[]>;
}

export interface IRoleRepository extends IQueryRepository, ICommandRepository {
  addPermissionToRole(data: IRolePermissionCreateDTO[]): Promise<boolean>;
  getRoleWithPermissions(id: string): Promise<RoleWithPermissions[]>;
  updatePermissionToRole(
    data: IRolePermissionUpdateDTO
  ): Promise<RoleWithPermissions>;
}

export interface IQueryRepository {
  getRoleById(id: string): Promise<Role>;
  getRoles(
    paging: PagingDTO,
    condition: IRoleConditionDTO
  ): Promise<ListResponse<Role[]>>;
}

export interface ICommandRepository {
  createRole(data: Omit<IRoleCreateDTO, 'permissions'>): Promise<Role>;
  updateRole(id: string, data: IRoleUpdateDTO): Promise<Role>;
  deleteRole(id: string): Promise<boolean>;
}
