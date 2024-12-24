import { IRoleConditionDTO, IRoleCreateDTO, IRoleUpdateDTO } from "@models/role/role.dto";
import { IRoleRepository, IRoleUseCase } from "@models/role/role.interface";
import { Role } from "@models/role/role.model";
import { ListResponse } from "src/share/models/base-model";
import { PagingDTO } from "src/share/models/paging";

export class RoleUserCase implements IRoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}
  getRoleById(id: string): Promise<Role> {
    return this.roleRepository.getRoleById(id);
  }
  getRoles(paging: PagingDTO, condition: IRoleConditionDTO): Promise<ListResponse<Role[]>> {
    return this.roleRepository.getRoles(paging, condition);
  }
  createRole(data: IRoleCreateDTO): Promise<Role> {
    return this.roleRepository.createRole(data);
  }
  updateRole(id: string, data: IRoleUpdateDTO): Promise<Role> {
    return this.roleRepository.updateRole(id, data);
  }
  deleteRole(id: string): Promise<boolean> {
    return this.roleRepository.deleteRole(id);
  }
}