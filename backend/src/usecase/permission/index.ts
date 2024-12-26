import { PermissionConditionDTO, PermissionCreateDTO, PermissionUpdateDTO } from "@models/permission/permission.dto";
import { IPermissionRepository, IPermissionUseCase } from "@models/permission/permission.interface";
import { Permission } from "@models/permission/permission.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class PermissionUseCase implements IPermissionUseCase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}
  getPermission(id: string, condition: PermissionConditionDTO): Promise<Permission | null> {
    return this.permissionRepository.getPermission(id, condition);
  }
  getPermissions(paging: PagingDTO, condition: PermissionConditionDTO): Promise<ListResponse<Permission[]>> {
    return this.permissionRepository.getPermissions(paging, condition);
  }
  createPermission(data: PermissionCreateDTO): Promise<Permission> {
    return this.permissionRepository.createPermission(data);
  }
  updatePermission(id: string, data: PermissionUpdateDTO): Promise<Permission> {
    return this.permissionRepository.updatePermission(id, data);
  }
  deletePermission(id: string): Promise<boolean> {
    return this.permissionRepository.deletePermission(id);
  }
}