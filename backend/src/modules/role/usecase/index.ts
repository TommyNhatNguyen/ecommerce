import { ListResponse } from 'src/share/models/base-model';
import { PagingDTO } from 'src/share/models/paging';
import {
  IRoleConditionDTO,
  IRoleCreateDTO,
  IRolePermissionCreateDTO,
  IRolePermissionUpdateDTO,
  IRoleUpdateDTO,
} from 'src/modules/role/models/role.dto';
import {
  IRoleRepository,
  IRoleUseCase,
} from 'src/modules/role/models/role.interface';
import { Role, RoleWithPermissions } from 'src/modules/role/models/role.model';

export class RoleUserCase implements IRoleUseCase {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly permissionRoleRepository: IRoleRepository
  ) {}

  getRoleWithPermissions(id: string): Promise<RoleWithPermissions[]> {
    return this.permissionRoleRepository.getRoleWithPermissions(id);
  }
  async addPermissionToRole(data: IRolePermissionCreateDTO[]): Promise<RoleWithPermissions[]> {
    return await this.permissionRoleRepository.addPermissionToRole(data);
  }
  async updatePermissionToRole(
    data: IRolePermissionUpdateDTO
  ): Promise<RoleWithPermissions> {
    const role = (await this.getRoleWithPermissions(data.role_id || '')).find(
      (item) => item.permission_id === data.permission_id
    );
    if (!role) {
      console.log(data);
      return (await this.permissionRoleRepository.addPermissionToRole([data]))[0];
    }
    return await this.permissionRoleRepository.updatePermissionToRole(data);
  }
  getRoleById(id: string, condition: IRoleConditionDTO): Promise<Role> {
    return this.roleRepository.getRoleById(id, condition);
  }
  getRoles(
    paging: PagingDTO,
    condition: IRoleConditionDTO
  ): Promise<ListResponse<Role[]>> {
    return this.roleRepository.getRoles(paging, condition);
  }
  async createRole(data: IRoleCreateDTO): Promise<Role> {
    const { permissions, ...roleData } = data;
    const role = await this.roleRepository.createRole(roleData);
    const payload = permissions?.map((permission) => ({
      ...permission,
      role_id: role.id,
    })) || [];
    console.log(payload);
    await this.permissionRoleRepository.addPermissionToRole(payload);
    return role;
  }
  updateRole(id: string, data: IRoleUpdateDTO): Promise<Role> {
    return this.roleRepository.updateRole(id, data);
  }
  deleteRole(id: string): Promise<boolean> {
    return this.roleRepository.deleteRole(id);
  }
}
