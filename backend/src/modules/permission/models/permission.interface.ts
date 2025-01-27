import { PermissionCreateDTO, PermissionUpdateDTO } from "src/modules/permission/models/permission.dto";
import { PermissionConditionDTO } from "src/modules/permission/models/permission.dto";
import { Permission } from "src/modules/permission/models/permission.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export interface IPermissionUseCase {
  getPermission(id: string, condition?: PermissionConditionDTO) : Promise<Permission | null>
  getPermissions(paging: PagingDTO,condition?: PermissionConditionDTO) : Promise<ListResponse<Permission[]>>
  createPermission(data: PermissionCreateDTO) : Promise<Permission>
  updatePermission(id: string, data: PermissionUpdateDTO) : Promise<Permission>
  deletePermission(id: string) : Promise<boolean>
}

export interface IPermissionRepository extends IQueryRepository, ICommandRepository {}

export interface IQueryRepository {
  getPermission(id: string, condition?: PermissionConditionDTO) : Promise<Permission | null>
  getPermissions(paging: PagingDTO,condition?: PermissionConditionDTO) : Promise<ListResponse<Permission[]>>
}

export interface ICommandRepository {
  createPermission(data: PermissionCreateDTO) : Promise<Permission>
  updatePermission(id: string, data: PermissionUpdateDTO) : Promise<Permission>
  deletePermission(id: string) : Promise<boolean>
}