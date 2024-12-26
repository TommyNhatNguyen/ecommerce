import { PermissionConditionDTO, PermissionCreateDTO, PermissionUpdateDTO } from "@models/permission/permission.dto";
import { Permission } from "@models/permission/permission.model";
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