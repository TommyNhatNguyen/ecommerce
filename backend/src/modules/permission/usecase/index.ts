import { ListResponse } from "src/share/models/base-model";
import { PermissionUpdateDTO } from "src/modules/permission/models/permission.dto";
import { PermissionCreateDTO } from "src/modules/permission/models/permission.dto";
import { Permission } from "src/modules/permission/models/permission.model";
import { IPermissionRepository } from "src/modules/permission/models/permission.interface";
import { IPermissionUseCase } from "src/modules/permission/models/permission.interface";
import { PagingDTO } from "src/share/models/paging";
import { PermissionConditionDTO } from "src/modules/permission/models/permission.dto";

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